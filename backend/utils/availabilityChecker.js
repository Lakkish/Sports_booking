const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const Coach = require("../models/Coach");

module.exports = async function checkAvailability(
  court,
  equipment,
  coach,
  startTime,
  endTime
) {
  startTime = new Date(startTime);
  endTime = new Date(endTime);

  // 1. Court availability
  const courtConflict = await Booking.findOne({
    court,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (courtConflict) {
    return { ok: false, message: "Court not available for this slot" };
  }

  // 2. Equipment availability
  for (const item of equipment) {
    const eq = await Equipment.findById(item.equipmentId);

    const bookedQty = await Booking.aggregate([
      {
        $match: {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      },
      {
        $unwind: "$equipment",
      },
      {
        $match: { "equipment.equipmentId": eq._id },
      },
      {
        $group: { _id: null, total: { $sum: "$equipment.quantity" } },
      },
    ]);

    const totalBooked = bookedQty[0]?.total || 0;

    if (totalBooked + item.quantity > eq.totalStock) {
      return { ok: false, message: `${eq.name} stock not available` };
    }
  }

  // 3. Coach availability
  if (coach) {
    const coachConflict = await Booking.findOne({
      coach,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (coachConflict) {
      return { ok: false, message: "Coach unavailable for this slot" };
    }
  }

  return { ok: true };
};

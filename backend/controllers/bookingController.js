const Booking = require("../models/Booking");
const Court = require("../models/Court");
const Equipment = require("../models/Equipment");
const Coach = require("../models/Coach");
const calculatePrice = require("../utils/priceCalculator");

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { court, coach, equipment, startTime, endTime } = req.body;

    const pricingBreakdown = await calculatePrice({
      court,
      coach,
      equipment,
      startTime,
      endTime,
    });

    const booking = await Booking.create({
      user: userId,
      court,
      coach,
      equipment,
      startTime,
      endTime,
      pricingBreakdown,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(
      "court coach equipment.equipmentId user"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.calculatePricePreview = async (req, res) => {
  try {
    const breakdown = await calculatePrice(req.body);
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "court coach equipment.equipmentId"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

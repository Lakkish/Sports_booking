const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const Court = require("../models/Court");
const Coach = require("../models/Coach");
const PricingRule = require("../models/PricingRule");

const checkAvailability = require("../utils/availabilityChecker");
const calculatePrice = require("../utils/priceCalculator");

exports.createBooking = async (req, res) => {
  try {
    const { user, court, equipment, coach, startTime, endTime } = req.body;

    // 1. Check availability for all resources
    const available = await checkAvailability(
      court,
      equipment,
      coach,
      startTime,
      endTime
    );
    if (!available.ok) {
      return res.status(400).json({ message: available.message });
    }

    // 2. Calculate pricing
    const pricingBreakdown = await calculatePrice({
      court,
      coach,
      equipment,
      startTime,
      endTime,
    });

    // 3. Create booking
    const booking = await Booking.create({
      user,
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

exports.getBookingsByUser = async (req, res) => {
  const bookings = await Booking.find({ user: req.params.id }).populate(
    "court coach equipment.equipmentId"
  );
  res.json(bookings);
};

exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("court coach user");
  res.json(bookings);
};

exports.calculatePricePreview = async (req, res) => {
  try {
    const { court, coach, equipment, startTime, endTime } = req.body;

    const pricing = await calculatePrice({
      court,
      coach,
      equipment,
      startTime,
      endTime,
    });

    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate price", error });
  }
};

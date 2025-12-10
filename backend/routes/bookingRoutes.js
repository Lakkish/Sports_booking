const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  calculatePricePreview,
} = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createBooking);
router.get("/user/:id", auth, getBookingsByUser);
router.get("/", auth, getAllBookings);
router.post("/calc-price", auth, calculatePricePreview);

module.exports = router;

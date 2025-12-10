const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  calculatePricePreview,
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/user/:id", getBookingsByUser);
router.get("/", getAllBookings);
router.post("/calc-price", calculatePricePreview);

module.exports = router;

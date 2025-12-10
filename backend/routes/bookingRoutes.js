const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingsByUser,
  getAllBookings,
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/user/:id", getBookingsByUser);
router.get("/", getAllBookings);

module.exports = router;

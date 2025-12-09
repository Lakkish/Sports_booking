const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const BookingSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    court: { type: ObjectId, ref: "Court", required: true },
    coach: { type: ObjectId, ref: "Coach", default: null },

    equipment: [
      {
        equipmentId: { type: ObjectId, ref: "Equipment", required: true },
        quantity: { type: Number, required: true },
      },
    ],

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    status: {
      type: String,
      enum: ["confirmed", "cancelled", "waitlist"],
      default: "confirmed",
    },

    pricingBreakdown: {
      basePrice: Number,
      indoorPremium: Number,
      peakFee: Number,
      weekendFee: Number,
      coachFee: Number,
      equipmentFee: Number,
      total: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);

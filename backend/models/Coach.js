const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    pricePerHour: { type: Number, required: true },

    availability: [
      {
        day: { type: Number, required: true }, // 0-6 (Sun-Sat)
        startTime: { type: String, required: true }, // "10:00"
        endTime: { type: String, required: true }, // "18:00"
      },
    ],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coach", CoachSchema);

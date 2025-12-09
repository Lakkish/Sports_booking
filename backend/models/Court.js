const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["indoor", "outdoor"], required: true },
    basePrice: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Court", CourtSchema);

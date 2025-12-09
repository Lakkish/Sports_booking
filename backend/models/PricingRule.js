const mongoose = require("mongoose");

const PricingRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    type: {
      type: String,
      enum: ["multiplier", "flat", "conditional"],
      required: true,
    },

    condition: {
      days: [Number],
      startHour: Number,
      endHour: Number,
      courtType: String,
    },

    value: { type: Number, required: true }, // multiplier or flat fee
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PricingRule", PricingRuleSchema);

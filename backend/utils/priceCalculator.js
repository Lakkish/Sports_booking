const Court = require("../models/Court");
const Coach = require("../models/Coach");
const Equipment = require("../models/Equipment");
const PricingRule = require("../models/PricingRule");

module.exports = async function calculatePrice({
  court,
  coach,
  equipment,
  startTime,
}) {
  const courtData = await Court.findById(court);
  const rules = await PricingRule.find({ isActive: true });

  const date = new Date(startTime);
  const hour = date.getHours();
  const day = date.getDay();

  let basePrice = courtData.basePrice;
  let indoorPremium = 0;
  let peakFee = 0;
  let weekendFee = 0;
  let equipmentFee = 0;
  let coachFee = 0;

  for (const rule of rules) {
    // Weekend rule
    if (rule.condition?.days?.includes(day)) {
      weekendFee += rule.value;
    }

    // Peak hour
    if (rule.condition?.startHour <= hour && rule.condition?.endHour > hour) {
      if (rule.type === "multiplier") {
        peakFee += basePrice * (rule.value - 1);
      }
    }

    // Indoor premium
    if (rule.condition?.courtType === courtData.type) {
      indoorPremium += rule.value;
    }
  }

  // Equipment fee
  for (const item of equipment) {
    const eq = await Equipment.findById(item.equipmentId);
    equipmentFee += eq.pricePerUnit * item.quantity;
  }

  // Coach fee
  if (coach) {
    const coachData = await Coach.findById(coach);
    coachFee = coachData.pricePerHour;
  }

  const total =
    basePrice + indoorPremium + peakFee + weekendFee + equipmentFee + coachFee;

  return {
    basePrice,
    indoorPremium,
    peakFee,
    weekendFee,
    equipmentFee,
    coachFee,
    total,
  };
};

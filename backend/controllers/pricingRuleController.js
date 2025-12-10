const PricingRule = require("../models/PricingRule");

exports.getPricingRules = async (req, res) => {
  const rules = await PricingRule.find();
  res.json(rules);
};

exports.createPricingRule = async (req, res) => {
  const rule = await PricingRule.create(req.body);
  res.json(rule);
};

exports.updatePricingRule = async (req, res) => {
  const updated = await PricingRule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.togglePricingRule = async (req, res) => {
  const rule = await PricingRule.findById(req.params.id);
  rule.isActive = !rule.isActive;
  await rule.save();
  res.json(rule);
};

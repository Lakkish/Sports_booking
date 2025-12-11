const PricingRule = require("../models/PricingRule");

exports.getPricingRules = async (req, res) => {
  try {
    const rules = await PricingRule.find();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.create(req.body);
    res.json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePricingRule = async (req, res) => {
  try {
    const updated = await PricingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.togglePricingRuleStatus = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);
    rule.isActive = !rule.isActive;
    await rule.save();
    res.json(rule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

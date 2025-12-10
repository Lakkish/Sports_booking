const express = require("express");
const router = express.Router();
const {
  getPricingRules,
  createPricingRule,
  updatePricingRule,
  togglePricingRule,
} = require("../controllers/pricingRuleController");

router.get("/", getPricingRules);
router.post("/", createPricingRule);
router.put("/:id", updatePricingRule);
router.patch("/:id/status", togglePricingRule);

module.exports = router;

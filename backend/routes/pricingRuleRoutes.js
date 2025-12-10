const express = require("express");
const router = express.Router();
const {
  getPricingRules,
  createPricingRule,
  updatePricingRule,
  togglePricingRule,
} = require("../controllers/pricingRuleController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getPricingRules);
router.post("/", auth, admin, createPricingRule);
router.put("/:id", auth, admin, updatePricingRule);
router.patch("/:id/status", auth, admin, togglePricingRule);

module.exports = router;

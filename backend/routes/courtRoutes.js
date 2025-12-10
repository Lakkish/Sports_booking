const express = require("express");
const router = express.Router();
const {
  getCourts,
  createCourt,
  updateCourt,
  toggleCourtStatus,
} = require("../controllers/courtController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getCourts);
router.post("/", auth, admin, createCourt);
router.put("/:id", auth, admin, updateCourt);
router.patch("/:id/status", auth, admin, toggleCourtStatus);

module.exports = router;

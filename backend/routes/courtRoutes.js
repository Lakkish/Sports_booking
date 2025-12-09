const express = require("express");
const router = express.Router();
const {
  getCourts,
  createCourt,
  updateCourt,
  toggleCourtStatus,
} = require("../controllers/courtController");

router.get("/", getCourts);
router.post("/", createCourt);
router.put("/:id", updateCourt);
router.patch("/:id/status", toggleCourtStatus);

module.exports = router;

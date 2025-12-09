const express = require("express");
const router = express.Router();
const {
  getCoaches,
  createCoach,
  updateCoach,
} = require("../controllers/coachController");

router.get("/", getCoaches);
router.post("/", createCoach);
router.put("/:id", updateCoach);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getCoaches,
  createCoach,
  updateCoach,
} = require("../controllers/coachController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getCoaches);
router.post("/", auth, admin, createCoach);
router.put("/:id", auth, admin, updateCoach);

module.exports = router;

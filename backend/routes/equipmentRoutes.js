const express = require("express");
const router = express.Router();
const {
  getEquipment,
  createEquipment,
  updateEquipment,
  toggleEquipmentStatus,
} = require("../controllers/equipmentController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getEquipment);
router.post("/", auth, admin, createEquipment);
router.put("/:id", auth, admin, updateEquipment);
router.patch("/:id/status", auth, admin, toggleEquipmentStatus);
module.exports = router;

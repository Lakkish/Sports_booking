const express = require("express");
const router = express.Router();
const {
  getEquipment,
  createEquipment,
  updateEquipment,
} = require("../controllers/equipmentController");

router.get("/", getEquipment);
router.post("/", createEquipment);
router.put("/:id", updateEquipment);

module.exports = router;

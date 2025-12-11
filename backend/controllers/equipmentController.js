const Equipment = require("../models/Equipment");

exports.getEquipment = async (req, res) => {
  try {
    const eq = await Equipment.find();
    res.json(eq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEquipment = async (req, res) => {
  try {
    const eq = await Equipment.create(req.body);
    res.json(eq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleEquipmentStatus = async (req, res) => {
  try {
    const eq = await Equipment.findById(req.params.id);
    eq.isActive = !eq.isActive;
    await eq.save();
    res.json(eq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

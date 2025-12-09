const Equipment = require("../models/Equipment");

exports.getEquipment = async (req, res) => {
  const list = await Equipment.find();
  res.json(list);
};

exports.createEquipment = async (req, res) => {
  const item = await Equipment.create(req.body);
  res.json(item);
};

exports.updateEquipment = async (req, res) => {
  const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

const Court = require("../models/Court");

exports.getCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourt = async (req, res) => {
  try {
    const court = await Court.create(req.body);
    res.json(court);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourt = async (req, res) => {
  try {
    const updated = await Court.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleCourtStatus = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    court.isActive = !court.isActive;
    await court.save();
    res.json(court);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

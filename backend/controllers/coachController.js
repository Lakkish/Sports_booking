const Coach = require("../models/Coach");

exports.getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCoach = async (req, res) => {
  try {
    const coach = await Coach.create(req.body);
    res.json(coach);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCoach = async (req, res) => {
  try {
    const updated = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleCoachStatus = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    coach.isActive = !coach.isActive;
    await coach.save();
    res.json(coach);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

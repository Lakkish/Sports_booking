const Coach = require("../models/Coach");

exports.getCoaches = async (req, res) => {
  const coaches = await Coach.find();
  res.json(coaches);
};

exports.createCoach = async (req, res) => {
  const coach = await Coach.create(req.body);
  res.json(coach);
};

exports.updateCoach = async (req, res) => {
  const updated = await Coach.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

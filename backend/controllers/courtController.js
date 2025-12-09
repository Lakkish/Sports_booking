const Court = require("../models/Court");

exports.getCourts = async (req, res) => {
  const courts = await Court.find();
  res.json(courts);
};

exports.createCourt = async (req, res) => {
  const court = await Court.create(req.body);
  res.json(court);
};

exports.updateCourt = async (req, res) => {
  const updated = await Court.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.toggleCourtStatus = async (req, res) => {
  const court = await Court.findById(req.params.id);
  court.isActive = !court.isActive;
  await court.save();
  res.json(court);
};

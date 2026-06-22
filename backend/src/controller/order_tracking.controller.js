const { OrderTracking } = require("../models");

// Create new tracking record
exports.createTracking = async (req, res) => {
  try {
    const tracking = await OrderTracking.create(req.body);
    res.status(201).json(tracking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tracking records
exports.getAllTrackings = async (req, res) => {
  try {
    const trackings = await OrderTracking.findAll();
    res.json(trackings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get tracking by ID
exports.getTrackingById = async (req, res) => {
  try {
    const tracking = await OrderTracking.findByPk(req.params.id);
    if (!tracking) return res.status(404).json({ error: "Tracking not found" });
    res.json(tracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update tracking by ID
exports.updateTracking = async (req, res) => {
  try {
    const tracking = await OrderTracking.findByPk(req.params.id);
    if (!tracking) return res.status(404).json({ error: "Tracking not found" });

    await tracking.update(req.body);
    res.json(tracking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete tracking by ID (soft delete because of paranoid)
exports.deleteTracking = async (req, res) => {
  try {
    const tracking = await OrderTracking.findByPk(req.params.id);
    if (!tracking) return res.status(404).json({ error: "Tracking not found" });

    await tracking.destroy();
    res.json({ message: "Tracking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

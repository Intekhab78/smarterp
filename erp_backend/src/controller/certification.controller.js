const db = require("../models");
const Certification = db.Certification_details;
const fs = require("fs");
const path = require("path");

// CREATE
exports.create = async (req, res) => {
  try {
    const { emp_id, certification, from, to } = req.body;
    if (!emp_id) return res.status(400).json({ message: "emp_id is required" });

    const certFile = req.file ? req.file.filename : null;

    const newCert = await Certification.create({
      emp_id,
      certification,
      from_date: from,
      to_date: to,
      filePath: certFile, // only filename
    });

    res.status(201).json({ message: "Certification saved!", data: newCert });
  } catch (err) {
    console.error("❌ Error saving certification:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { certification, from, to } = req.body;

    const cert = await Certification.findByPk(id);
    if (!cert)
      return res.status(404).json({ message: "Certification not found" });

    if (req.file) {
      cert.filePath = req.file.filename;
    }

    cert.certification = certification || cert.certification;
    cert.from_date = from || cert.from_date;
    cert.to_date = to || cert.to_date;

    await cert.save();
    res.json({ message: "Certification updated successfully", data: cert });
  } catch (err) {
    console.error("❌ Error updating certification:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET all Certifications for a specific employee
exports.findByEmployee = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const certs = await Certification.findAll({
      where: { emp_id },
      order: [["created_at", "DESC"]],
    });
    res.json(certs);
  } catch (err) {
    console.error("❌ Error fetching certifications:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE Certification
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certification.findByPk(id);
    if (!cert)
      return res.status(404).json({ message: "Certification not found" });

    // Optional: delete file from disk
    if (cert.filePath) {
      const filePath = path.join(__dirname, `../public${cert.filePath}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await cert.destroy();
    res.json({ message: "Certification deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting certification:", err);
    res.status(500).json({ error: err.message });
  }
};

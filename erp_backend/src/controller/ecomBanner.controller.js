const db = require("../models");
const Banner = db.ecom_banner;
const path = require("path");

/**
 * CREATE BANNER
 */
exports.create = async (req, res) => {
  try {
    const {
      banner_cat,
      banner_title,
      banner_sub_title,
      company,
      location,
      website,
      banner_position,
      note_1,
      note_2,
      status,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    // Save relative path for frontend
    const imagePath = req.file.path
      .replace(process.cwd(), "")
      .replace(/\\/g, "/");

    const banner = await Banner.create({
      banner_cat,
      // banner_image: imagePath,
      banner_image: req.file.filename, // ✅ only filename

      banner_title,
      banner_sub_title,
      company,
      location,
      website,
      banner_position,
      note_1,
      note_2,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { company, location, banner_cat } = req.query;

    const where = {};
    if (company) where.company = company;
    if (location) where.location = location;
    if (banner_cat) where.banner_cat = banner_cat;

    const banners = await Banner.findAll({
      where,
      order: [["id", "DESC"]],
    });

    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ success: true, data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const updatedData = { ...req.body };

    // ✅ Save only filename (same as create)
    if (req.file) {
      updatedData.banner_image = req.file.filename;
    }

    await banner.update(updatedData);

    res.json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    await banner.destroy(); // paranoid delete

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.status = banner.status === 1 ? 0 : 1;
    await banner.save();

    res.json({
      success: true,
      message: "Banner status updated",
      status: banner.status,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const db = require("../models");
const EmailCategory = db.email_category;

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const category = await EmailCategory.create({ name, status: status || 1 });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await EmailCategory.findAll({
      order: [["id", "DESC"]],
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await EmailCategory.findByPk(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (name !== undefined) category.name = name;
    if (status !== undefined) category.status = status;

    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete category (soft delete or hard delete)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await EmailCategory.findByPk(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Soft delete if paranoid enabled
    await category.destroy();

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategoriesWithCampaigns = async (req, res) => {
  try {
    const categories = await EmailCategory.findAll({
      include: [
        {
          model: db.email_campaign,
          as: "campaigns",
          where: { status: 1 }, // optional: only active campaigns
          required: false,
        },
      ],
      order: [["id", "DESC"]],
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

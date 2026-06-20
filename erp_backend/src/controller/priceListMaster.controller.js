const db = require("../models");
const PriceListMaster = db.priceListMaster;

// CREATE
exports.create = async (req, res) => {
  try {
    if (req.body.comp === "") req.body.comp = null;
    if (req.body.loc === "") req.body.loc = null;

    const data = await PriceListMaster.create(req.body);
    res.status(201).json({ message: "Price List created successfully", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LIST ALL
exports.list = async (req, res) => {
  try {
    const data = await PriceListMaster.findAll({
      include: [{ model: db.priceListItemDetails, as: "items" }],
      order: [["id", "DESC"]],
    });

    res.status(200).json({ message: "Success", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DETAILS (by ID)
exports.details = async (req, res) => {
  try {
    const data = await PriceListMaster.findOne({
      where: { id: req.params.id },
      include: [{ model: db.priceListItemDetails, as: "items" }],
    });

    if (!data) return res.status(404).json({ message: "Price List not found" });

    res.status(200).json({ message: "Success", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
// UPDATE
exports.update = async (req, res) => {
  try {
    // Convert empty strings to null (important for integer columns)
    if (req.body.comp === "") req.body.comp = null;
    if (req.body.loc === "") req.body.loc = null;

    const updated = await PriceListMaster.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated[0])
      return res.status(404).json({ message: "Price List not found" });

    res.status(200).json({ message: "Price List updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE (status → inactive)
exports.delete = async (req, res) => {
  try {
    const item = await PriceListMaster.findOne({
      where: { id: req.params.id },
    });

    if (!item) return res.status(404).json({ message: "Price List not found" });

    await item.update({ status: "inactive" });
    await item.destroy(); // soft delete because paranoid:true

    res.status(200).json({ message: "Price List deleted (inactive)" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

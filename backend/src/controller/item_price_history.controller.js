const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where, FLOAT } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const item_price_history = db.item_price_history;
const item_location_master = db.item_location_master;

// Save new item price history and update item_location_master
const createItemPriceHistory = async (req, res) => {
  try {
    const {
      item_id,
      batch_no,
      itemprice,
      itemnewprice,
      changed_by,
      company_id,
      location_id,
    } = req.body;

    if (!item_id || !company_id || !location_id) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Create new price history record
    const newRecord = await item_price_history.create({
      item_id,
      batch_no,
      itemprice: itemprice, // store old price
      itemnewprice: itemnewprice, // store new price
      changed_by,
      company_id,
      location_id,
    });

    // Update itemprice in item_location_master for the given item_id
    await item_location_master.update(
      { itemprice: itemnewprice },
      { where: { item_id } }
    );

    return res.status(201).json({
      message: "Item price history saved and item price updated successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error saving item price history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createItemPriceHistory,
};

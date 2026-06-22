const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const ResponseFormatter = require("../utils/ResponseFormatter");

const StockMovementModel = db.stock_movement;
const ItemLocationModel = db.item_location_master;

/**
 * Fetch all stock movements with optional pagination
 */
const list = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    // Fetch data with pagination
    const { count, rows } = await StockMovementModel.findAndCountAll({
      offset,
      limit,
      order: [["id", "DESC"]],
      include: [
        {
          model: ItemLocationModel,
          as: "item_location",
          attributes: [
            "id",
            "item_id",
            "item_name",
            "itemupc",
            "stock",
            "distributed_stock",
            "remaining_stock",
            "itemprice",
          ],
        },
      ],
    });

    return res.json({
      status: "success",
      message: "Stock movements fetched successfully",
      data: {
        totalRecords: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        rows,
      },
    });
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch stock movements",
      error: error.message,
    });
  }
};

//for items wise report

const itemWiseStockReport = async (req, res) => {
  try {
    const { item_id } = req.params; // ✅ FIX
    const { from_date, to_date } = req.query;

    if (!item_id) {
      return res.status(400).json({
        success: false,
        message: "item_id is required",
      });
    }

    let whereCondition = { item_id };

    if (from_date && to_date) {
      whereCondition.date = {
        [Op.between]: [from_date, to_date],
      };
    }

    const report = await StockMovementModel.findAll({
      where: whereCondition,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  list,
  itemWiseStockReport,
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const BatchModel = db.batch;
const itemModel = db.item_master;
const itemLocationModel = db.item_location_master;
const { codesettingupdate } = require("../utils/handler");
require("dotenv").config();
const paths = require("path");
const sequelize = db.sequelize;
const StockMovement = db.stock_movement;
const { syncStockFromBatches } = require("../utils/stockSync");

// this contrller is suer for increase the stock instant

const list = async (req, res, next) => {
  // Add company_id and location_id here
  const { page, limit = 10, company_id, location_id } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;

    // Add filters object dynamically
    const filters = {};
    if (company_id) filters.company = company_id;
    if (location_id) filters.location = location_id;

    const totalRecords = await BatchModel.count({ where: filters });

    const festivalRes = await BatchModel.findAll({
      where: filters,
      order: [["id", "DESC"]],
      limit: limits,
      offset: offset,
      include: [
        {
          model: db.item_location_master,
          as: "itemLocationModel",
          attributes: ["itemupc", "item_name"],
          required: false,
        },
        {
          model: db.company,
          as: "companyDetails",
          attributes: ["compdesc"],
          required: false,
        },
        {
          model: db.location,
          as: "locationDetails",
          attributes: ["locname"],
          required: false,
        },
      ],
    });

    const totalPages = Math.ceil(totalRecords / limits);
    const pagination = {
      records: festivalRes,
      currentPage,
      pageSize: limits,
      totalRecords,
      totalPages,
    };

    if (!festivalRes) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Not found!", "Error", ""),
        );
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully fetched records",
          "",
          festivalRes,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};

const store = async (req, res, next) => {
  const { item_id, expiry_date, qty } = req.body;

  try {
    // codesettingupdate('brand');
    let item = await BatchModel.create({
      item_id: item_id,
      expiry_date: expiry_date,
      qty: qty,
    });

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          item,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};
const details = async (req, res, next) => {
  const { id } = req.body;

  try {
    const festivalRes = await BatchModel.findOne({
      where: {
        id: id,
      },
    });

    if (!festivalRes) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, " not found!", "Error", ""),
        );
    } else {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully show record",
            "",
            festivalRes,
          ),
        );
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};
const update = async (req, res, next) => {
  const { id, item_id, expiry_date, qty } = req.body;

  try {
    const detail = await BatchModel.findOne({
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }
    // codesettingupdate('item');
    let item = await BatchModel.update(
      {
        item_id: item_id,
        expiry_date: expiry_date,
        qty: qty,
      },
      {
        where: {
          id: id,
        },
      },
    );

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully updated record",
          "",
          detail,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};
const delete_batch = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await BatchModel.destroy({
      where: {
        id: id,
      },
    });

    if (deletedCount === 0) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "not found!", "Error", ""),
        );
    } else {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully deleted record",
            "",
            { deletedCount },
          ),
        );
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};

// =========================
//Update the stock if needed by the reason
// =========================

const increaseStockAdjustment = async (req, res) => {
  const {
    item_id, // frontend sends location id
    itemupc,
    quantity,
    company_id,
    location_id,
    reason,
    expiry_date,
    itemlanprice,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    if (!item_id || !quantity || !company_id || !location_id || !reason) {
      throw new Error("Required fields missing");
    }

    const addQty = parseFloat(quantity);
    if (isNaN(addQty) || addQty <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const locationRow = await itemLocationModel.findOne({
      where: {
        id: item_id,
        company_id,
        location_id,
      },
      transaction: t,
    });

    if (!locationRow) {
      throw new Error("Item not found in this location");
    }

    const previousRemaining = parseFloat(locationRow.remaining_stock || 0);
    const previousDistributed = parseFloat(locationRow.distributed_stock || 0);
    const qty_on_hand_previous = previousRemaining + previousDistributed;
    const qty_on_hand_new = qty_on_hand_previous + addQty;

    // ======================================
    // Generate GRN Serial
    // ======================================
    const now = new Date();
    const prefix = `STOCK-ADJ${now.getFullYear()}${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}`;

    const lastGrn = await BatchModel.findOne({
      where: {
        grn_number: { [Op.like]: `${prefix}%` },
      },
      order: [["grn_number", "DESC"]],
      transaction: t,
    });

    let serial = 1;

    if (lastGrn?.grn_number) {
      const lastSerialStr = lastGrn.grn_number.replace(prefix, "");
      serial = (parseInt(lastSerialStr) || 0) + 1;
    }

    const generatedGrnNumber = `${prefix}${String(serial).padStart(4, "0")}`;

    const batchNo =
      `ADJ${String(now.getFullYear()).slice(-2)}` +
      `${String(now.getMonth() + 1).padStart(2, "0")}` +
      `${String(now.getDate()).padStart(2, "0")}` +
      `${String(now.getHours()).padStart(2, "0")}` +
      `${String(now.getMinutes()).padStart(2, "0")}` +
      `${String(now.getSeconds()).padStart(2, "0")}${item_id}`;

    // ======================================
    // CREATE BATCH (SOURCE OF TRUTH)
    // ======================================
    await BatchModel.create(
      {
        item_id: item_id,
        itemupc,
        batch_number: batchNo,
        grn_number: generatedGrnNumber,
        qty: addQty,
        current_in_stock: addQty,
        expiry_date: expiry_date || null,
        itemcost: itemlanprice || locationRow.itemcost,
        itemlanprice: itemlanprice || locationRow.itemprice,
        location: location_id,
        company: company_id,
        status: 1,
      },
      { transaction: t },
    );

    // ======================================
    // Recalculate Stock from Batches
    // ======================================
    await syncStockFromBatches({
      item_ids: [item_id],
      company_id,
      location_id,
      transaction: t,
    });

    // ======================================
    // Stock Movement Entry
    // ======================================
    await StockMovement.create(
      {
        item_id: item_id,
        itemupc,
        transaction_no: generatedGrnNumber,
        transaction_type: "STOCK_ADJUSTMENT_IN",
        qty: addQty,
        type: "IN",
        comp_id: company_id,
        loc_id: location_id,
        batch: batchNo,
        stock_desc: `Manual Stock Adjustment | Reason: ${reason}`,

        qty_on_hand_previous: qty_on_hand_previous,
        qty_on_hand_new: qty_on_hand_new,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Stock adjusted successfully",
      grn_number: generatedGrnNumber,
    });
  } catch (error) {
    await t.rollback();

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  list,
  store,
  update,
  details,
  delete_batch,
  increaseStockAdjustment,
};

"use strict";

const db = require("../models");
const OrderStatusMaster = db.order_status_master;

/**
 * CREATE
 */
exports.create = async (req, res) => {
  try {
    const {
      company_id,
      location_id,
      status_name,
      status_order,
      is_final,
      status,
    } = req.body;

    if (!company_id || !status_name || !status_order) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const data = await OrderStatusMaster.create({
      company_id,
      location_id: location_id || null, // ✅ FIX
      status_name,
      status_order,
      is_final: is_final ?? 0,
      status: status ?? 1,
    });

    return res.status(201).json({
      success: true,
      message: "Order status created successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * LIST (Company wise)
 */
exports.list = async (req, res) => {
  try {
    const { company_id } = req.query;

    if (!company_id) {
      return res.status(400).json({
        success: false,
        message: "company_id is required",
      });
    }

    const data = await OrderStatusMaster.findAll({
      where: { company_id },
      order: [["status_order", "ASC"]],
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DETAILS
 */
exports.details = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await OrderStatusMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Order status not found",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_name, status_order, is_final, status } = req.body;

    const data = await OrderStatusMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Order status not found",
      });
    }

    await data.update({
      status_name: status_name ?? data.status_name,
      status_order: status_order ?? data.status_order,
      is_final: is_final ?? data.is_final,
      status: status ?? data.status,
    });

    return res.json({
      success: true,
      message: "Order status updated successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

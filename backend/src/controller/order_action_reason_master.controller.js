"use strict";

const db = require("../models");
const { Op } = require("sequelize");

const OrderActionReasonMaster = db.order_action_reason_master;

/**
 * CREATE
 */
exports.create = async (req, res) => {
  try {
    const { reason_text, status } = req.body;

    if (!reason_text) {
      return res.status(400).json({
        status: false,
        message: "Reason text is required",
      });
    }

    // Duplicate check
    const exists = await OrderActionReasonMaster.findOne({
      where: {
        reason_text,
        deleted_at: null,
      },
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Reason already exists",
      });
    }

    const data = await OrderActionReasonMaster.create({
      reason_text,
      status: status ?? 1,
      addedby: req.user?.id || null,
    });

    return res.json({
      status: true,
      message: "Reason created successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

/**
 * LIST (with search & pagination)
 */
exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      deleted_at: null,
    };

    if (search) {
      where.reason_text = {
        [Op.like]: `%${search}%`,
      };
    }

    const { rows, count } = await OrderActionReasonMaster.findAndCountAll({
      //   where: { status: 1, deleted_at: null },
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [["id", "DESC"]],
    });

    return res.json({
      status: true,
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

/**
 * DETAILS
 */
exports.details = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await OrderActionReasonMaster.findOne({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Reason not found",
      });
    }

    return res.json({
      status: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

/**
 * UPDATE
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason_text, status } = req.body;

    const data = await OrderActionReasonMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Reason not found",
      });
    }

    // Duplicate check
    if (reason_text) {
      const exists = await OrderActionReasonMaster.findOne({
        where: {
          reason_text,
          id: { [Op.ne]: id },
          deleted_at: null,
        },
      });

      if (exists) {
        return res.status(400).json({
          status: false,
          message: "Reason already exists",
        });
      }
    }

    await data.update({
      reason_text: reason_text ?? data.reason_text,
      status: status ?? data.status,
    });

    return res.json({
      status: true,
      message: "Reason updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

/**
 * STATUS UPDATE (enable / disable)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const data = await OrderActionReasonMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Reason not found",
      });
    }

    await data.update({ status });

    return res.json({
      status: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

/**
 * DELETE (soft delete)
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await OrderActionReasonMaster.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Reason not found",
      });
    }

    await data.destroy(); // paranoid delete

    return res.json({
      status: true,
      message: "Reason deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

"use strict";

const db = require("../models");
const { Op } = require("sequelize");

const OrderActionReasonMapping = db.order_action_reason_mapping;
const OrderActionReasonMaster = db.order_action_reason_master;
const ItemDepartment = db.item_department;
// const ReasonTypeMaster = db.reason_type_master;

/**
 * CREATE
 */
exports.create = async (req, res) => {
  try {
    const { department_id, reason_id, reason_type_id, status } = req.body;

    if (!department_id || !reason_id || !reason_type_id) {
      return res.status(400).json({
        status: false,
        message: "department_id, reason_id and reason_type_id are required",
      });
    }

    // Duplicate check
    const exists = await OrderActionReasonMapping.findOne({
      where: {
        department_id,
        reason_id,
        reason_type_id,
        deleted_at: null,
      },
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Mapping already exists",
      });
    }

    const data = await OrderActionReasonMapping.create({
      department_id,
      reason_id,
      reason_type_id,
      status: status ?? 1,
      addedby: req.user?.id || null,
    });

    return res.json({
      status: true,
      message: "Mapping created successfully",
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

exports.list = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      department_id,
      reason_type_id,
      search = "",
      fetch_all = "false",
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    // MAIN WHERE (mapping table)
    const where = {};
    if (department_id) where.department_id = department_id;
    if (reason_type_id) where.reason_type_id = reason_type_id;

    // REASON SEARCH (separate)
    const reasonWhere = {};
    if (search) {
      reasonWhere.reason_text = { [Op.like]: `%${search}%` };
    }

    const queryOptions = {
      where,
      include: [
        {
          model: ItemDepartment,
          as: "department",
          attributes: ["id", "itemdeptname"],
        },
        {
          model: OrderActionReasonMaster,
          as: "reason",
          attributes: ["id", "reason_text"],
          where: reasonWhere,
          required: !!search, // INNER JOIN only when searching
        },
      ],
      order: [["id", "DESC"]],
      distinct: true, // 🔥 VERY IMPORTANT for correct count
    };

    // Pagination only when fetch_all is false
    if (fetch_all !== "true") {
      queryOptions.limit = limitNum;
      queryOptions.offset = offset;
    }

    const { rows, count } = await OrderActionReasonMapping.findAndCountAll(
      queryOptions
    );

    return res.json({
      status: true,
      data: rows,
      pagination:
        fetch_all === "true"
          ? null
          : {
              total: count,
              page: pageNum,
              limit: limitNum,
            },
    });
  } catch (error) {
    console.error("Mapping List Error:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { department_id, reason_type_id, search = "" } = req.query;

    // MAIN WHERE (mapping table)
    const where = {};
    if (department_id) where.department_id = department_id;
    if (reason_type_id) where.reason_type_id = reason_type_id;

    // REASON SEARCH
    const reasonWhere = {};
    if (search) {
      reasonWhere.reason_text = { [Op.like]: `%${search}%` };
    }

    const rows = await OrderActionReasonMapping.findAll({
      where,
      include: [
        {
          model: ItemDepartment,
          as: "department",
          attributes: ["id", "itemdeptname"],
        },
        {
          model: OrderActionReasonMaster,
          as: "reason",
          attributes: ["id", "reason_text"],
          where: reasonWhere,
          required: !!search, // INNER JOIN only when searching
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.json({
      status: true,
      data: rows,
    });
  } catch (error) {
    console.error("Mapping ListAll Error:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

/**
 * LIST (search + pagination)
 */
exports.list1 = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      department_id,
      reason_type_id,
      search = "",
    } = req.query;

    const offset = (page - 1) * limit;

    const where = {};
    if (department_id) where.department_id = department_id;
    if (reason_type_id) where.reason_type_id = reason_type_id;

    const { rows, count } = await OrderActionReasonMapping.findAndCountAll({
      where,
      include: [
        {
          model: ItemDepartment,
          as: "department",
          attributes: ["id", "itemdeptname"],
        },
        {
          model: OrderActionReasonMaster,
          as: "reason",
          attributes: ["id", "reason_text"],
          ...(search && {
            where: { reason_text: { [Op.like]: `%${search}%` } },
          }),
        },
      ],
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

    const data = await OrderActionReasonMapping.findOne({
      where: {
        id,
        deleted_at: null,
      },
      include: [
        { model: ItemDepartment, as: "department" },
        { model: OrderActionReasonMaster, as: "reason" },
        // { model: ReasonTypeMaster, as: "reason_type" },
      ],
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Mapping not found",
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
    const { department_id, reason_id, reason_type_id, status } = req.body;

    const data = await OrderActionReasonMapping.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Mapping not found",
      });
    }

    // Duplicate check
    if (department_id && reason_id && reason_type_id) {
      const exists = await OrderActionReasonMapping.findOne({
        where: {
          department_id,
          reason_id,
          reason_type_id,
          id: { [Op.ne]: id },
          deleted_at: null,
        },
      });

      if (exists) {
        return res.status(400).json({
          status: false,
          message: "Mapping already exists",
        });
      }
    }

    await data.update({
      department_id: department_id ?? data.department_id,
      reason_id: reason_id ?? data.reason_id,
      reason_type_id: reason_type_id ?? data.reason_type_id,
      status: status ?? data.status,
    });

    return res.json({
      status: true,
      message: "Mapping updated successfully",
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
 * STATUS UPDATE
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const data = await OrderActionReasonMapping.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Mapping not found",
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

    const data = await OrderActionReasonMapping.findByPk(id);

    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Mapping not found",
      });
    }

    await data.destroy(); // paranoid delete

    return res.json({
      status: true,
      message: "Mapping deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

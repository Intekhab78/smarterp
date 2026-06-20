const db = require("../models");
const { Op } = require("sequelize");

// ✅ 1. Get all queue records
const getQueueList = async (req, res) => {
  try {
    const data = await db.queue_detail.findAll({
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ success: true, message: "Queue list", data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching queue list",
      error: error.message,
    });
  }
};

// ✅ 2. Update queue status
const updateQueueStatus = async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res
      .status(400)
      .json({ success: false, message: "id and status are required" });
  }

  try {
    const queue = await db.queue_detail.findByPk(id);
    if (!queue) {
      return res
        .status(404)
        .json({ success: false, message: "Queue not found" });
    }

    queue.status = status;
    await queue.save();

    res
      .status(200)
      .json({ success: true, message: "Status updated", data: queue });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Update failed", error: error.message });
  }
};

// GET: /api/queue/by-order
const getByOrderNo = async (req, res) => {
  try {
    const { order_no } = req.query;
    if (!order_no) {
      return res
        .status(400)
        .json({ success: false, message: "Order No is required" });
    }

    const queue = await db.queue_detail.findOne({ where: { order_no } });

    if (!queue) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order found",
      data: queue,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

// POST: /api/queue/cashier-update
const cashierUpdateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const validStatuses = ["completed", "ready"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updated = await db.queue_detail.update({ status }, { where: { id } });

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: err.message,
    });
  }
};

module.exports = {
  getQueueList,
  updateQueueStatus,
  getByOrderNo,
  cashierUpdateStatus,
};

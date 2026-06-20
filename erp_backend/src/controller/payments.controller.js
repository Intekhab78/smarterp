const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where, FLOAT } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const Payment = db.payments;
const Order = db.order;
const PaymentsRefunds = db.payments_refunds;

exports.getCancelledAndRefundedPayments = async (req, res) => {
  try {
    const { status, from_date, to_date } = req.body;

    /**
     * status can be:
     *  - CANCELLED
     *  - REFUNDED
     *  - ALL
     */

    let whereCondition = {};

    if (status === "CANCELLED") {
      whereCondition.payment_status = "Cancelled";
    }

    if (status === "REFUNDED") {
      whereCondition.payment_status = {
        [Op.in]: ["Refunded", "Partial-Refunded"],
      };
    }

    if (from_date && to_date) {
      whereCondition.created_at = {
        [Op.between]: [from_date, to_date],
      };
    }

    const payments = await Payment.findAll({
      where: whereCondition,
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "order_number", "total_qty", "total_gross"],
        },
        {
          model: PaymentsRefunds,
          as: "refunds",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      total_records: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch admin payments",
      error: error.message,
    });
  }
};

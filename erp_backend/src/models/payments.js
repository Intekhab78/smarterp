"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    static associate(models) {
      payments.belongsTo(models.order, {
        foreignKey: "order_id",
        as: "order",
      });

      payments.hasMany(models.payment_transactions, {
        foreignKey: "payment_id",
        as: "transactions",
      });

      payments.hasMany(models.payments_refunds, {
        foreignKey: "payment_id",
        as: "refunds",
      });
    }
  }

  payments.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        comment: "Primary key",
      },

      order_id: {
        // type: DataTypes.BIGINT,
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Reference to orders table",
      },
      order_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Readable order number",
      },

      invoice_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "Linked invoice id (if generated)",
      },

      payment_method: {
        type: DataTypes.STRING(50),
        comment: "COD | UPI | CARD | WALLET",
      },

      payment_type: {
        type: DataTypes.STRING(50),
        comment: "ONLINE or OFFLINE",
      },

      amount: {
        type: DataTypes.DECIMAL(18, 2),
        comment: "Total payable amount",
      },

      payment_status: {
        type: DataTypes.STRING(50),
        comment: "Pending | Paid | Failed | Refunded | Partial-Refunded",
      },

      gateway_order_id: {
        type: DataTypes.STRING(255),
        comment: "Payment gateway order reference",
      },

      razorpay_order_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Razorpay order ID",
      },

      razorpay_payment_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Razorpay payment ID",
      },

      razorpay_signature: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Razorpay payment signature for verification",
      },

      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Payment verification timestamp",
      },

      company_id: {
        type: DataTypes.BIGINT,
        comment: "Company reference",
      },

      location_id: {
        type: DataTypes.BIGINT,
        comment: "Location reference",
      },

      website: {
        type: DataTypes.STRING(255),
        comment: "Website / sales channel",
      },
    },
    {
      sequelize,
      modelName: "payments",
      tableName: "payments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  return payments;
};

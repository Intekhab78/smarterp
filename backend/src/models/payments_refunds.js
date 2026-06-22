"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class payments_refunds extends Model {
    static associate(models) {
      payments_refunds.belongsTo(models.payments, {
        foreignKey: "payment_id",
        as: "payment",
      });
    }
  }
  // 👉 Tracks refund lifecycle (async, failure-safe)
  payments_refunds.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        comment: "Primary key",
      },

      payment_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "Reference to payments table",
      },

      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "Reference to orders table",
      },

      refund_amount: {
        type: DataTypes.DECIMAL(18, 2),
        comment: "Refunded amount",
      },

      refund_reason: {
        type: DataTypes.STRING(255),
        comment: "Reason for refund",
      },

      refund_status: {
        type: DataTypes.STRING(50),
        comment: "Pending | Completed | Failed",
      },

      refund_mode: {
        type: DataTypes.STRING(50),
        comment: "UPI | CARD | WALLET",
      },

      gateway_refund_id: {
        type: DataTypes.STRING(255),
        comment: "Gateway refund reference",
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
      modelName: "payments_refunds",
      tableName: "payments_refunds",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  return payments_refunds;
};

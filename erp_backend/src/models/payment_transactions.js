"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class payment_transactions extends Model {
    static associate(models) {
      // payment_transactions.belongsTo(models.payments, {
      //   foreignKey: "payment_id",
      // });
      payment_transactions.belongsTo(models.payments, {
        foreignKey: "payment_id",
        as: "payment",
      });
    }
  }

  //   Tracks real money movement (payment + refund)
  payment_transactions.init(
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

      transaction_id: {
        type: DataTypes.STRING(255),
        comment: "Gateway transaction id",
      },

      transaction_type: {
        type: DataTypes.STRING(50),
        comment: "PAYMENT or REFUND",
      },

      amount: {
        type: DataTypes.DECIMAL(18, 2),
        comment: "Transaction amount",
      },

      status: {
        type: DataTypes.STRING(50),
        comment: "Initiated | Success | Failed",
      },

      payment_mode: {
        type: DataTypes.STRING(50),
        comment: "UPI | CARD | COD | COUPON",
      },

      raw_response: {
        type: DataTypes.JSON,
        comment: "Full gateway response (for audit/debug)",
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
      modelName: "payment_transactions",
      tableName: "payment_transactions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  return payment_transactions;
};

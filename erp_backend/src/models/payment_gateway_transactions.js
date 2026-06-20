"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class payment_gateway_transactions extends Model {
    static associate(models) {
      // Optional association (if needed later)
      // payment_gateway_transactions.belongsTo(models.payments, {
      //   foreignKey: "payment_id",
      //   as: "payment",
      // });
    }
  }

  payment_gateway_transactions.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        comment: "Primary key",
      },

      gateway: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "PAYU | RAZORPAY | PHONEPE",
      },

      txnid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: "Gateway transaction ID",
      },

      status: {
        type: DataTypes.STRING(50),
        comment: "Initiated | Success | Failed",
      },

      amount: {
        type: DataTypes.DECIMAL(18, 2),
        comment: "Transaction amount",
      },

      raw_response: {
        type: DataTypes.JSON,
        comment: "Complete gateway response",
      },

      website: {
        type: DataTypes.STRING(255),
        comment: "Website / sales channel",
      },
    },
    {
      sequelize,
      modelName: "payment_gateway_transactions",
      tableName: "payment_gateway_transactions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return payment_gateway_transactions;
};

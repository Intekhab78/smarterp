"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ecom_pending_orders extends Model {
    static associate(models) {}
  }

  ecom_pending_orders.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        comment: "Primary key",
      },
      txnid: {
        type: DataTypes.STRING(255),
        comment: "Gateway transaction id",
      },
      payload: {
        type: DataTypes.JSON,
        comment: "Full gateway response (for audit/debug)",
      },
      status: {
        type: DataTypes.STRING(50),
        comment: "Initiated | Success | Failed",
      },
      website: {
        type: DataTypes.STRING(255),
        comment: "Website / sales channel",
      },
    },
    {
      sequelize,
      modelName: "ecom_pending_orders",
      tableName: "ecom_pending_orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  return ecom_pending_orders;
};

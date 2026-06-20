"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class order_status_master extends Model {
    static associate(models) {
      // optional – can be added later
    }
  }

  order_status_master.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      status_name: {
        // Order Placed, Shipped, Delivered etc.
        type: DataTypes.STRING(191),
        allowNull: false,
      },

      status_order: {
        // sequence: 1,2,3,4...
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      is_final: {
        // Delivered / Cancelled
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
      },

      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      status: {
        // active / inactive
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "order_status_master",
      tableName: "order_status_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return order_status_master;
};

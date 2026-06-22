"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class order_cancellations extends Model {
    static associate(models) {
      this.belongsTo(models.order, {
        foreignKey: "order_id",
        as: "order",
      });

      this.belongsTo(models.order_details, {
        foreignKey: "order_item_id",
        as: "order_item",
      });
    }
  }

  order_cancellations.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      order_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      order_item_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // NULL = full order cancel
      },
      item_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      item_qty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      adjustment_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "cancel",
      },
      //   adjustment_type    -- cancel | refund

      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      refund_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },

      refund_status: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      initiated_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "order_cancellations",
      tableName: "order_cancellations",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return order_cancellations;
};

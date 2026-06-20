"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderTracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.order, {
        foreignKey: "order_id",
        targetKey: "id",
        as: "order",
      });
    }
  }

  OrderTracking.init(
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
      courier_company: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tracking_number: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shipment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      estimated_delivery: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      delivery_status: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "pending",
      },
      last_updated: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      tracking_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "OrderTracking",
      tableName: "order_tracking",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // soft deletes using deleted_at
      deletedAt: "deleted_at",
    }
  );

  return OrderTracking;
};

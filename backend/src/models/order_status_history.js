"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class order_status_history extends Model {
    static associate(models) {
      // optional – can be added later
    }
  }

  order_status_history.init(
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
      status_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      changed_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      remarks: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: "order_status_history",
      tableName: "order_status_history",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return order_status_history;
};

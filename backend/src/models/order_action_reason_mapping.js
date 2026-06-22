"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class order_action_reason_mapping extends Model {
    static associate(models) {
      this.belongsTo(models.item_department, {
        foreignKey: "department_id",
        as: "department",
      });
      this.belongsTo(models.order_action_reason_master, {
        foreignKey: "reason_id",
        as: "reason",
      });
    }
  }

  order_action_reason_mapping.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      department_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      reason_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      reason_type_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      status: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1,
      },

      addedby: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "order_action_reason_mapping",
      tableName: "order_action_reason_mapping",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return order_action_reason_mapping;
};

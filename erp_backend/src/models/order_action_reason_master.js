"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class order_action_reason_master extends Model {
    static associate(models) {
      this.hasMany(models.order_action_reason_mapping, {
        foreignKey: "reason_id",
        as: "reason_mappings",
      });
    }
  }

  order_action_reason_master.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      reason_text: {
        type: DataTypes.STRING(255),
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
      modelName: "order_action_reason_master",
      tableName: "order_action_reason_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return order_action_reason_master;
};

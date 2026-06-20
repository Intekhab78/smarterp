"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class queue_detail extends Model {
    static associate(models) {
      // Define associations if needed
    }
  }

  queue_detail.init(
    {
      order_no: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "preparing",
      },
    },
    {
      sequelize,
      modelName: "queue_detail",
      tableName: "queue_details",
      timestamps: true, // includes createdAt and updatedAt
      createdAt: "created_at",
      updatedAt: false, // disable updatedAt if not needed
    }
  );

  return queue_detail;
};

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class function_action_master_map extends Model {
    static associate(models) {
      // Define the associations as needed
      this.belongsTo(models.function_master, {
        foreignKey: "function_master_id",
        as: "function_master", // Alias used in the query
      });
      this.belongsTo(models.action_master, {
        foreignKey: "action_id",
        as: "action_master", // Alias used in the query
      });
    }
  }

  function_action_master_map.init(
    {
      function_action_master_map_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      function_master_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "function_masters", // referencing the function_master table
          key: "function_master_id",
        },
      },
      action_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // Reference to action_master table
      },
    },
    {
      sequelize,
      modelName: "function_action_master_map", // This is the model name
      tableName: "function_action_master_maps", // Ensure this matches the table name
      timestamps: false,
    }
  );

  return function_action_master_map;
};


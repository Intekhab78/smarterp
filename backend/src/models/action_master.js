"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class action_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the relationship with function_action_master_map (One-to-Many relationship)
      this.hasMany(models.function_action_master_map, {
        foreignKey: "action_id",  // Foreign key in function_action_master_map
        as: "function_action_master_maps", // Alias for the relationship
      });

      // Add any other associations you might need (like belongsTo or hasMany with other models)
    }
  }

  action_master.init(
    {
      action_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      action_name: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sorting_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "action_master",
      tableName: "action_masters",
      timestamps: true,
      paranoid: true, // Enables soft delete
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return action_master;
};

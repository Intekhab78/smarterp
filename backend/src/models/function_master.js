"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class function_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the relationship with function_action_master_map (One-to-Many relationship)
      this.hasMany(models.function_action_master_map, {
        foreignKey: "function_master_id", // Foreign key in function_action_master_map
        as: "function_action_master_maps", // Alias for the relationship
      });
      this.belongsTo(models.module_master, {
        foreignKey: "module_id",
        as: "module",
      });
      this.belongsTo(models.sub_module_master, {
        foreignKey: "sub_module_id",
        as: "sub_module",
      });

      // Add any other associations you might need (like belongsTo or hasMany with other models)
    }
  }

  function_master.init(
    {
      function_master_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      module_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sub_module_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      function_master_name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },

      function_master_description: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sorting_order: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      date1: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      date2: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      note1: {
        type: DataTypes.CHAR(255),
        allowNull: true,
      },
      note2: {
        type: DataTypes.CHAR(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "function_master",
      tableName: "function_masters",
      timestamps: true,
      paranoid: true, // Soft delete enabled
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      hooks: {
        beforeCreate: (module, options) => {
          // You can add any preprocessing before creating a function master entry
        },
        beforeUpdate: (module, options) => {
          // You can add any preprocessing before updating a function master entry
        },
      },
    }
  );

  return function_master;
};

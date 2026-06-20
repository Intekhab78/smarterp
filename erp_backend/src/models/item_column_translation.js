"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class item_column_translation extends Model {
    // static associate(models) {
    //   this.belongsTo(models.department_master, {
    //     foreignKey: "department_id",
    //     as: "department",
    //   });
    // }
  }

  item_column_translation.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      field_name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      display_label: {
        type: DataTypes.STRING(191),
        allowNull: false,
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
      modelName: "item_column_translation",
      tableName: "item_column_translation",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );

  return item_column_translation;
};

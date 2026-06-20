"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class grn_setting extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  grn_setting.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      Is_auto_gen_batch_no: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // ✅ true = 1, false = 0
      },
      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "grn_setting",
      tableName: "grn_setting",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return grn_setting;
};

"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class system_setting extends Model {
    static associate(models) {}
  }

  system_setting.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      // 🔑 Setting Key
      setting_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      // ✅ YES = 1 | NO = 0
      setting_value: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      },

      // 🏢 Company
      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      // 📍 Location
      location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "system_setting",
      tableName: "system_settings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",

      // ✅ FIX: Add UNIQUE constraint for proper upsert
      indexes: [
        {
          unique: true,
          fields: ["company_id", "location_id", "setting_key"],
        },
      ],
    }
  );

  return system_setting;
};

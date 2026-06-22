"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class register_tbl_details extends Model {
    static associate(models) {
      register_tbl_details.belongsTo(models.register_tbl_hdr, {
        foreignKey: "register_id",
        targetKey: "id", // match with new auto-increment ID
      });
    }
  }

  register_tbl_details.init(
    {
      register_id: {
        type: DataTypes.INTEGER, // updated to match new ID type
        allowNull: false,
      },
      currency_country: DataTypes.STRING,
      currency: DataTypes.STRING(10),
      denomination_2000: DataTypes.INTEGER,
      denomination_1000: DataTypes.INTEGER,
      denomination_500: DataTypes.INTEGER,
      denomination_200: DataTypes.INTEGER,
      denomination_100: DataTypes.INTEGER,
      denomination_50: DataTypes.INTEGER,
      denomination_20: DataTypes.INTEGER,
      denomination_10: DataTypes.INTEGER,
      denomination_5: DataTypes.INTEGER,
      denomination_2: DataTypes.INTEGER,
      denomination_1: DataTypes.INTEGER,
      denomination_0_5: DataTypes.INTEGER,
      denomination_0_25: DataTypes.INTEGER,
      total: DataTypes.FLOAT,
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      // ✅ New columns added below
      over_short: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "register_tbl_details",
      tableName: "register_tbl_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return register_tbl_details;
};

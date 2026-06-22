"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class currency_denomination_master extends Model {
    static associate(models) {
      // associations if needed later
    }
  }

  currency_denomination_master.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      currency_country: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      denomination_2000: DataTypes.TINYINT,
      denomination_1000: DataTypes.TINYINT,
      denomination_500: DataTypes.TINYINT,
      denomination_200: DataTypes.TINYINT,
      denomination_100: DataTypes.TINYINT,
      denomination_50: DataTypes.TINYINT,
      denomination_20: DataTypes.TINYINT,
      denomination_10: DataTypes.TINYINT,
      denomination_5: DataTypes.TINYINT,
      denomination_2: DataTypes.TINYINT,
      denomination_1: DataTypes.TINYINT,
      denomination_0_5: DataTypes.TINYINT,
      denomination_0_25: DataTypes.TINYINT,
    },
    {
      sequelize,
      modelName: "currency_denomination_master",
      tableName: "currency_denomination_masters",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return currency_denomination_master;
};

"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class priceListMaster extends Model {
    static associate(models) {
      // One price list → Many items
      this.hasMany(models.priceListItemDetails, {
        foreignKey: "price_list_code",
        sourceKey: "price_list_code",
        as: "items",
      });
    }
  }

  priceListMaster.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4,
      },
      comp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      loc: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      price_list_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      price_list_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true, // null = infinite
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive",
      },
    },
    {
      sequelize,
      modelName: "priceListMaster",
      tableName: "price_list_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return priceListMaster;
};

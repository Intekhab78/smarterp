"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class priceListItemDetails extends Model {
    static associate(models) {
      // Belongs to PriceListMaster
      this.belongsTo(models.priceListMaster, {
        foreignKey: "price_list_code",
        targetKey: "price_list_code",
        as: "priceList",
      });
      this.belongsTo(models.item_location_master, {
        foreignKey: "item_id",
        targetKey: "id",
        as: "item_location",
      });
    }
  }

  priceListItemDetails.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      price_list_code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "PriceLstCode",
      },

      item_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      item_upc: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      item_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      itemcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      itemlanprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      itemprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      list_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      comp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loc: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive",
      },
    },
    {
      sequelize,
      modelName: "priceListItemDetails",
      tableName: "price_list_item_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return priceListItemDetails;
};

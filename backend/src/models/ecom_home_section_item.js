"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ecom_home_section_item extends Model {
    static associate(models) {
      //   this.belongsTo(models.ecom_home_section, {
      //     foreignKey: "ecom_home_section_id",
      //     as: "section",
      //   });
      //   this.belongsTo(models.product, {
      //     foreignKey: "product_id",
      //     as: "product",
      //   });
      this.belongsTo(models.item_location_master, {
        foreignKey: "item_id",
        targetKey: "id", // item_location_master.id
        as: "item",
      });
    }
  }

  ecom_home_section_item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      ecom_home_section_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      sort_order: DataTypes.INTEGER,
      status: DataTypes.STRING(50),
      company_id: DataTypes.INTEGER,
      location_id: DataTypes.INTEGER,
      website_ref: DataTypes.STRING(50),

      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),

      addedby: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "ecom_home_section_item",
      tableName: "ecom_home_section_item",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return ecom_home_section_item;
};

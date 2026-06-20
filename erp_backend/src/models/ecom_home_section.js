"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ecom_home_section extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      //   this.hasMany(models.ecom_home_section_product, {
      //     foreignKey: "ecom_home_section_id",
      //     as: "products",
      //   });
    }
  }

  ecom_home_section.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: DataTypes.STRING(255), // New Arrivals
      slug: DataTypes.STRING(255), // new-arrivals
      section_type: DataTypes.STRING(50), // new, recommended, manual
      limit_count: DataTypes.INTEGER,
      sort_order: DataTypes.INTEGER,
      company_id: DataTypes.INTEGER,
      location_id: DataTypes.INTEGER,
      website_ref: DataTypes.STRING(50),
      status: DataTypes.STRING(50), // active / inactive
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      addedby: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "ecom_home_section",
      tableName: "ecom_home_section",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return ecom_home_section;
};

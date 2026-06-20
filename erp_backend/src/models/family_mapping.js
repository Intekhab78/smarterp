"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class family_mapping extends Model {
    static associate(models) {
      family_mapping.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      family_mapping.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
      family_mapping.belongsTo(models.family_master, {
        foreignKey: "family_id",
        as: "family",
      });
    }
  }

  family_mapping.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      website_key: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      family_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "family_mapping",
      tableName: "family_mapping",
      timestamps: true,
      underscored: true,
    }
  );

  return family_mapping;
};

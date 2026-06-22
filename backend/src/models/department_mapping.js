"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class department_mapping extends Model {
    static associate(models) {
      department_mapping.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      department_mapping.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
      department_mapping.belongsTo(models.item_department, {
        foreignKey: "department_id",
        as: "department",
      });
    }
  }

  department_mapping.init(
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
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "department_mapping",
      tableName: "department_mapping",
      timestamps: true,
      underscored: true,
    }
  );

  return department_mapping;
};

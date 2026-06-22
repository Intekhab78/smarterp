"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Certification_details extends Model {
    static associate(models) {
      Certification_details.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });
    }
  }

  Certification_details.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      certification: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      from_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      to_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Certification_details",
      tableName: "certification_details",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Certification_details;
};

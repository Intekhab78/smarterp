"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payroll_details extends Model {
    static associate(models) {
      Payroll_details.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });
    }
  }

  Payroll_details.init(
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
      // ---- Contract Fields ----
      contract_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      supervisor: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      notice_period: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      benefits: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // ---- Payroll Fields ----
      status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "Active",
      },
      employeeType: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      salaryStructure: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payroll_details",
      tableName: "payroll_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return Payroll_details;
};

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class contract extends Model {
    static associate(models) {
      // Each contract belongs to one employee
      contract.belongsTo(models.Employee, {
        foreignKey: 'emp_id',
        as: 'employee',
      });
    }
  }

  contract.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 🔹 Employee Information
      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      emp_fname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emp_lname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // 🔹 Contract Information
      contract_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of contract (Permanent, Temporary, Intern, Consultant)',
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      benefits: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notice_period: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      supervisor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'contract',
      tableName: 'contract',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return contract;
};

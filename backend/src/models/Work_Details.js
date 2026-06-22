"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Work_details extends Model {
    static associate(models) {
      // Work belongs to Employee
      Work_details.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });

      // Optional: if you have company & location tables, you can associate them
      // Work_details.belongsTo(models.Company, { foreignKey: 'companyCode', as: 'company' });
      // Work_details.belongsTo(models.Location, { foreignKey: 'locationId', as: 'location' });
    }
  }

  Work_details.init(
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

      companyCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      locationId: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      subDepartment: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      manager: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      work_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      resume: {
        type: DataTypes.STRING, // store file path or URL
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Work_details",
      tableName: "work_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return Work_details;
};

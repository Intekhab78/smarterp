'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class employee_documents extends Model {
    static associate(models) {
      // Each document belongs to an employee
      employee_documents.belongsTo(models.Employee, { foreignKey: 'emp_id', as: 'employee' });
    }
  }

  employee_documents.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    issuedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    visaType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visaCountry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true, // store uploaded file path
    },
  }, {
    sequelize,
    modelName: 'employee_documents',
    tableName: 'employee_documents',
    timestamps: true,
    paranoid: true,  // for soft deletes
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  return employee_documents;
};

'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class company_location extends Model {
    static associate(models) {
    }
  }
  company_location.init({
    company_id: DataTypes.BIGINT,
    branch_name: DataTypes.STRING(255),
    address: DataTypes.TEXT,
    currency_id: DataTypes.BIGINT
    
  }, {
    sequelize,
    modelName: 'company_location',
    tableName: 'company_locations',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return company_location;
};
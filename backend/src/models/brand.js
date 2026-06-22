'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.company,
        {
          foreignKey: 'company_id',
          as: 'company'
        });
      this.belongsTo(models.location,
        {
          foreignKey: 'location_id',
          as: 'location'
        });
    }
  }
  brand.init({
    uuid: DataTypes.STRING(255),
    organisation_id: DataTypes.BIGINT,
    brandcode: DataTypes.STRING(255),
    brandname: DataTypes.STRING(255),
    brandlong: DataTypes.STRING(255),
    note1: DataTypes.STRING(255),
    note2: DataTypes.STRING(255),
    note3: DataTypes.STRING(255),
    itmsbranddt1: DataTypes.DATE,
    itmsbranddt2: DataTypes.DATE,
    addedby: DataTypes.BIGINT,
    company_id: DataTypes.BIGINT,
    location_id: DataTypes.BIGINT,
    status: DataTypes.TINYINT(1),
    
  }, {
    sequelize,
    modelName: 'brand',
    tableName: 'brands',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return brand;
};
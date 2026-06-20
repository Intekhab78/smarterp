'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class setting_landed_cost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.item_master, {
        foreignKey: 'barcode',
        as: 'item_master',
      });
      this.belongsTo(models.location, {
        foreignKey: 'whlongdesc',
        as: 'location',
      });
      this.belongsTo(models.currency, {
        foreignKey: 'ccurrency',
        as: 'currency',
      });
    }
  }
  setting_landed_cost.init({
    barcode: DataTypes.BIGINT,
    sno: DataTypes.STRING(255),
    supname: DataTypes.STRING(255),
    whlongdesc: DataTypes.BIGINT,
    locdesc: DataTypes.STRING(255),
    whnegstock: DataTypes.STRING(255),
    ccurrency: DataTypes.BIGINT,
    fixed_cost: DataTypes.STRING(255),
    status: DataTypes.TINYINT(1),
    
  }, {
    sequelize,
    modelName: 'setting_landed_cost',
    tableName: 'setting_landed_cost',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return setting_landed_cost;
};
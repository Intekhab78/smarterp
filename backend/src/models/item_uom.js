'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item_uom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.user_master, {foreignKey:'id'})
    }
  }
  item_uom.init({
    uuid: DataTypes.STRING(255),
    organisation_id: DataTypes.BIGINT,
    code: DataTypes.STRING(255),
    name: DataTypes.STRING(255),
    upc: DataTypes.STRING(255),
    type: DataTypes.STRING(255),
    status: DataTypes.TINYINT(1),
    uomcode: DataTypes.STRING(255),
    uomname: DataTypes.STRING(255),
    uomdec: DataTypes.STRING(255),
    uomlong: DataTypes.DECIMAL(18,2),
    unittype: DataTypes.DECIMAL(18,2),
    symbol: DataTypes.STRING(255),
    note1: DataTypes.STRING(255),
    note2: DataTypes.STRING(255),
    note3: DataTypes.STRING(255),
    itmuomdt1: DataTypes.DATE,
    itmuomdt2: DataTypes.DATE,
    addedby: DataTypes.BIGINT,
    
  }, {
    sequelize,
    modelName: 'item_uom',
    tableName: 'item_uoms',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return item_uom;
};
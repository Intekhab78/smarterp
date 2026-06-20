'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class warehouse_master extends Model {
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
  warehouse_master.init({
    // uuid: DataTypes.STRING(255),
    whcode: DataTypes.STRING(255),
    whdesc: DataTypes.STRING(255),
    whlongdesc: DataTypes.TEXT,
    locdesc: DataTypes.TEXT,
    whnegstock: DataTypes.TINYINT(1),
    note1: DataTypes.STRING(255),
    note2: DataTypes.STRING(255),
    note3: DataTypes.STRING(255),
    itmcatdt1: DataTypes.DATE,
    itmcatdt2: DataTypes.DATE,
    addedby: DataTypes.BIGINT,
    company_id: DataTypes.BIGINT,
    location_id: DataTypes.BIGINT,
    status: DataTypes.TINYINT(1),
    
  }, {
    sequelize,
    modelName: 'warehouse_master',
    tableName: 'warehouse_master',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return warehouse_master;
};
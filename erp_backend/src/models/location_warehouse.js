'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class location_warehouse extends Model {
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
  location_warehouse.init({
    // uuid: DataTypes.STRING(255),
    location_id: DataTypes.BIGINT,
    warehouse_desc: DataTypes.BIGINT,
    address: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'location_warehouse',
    tableName: 'location_warehouses',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return location_warehouse;
};
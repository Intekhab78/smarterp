'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item_major_category extends Model {
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
  item_major_category.init({
    uuid: DataTypes.STRING(255),
    organisation_id: DataTypes.BIGINT,
    parent_id: DataTypes.BIGINT,
    node_level: DataTypes.BIGINT,
    name: DataTypes.STRING(255),
    company_id: DataTypes.BIGINT,
    location_id: DataTypes.BIGINT,
    status: DataTypes.TINYINT(1),
    
  }, {
    sequelize,
    modelName: 'item_major_category',
    tableName: 'item_major_categories',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return item_major_category;
};
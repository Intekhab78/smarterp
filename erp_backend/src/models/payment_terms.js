'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_terms extends Model {
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
  payment_terms.init({
    uuid: DataTypes.STRING(255),
    organisation_id: DataTypes.BIGINT,
    name: DataTypes.STRING(255),
    number_of_days: DataTypes.BIGINT,
    status: DataTypes.STRING(255),
    
  }, {
    sequelize,
    modelName: 'payment_terms',
    tableName: 'payment_terms',
    timestamps:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return payment_terms;
};
'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class company_address extends Model {
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
  company_address.init({
    // uuid: DataTypes.STRING(255),
    company_id: DataTypes.BIGINT,
    address_name: DataTypes.STRING(255),
    address: DataTypes.TEXT,
    postal_code: DataTypes.BIGINT,
    country_id: DataTypes.BIGINT,
    city_id: DataTypes.BIGINT,
    emirates_id: DataTypes.BIGINT,
    contact_no: DataTypes.BIGINT,
    email: DataTypes.STRING(255),
    contact_name: DataTypes.STRING(255),
    fax_no: DataTypes.STRING(255),
    landline_no: DataTypes.STRING(255),
    toll_free_number: DataTypes.STRING(255),
    other_number_2: DataTypes.BIGINT,
    other_number_3: DataTypes.BIGINT,
    other_email_2: DataTypes.STRING(255),
    other_email_3: DataTypes.STRING(255),
    default_address: DataTypes.TINYINT(1),
    
  }, {
    sequelize,
    modelName: 'company_address',
    tableName: 'company_addresses',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return company_address;
};
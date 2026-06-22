'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class location_contact extends Model {
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
  location_contact.init({
    // uuid: DataTypes.STRING(255),
    location_id: DataTypes.BIGINT,
    country_id: DataTypes.BIGINT,
    bank_account_number: DataTypes.STRING(255),
    address: DataTypes.STRING(255),
    currency_id: DataTypes.BIGINT,
    postal_code: DataTypes.BIGINT,
    paying_bank: DataTypes.STRING(255),
    beneficiary_name: DataTypes.STRING(255),
    branch_name: DataTypes.STRING(255),
    iban_no: DataTypes.STRING(255),
    contact_no: DataTypes.BIGINT,
    email: DataTypes.STRING(255),
    contact_name: DataTypes.STRING(255),
    fax_no: DataTypes.STRING(255),
    landline_no: DataTypes.STRING(255),
    other_number_2: DataTypes.BIGINT,
    other_number_3: DataTypes.BIGINT,
    other_email_2: DataTypes.STRING(255),
    other_email_3: DataTypes.STRING(255),
    default_contact: DataTypes.TINYINT(1),
    
  }, {
    sequelize,
    modelName: 'location_contact',
    tableName: 'location_contacts',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return location_contact;
};
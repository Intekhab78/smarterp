'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.item_major_category, {
        foreignKey: 'itemcatname', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'itemcategory' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.item_color, {
        foreignKey: 'colorname', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'item_color' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.size_master, {
        foreignKey: 'sizename', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'size_master' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.item_department, {
        foreignKey: 'departname', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'item_department' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.family_master, {
        foreignKey: 'familyname', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'family_master' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.sub_family_master, {
        foreignKey: 'subfamliy', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'sub_family_master' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.brand, {
        foreignKey: 'brandname', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'brand' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.item_uom, {
        foreignKey: 'itmuom', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'item_uom' // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.customer_info, {
        foreignKey: 'suppliername',
        as: 'customer_info',
      });
      this.belongsTo(models.tax_master, {
        foreignKey: 'itmtax1code',
        as: 'tax_master_1',
      });
      this.belongsTo(models.tax_master, {
        foreignKey: 'itmtax2code',
        as: 'tax_master_2',
      });
      this.belongsTo(models.tax_master, {
        foreignKey: 'itmtax3code',
        as: 'tax_master_3',
      });
      this.hasMany(models.item_main_price,
        {
          foreignKey: 'item_id',
          as: 'item_main_prices'
        });
    }
  }
  product_master.init({
    uuid: DataTypes.STRING(255),
    organisation_id: DataTypes.BIGINT,
    itemcatname: DataTypes.BIGINT,
    itemdesclong: DataTypes.STRING(255),
    itemdesc3: DataTypes.STRING(255),
    itemdesc4: DataTypes.STRING(255),
    itemupc: DataTypes.STRING(255),
    itemref: DataTypes.STRING(255),
    stylecode: DataTypes.STRING(255),
    colorname: DataTypes.BIGINT,
    sizename: DataTypes.BIGINT,
    departname: DataTypes.BIGINT,
    familyname: DataTypes.BIGINT,
    subfamliy: DataTypes.BIGINT,
    brandname: DataTypes.BIGINT,
    hsncode: DataTypes.STRING(255),
    itemcost: DataTypes.STRING(255),
    itemprice: DataTypes.DECIMAL(18, 2),
    itemlanprice: DataTypes.DECIMAL(18, 2),
    minstklvl: DataTypes.STRING(255),
    maxstklvl: DataTypes.STRING(255),
    itmstkmgmt: DataTypes.STRING(255),
    itmuom: DataTypes.BIGINT,
    itmwweight: DataTypes.DECIMAL(18, 2),
    itmwpurunit: DataTypes.DECIMAL(18, 2),
    itmwsalesunit: DataTypes.DECIMAL(18, 2),
    itmtax1code: DataTypes.STRING(255),
    itmtax2code: DataTypes.STRING(255),
    itmtax3code: DataTypes.STRING(255),
    itmcostingmet: DataTypes.DECIMAL(18, 2),
    suppliername: DataTypes.INTEGER(11),
    note1: DataTypes.STRING(255),
    note2: DataTypes.STRING(255),
    note3: DataTypes.STRING(255),
    addedby: DataTypes.BIGINT,
    itemdesc: DataTypes.STRING(255),
    itmdt1: DataTypes.DATE,
    itmdt2: DataTypes.DATE,
    itmexpiry: DataTypes.DATE,
    status: DataTypes.TINYINT(1),
  }, {
    sequelize,
    modelName: 'product_master',
    tableName: 'product_masters',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return product_master;
};
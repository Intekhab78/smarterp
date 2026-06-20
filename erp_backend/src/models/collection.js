"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      // this.hasMany(models.collection_details, {
      //   foreignKey: "collection_id",
      //   as: "collection_details",
      // });
      this.hasMany(models.collection_details, {
        foreignKey: "collection_id",
        as: "collection_details",
      });

      this.belongsTo(models.user_master, {
        foreignKey: "customer_id",
        as: "customer",
      });
      this.belongsTo(models.user_master, {
        foreignKey: "salesman_id",
        as: "salesman",
      });
      this.belongsTo(models.payment_type, {
        foreignKey: "payment_type",
        as: "payment_types",
      });
      this.belongsTo(models.bank, {
        foreignKey: "bankname",
        as: "bank",
      });
      this.belongsTo(models.invoice, {
        foreignKey: "invoice_id",
        as: "invoice",
      });
      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
    }
  } // Adjust the path as necessary

  collection.init(
    {
      uuid: DataTypes.CHAR(36),
      organisation_id: DataTypes.BIGINT,
      invoice_id: DataTypes.BIGINT,
      order_id: DataTypes.BIGINT,

      customer_id: DataTypes.BIGINT,
      salesman_id: DataTypes.BIGINT,
      route_id: DataTypes.BIGINT,
      on_account: DataTypes.STRING(191),
      trip_id: DataTypes.BIGINT,
      collection_type: DataTypes.ENUM("1", "2", "3", "4"),
      collection_number: DataTypes.STRING(191),
      payemnt_type: DataTypes.ENUM("1", "2", "3", "4"),
      invoice_amount: DataTypes.DECIMAL(18, 2),
      discount: DataTypes.DECIMAL(18, 2),
      collection_status: DataTypes.ENUM("Pending", "Approved"),
      cheque_number: DataTypes.STRING(191),
      cheque_date: DataTypes.DATE,
      bank_info: DataTypes.STRING(191),
      bank_num: DataTypes.STRING(191),
      transaction_number: DataTypes.STRING(191),
      allocate_amount: DataTypes.DECIMAL(18, 2),
      shelf_rent: DataTypes.DECIMAL(18, 2),
      rebate_amount: DataTypes.DECIMAL(18, 2),
      rebate_vat_value: DataTypes.DECIMAL(18, 2),
      is_rebateVat: DataTypes.BIGINT,
      source: DataTypes.INTEGER,
      image: DataTypes.TEXT,
      current_stage: DataTypes.ENUM(
        "Pending",
        "Approved",
        "Rejected",
        "In-Process",
        "Completed"
      ),
      comment: DataTypes.TEXT,
      is_sync: DataTypes.TINYINT(1),
      erp_id: DataTypes.TEXT,
      erp_status: DataTypes.TEXT,
      pdc_status: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
      odoo_failed_response: DataTypes.TEXT,
      lob_id: DataTypes.BIGINT,
      collection_date: DataTypes.DATE,
      collection_time: DataTypes.TIME,
      source_type: DataTypes.ENUM(
        "iCash",
        "Tele",
        "BDE",
        "WhatsApp",
        "Email",
        "Supervisor",
        "Other",
        "InstaShop",
        "Express Delivery",
        "Swan",
        "Now Now",
        "Lifey"
      ),
      bonus_value: DataTypes.DECIMAL(8, 2),
      type: DataTypes.STRING(191),
      payment_reference: DataTypes.STRING(191),
      is_topup: DataTypes.ENUM("Yes", "No"),
      chequeme_image: DataTypes.TEXT,
      bank_charge: DataTypes.DECIMAL(8, 2),
      card_type: DataTypes.DECIMAL(18, 3),
      card_charge: DataTypes.DECIMAL(18, 3),
      vat_amount: DataTypes.DECIMAL(18, 3),
      tr_status: DataTypes.STRING(191),
      pending_amount: DataTypes.DECIMAL(18, 3),
      total: DataTypes.DECIMAL(18, 3),
      is_coupon: DataTypes.INTEGER,
      is_partial: DataTypes.TINYINT(1),

      payment_no: DataTypes.STRING(255),
      balance_amount: DataTypes.DECIMAL(18, 3),
      payment_type: DataTypes.STRING(255),
      date: DataTypes.DATE,
      transaction_no: DataTypes.BIGINT,
      approved_by: DataTypes.BIGINT,
      payment_mode: DataTypes.STRING(255),
      cash: DataTypes.STRING(255),
      bankname: DataTypes.BIGINT,
      voucher: DataTypes.STRING(255),
      credit_card: DataTypes.STRING(255),
      pay_account_no: DataTypes.STRING(255),
      pay_branch_location: DataTypes.STRING(255),
      total_payment_amount: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmtaxdt1: DataTypes.DATE,
      itmtaxdt2: DataTypes.DATE,
      status: DataTypes.TINYINT(1),
      addedby: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "collection",
      tableName: "collections",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return collection;
};

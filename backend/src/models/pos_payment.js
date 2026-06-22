"use strict";
const { Model, DataTypes } = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class pos_payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
      this.belongsTo(models.invoice, {
        foreignKey: "invoice_id",
        as: "invoice",
      });
    }
  }
  pos_payment.init(
    {
      uuid: DataTypes.STRING(255),
      invoice_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: "invoices",
          key: "id",
        },
      },
      organisation_id: DataTypes.BIGINT,
      accounting_date: DataTypes.DATE,
      customer_id: DataTypes.BIGINT,
      entry_reference: DataTypes.STRING(255),
      bank_id: DataTypes.BIGINT,
      currency: DataTypes.STRING(255),
      bp_amount: DataTypes.DECIMAL(18, 2),
      ct_val_bank_curr: DataTypes.DECIMAL(18, 2),
      check_number: DataTypes.STRING(255),
      total_allocated_to_bp: DataTypes.STRING(255),
      remaining_for_allocation: DataTypes.STRING(255),
      bank_amount: DataTypes.DECIMAL(18, 2),
      bp_account_balance: DataTypes.DECIMAL(18, 2),
      payment_no: DataTypes.STRING(255),
      payment_type: DataTypes.STRING(255),
      date: DataTypes.DATE,
      transaction_no: DataTypes.STRING(255),
      approved_by: DataTypes.BIGINT,
      payment_mode: DataTypes.STRING(255),
      cash: DataTypes.STRING(255),
      bankname: DataTypes.STRING(255),
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
      modelName: "pos_payment",
      tableName: "pos_payments",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return pos_payment;
};

"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class invoice_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      this.hasMany(models.invoice_log_details, {
        foreignKey: "invoice_id",
        as: "invoice_log_details",
      });
      //   this.belongsTo(models.user_master, {
      //     foreignKey: "customer_id",
      //     as: "customer",
      //   });
      //   this.belongsTo(models.user_master, {
      //     foreignKey: "salesman_id",
      //     as: "salesman",
      //   });
      //   this.belongsTo(models.company, {
      //     foreignKey: "company_id",
      //     as: "company",
      //   });
      //   this.belongsTo(models.location, {
      //     foreignKey: "location_id",
      //     as: "location",
      //   });
    }
  }

  invoice_log.init(
    {
      uuid: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4,
      },
      organisation_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      customer_id: DataTypes.BIGINT,
      depot_id: DataTypes.BIGINT,
      order_id: DataTypes.BIGINT,
      order_type_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      delivery_id: DataTypes.BIGINT,
      deliver_address_id: DataTypes.INTEGER,
      salesman_id: DataTypes.BIGINT,
      route_id: DataTypes.BIGINT,
      trip_id: DataTypes.BIGINT,
      invoice_type: DataTypes.ENUM("1", "2", "3", "4"),
      invoice_number: {
        type: DataTypes.STRING(191),
        defaultValue: "INV-0000", // <--- Add this or any suitable default
      },
      invoice_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // <--- Sets the default to current date/time
      },
      invoice_due_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // <--- Sets the default to current date/time
      },
      payment_term_id: DataTypes.BIGINT,
      total_qty: DataTypes.DECIMAL(18, 2),
      total_gross: DataTypes.DECIMAL(18, 2),
      total_discount_amount: DataTypes.DECIMAL(18, 2),
      total_net: DataTypes.DECIMAL(18, 2),
      total_vat: DataTypes.DECIMAL(18, 2),
      total_excise: DataTypes.DECIMAL(18, 2),
      delivery_charge: DataTypes.DECIMAL(18, 2),
      grand_total: DataTypes.DECIMAL(18, 2),
      rounding_off_amount: DataTypes.DECIMAL(8, 2),
      pending_credit: DataTypes.DECIMAL(18, 3),
      pdc_amount: DataTypes.DECIMAL(18, 3),
      is_exchange: DataTypes.TINYINT(1),
      exchange_number: DataTypes.STRING(191),
      current_stage: DataTypes.ENUM(
        "Pending",
        "Approved",
        "Rejected",
        "In-Process",
        "Completed"
      ),
      current_stage_comment: DataTypes.TEXT,
      approval_status: DataTypes.ENUM(
        "Deleted",
        "Created",
        "Updated",
        "In-Process",
        "Approved"
      ),
      is_sync: DataTypes.TINYINT(1),
      erp_id: DataTypes.TEXT,
      erp_status: DataTypes.TEXT,
      payment_received: DataTypes.TINYINT(1),
      //   source: DataTypes.INTEGER,
      source: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: DataTypes.STRING(191),
      is_premium_invoice: DataTypes.TINYINT(1),
      lob_id: DataTypes.BIGINT,
      customer_lpo: DataTypes.STRING(199),
      stamp: DataTypes.INTEGER,
      supervisor_stamp: DataTypes.INTEGER,
      supervisor_stamp_date_time: DataTypes.DATE,
      cashier_stamp: DataTypes.INTEGER,
      cashier_stamp_date_time: DataTypes.DATE,
      stamp_image: DataTypes.STRING(235),
      source_type: DataTypes.INTEGER,
      is_icash: DataTypes.INTEGER,
      is_otg: DataTypes.INTEGER,
      reason: DataTypes.STRING(191),
      is_coupon: DataTypes.INTEGER,
      invoices_post_res: DataTypes.TEXT,
      invoices_xml: DataTypes.TEXT,
      coupon_range_from: DataTypes.INTEGER,
      coupon_range_to: DataTypes.INTEGER,
      is_topup: DataTypes.INTEGER,
      is_coupon_sale: DataTypes.INTEGER,
      latitude: DataTypes.STRING(191),
      longitude: DataTypes.STRING(191),
      invoice_pdf: DataTypes.STRING(191),
      taxable_total: DataTypes.DECIMAL(18, 2),
      cgst_amount: DataTypes.DECIMAL(18, 2),
      sgst_amount: DataTypes.DECIMAL(18, 2),
      igst_amount: DataTypes.DECIMAL(18, 2),
      bank_name: DataTypes.BIGINT,
      total_discounttype: DataTypes.STRING(255),
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "invoice_log",
      tableName: "invoices_log",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  invoice_log.beforeCreate((invoiceInstance) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const nanoseconds = process.hrtime.bigint().toString(); // get high-resolution time
    const nanoDigits = nanoseconds.slice(-9, -7); // first 2 digits of nanoseconds (approx)

    invoiceInstance.invoice_number = `POS/${year}${month}${date}/${hours}${minutes}${seconds}${nanoDigits}`;
  });

  invoice_log.beforeUpdate((invoiceInstance) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const nanoseconds = process.hrtime.bigint().toString();
    const nanoDigits = nanoseconds.slice(-9, -7);

    invoiceInstance.invoice_number = `POS/${year}${month}${date}/${hours}${minutes}${seconds}${nanoDigits}`;
  });

  return invoice_log;
};

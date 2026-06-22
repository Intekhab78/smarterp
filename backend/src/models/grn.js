"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class grn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      this.hasMany(models.good_receipt_note_details, {
        foreignKey: "grn_id",
        as: "grn_details",
      });
      this.belongsTo(models.user_master, {
        foreignKey: "customer_id",
        as: "customer",
      });
      this.belongsTo(models.user_master, {
        foreignKey: "salesman_id",
        as: "salesman",
      });
      this.belongsTo(models.payment_terms, {
        foreignKey: "payment_term_id",
        as: "payment_terms",
      });
      // grn model
      this.belongsTo(models.order, {
        foreignKey: "order_id",
        as: "order",
      });

      this.belongsTo(models.vendor_master, {
        foreignKey: "vendor_id", // <-- this links to vendor_master.id
        as: "vendor_details",
      });
      // this.belongsTo(models.order, {
      //   foreignKey: "order_id",
      //   as: "orderModel",
      // });
      //   this.belongsToMany(models.grn_details, {
      //     foreignKey: 'id',
      //     otherKey: 'grn_id',
      //     as: 'grn_details'
      // });
      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
      // Add this for extra costs
      this.hasMany(models.grn_extra_cost, {
        foreignKey: "grn_number", // column in grn_extra_cost
        sourceKey: "grn_number", // column in grn
        as: "extra_costs", // alias used in include
      });
    }
  } // Adjust the path as necessary

  grn.init(
    {
      // uuid: DataTypes.CHAR(36),
      uuid: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4,
      },
      //   organisation_id: DataTypes.BIGINT,
      organisation_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      order_type_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      //   order_type_id: DataTypes.BIGINT,

      customer_id: DataTypes.BIGINT,
      vendor_id: DataTypes.BIGINT, // 👈 new column

      depot_id: DataTypes.BIGINT,
      order_id: DataTypes.BIGINT,
      order_number: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      //   order_id: {
      //     type: DataTypes.BIGINT,
      //     defaultValue: 1,
      //   },
      delivery_id: DataTypes.BIGINT,
      deliver_address_id: DataTypes.INTEGER,
      salesman_id: DataTypes.BIGINT,
      route_id: DataTypes.BIGINT,
      trip_id: DataTypes.BIGINT,
      grn_type: DataTypes.ENUM("1", "2", "3", "4"),
      grn_number: DataTypes.STRING(191),
      //   grn_date: DataTypes.DATE,
      grn_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      grn_due_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },

      vendor_invoice_no: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      vendor_invoice_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      delivery_note: {
        type: DataTypes.STRING(191),
        allowNull: true,
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
      is_premium_grn: DataTypes.TINYINT(1),
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
      grns_post_res: DataTypes.TEXT,
      grns_xml: DataTypes.TEXT,
      coupon_range_from: DataTypes.INTEGER,
      coupon_range_to: DataTypes.INTEGER,
      is_topup: DataTypes.INTEGER,
      is_coupon_sale: DataTypes.INTEGER,
      latitude: DataTypes.STRING(191),
      longitude: DataTypes.STRING(191),
      grn_pdf: DataTypes.STRING(191),
      taxable_total: DataTypes.DECIMAL(18, 2),
      cgst_amount: DataTypes.DECIMAL(18, 2),
      sgst_amount: DataTypes.DECIMAL(18, 2),
      igst_amount: DataTypes.DECIMAL(18, 2),
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "grn",
      tableName: "good_receipt_notes",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return grn;
};

"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      this.hasMany(models.order_details, {
        foreignKey: "order_id",
        as: "order_details",
      });

      this.hasOne(models.invoice, {
        foreignKey: "order_id",
        as: "invoice",
        scope: {}, // ensure no other filter
      });

      this.hasOne(models.grn, {
        foreignKey: "order_id",
        as: "grn",
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

      this.hasMany(models.payments, {
        // ✅ ADD THIS
        foreignKey: "order_id",
        as: "payments",
      });

      // order model
      this.hasMany(models.order_cancellations, {
        foreignKey: "order_id",
        as: "cancellations",
      });

      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });

      this.belongsTo(models.vendor_master, {
        foreignKey: "vendor_id", // orders.vendor_id
        as: "vendor_details",
      });

      this.belongsTo(models.customer_master, {
        foreignKey: "customer_id", // in orders table
        targetKey: "customer_code", // in customer_master table
        as: "customer_details",
      });
    }
  }
  order.init(
    {
      // uuid: DataTypes.CHAR(36),
      uuid: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4,
      },
      // organisation_id: DataTypes.BIGINT,
      organisation_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      customer_id: DataTypes.BIGINT,
      vendor_id: DataTypes.BIGINT,

      depot_id: DataTypes.BIGINT,
      // order_type_id: DataTypes.BIGINT,
      order_type_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      salesman_id: DataTypes.BIGINT,
      route_id: DataTypes.BIGINT,
      storage_location_id: DataTypes.BIGINT,
      customer_lpo: DataTypes.STRING(191),
      order_number: DataTypes.STRING(191),
      transaction_type: DataTypes.STRING(191),
      // payment_id: DataTypes.STRING(191),
      payment_id: { type: DataTypes.BIGINT, defaultValue: 1 },
      payment_term_id: DataTypes.BIGINT,
      payment_type: DataTypes.STRING(191),

      order_date: DataTypes.DATE,
      due_date: DataTypes.DATE,
      delivery_date: DataTypes.DATE,
      total_qty: DataTypes.DECIMAL(18, 2),
      open_qty: DataTypes.DECIMAL(18, 2),

      total_weight: DataTypes.DECIMAL(18, 2),
      total_pallet: DataTypes.DECIMAL(18, 2),
      total_pallet_volume: DataTypes.DECIMAL(18, 2),
      total_gross: DataTypes.DECIMAL(18, 2),
      total_discount_amount: DataTypes.DECIMAL(18, 2),
      total_net: DataTypes.DECIMAL(18, 2),
      total_vat: DataTypes.DECIMAL(18, 2),
      total_excise: DataTypes.DECIMAL(18, 2),
      grand_total: DataTypes.DECIMAL(18, 2),
      any_comment: DataTypes.TEXT,
      // current_stage: DataTypes.ENUM(
      //   "Pending",
      //   "Approved",
      //   "Rejected",
      //   "In-Process",
      //   "Partial-Deliver",
      //   "Completed",
      //   "Assigned"
      // ),

      // current_stage: DataTypes.ENUM(
      //   "Pending",
      //   "Order Placed",
      //   "Ready to Ship",
      //   "Processing",
      //   "Packed",
      //   "Shipped",
      //   "Out for Delivery",
      //   "Delivered",
      //   "Cancelled",
      //   "Returned",
      //   "Refunded",
      //   "Approved",
      //   "Rejected",
      //   "In-Process",
      //   "Partial-Deliver",
      //   "Completed",
      //   "Assigned"
      // ),

      current_stage: DataTypes.STRING(191),

      current_stage_comment: DataTypes.TEXT,
      approval_status: DataTypes.ENUM(
        "Deleted",
        "Created",
        "Updated",
        "In-Process",
        "Partial-Delivered",
        "Delivered",
        "Completed",
        "Cancel",
        "Assigned",
        "On-Hold"
      ),
      is_sync: DataTypes.TINYINT(1),
      erp_id: DataTypes.INTEGER(11),
      erp_status: DataTypes.TEXT,
      sign_image: DataTypes.STRING(191),
      // source: DataTypes.INTEGER(11),
      source: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: DataTypes.STRING(191),
      current_order_status: DataTypes.BIGINT,
      is_recurring: DataTypes.TINYINT(4),
      is_load_created: DataTypes.TINYINT(4),
      lob_id: DataTypes.BIGINT,
      order_request_json: DataTypes.TEXT,
      source_order_number: DataTypes.STRING(191),
      delivery_charge: DataTypes.DECIMAL(18, 2),
      card_type: DataTypes.STRING(191),
      card_charge: DataTypes.DECIMAL(18, 2),
      recurring_id: DataTypes.INTEGER(11),
      customer_address_id: DataTypes.BIGINT,
      cancel_reason: DataTypes.TEXT,
      cancel_department: DataTypes.TEXT,
      source_ref_number: DataTypes.TEXT,
      created_by: DataTypes.BIGINT,
      order_type: DataTypes.STRING(191),
      type: DataTypes.STRING(191),
      taxable_total: DataTypes.DECIMAL(18, 2),
      cgst_amount: DataTypes.DECIMAL(18, 2),
      sgst_amount: DataTypes.DECIMAL(18, 2),
      igst_amount: DataTypes.DECIMAL(18, 2),
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
      // deleted_at:DataTypes.TIMESTAMPS,
    },
    {
      sequelize,
      modelName: "order",
      tableName: "orders",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return order;
};

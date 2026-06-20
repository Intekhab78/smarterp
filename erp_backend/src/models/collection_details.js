"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class collection_details extends Model {
    static associate(models) {
      // this.belongsTo(models.collection, {
      //   foreignKey: "collection_id",
      //   as: "collectionModel",
      // });
      this.belongsTo(models.collection, {
        foreignKey: "collection_id",
        as: "collection", // ✅ Changed from "collectionModel" to "collection"
      });
      this.belongsTo(models.invoice, {
        foreignKey: "invoice_id",
        as: "invoiceModel",
      });
      this.belongsTo(models.grn, {
        foreignKey: "invoice_id",
        as: "GrnModel",
      });

      // ✅ Add this
      this.belongsTo(models.register_tbl_hdr, {
        foreignKey: "register_tbl_hdr_id",
        as: "registerHeader",
      });
      //   this.belongsToMany(models.order_details, {
      //     foreignKey: 'id',
      //     otherKey: 'order_id',
      //     as: 'order_details'
      // });
    }
  }
  collection_details.init(
    {
      uuid: DataTypes.CHAR(36),
      collection_id: DataTypes.BIGINT.UNSIGNED,
      payment_mode: DataTypes.STRING(20),
      invoice_id: DataTypes.BIGINT.UNSIGNED,
      order_id: DataTypes.BIGINT,

      register_tbl_hdr_id: DataTypes.BIGINT.UNSIGNED,

      customer_id: DataTypes.BIGINT.UNSIGNED,
      amount: DataTypes.DECIMAL(18, 2),
      pending_amount: DataTypes.DECIMAL(18, 2),
      grand_total: DataTypes.DECIMAL(18, 2),
      item_amount: DataTypes.DECIMAL(18, 2),
      total: DataTypes.DECIMAL(18, 2),
      lob_id: DataTypes.BIGINT.UNSIGNED,
      type: DataTypes.STRING(200),
      coupon_voucher_gift_code: DataTypes.STRING(255),
      paymentcard_number: DataTypes.STRING(255),
      // <-- Add these two new columns here:
      // ✅ Add new columns here:
      currency: DataTypes.STRING(10),
      exchange_amount: DataTypes.DECIMAL(18, 2),

      card_type: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "collection_details", // ✅ MUST match what `collection.js` is using
      tableName: "collection_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return collection_details;
};

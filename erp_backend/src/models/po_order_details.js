"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class po_order_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.item_master, {
        foreignKey: "item_id",
        as: "itemModel",
      });
      this.belongsTo(models.item_location_master, {
        foreignKey: "item_id", // invoice_details.item_id (integer)
        targetKey: "id", // item_location_master.id (integer)
        as: "itemLocationModel",
      });
      this.belongsTo(models.po_order, {
        foreignKey: "order_id",
        as: "orderModel",
      });
      //   this.belongsToMany(models.order_details, {
      //     foreignKey: 'id',
      //     otherKey: 'order_id',
      //     as: 'order_details'
      // });
    }
  }
  po_order_details.init(
    {
      uuid: DataTypes.CHAR(36),
      //   po_order_id: DataTypes.BIGINT.UNSIGNED,
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      item_id: DataTypes.BIGINT.UNSIGNED,
      item_uom_id: DataTypes.BIGINT.UNSIGNED,
      discount_id: DataTypes.BIGINT.UNSIGNED,
      is_free: DataTypes.BIGINT,
      is_item_poi: DataTypes.BIGINT.UNSIGNED,
      promotion_id: DataTypes.BIGINT.UNSIGNED,
      item_qty: DataTypes.DECIMAL(18, 2),
      open_qty: DataTypes.DECIMAL(18, 2),
      delivered_qty: DataTypes.DECIMAL(18, 2),
      item_weight: DataTypes.STRING(191),
      total_pallet: DataTypes.DECIMAL(18, 2),
      total_pallet_volume: DataTypes.DECIMAL(18, 2),
      item_price: DataTypes.DECIMAL(18, 2),
      item_gross: DataTypes.DECIMAL(18, 2),
      item_discount_amount: DataTypes.DECIMAL(18, 2),
      item_net: DataTypes.DECIMAL(18, 2),
      item_vat: DataTypes.DECIMAL(18, 2),
      item_excise: DataTypes.DECIMAL(18, 2),
      item_grand_total: DataTypes.DECIMAL(18, 2),
      // order_status: DataTypes.ENUM("Pending", "Delivered", "Partial-Delivered"),
      order_status: DataTypes.ENUM(
        "Pending",
        "Delivered",
        "Partial-Delivered",
        "Cancelled",
        "Refunded",
        "Exchanged",
      ),
      current_po_order_status: DataTypes.BIGINT,

      ptr_di: DataTypes.DECIMAL(18, 2),
      taxa_ble: DataTypes.DECIMAL(18, 2),
      cgst: DataTypes.DECIMAL(18, 2),
      cgst_amount: DataTypes.DECIMAL(18, 2),
      sgst: DataTypes.DECIMAL(18, 2),
      sgst_amount: DataTypes.DECIMAL(18, 2),
      igst: DataTypes.DECIMAL(18, 2),
      igst_amount: DataTypes.DECIMAL(18, 2),
      discounttype: DataTypes.STRING(255),
      itemtype: DataTypes.STRING(255),
      landed_cost_per_unit: DataTypes.DECIMAL(18, 2),
      expiry_delivery_date: DataTypes.DATE,
      receiving_site: DataTypes.STRING(255),
      purchase_cost_per_unit: DataTypes.DECIMAL(18, 2),
      hsn_code: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "po_order_details",
      tableName: "po_order_details",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );
  return po_order_details;
};

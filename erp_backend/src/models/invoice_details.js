"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class invoice_details extends Model {
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
      this.belongsTo(models.invoice, {
        foreignKey: "invoice_id",
        as: "invoiceModel",
      });
    }
  }
  invoice_details.init(
    {
      uuid: DataTypes.CHAR(36),
      invoice_id: DataTypes.BIGINT.UNSIGNED,
      item_id: DataTypes.BIGINT.UNSIGNED,
      item_salesman_id: DataTypes.BIGINT.UNSIGNED,
      color: DataTypes.BIGINT.UNSIGNED,
      size: DataTypes.BIGINT.UNSIGNED,
      item_uom_id: DataTypes.BIGINT.UNSIGNED,
      discount_id: DataTypes.BIGINT.UNSIGNED,
      is_free: DataTypes.TINYINT,
      is_item_poi: DataTypes.TINYINT,
      promotion_id: DataTypes.BIGINT.UNSIGNED,
      item_qty: DataTypes.DECIMAL(18, 2),
      ret_exc_status: DataTypes.STRING(100),
      ret_exc_qty: DataTypes.DECIMAL(18, 2),
      ret_bal_qty: DataTypes.DECIMAL(18, 2),
      act_inv_ref: DataTypes.STRING(191),

      lower_unit_qty: DataTypes.DECIMAL(8, 2),
      item_price: DataTypes.DECIMAL(18, 2),
      item_gross: DataTypes.DECIMAL(18, 2),
      item_discount_amount: DataTypes.DECIMAL(18, 2),
      item_net: DataTypes.DECIMAL(18, 2),
      item_vat: DataTypes.DECIMAL(18, 2),
      doc_discount: DataTypes.DECIMAL(18, 2),
      item_excise: DataTypes.DECIMAL(18, 2),
      perItem_Total: DataTypes.DECIMAL(18, 2),
      item_grand_total: DataTypes.DECIMAL(18, 2),
      variant_id: DataTypes.BIGINT.UNSIGNED,
      item_class_id: DataTypes.BIGINT.UNSIGNED,
      batch_number: DataTypes.STRING(191),
      required_qty: DataTypes.INTEGER,
      is_pallet: DataTypes.TINYINT,
      ship_quantity: DataTypes.DECIMAL(18, 2),
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
      rate: DataTypes.DECIMAL(18, 2),
    },
    {
      sequelize,
      modelName: "invoice_details",
      tableName: "invoice_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return invoice_details;
};

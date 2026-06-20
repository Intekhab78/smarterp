"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class good_receipt_note_details extends Model {
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
      this.belongsTo(models.grn, {
        foreignKey: "grn_id",
        as: "GrnModel",
      });

      this.belongsTo(models.item_location_master, {
        foreignKey: "item_location_id", // 👈 column in GRN details table
        targetKey: "id", // 👈 PK in item_location_master
        as: "itemLocationModel", // 👈 must match your include alias
      });
      //   this.belongsToMany(models.order_details, {
      //     foreignKey: 'id',
      //     otherKey: 'order_id',
      //     as: 'order_details'
      // });
    }
  }
  good_receipt_note_details.init(
    {
      uuid: DataTypes.CHAR(36),
      grn_id: DataTypes.BIGINT.UNSIGNED,
      item_id: DataTypes.BIGINT.UNSIGNED,
      // 👇 New column just beside item_id
      item_location_id: DataTypes.BIGINT.UNSIGNED,
      item_uom_id: DataTypes.BIGINT.UNSIGNED,
      discount_id: DataTypes.BIGINT.UNSIGNED,
      is_free: DataTypes.TINYINT,
      is_item_poi: DataTypes.TINYINT,
      promotion_id: DataTypes.BIGINT.UNSIGNED,
      item_qty: DataTypes.DECIMAL(18, 2),
      lower_unit_qty: DataTypes.DECIMAL(8, 2),
      item_price: DataTypes.DECIMAL(18, 2),
      item_mrp: DataTypes.DECIMAL(18, 2),
      item_gross: DataTypes.DECIMAL(18, 2),
      item_discount_amount: DataTypes.DECIMAL(18, 2),
      item_net: DataTypes.DECIMAL(18, 2),
      item_vat: DataTypes.DECIMAL(18, 2),
      item_excise: DataTypes.DECIMAL(18, 2),
      item_extra_cost: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
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
      modelName: "good_receipt_note_details",
      tableName: "good_receipt_note_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return good_receipt_note_details;
};

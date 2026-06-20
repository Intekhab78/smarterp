"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class stock_movement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.item_location_master, {
        foreignKey: "item_id",
        targetKey: "id",
        as: "item_location",
      });
    }
  }

  stock_movement.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: DataTypes.BIGINT,

      transaction_no: DataTypes.STRING(255),
      transaction_type: DataTypes.STRING(255),
      qty: DataTypes.DECIMAL(18, 2),
      uom_id: DataTypes.BIGINT,
      uom_name: DataTypes.STRING(255),
      itemupc: DataTypes.STRING(255),
      supplier_name: DataTypes.STRING(255),
      type: DataTypes.STRING(255),
      route_id: DataTypes.BIGINT,
      warehouse_id: DataTypes.BIGINT,
      loc_type: DataTypes.STRING(255),
      comp_id: DataTypes.BIGINT,
      loc_id: DataTypes.BIGINT,

      to_location: DataTypes.STRING(255),
      from_location: DataTypes.STRING(255),
      stock_code: DataTypes.STRING(255),
      batch: DataTypes.STRING(255),
      expirydate: DataTypes.DATE,

      stock_desc: DataTypes.STRING(500),
      qty_on_hand_previous: DataTypes.DECIMAL(18, 2),
      qty_on_hand_new: DataTypes.DECIMAL(18, 2),
      average_cost_previous: DataTypes.DECIMAL(18, 2),
      average_cost_new: DataTypes.DECIMAL(18, 2),
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "stock_movement",
      tableName: "stock_movement",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true, // ensures soft deletes using deletedAt
    }
  );

  return stock_movement;
};

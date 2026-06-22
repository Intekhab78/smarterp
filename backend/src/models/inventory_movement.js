"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class inventory_movement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.user_master, {foreignKey:'id'})
    }
  }
  inventory_movement.init(
    {
      uuid: DataTypes.STRING(255),
      item_id: DataTypes.BIGINT,
      detail_id: DataTypes.BIGINT,
      ccode: DataTypes.STRING(255),
      lcode: DataTypes.STRING(255),
      trantype: DataTypes.ENUM(
        "Ob",
        "Sales",
        "Purchase",
        "Transfer",
        "Stock Qty Adjustment",
        "Invoice",
        "Manual GRN"
      ),
      tranno: DataTypes.BIGINT,
      trandate: DataTypes.DATE,
      tranqty: DataTypes.BIGINT,
      trancstock: DataTypes.BIGINT,
      taxpor1desc: DataTypes.TEXT,
      taxpor2: DataTypes.BIGINT,
      addedby: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "inventory_movement",
      tableName: "inventory_movements",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return inventory_movement;
};

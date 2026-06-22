"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GrnExtraCost extends Model {
    static associate(models) {
      this.belongsTo(models.grn, {
        foreignKey: "grn_number", // column in grn_extra_cost
        targetKey: "grn_number", // column in grn
        as: "grn",
      });
    }
  }

  GrnExtraCost.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      grn_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cost_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      // ✅ New Columns
      vendor_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      vendor_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      supplier_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      mode_of_payment: {
        type: DataTypes.ENUM("Cash", "Cheque"),
        allowNull: false,
      },
      cheque_number: {
        type: DataTypes.STRING(100),
        allowNull: true, // only if payment is cheque
      },
      bank_name: {
        type: DataTypes.STRING(150),
        allowNull: true, // only if payment is cheque
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      number_of_item_types: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "grn_extra_cost",
      tableName: "grn_extra_costs",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return GrnExtraCost;
};

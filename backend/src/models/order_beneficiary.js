"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class order_beneficiary extends Model {
    /**
     * Define associations here if required
     */
  }

  order_beneficiary.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      order_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      order_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      donor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      beneficiary_firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      beneficiary_lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      beneficiary_fatherName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      beneficiary_motherName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      beneficiary_mobileNo: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "order_beneficiary",
      tableName: "order_beneficiaries",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return order_beneficiary;
};

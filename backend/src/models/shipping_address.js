"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class shipping_address extends Model {
    static associate(models) {
      // Relationship with customer_master
      this.belongsTo(models.customer_master, {
        foreignKey: "customer_id",
        as: "customer",
      });
    }
  }

  shipping_address.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      customer_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      alternate_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      pincode: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      address_line1: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      address_line2: {
        type: DataTypes.STRING,
      },

      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "India",
      },

      address_type: {
        type: DataTypes.ENUM("Home", "Office", "Other"),
        defaultValue: "Home",
      },

      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      latitude: {
        type: DataTypes.STRING,
      },

      longitude: {
        type: DataTypes.STRING,
      },

      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
    },

    {
      sequelize,
      modelName: "shipping_address",
      tableName: "shipping_address",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return shipping_address;
};

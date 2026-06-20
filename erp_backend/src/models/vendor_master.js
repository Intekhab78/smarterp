"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class vendor_master extends Model {
    static associate(models) {
      this.hasMany(models.order, {
        foreignKey: "vendor_id",
        as: "orders",
      });
      this.hasMany(models.invoice, {
        foreignKey: "vendor_id",
        as: "invoiceModel",
      });
      this.hasMany(models.grn, {
        foreignKey: "vendor_id",
        as: "grn",
      });
      this.hasMany(models.item_master, {
        foreignKey: "suppliername",
        as: "items",
      });
    }
  }

  vendor_master.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.CHAR(36),
        defaultValue: DataTypes.UUIDV4,
      },
      organisation_id: DataTypes.BIGINT,
      vendor_code: DataTypes.STRING(191),
      vendor_type: DataTypes.STRING(191),
      firstname: DataTypes.STRING(191),
      lastname: DataTypes.STRING(191),

      VendorMobileNumber: DataTypes.STRING(191),
      VendorEmail: DataTypes.STRING(191),
      VendorDocumentName: DataTypes.STRING(191),

      address1: DataTypes.STRING(191),

      company_name: DataTypes.STRING(191),
      trade_license_upload: DataTypes.STRING(191),
      tax_certificate: DataTypes.STRING(191),
      import_license_no: DataTypes.STRING(191),
      email: DataTypes.STRING(191),
      mobile: DataTypes.STRING(191),
      city: DataTypes.STRING(191),
      state: DataTypes.STRING(191),
      zip: DataTypes.STRING(50),
      bank_name: DataTypes.STRING(191),
      Account_no: DataTypes.BIGINT,
      remarks: DataTypes.TEXT,
      website: DataTypes.STRING(191),

      status: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "vendor_master",
      tableName: "vendor_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return vendor_master;
};

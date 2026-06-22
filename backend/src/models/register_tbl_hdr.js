"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class register_tbl_hdr extends Model {
    static associate(models) {
      register_tbl_hdr.hasMany(models.register_tbl_details, {
        foreignKey: "register_id",
        sourceKey: "id", // changed from uuid to id
        as: "details", // ✅ define alias here
      });
    }
  }

  register_tbl_hdr.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      currency: DataTypes.STRING(10),
      date: DataTypes.DATEONLY,
      time: DataTypes.TIME,
      open_by: DataTypes.STRING,
      open_by_id: DataTypes.INTEGER, // new field added
      float_amount: DataTypes.FLOAT,
      close_by: DataTypes.STRING,
      close_date: DataTypes.DATEONLY,
      close_time: DataTypes.TIME,
      status: DataTypes.STRING,
      register_status: DataTypes.STRING,
      over_short: DataTypes.FLOAT,
      reason: DataTypes.STRING,
      approve_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "register_tbl_hdr",
      tableName: "register_tbl_hdr",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return register_tbl_hdr;
};

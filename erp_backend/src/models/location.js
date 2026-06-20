"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.company, {
        foreignKey: "ccompany",
        as: "company",
      });
      this.hasMany(models.location_warehouse, {
        foreignKey: "location_id",
        as: "location_warehouse",
      });
      this.hasMany(models.location_contact, {
        foreignKey: "location_id",
        as: "location_contact",
      });
      this.hasMany(models.location_bank, {
        foreignKey: "location_id",
        as: "location_bank",
      });
      this.hasMany(models.location_address, {
        foreignKey: "location_id",
        as: "location_address",
      });
    }
  }
  location.init(
    {
      // uuid: DataTypes.STRING(255),
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      compdesc: DataTypes.STRING(255),
      loccode: DataTypes.STRING(255),
      locname: DataTypes.STRING(255),
      locdesclong: DataTypes.STRING(255),
      ccompany: DataTypes.STRING(255),
      ccurrency: DataTypes.STRING(255),
      clicense: DataTypes.STRING(255),
      ctaxnumber: DataTypes.STRING(255),
      cacurrency: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmcatdt1: DataTypes.DATE,
      itmcatdt2: DataTypes.DATE,
      cfinyear: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "location",
      tableName: "locations",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return location;
};

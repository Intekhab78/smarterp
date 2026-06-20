"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tax_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
    }
  }
  tax_master.init(
    {
      uuid: DataTypes.STRING(255),
      organisation_id: DataTypes.BIGINT,
      taxcode: DataTypes.STRING(255),
      taxname: DataTypes.STRING(255),
      taxlong: DataTypes.STRING(255),
      taxcal: DataTypes.DECIMAL(18, 2),
      taxpor1: DataTypes.DECIMAL(18, 2),
      taxpor1desc: DataTypes.STRING(255),
      taxpor2: DataTypes.DECIMAL(18, 2),
      taxpor2desc: DataTypes.STRING(255),
      taxpor3: DataTypes.DECIMAL(18, 2),
      taxpor3desc: DataTypes.STRING(255),
      taxlegis: DataTypes.STRING(255),
      taxvalidfrm: DataTypes.DATE,
      taxvalidto: DataTypes.DATE,
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmtaxdt1: DataTypes.DATE,
      itmtaxdt2: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "tax_master",
      tableName: "taxes_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return tax_master;
};

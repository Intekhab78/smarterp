"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class tax_settings extends Model {
    static associate(models) {
      //   this.belongsTo(models.company, {
      //     foreignKey: "company_id",
      //     as: "company",
      //   });
      //   this.belongsTo(models.location, {
      //     foreignKey: "location_id",
      //     as: "location",
      //   });
    }
  }

  tax_settings.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: DataTypes.STRING(255),
      // newly added fields
      tax_name: {
        type: DataTypes.ENUM("inclusive", "exclusive"),
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT(1),
        defaultValue: 1, // 1 = active, 0 = inactive
      },
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
      organisation_id: DataTypes.BIGINT,
      is_tax_registered: DataTypes.TINYINT(1),
      trn_text: DataTypes.STRING(255),
      number: DataTypes.STRING(255),
      register_date: DataTypes.DATE,
      composition_scheme: DataTypes.TINYINT(1),
      international_trade: DataTypes.TINYINT(1),
      composition_scheme_percentage: DataTypes.DECIMAL(5, 2),
      digital_services: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "tax_settings",
      tableName: "tax_settings",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return tax_settings;
};

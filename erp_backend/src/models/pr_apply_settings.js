"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class pr_apply_settings extends Model {
    static associate(models) {
      // Add associations here later if needed
      this.belongsTo(models.company, {
        foreignKey: "main_company_id",
        as: "main_company",
      });

      this.belongsTo(models.company, {
        foreignKey: "sub_company_id",
        as: "sub_company",
      });

      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });

      this.belongsTo(models.priceListMaster, {
        foreignKey: "pr_code",
        targetKey: "price_list_code",
        as: "price_list",
      });
    }
  }

  pr_apply_settings.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pr_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      main_company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sub_company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "pr_apply_settings",
      tableName: "pr_apply_settings",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return pr_apply_settings;
};

"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class FilterSetting extends Model {
    static associate(models) {
      // You may add associations here if needed
    }
  }

  FilterSetting.init(
    {
      main_company_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sub_company_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "FilterCompItemSetting",
      tableName: "filter_comp_item_settings",
      timestamps: true, // created_at, updated_at
    }
  );

  return FilterSetting;
};

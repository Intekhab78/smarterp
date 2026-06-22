"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class item_visibility_rules extends Model {
    static associate(models) {
      // Optional associations (add later if needed)
      // item_visibility_rules.belongsTo(models.organisation_master, {
      //   foreignKey: "organisation_id",
      //   as: "organisation",
      // });
      // item_visibility_rules.belongsTo(models.company_master, {
      //   foreignKey: "company_id",
      //   as: "company",
      // });
      // item_visibility_rules.belongsTo(models.location_master, {
      //   foreignKey: "location_id",
      //   as: "location",
      // });
    }
  }

  item_visibility_rules.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      organisation_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      field_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      allow_null: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "item_visibility_rules",
      tableName: "item_visibility_rules",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false, // because your table has only created_at
    }
  );

  return item_visibility_rules;
};

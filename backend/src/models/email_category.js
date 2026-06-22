"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class email_category extends Model {
    static associate(models) {
      // One category can have many campaigns
      email_category.hasMany(models.email_campaign, {
        foreignKey: "category_id",
        as: "campaigns",
      });
    }
  }

  email_category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "email_category",
      tableName: "email_categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  return email_category;
};

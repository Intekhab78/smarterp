"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ecom_banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  ecom_banner.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      banner_cat: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      banner_image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      banner_title: {
        type: DataTypes.STRING(150),
      },

      banner_sub_title: {
        type: DataTypes.STRING(255),
      },

      company: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      location: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      banner_position: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      note_1: {
        type: DataTypes.STRING(255),
      },

      note_2: {
        type: DataTypes.STRING(255),
      },

      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "ecom_banner",
      tableName: "ecom_banner",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return ecom_banner;
};

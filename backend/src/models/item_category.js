"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item_category extends Model {
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
      this.hasMany(models.item_master, {
        foreignKey: "itemcatname",
        as: "item_master",
      });
      this.hasMany(models.item_master_image, {
        foreignKey: "item_image_id",
        as: "item_master_image",
      });
    }
  }
  item_category.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4,
      },
      organisation_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      itemcatcode: DataTypes.STRING(255),
      itemcatname: DataTypes.STRING(255),
      itemdesclong: DataTypes.STRING(255),
      abcgroup: DataTypes.STRING(255),
      stockmgmt: DataTypes.STRING(255),
      negativestock: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmcatdt1: DataTypes.DATE,
      itmcatdt2: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "item_category",
      tableName: "item_categories",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return item_category;
};

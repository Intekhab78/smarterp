"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item_department extends Model {
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
      // Add this association:
      this.hasMany(models.department_mapping, {
        foreignKey: "department_id",
        as: "mappings",
      });
    }
  }
  item_department.init(
    {
      // uuid: DataTypes.STRING(255),
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
      },
      organisation_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // Ensures it can be null
        defaultValue: null, // Explicitly setting the default to null
      },
      image: {
        // New column added
        type: DataTypes.STRING,
        allowNull: true,
      },
      itemdeptcode: DataTypes.STRING(255),
      itemdeptname: DataTypes.STRING(255),
      itemdeptlong: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmdepdt1: DataTypes.DATE,
      itmdepdt2: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      // company_id: DataTypes.BIGINT,
      company_id: {
        type: DataTypes.BIGINT, // Change this from BIGINT to INTEGER
        allowNull: false,
      },
      location_id: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "item_department",
      tableName: "item_departments",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return item_department;
};

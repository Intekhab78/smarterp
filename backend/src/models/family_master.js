"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class family_master extends Model {
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
      this.hasMany(models.family_mapping, {
        foreignKey: "family_id",
        as: "mappings", // must match your include in query
      });
    }
  }
  family_master.init(
    {
      // uuid: DataTypes.STRING(255),
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
      },
      // organisation_id: DataTypes.BIGINT,
      organisation_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1, // Provide a default value if not provided
      },
      itemfamcode: DataTypes.STRING(255),
      itemfamname: DataTypes.STRING(255),
      itemfamlong: DataTypes.STRING(255),
      itemdeptname: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmfamdt1: DataTypes.DATE,
      itmfamdt2: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "family_master",
      tableName: "family_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return family_master;
};

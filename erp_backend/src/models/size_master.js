"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class size_master extends Model {
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
  size_master.init(
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
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 1,
      },
      // uuid: DataTypes.STRING(255),
      // organisation_id: DataTypes.BIGINT,
      itemsizecode: DataTypes.STRING(255),
      itemsizename: DataTypes.STRING(255),
      itemsizelong: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmsizedt1: DataTypes.DATE,
      itmsizedt2: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT.UNSIGNED,
      location_id: DataTypes.BIGINT.UNSIGNED,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "size_master",
      tableName: "sizes_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return size_master;
};

"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class emp_dpt_family extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   this.belongsTo(models.company, {
    //     foreignKey: "company_id",
    //     as: "company",
    //   });
    //   this.belongsTo(models.location, {
    //     foreignKey: "location_id",
    //     as: "location",
    //   });
    // }
  }
  emp_dpt_family.init(
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
      emp_dpt_famcode: DataTypes.STRING(255),
      emp_dpt_famname: DataTypes.STRING(255),
      emp_dpt_famlong: DataTypes.STRING(255),
      emp_dpt_fdeptname: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      amdt1: DataTypes.DATE,
      amdt2: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "emp_dpt_family",
      tableName: "emp_dpt_family",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return emp_dpt_family;
};

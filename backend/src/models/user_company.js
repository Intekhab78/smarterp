"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_company extends Model {
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

      this.belongsTo(models.user_master, {
        foreignKey: "user_id",
        as: "user_master",
      });
    }
  }
  user_company.init(
    {
      uuid: DataTypes.STRING(255),
      organisation_id: DataTypes.BIGINT,
      user_id: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "user_company",
      tableName: "user_companies",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return user_company;
};

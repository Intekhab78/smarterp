"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class emp_fam_member extends Model {
    static associate(models) {
      // each family member belongs to personal details
      emp_fam_member.belongsTo(models.Personal_Details, {
        foreignKey: "personal_details_id",
        as: "personalDetails",
      });
    }
  }

  emp_fam_member.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      emp_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      personal_details_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      relation: {
        type: DataTypes.STRING, // Wife, Son, Daughter
        allowNull: false,
      },

      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "emp_fam_member",
      tableName: "emp_fam_member",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );

  return emp_fam_member;
};

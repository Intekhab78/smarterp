"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Personal_Details extends Model {
    static associate(models) {
      // Work belongs to employee
      Personal_Details.belongsTo(models.Employee, {
        foreignKey: "emp_id",
        as: "employee",
      });

      // Personal details has many family members
      Personal_Details.hasMany(models.emp_fam_member, {
        foreignKey: "personal_details_id",
        as: "familyMembers",
      });
    }
  }

  Personal_Details.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      bank: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      emergencyContact: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      emergencyPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      permitNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      permitExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      distance: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      certificate: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      fieldOfStudy: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      legalName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      birthday: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      birthPlace: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      idNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      ssn: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      passport: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      maritalStatus: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      dependents: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fatherTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      fatherName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      motherTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      motherName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      spouseName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      marriageDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Personal_Details",
      tableName: "personal_details",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );

  return Personal_Details;
};

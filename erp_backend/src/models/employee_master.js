"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
const EmployeeDocuments = require("./employee_documents"); // Add this line at the top
const Emp_attendance = require("./emp_attendance");
const Contract = require("./contract");

module.exports = (sequelize, DataTypes) => {
  // class Employee extends Model {
  //   static associate(models) {
  //     // One employee has one work details
  //     Employee.hasOne(models.Work_details, {
  //       foreignKey: 'emp_id',
  //       as: 'work',
  //       onDelete: 'CASCADE',
  //     },
  //     Employee.hasOne(models.personal_details, {
  //       foreignKey: 'emp_id',
  //       as: 'personal_details',
  //       onDelete: 'CASCADE',
  //     }

  //   );
  //   }
  // }

  class Employee extends Model {
    static associate(models) {
      // One employee has one work details
      Employee.hasOne(models.Work_details, {
        foreignKey: "emp_id",
        as: "work",
        onDelete: "CASCADE",
      });

      // One employee has one personal details
      Employee.hasOne(models.Personal_Details, {
        foreignKey: "emp_id",
        as: "personal_details",
        onDelete: "CASCADE",
      });

      // 👇 NEW — One employee has many certifications
      Employee.hasMany(models.Certification_details, {
        foreignKey: "emp_id",
        as: "certifications",
        onDelete: "CASCADE",
      });

      Employee.hasOne(models.Payroll_details, {
        foreignKey: "emp_id",
        as: "payroll_details",
      });

      // 👇 NEW — One employee has many documents
      Employee.hasMany(models.employee_documents, {
        foreignKey: "emp_id",
        as: "employee_documents",
      });

      Employee.hasMany(models.emp_attendance, {
        foreignKey: "emp_id",
        as: "emp_attendance",
      });
      Employee.hasMany(models.contract, {
        foreignKey: "emp_id",
        as: "contract",
      });
    }
  }

  Employee.init(
    {
      emp_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      emp_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emp_fname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emp_lname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emp_email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: { isEmail: true },
      },
      emp_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emp_address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      emp_department: {
        type: DataTypes.INTEGER,
        allowNull: true, // can be foreign key if needed
      },
      emp_designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emp_profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Employee", // <-- must match the class for associations
      tableName: "employees",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  );

  return Employee;
};

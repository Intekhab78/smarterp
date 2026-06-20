"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class emp_attendance_summary extends Model {
    static associate(models) {
      // emp_attendance_summary.belongsTo(models.Employee, {
      //   foreignKey: "emp_id",
      //   as: "employee",
      // });
    }
  }

  emp_attendance_summary.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      emp_id: DataTypes.BIGINT,
      email: DataTypes.STRING,
      datetime: DataTypes.DATE,
      // NEW FIELD → Only Date (YYYY-MM-DD)
      date_only: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      // NEW FIELD → Punch In time
      punch_in: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // NEW FIELD → Punch Out time
      punch_out: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // NEW FIELD → Working Hours (HH:MM)
      working_hours: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      server_punch_in: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      server_punch_out: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "approved"),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "emp_attendance_summary",
      tableName: "emp_attendance_summary",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return emp_attendance_summary;
};

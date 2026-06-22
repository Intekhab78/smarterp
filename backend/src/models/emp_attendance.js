"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class emp_attendance extends Model {
    static associate(models) {
      // emp_attendance.belongsTo(models.Employee, {
      //   foreignKey: "emp_id",
      //   as: "employee",
      // });
    }
  }

  emp_attendance.init(
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

      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      match_percentage: DataTypes.DECIMAL(5, 2),
      device_id: DataTypes.STRING,
      device_brand: DataTypes.STRING,
      device_model: DataTypes.STRING,
      device_manufacturer: DataTypes.STRING,
      device_type: DataTypes.ENUM("phone", "tablet"),
      // ADD THIS ⬇⬇⬇
      // server_time: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },

      server_time: {
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
      modelName: "emp_attendance",
      tableName: "emp_attendance",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return emp_attendance;
};

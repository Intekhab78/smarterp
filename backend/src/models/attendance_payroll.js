"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class attendance_payroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
      // For example:
      // this.belongsTo(models.employee, { foreignKey: 'empid', as: 'employee' });
    }
  }

  attendance_payroll.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      emp_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      punch_in: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      punch_out: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      // working_hour: {
      //   type: DataTypes.DECIMAL(5, 2),
      //   allowNull: true,
      // },
      working_hours: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      manager_comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hr_status: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      hr_comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "attendance_payroll",
      tableName: "attendance_payroll",
      timestamps: false,
    }
  );

  return attendance_payroll;
};

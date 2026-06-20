"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class customer_login extends Model {
    static associate(models) {
      this.belongsTo(models.customer_master, {
        foreignKey: "customer_id",
        as: "customer",
      });
    }
  }

  customer_login.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      customer_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      last_login: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "customer_login",
      tableName: "customer_login",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return customer_login;
};

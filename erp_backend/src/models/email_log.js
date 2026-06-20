"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class email_log extends Model {
    static associate(models) {
      email_log.belongsTo(models.email_contact, {
        foreignKey: "email_contact_id",
        as: "contact",
      });

      email_log.belongsTo(models.email_campaign, {
        foreignKey: "campaign_id",
        as: "campaign",
      });
    }
  }

  email_log.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      email_contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.STRING(50), // sent / failed
      },
    },
    {
      sequelize,
      modelName: "email_log",
      tableName: "email_logs",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return email_log;
};

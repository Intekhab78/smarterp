"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class email_campaign_contact extends Model {
    static associate(models) {
      email_campaign_contact.belongsTo(models.email_campaign, {
        foreignKey: "campaign_id",
        as: "campaign",
      });

      email_campaign_contact.belongsTo(models.email_contact, {
        foreignKey: "email_contact_id",
        as: "contact",
      });
    }
  }

  email_campaign_contact.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email_contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "email_campaign_contact",
      tableName: "email_campaign_contacts",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return email_campaign_contact;
};

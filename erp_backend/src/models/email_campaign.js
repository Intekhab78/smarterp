"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class email_campaign extends Model {
    static associate(models) {
      email_campaign.belongsToMany(models.email_contact, {
        through: models.email_campaign_contact,
        foreignKey: "campaign_id",
        otherKey: "email_contact_id",
        as: "contacts",
      });
      // email_campaign.js
      email_campaign.belongsTo(models.email_category, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }

  email_campaign.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachment: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      signature: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      category_id: {
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
      modelName: "email_campaign",
      tableName: "email_campaigns",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return email_campaign;
};

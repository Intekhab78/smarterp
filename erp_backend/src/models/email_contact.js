"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class email_contact extends Model {
    static associate(models) {
      email_contact.belongsToMany(models.email_campaign, {
        through: models.email_campaign_contact,
        foreignKey: "email_contact_id",
        otherKey: "campaign_id",
        as: "campaigns",
      });
    }
  }

  email_contact.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1, // 1 = active, 0 = inactive
      },
    },
    {
      sequelize,
      modelName: "email_contact",
      tableName: "email_contacts",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return email_contact;
};

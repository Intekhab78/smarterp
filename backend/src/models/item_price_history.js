"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class item_price_history extends Model {
    static associate(models) {
      // Optional associations
      // this.belongsTo(models.item_master, { foreignKey: 'item_id' });
      // this.belongsTo(models.company, { foreignKey: 'company_id' });
      // this.belongsTo(models.location, { foreignKey: 'location_id' });
      // this.belongsTo(models.user_master, { foreignKey: 'changed_by' });
    }
  }

  item_price_history.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: DataTypes.UUID, // Updated to UUID
        allowNull: false,
      },
      batch_no: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      itemprice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      itemnewprice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      changed_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      changed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "item_price_history",
      tableName: "item_price_history",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true, // enables soft delete
    }
  );

  return item_price_history;
};

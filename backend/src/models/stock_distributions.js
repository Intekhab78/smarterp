"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class stock_distribution extends Model {
    static associate(models) {
      this.belongsTo(models.item_master, {
        foreignKey: "item_id",
        as: "item",
      });
      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
      this.belongsTo(models.warehouse_master, {
        foreignKey: "warehouse_id",
        as: "warehouse",
      });
      //   this.belongsTo(models.users, {
      //     foreignKey: "distributed_by",
      //     as: "user",
      //   });
    }
  }

  stock_distribution.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      warehouse_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distributed_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      distribution_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "stock_distribution",
      tableName: "stock_distributions",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      indexes: [
        {
          unique: true,
          fields: ["item_id", "company_id", "location_id", "warehouse_id"],
          name: "unique_distribution",
        },
      ],
    }
  );

  return stock_distribution;
};

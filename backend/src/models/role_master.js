"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class role_master extends Model {
    static associate(models) {
      this.hasMany(models.user_master, {
        foreignKey: "role_id",
        as: "users",
      });

      this.belongsToMany(models.permissions, {
        through: "role_has_permissions",
        foreignKey: "role_id",
        otherKey: "permission_id",
        as: "permissions", // ✅ matches the include alias
      });
    }
  }
  role_master.init(
    {
      role_id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      role_name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      role_description: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "role_master",
      tableName: "role_masters",
      timestamps: true,
      paranoid: true, // Soft delete enabled
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      hooks: {
        beforeCreate: (module, options) => {
          // You can add any preprocessing before creating a module
        },
        beforeUpdate: (module, options) => {
          // You can add any preprocessing before updating a module
        },
      },
    }
  );

  return role_master;
};

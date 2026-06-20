"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class user_group extends Model {
    static associate(models) {
      this.belongsTo(models.module_master, {
        foreignKey: "module_id",
        as: "module",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.sub_module_master, {
        foreignKey: "sub_module_id",
        as: "subModule",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.function_master, {
        foreignKey: "function_master_id",
        as: "function",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.action_master, {
        foreignKey: "action_id",
        as: "actions",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.user_user_master, {
        foreignKey: "role_id", // ✅ Match user_group.role_id
        targetKey: "role_id", // ✅ Points to user_user_master.role_id
        as: "user_master", // Optional alias
      });
    }
  }

  user_group.init(
    {
      user_group_id: {
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
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      module_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sub_module_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      function_master_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      action_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // Allows null if there's no specific action
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      updated_by: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      modelName: "user_group",
      tableName: "user_groups",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return user_group;
};

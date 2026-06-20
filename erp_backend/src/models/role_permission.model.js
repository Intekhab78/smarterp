"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class role_permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // role_permissions belongs to role_masters
      this.belongsTo(models.role_master, {
        foreignKey: "role_id",
        as: "role",
      });
    }
  }

  role_permissions.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      route_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "role_permissions",
      tableName: "role_permissions",
      timestamps: false, // only created_at exists
      underscored: true,
    }
  );

  return role_permissions;
};

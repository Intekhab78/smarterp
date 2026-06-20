"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.role_master, {
        through: "role_has_permissions",
        foreignKey: "permission_id",
        otherKey: "role_id",
        as: "roles", // you can name it "roles" or "role_master"
      });

      // define association here
      // this.belongsTo(models.user_master, {foreignKey:'id'})
    }
  }
  permissions.init(
    {
      path: DataTypes.STRING(255),
      guard_name: DataTypes.STRING(255),
      type: DataTypes.STRING(255),
      icon: DataTypes.STRING(255),
      parent_id: DataTypes.BIGINT,
      title: DataTypes.TEXT,
      is_view: DataTypes.BIGINT,
      is_create: DataTypes.BIGINT,
      is_edit: DataTypes.BIGINT,
      is_delete: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "permissions",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return permissions;
};

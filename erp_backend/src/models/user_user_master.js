"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class user_user_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
      this.belongsTo(models.roles, {
        foreignKey: "role_id",
        as: "roles",
      });
      this.hasMany(models.user_company, {
        foreignKey: "user_id",
        as: "user_company",
      });
      this.hasMany(models.user_group, {
        foreignKey: "role_id", // ✅ Matches the key in user_group
        sourceKey: "role_id", // ✅ Optional, if not the primary key
        as: "user_group",
      });
    }
  }
  user_user_master.init(
    {
      uuid: DataTypes.CHAR(36),
      firstname: DataTypes.STRING(191),
      lastname: DataTypes.STRING(191),
      email: DataTypes.STRING(191),
      password: DataTypes.STRING(191),
      mobile: DataTypes.STRING(191),
      //   role_id: DataTypes.BIGINT,
      role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      hire_date: DataTypes.DATE,
      base_subsidiary: DataTypes.STRING(191),
      home_store: DataTypes.STRING(191),
      job_title: DataTypes.STRING(191),
      till: DataTypes.STRING(191),
      drawer: DataTypes.STRING(191),
      max_disc: DataTypes.STRING(191),
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "user_user_master",
      tableName: "user_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      hooks: {
        beforeSave: async (user, options) => {
          if (user.password && user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 8);
          }
        },
      },
    }
  );
  return user_user_master;
};

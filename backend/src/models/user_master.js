"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class user_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.customer_info, {
        foreignKey: "user_id",
        as: "customerInfo",
      });

      this.hasOne(models.salesman_info, {
        foreignKey: "user_id",
        as: "salesmanInfo",
      });

      this.belongsTo(models.country_masters, {
        foreignKey: "cuscountry",
        as: "country",
      });
      this.belongsTo(models.country_masters, {
        foreignKey: "country_id",
        as: "countrys",
      });

      // this.belongsTo(models.role_master, {
      //   foreignKey: "role_id",
      //   as: "role",
      // });
      this.belongsTo(models.role_master, {
        foreignKey: "role_id",
        as: "role", // 👈 match this alias with your include
      });

      // this.hasMany(models.user_company, {
      //   foreignKey: "user_id",
      //   as: "user_company",
      // });

      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });

      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });

      // this.hasMany(models.user_group, {
      //   foreignKey: "user_group_id",
      //   targetKey: "role_id",
      //   as: "user_group",
      // });
    }
  }
  user_master.init(
    {
      uuid: DataTypes.CHAR(36),
      usertype: DataTypes.BIGINT,
      parent_id: DataTypes.STRING(191),
      firstname: DataTypes.STRING(191),
      cuscat: DataTypes.STRING(191),
      lastname: DataTypes.STRING(191),
      email: DataTypes.STRING(191),
      password: DataTypes.STRING(191),
      api_token: DataTypes.STRING(191),
      // email_verified_at: "",
      email_verified_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW, // Sets default to current timestamp
      },
      mobile: DataTypes.STRING(191),
      country_id: DataTypes.INTEGER(11),
      cuscountry: DataTypes.INTEGER(11),
      is_approved_by_admin: DataTypes.TINYINT(1),
      status: DataTypes.TINYINT(1),
      id_stripe: DataTypes.STRING(191),
      login_type: {
        type: DataTypes.ENUM(
          "system",
          "google",
          "facebook",
          "twitter",
          "mobile"
        ),
        default: "system",
      },

      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1001,
      },
      remember_token: DataTypes.STRING(191),
      ad_id: DataTypes.STRING(100),
      employe_code: DataTypes.STRING(191),

      cusbrand: DataTypes.STRING(191),
      cuscomname: DataTypes.STRING(191),
      category: DataTypes.STRING(191),
      custitle: DataTypes.STRING(191),
      cussname: DataTypes.STRING(191),
      cusemail1: DataTypes.STRING(191),
      subemail2: DataTypes.STRING(191),
      cusemail3: DataTypes.STRING(191),
      cusemail4: DataTypes.STRING(191),
      custax1: DataTypes.STRING(191),
      custax2: DataTypes.STRING(191),
      custax3: DataTypes.STRING(191),
      cusauth: DataTypes.STRING(191),
      cusfax: DataTypes.BIGINT,
      cusdob: DataTypes.DATE,
      cusanndt: DataTypes.DATE,
      custoll: DataTypes.BIGINT,
      cusconpername: DataTypes.STRING(191),
      cusconpername2: DataTypes.STRING(191),
      cusconpername3: DataTypes.STRING(191),
      cusphone: DataTypes.BIGINT,
      cusphone2: DataTypes.BIGINT,
      cusphone3: DataTypes.BIGINT,
      mobile2: DataTypes.BIGINT,
      custaxdt1: DataTypes.DATE,
      custaxdt2: DataTypes.DATE,
      note1: DataTypes.STRING(191),
      note2: DataTypes.STRING(191),
      note3: DataTypes.STRING(191),
      addedby: DataTypes.BIGINT,
      createddt: DataTypes.DATE,
      cusadd3: DataTypes.STRING(191),
      otherno: DataTypes.STRING(191),
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "user_master",
      tableName: "users",
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
  return user_master;
};

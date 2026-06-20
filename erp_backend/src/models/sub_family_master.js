"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sub_family_master extends Model {
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

      // NEW: Link Sub Family → Family
      // this.belongsTo(models.family_master, {
      //   foreignKey: "itemfamcode",
      //   targetKey: "itemfamcode",
      //   as: "family",
      // });

      this.belongsTo(models.family_master, {
        foreignKey: "itemfamcode",
        targetKey: "id",
        as: "family",
      });

      // FIXED DEPARTMENT RELATION
      this.belongsTo(models.item_department, {
        foreignKey: "itemdeptname", // this holds department id (25)
        targetKey: "id",
        as: "department",
      });

      // NEW: Link Sub Family → Department
      // this.belongsTo(models.item_department, {
      //   foreignKey: "itemdeptname",
      //   targetKey: "deptcode",
      //   as: "department",
      // });
    }
  }
  sub_family_master.init(
    {
      // uuid: DataTypes.STRING(255),
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
      },

      // organisation_id: DataTypes.BIGINT,
      organisation_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1, // Provide a default value if not provided
      },
      // organisation_id: DataTypes.BIGINT,
      itemsfamcode: DataTypes.STRING(255),
      itemsfamname: DataTypes.STRING(255),
      itemsfamlong: DataTypes.STRING(255),
      itemdeptname: DataTypes.STRING(255),
      itemfamcode: DataTypes.STRING(255),
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      itmsfamdt1: DataTypes.DATE,
      itmsfamdt2: DataTypes.DATE,
      addedby: DataTypes.BIGINT,
      company_id: DataTypes.BIGINT,
      location_id: DataTypes.BIGINT,
      status: DataTypes.TINYINT(1),
    },
    {
      sequelize,
      modelName: "sub_family_master",
      tableName: "sub_family_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return sub_family_master;
};

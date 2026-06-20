"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class test extends Model {
    static associate(models) {
      // A test entry can have multiple images
      test.hasMany(models.TestImage, { foreignKey: "test_id", as: "images" });
    }
  }

  test.init(
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "test",
      tableName: "tests",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return test;
};

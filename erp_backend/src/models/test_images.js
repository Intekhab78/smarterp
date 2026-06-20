"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TestImage extends Model {
    static associate(models) {
      // Each image set belongs to one test entry
      TestImage.belongsTo(models.test, { foreignKey: "test_id", as: "tests" });
    }
  }

  TestImage.init(
    {
      test_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tests",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      main_image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      left_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      right_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      front_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      back_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TestImage",
      tableName: "test_images",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return TestImage;
};

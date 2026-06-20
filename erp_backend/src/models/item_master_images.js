"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class item_master_image extends Model {
    static associate(models) {
      // Define the relation to item_location_master
      // item_master_image.belongsTo(models.item_location_master, {
      //   foreignKey: "item_image_id",
      //   as: "item_location",
      //   onDelete: "CASCADE",
      // });
      item_master_image.belongsTo(models.item_location_master, {
        foreignKey: "item_image_id",
        as: "item_location",
      });
    }
  }

  item_master_image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_image_id: {
        type: DataTypes.BIGINT, // Use BIGINT here to match referenced column
        allowNull: false,
        references: {
          model: "item_location_master",
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
      modelName: "item_master_image",
      tableName: "item_master_image",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return item_master_image;
};

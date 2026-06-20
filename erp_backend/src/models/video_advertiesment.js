"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VideoAdvertiesment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   this.belongsTo(models.company, {
    //     foreignKey: "company_id",
    //     targetKey: "id",
    //     as: "company",
    //   });
    //   this.belongsTo(models.store, {
    //     foreignKey: "store_id",
    //     targetKey: "id",
    //     as: "store",
    //   });
    //   this.belongsTo(models.location, {
    //     foreignKey: "location_id",
    //     targetKey: "id",
    //     as: "location",
    //   });
    //   this.belongsTo(models.user, {
    //     foreignKey: "created_by",
    //     targetKey: "id",
    //     as: "createdBy",
    //   });
    // }
  }

  VideoAdvertiesment.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      company_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      location_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      store_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      video_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },

      video_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "mp4",
      },

      duration_seconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      //   status: {
      //     type: DataTypes.STRING(50),
      //     allowNull: false,
      //     defaultValue: "active", // active | inactive | paused
      //   },

      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "active",
      },

      is_running: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_loop: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      created_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "VideoAdvertiesment",
      tableName: "video_advertiesment",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // soft delete
      deletedAt: "deleted_at",
    }
  );

  return VideoAdvertiesment;
};

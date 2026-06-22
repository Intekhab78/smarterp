"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // ⛔ Make sure models.User is already registered before this runs
      // if (models.User?.prototype instanceof Model) {
      //   this.belongsTo(models.User, {
      //     foreignKey: "userId",
      //     as: "user",
      //   });
      // } else {
      //   throw new Error("models.User is not defined or not a Sequelize model.");
      // }
    }
  }

  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      vehicleType: DataTypes.STRING,
      vehicleNumber: DataTypes.STRING,
      fromLocation: DataTypes.STRING,
      toLocation: DataTypes.STRING,
      departureTime: DataTypes.STRING,
      arrivalTime: DataTypes.STRING,
      classType: DataTypes.STRING,
      price: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
      timestamps: false,
    }
  );

  return Booking;
};

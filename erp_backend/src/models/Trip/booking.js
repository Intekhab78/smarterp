"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Booking.init(
    {
      // ✅ Auto-increment primary key
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      // General vehicle info
      vehicleType: {
        type: DataTypes.STRING, // e.g., "flight", "train", "car"
      },
      vehicleNumber: {
        type: DataTypes.STRING, // Flight number, train number, car ID, etc.
      },

      // Route info
      fromLocation: {
        type: DataTypes.STRING, // Generic 'source' location
      },
      toLocation: {
        type: DataTypes.STRING, // Generic 'destination'
      },

      // Timing info
      departureTime: {
        type: DataTypes.STRING, // Or use DataTypes.DATE
      },
      arrivalTime: {
        type: DataTypes.STRING, // Or use DataTypes.DATE
      },

      // Optional details
      classType: {
        type: DataTypes.STRING, // e.g., "Economy", "Sleeper", "SUV"
      },
      price: {
        type: DataTypes.STRING,
      },

      // Timestamp
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
      timestamps: false, // set true if managing createdAt and updatedAt automatically
    }
  );

  return Booking;
};

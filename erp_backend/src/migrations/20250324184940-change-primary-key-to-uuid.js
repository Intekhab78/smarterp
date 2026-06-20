"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'id' column
    await queryInterface.removeColumn("items", "id");

    // Modify 'uuid' to be the primary key
    await queryInterface.changeColumn("items", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add 'id' column if we roll back
    await queryInterface.addColumn("items", "id", {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    });

    // Remove 'uuid' as primary key
    await queryInterface.changeColumn("items", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
  },
};

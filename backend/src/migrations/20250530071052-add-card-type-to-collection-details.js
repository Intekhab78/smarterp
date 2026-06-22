"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("collection_details", "card_type", {
      type: Sequelize.STRING(255),
      allowNull: true, // or false depending on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("collection_details", "card_type");
  },
};

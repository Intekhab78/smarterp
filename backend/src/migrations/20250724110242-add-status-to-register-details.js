"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("register_tbl_details", "status", {
      type: Sequelize.STRING(20),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("register_tbl_details", "status");
  },
};

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("register_tbl_details", "over_short", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn("register_tbl_details", "reason", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("register_tbl_details", "over_short");
    await queryInterface.removeColumn("register_tbl_details", "reason");
  },
};

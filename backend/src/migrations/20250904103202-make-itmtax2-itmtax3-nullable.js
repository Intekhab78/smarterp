"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("items", "itmtax2code", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true, // make nullable
    });

    await queryInterface.changeColumn("items", "itmtax3code", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true, // make nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("items", "itmtax2code", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false, // revert to NOT NULL
    });

    await queryInterface.changeColumn("items", "itmtax3code", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false, // revert to NOT NULL
    });
  },
};

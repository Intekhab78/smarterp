"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "company_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "location_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "company_id");
    await queryInterface.removeColumn("users", "location_id");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add grn_number just after batch_number
    await queryInterface.addColumn("batches", "grn_number", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: "batch_number", // MySQL only
    });

    // Add company just before location
    await queryInterface.addColumn("batches", "company", {
      type: Sequelize.STRING(255),
      allowNull: true,
      before: "location", // MySQL only
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("batches", "grn_number");
    await queryInterface.removeColumn("batches", "company");
  },
};

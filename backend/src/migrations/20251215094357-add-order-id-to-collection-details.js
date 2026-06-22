"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("collection_details", "order_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      after: "invoice_id", // MySQL only
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("collection_details", "order_id");
  },
};

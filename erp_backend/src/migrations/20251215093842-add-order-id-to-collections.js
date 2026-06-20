"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("collections", "order_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      after: "invoice_id", // optional (works in MySQL)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("collections", "order_id");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoices", "vendor_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      after: "customer_id", // 👈 this ensures column is added after `id`
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invoices", "vendor_id");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "vendor_id", {
      type: Sequelize.STRING(191), // 🔥 string instead of BIGINT
      allowNull: true,
      after: "customer_id", // for MySQL only
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "vendor_id");
  },
};

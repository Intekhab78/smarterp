"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("good_receipt_notes", "vendor_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
      after: "customer_id", // 👈 ensures vendor_id comes after customer_id
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("good_receipt_notes", "vendor_id");
  },
};

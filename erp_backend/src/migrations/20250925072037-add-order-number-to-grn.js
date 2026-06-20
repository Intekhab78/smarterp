"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("good_receipt_notes", "order_number", {
      type: Sequelize.STRING(191),
      allowNull: true,
      after: "order_id", // works only in MySQL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("good_receipt_notes", "order_number");
  },
};

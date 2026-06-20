"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("good_receipt_notes", "vendor_invoice_no", {
      type: Sequelize.STRING(191),
      allowNull: true,
    });
    await queryInterface.addColumn(
      "good_receipt_notes",
      "vendor_invoice_date",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );
    await queryInterface.addColumn("good_receipt_notes", "delivery_note", {
      type: Sequelize.STRING(191),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "good_receipt_notes",
      "vendor_invoice_no"
    );
    await queryInterface.removeColumn(
      "good_receipt_notes",
      "vendor_invoice_date"
    );
    await queryInterface.removeColumn("good_receipt_notes", "delivery_note");
  },
};

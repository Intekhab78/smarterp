"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "good_receipt_note_details", // table name
      "item_mrp", // new column name
      {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
        after: "item_price", // 👈 place just after item_price
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("good_receipt_note_details", "item_mrp");
  },
};

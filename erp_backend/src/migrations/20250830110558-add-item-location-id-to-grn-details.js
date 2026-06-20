"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "good_receipt_note_details", // 👈 your table name
      "item_location_id", // 👈 new column name
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        after: "item_id", // 👈 place column just after item_id
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "good_receipt_note_details",
      "item_location_id"
    );
  },
};

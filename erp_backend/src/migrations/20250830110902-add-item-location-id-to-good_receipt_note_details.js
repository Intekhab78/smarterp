"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn(
    //   "good_receipt_note_details", // table name
    //   "item_location_id", // new column
    //   {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    //     after: "item_id", // ensures column comes after item_id
    //   }
    // );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "good_receipt_note_details",
      "item_location_id"
    );
  },
};

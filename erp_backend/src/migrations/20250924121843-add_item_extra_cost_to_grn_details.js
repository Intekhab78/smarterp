"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "good_receipt_note_details",
      "item_extra_cost",
      {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        after: "item_net", // This will add it just before item_grand_total
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "good_receipt_note_details",
      "item_extra_cost"
    );
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoice_details", "perItem_Total", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invoice_details", "perItem_Total");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add column after `item_tax`
    await queryInterface.sequelize.query(`
      ALTER TABLE item_location_master 
      ADD COLUMN opening_stock DECIMAL(18,2) DEFAULT 0.0 AFTER item_tax;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("item_location_master", "opening_stock");
  },
};

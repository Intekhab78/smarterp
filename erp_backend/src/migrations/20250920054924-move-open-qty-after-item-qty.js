"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // MySQL syntax to move column
    await queryInterface.sequelize.query(`
      ALTER TABLE order_details 
      MODIFY COLUMN open_qty DECIMAL(18,2) AFTER item_qty;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Optional: move it back to the end (or wherever it was)
    await queryInterface.sequelize.query(`
      ALTER TABLE order_details 
      MODIFY COLUMN open_qty DECIMAL(18,2);
    `);
  },
};

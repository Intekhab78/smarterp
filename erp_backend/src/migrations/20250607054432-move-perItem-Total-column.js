"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE invoice_details 
      MODIFY COLUMN perItem_Total DECIMAL(18,2) 
      AFTER item_excise;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE invoice_details 
      MODIFY COLUMN perItem_Total DECIMAL(18,2) 
      AFTER item_grand_total;
    `);
  },
};

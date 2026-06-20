"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Move `discounttype` before `item_discount_amount`
    await queryInterface.changeColumn("invoice_details", "discounttype", {
      type: Sequelize.STRING(255),
      after: "item_net", // column just before item_discount_amount
    });

    // Move `doc_discount` after `item_discount_amount`
    await queryInterface.changeColumn("invoice_details", "doc_discount", {
      type: Sequelize.DECIMAL(18, 2),
      after: "item_discount_amount",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes (optional or based on previous structure)
    await queryInterface.changeColumn("invoice_details", "discounttype", {
      type: Sequelize.STRING(255),
    });

    await queryInterface.changeColumn("invoice_details", "doc_discount", {
      type: Sequelize.DECIMAL(18, 2),
    });
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("invoice_details", "ret_exc_status", {
      type: Sequelize.STRING(100),
      after: "item_qty",
    });

    await queryInterface.addColumn("invoice_details", "ret_exc_qty", {
      type: Sequelize.DECIMAL(18, 2),
      after: "ret_exc_status",
    });

    await queryInterface.addColumn("invoice_details", "ret_bal_qty", {
      type: Sequelize.DECIMAL(18, 2),
      after: "ret_exc_qty",
    });

    await queryInterface.addColumn("invoice_details", "act_inv_ref", {
      type: Sequelize.STRING(191),
      after: "ret_bal_qty",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invoice_details", "ret_exc_status");
    await queryInterface.removeColumn("invoice_details", "ret_exc_qty");
    await queryInterface.removeColumn("invoice_details", "ret_bal_qty");
    await queryInterface.removeColumn("invoice_details", "act_inv_ref");
  },
};

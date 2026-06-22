"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE collection_details
      MODIFY COLUMN payment_mode VARCHAR(20) AFTER invoice_id,
      MODIFY COLUMN card_type VARCHAR(255) AFTER payment_mode,
      MODIFY COLUMN paymentcard_number VARCHAR(255) AFTER card_type,
      MODIFY COLUMN coupon_voucher_gift_code VARCHAR(255) AFTER paymentcard_number,
      MODIFY COLUMN amount DECIMAL(18,2) AFTER coupon_voucher_gift_code
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // You can reverse the order if necessary
  },
};

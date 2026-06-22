"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "collection_details",
      "coupon_voucher_gift_code",
      {
        type: Sequelize.STRING(255),
        allowNull: true,
      }
    );

    await queryInterface.addColumn("collection_details", "paymentcard_number", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("collection_details", "card_type", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "collection_details",
      "coupon_voucher_gift_code"
    );
    await queryInterface.removeColumn(
      "collection_details",
      "paymentcard_number"
    );
    await queryInterface.removeColumn("collection_details", "card_type");
  },
};

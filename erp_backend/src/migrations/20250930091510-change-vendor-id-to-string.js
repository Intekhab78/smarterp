"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("orders", "vendor_id", {
      type: Sequelize.STRING(191), // 🔥 convert to string
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("orders", "vendor_id", {
      type: Sequelize.BIGINT, // rollback to bigint if needed
      allowNull: true,
    });
  },
};

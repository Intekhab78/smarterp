"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("orders", "vendor_id", {
      type: Sequelize.BIGINT,
      allowNull: true, // change to false if you want it required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("orders", "vendor_id", {
      type: Sequelize.STRING, // rollback to previous type
      allowNull: true,
    });
  },
};

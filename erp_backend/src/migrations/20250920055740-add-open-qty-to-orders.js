"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "open_qty", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: "total_qty", // MySQL only
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "open_qty");
  },
};

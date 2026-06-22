"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add columns after `stock`
    await queryInterface.addColumn("items", "distributed_stock", {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0,
      after: "stock", // 👈 Adds just after `stock` column
    });

    await queryInterface.addColumn("items", "remaining_stock", {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0,
      after: "distributed_stock", // 👈 Adds after `distributed_stock`
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns if rolled back
    await queryInterface.removeColumn("items", "distributed_stock");
    await queryInterface.removeColumn("items", "remaining_stock");
  },
};

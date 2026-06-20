"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("batches", "itemcost", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: "current_in_stock", // place it after current_in_stock
    });

    await queryInterface.addColumn("batches", "itemlanprice", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: "itemcost",
    });

    await queryInterface.addColumn("batches", "item_price", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: "itemlanprice",
    });

    await queryInterface.addColumn("batches", "mrp", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: "item_price",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("batches", "mrp");
    await queryInterface.removeColumn("batches", "item_price");
    await queryInterface.removeColumn("batches", "itemlanprice");
    await queryInterface.removeColumn("batches", "itemcost");
  },
};

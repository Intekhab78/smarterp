"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("item_main_prices", "batch_number", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: "uom_cost", // adjust this if you want exact placement
    });

    await queryInterface.addColumn("item_main_prices", "itemcost", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: "batch_number",
    });

    await queryInterface.addColumn("item_main_prices", "itemlanprice", {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
      after: "itemcost",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("item_main_prices", "itemlanprice");
    await queryInterface.removeColumn("item_main_prices", "itemcost");
    await queryInterface.removeColumn("item_main_prices", "batch_number");
  },
};

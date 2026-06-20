"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "stock_movement", // table name
      "loc_id", // new column name
      {
        type: Sequelize.BIGINT,
        allowNull: true, // change to false if required
        after: "comp_id", // position after comp_id
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("stock_movement", "loc_id");
  },
};

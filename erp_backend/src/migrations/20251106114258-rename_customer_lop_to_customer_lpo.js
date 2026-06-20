"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      "orders",
      "customer_lop",
      "customer_lpo"
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn(
      "orders",
      "customer_lpo",
      "customer_lop"
    );
  },
};

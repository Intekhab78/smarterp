module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("collection_details", "currency", {
      type: Sequelize.STRING(10),
    });
    await queryInterface.addColumn("collection_details", "exchange_amount", {
      type: Sequelize.DECIMAL(18, 2),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("collection_details", "currency");
    await queryInterface.removeColumn("collection_details", "exchange_amount");
  },
};

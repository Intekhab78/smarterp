module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("register_settings", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "close",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("register_settings", "status");
  },
};

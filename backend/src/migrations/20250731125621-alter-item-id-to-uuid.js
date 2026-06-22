"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("item_location_master", "item_id", {
      type: Sequelize.UUID,
      allowNull: true, // change to false if needed
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("item_location_master", "item_id", {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  },
};

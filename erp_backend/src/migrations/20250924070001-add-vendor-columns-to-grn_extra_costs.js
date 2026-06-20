"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("grn_extra_costs", "vendor_type", {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: "",
      after: "cost_type",
    });

    await queryInterface.addColumn("grn_extra_costs", "vendor_name", {
      type: Sequelize.STRING(150),
      allowNull: false,
      defaultValue: "",
      after: "vendor_type",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("grn_extra_costs", "vendor_name");
    await queryInterface.removeColumn("grn_extra_costs", "vendor_type");
  },
};

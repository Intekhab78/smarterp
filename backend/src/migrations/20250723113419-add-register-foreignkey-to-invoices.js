"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("invoices", "register_tbl_hdr_id", {
      type: Sequelize.INTEGER, // ✅ match `register_tbl_hdr.id` type
      allowNull: true,
      references: {
        model: "register_tbl_hdr",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("invoices", "register_tbl_hdr_id");
  },
};

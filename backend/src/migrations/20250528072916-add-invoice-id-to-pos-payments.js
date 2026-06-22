"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("pos_payments", "invoice_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: "invoices",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("pos_payments", "invoice_id");
  },
};

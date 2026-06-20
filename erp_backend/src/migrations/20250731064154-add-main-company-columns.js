"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("companies", "is_main_comp", {
      type: Sequelize.ENUM("yes", "no"),
      allowNull: false,
      defaultValue: "yes",
      after: "id", // Add column after `id`
    });

    await queryInterface.addColumn("companies", "main_company_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      after: "is_main_comp", // Add column after `is_main_comp`
      references: {
        model: "companies",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns in reverse order
    await queryInterface.removeColumn("companies", "main_company_id");
    await queryInterface.removeColumn("companies", "is_main_comp");

    // Drop ENUM type (if needed to prevent future conflicts)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_companies_is_main_comp";'
    );
  },
};

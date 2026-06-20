"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("vendor_master", "VendorMobileNumber", {
      type: Sequelize.STRING(191),
      allowNull: true,
      after: "mobile", // optional, depends on your DB
    });

    await queryInterface.addColumn("vendor_master", "VendorEmail", {
      type: Sequelize.STRING(191),
      allowNull: true,
      after: "VendorMobileNumber",
    });

    await queryInterface.addColumn("vendor_master", "VendorDocumentName", {
      type: Sequelize.STRING(191),
      allowNull: true,
      after: "VendorEmail",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("vendor_master", "VendorMobileNumber");
    await queryInterface.removeColumn("vendor_master", "VendorEmail");
    await queryInterface.removeColumn("vendor_master", "VendorDocumentName");
  },
};

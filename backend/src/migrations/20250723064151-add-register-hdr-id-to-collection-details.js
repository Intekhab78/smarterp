module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "collection_details",
      "register_tbl_hdr_id",
      {
        type: Sequelize.BIGINT.UNSIGNED,
        after: "invoice_id", // 👈 This ensures it comes after invoice_id
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "collection_details",
      "register_tbl_hdr_id"
    );
  },
};

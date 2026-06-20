"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // ADD new column: only date
    await queryInterface.addColumn("emp_attendance", "date_only", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    // ADD new column: punch in
    await queryInterface.addColumn("emp_attendance", "punch_in", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // ADD new column: punch out
    await queryInterface.addColumn("emp_attendance", "punch_out", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // ADD new column: working hours
    await queryInterface.addColumn("emp_attendance", "working_hours", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("emp_attendance", "date_only");
    await queryInterface.removeColumn("emp_attendance", "punch_in");
    await queryInterface.removeColumn("emp_attendance", "punch_out");
    await queryInterface.removeColumn("emp_attendance", "working_hours");
  },
};

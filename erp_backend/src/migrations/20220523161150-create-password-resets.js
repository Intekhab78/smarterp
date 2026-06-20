'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('password_resets', {
      email: {
        type: Sequelize.STRING,
        references:{ model: 'user_master', key: 'id'},
        onUpdate:'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      token: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('password_resets');
  }
};
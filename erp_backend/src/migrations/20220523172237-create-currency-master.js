'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('currency_master', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      currency_name: {
        type: Sequelize.STRING(50)
      },
      currency_code: {
        type: Sequelize.STRING(50)
      },
      currency_format: {
        type: Sequelize.STRING(50)
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue:'active'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at:{
        allowNull: true,
        type: Sequelize.DATE  
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('currency_master');
  }
};
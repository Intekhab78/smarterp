'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards_masters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{ model: 'user_master', key: 'id'},
        onUpdate:'CASCADE',
        onDelete:'CASCADE',
      },
      card_number: {
        type: Sequelize.STRING(16)
      },
      expiry_month: {
        type: Sequelize.INTEGER(2)
      },
      expiry_year: {
        type: Sequelize.INTEGER(4)
      },
      cvv: {
        type: Sequelize.INTEGER(3)
      },
      status:{
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cards_masters');
  }
};
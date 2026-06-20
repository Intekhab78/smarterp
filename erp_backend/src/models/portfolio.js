'use strict';
const bcrypt = require('bcrypt')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class portfolio extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.portfolio_category, {
              foreignKey: 'category_id', // Assuming 'user_id' is the foreign key in the customer_info table
              as: 'portfolio_category' // Alias, optional but useful for clarity in queries
            });
            this.hasMany(models.portfolio_images, {
                foreignKey: 'portfolio_id', // Assuming 'user_id' is the foreign key in the customer_info table
                as: 'portfolio_images' // Alias, optional but useful for clarity in queries
              });
          }
    }
    portfolio.init({
        category_id: DataTypes.BIGINT,
        title: DataTypes.STRING(255),
    }, {
        sequelize,
        modelName: 'portfolio',
        tableName: 'portfolio',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    return portfolio;
};
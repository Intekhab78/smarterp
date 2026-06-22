'use strict';
const bcrypt = require('bcrypt')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class portfolio_images extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }
    portfolio_images.init({
        portfolio_id: DataTypes.BIGINT,
        image: DataTypes.STRING(255),
    }, {
        sequelize,
        modelName: 'portfolio_images',
        tableName: 'portfolio_images',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    return portfolio_images;
};
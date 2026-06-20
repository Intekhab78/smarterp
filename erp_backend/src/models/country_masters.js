'use strict';
const bcrypt = require('bcrypt')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class country_masters extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }
    country_masters.init({
        name: DataTypes.STRING(191),
        country_code: DataTypes.STRING(191),
        dial_code: DataTypes.STRING(191),
        currency: DataTypes.STRING(191),
        currency_code: DataTypes.STRING(191),
        currency_symbol: DataTypes.STRING(191),
    }, {
        sequelize,
        modelName: 'country_masters',
        tableName: 'country_masters',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    return country_masters;
};
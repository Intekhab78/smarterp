'use strict';
const bcrypt = require('bcrypt')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class currency_details extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        
    }
    currency_details.init({
        currency_id: DataTypes.BIGINT,
        frmdt: DataTypes.DATE,
        todt: DataTypes.DATE,
        curdess: DataTypes.STRING(255),
        currate: DataTypes.STRING(255),
    }, {
        sequelize,
        modelName: 'currency_details',
        tableName: 'currency_details',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    return currency_details;
};
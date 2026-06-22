'use strict';
const bcrypt = require('bcrypt')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class payment_type extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        
    }
    payment_type.init({
        name: DataTypes.STRING(255),
    }, {
        sequelize,
        modelName: 'payment_type',
        tableName: 'payment_types',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    return payment_type;
};
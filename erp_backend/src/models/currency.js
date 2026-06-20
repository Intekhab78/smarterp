'use strict';
const bcrypt = require('bcrypt')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class currency extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */static associate(models) {
        this.hasMany(models.currency_details,
            {
              foreignKey: 'currency_id',
              as: 'currency_details'
            });
         }
    }
    currency.init({
        name: DataTypes.STRING(255),
        curcode: DataTypes.STRING(255),
        curdes: DataTypes.STRING(255),
        curldes: DataTypes.STRING(255),
        isocode: DataTypes.STRING(255),
        symbol: DataTypes.STRING(255),
        format: DataTypes.STRING(255),
        decimals: DataTypes.STRING(255),
        rounding: DataTypes.STRING(255),
        // frmdt: DataTypes.STRING(255),
        // todt: DataTypes.STRING(255),
        // curdess: DataTypes.STRING(255),
        // currate: DataTypes.STRING(255),
        note1: DataTypes.STRING(255),
        note2: DataTypes.STRING(255),
        note3: DataTypes.STRING(255),
        itmcatdt1: DataTypes.STRING(255),
        itmcatdt2: DataTypes.STRING(255),
        addedby: DataTypes.STRING(255),
        status: DataTypes.STRING(255),
    }, {
        sequelize,
        modelName: 'currency',
        tableName: 'currency',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    return currency;
};
'use strict';
const bcrypt = require('bcrypt')
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class state extends Model {
        static associate(models) {
        this.belongsTo(models.country_masters, {
            foreignKey: 'country_id',
            as: 'country'
        });
     }
        
    }
    state.init({
        name: DataTypes.STRING(255),
        country_id: DataTypes.BIGINT,
    }, {
        sequelize,
        modelName: 'state',
        tableName: 'states',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    return state;
};
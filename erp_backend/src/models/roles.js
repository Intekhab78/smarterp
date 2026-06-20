'use strict';
const {
  Model,DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      roles.belongsToMany(models.permissions, {
        through: 'role_has_permissions',
        foreignKey: 'role_id',
        otherKey: 'permission_id', 
        as: 'permissions',
        onDelete: 'CASCADE',
      });
      
    }
  }
  roles.init({
    name: DataTypes.STRING(255),
    guard_name: {
      type: DataTypes.STRING(255),
      defaultValue: 'web'
    },
    description: DataTypes.TEXT,
    
  }, {
    sequelize,
    modelName: 'roles',
    timestamps:true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return roles;
};
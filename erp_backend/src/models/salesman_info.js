'use strict';
const {
  Model, DataTypes
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class salesman_info extends Model {
    static associate(models) {
      this.belongsTo(models.user_master, {
        foreignKey: 'user_id', // Assuming 'user_id' is the foreign key in the customer_info table
        as: 'users' // Alias, optional but useful for clarity in queries
      });
    }
  }

  salesman_info.init({
    uuid: DataTypes.CHAR(36),
    organisation_id: DataTypes.BIGINT.UNSIGNED,
    user_id: DataTypes.BIGINT.UNSIGNED,
    route_id: DataTypes.BIGINT.UNSIGNED,
    region_id: DataTypes.BIGINT.UNSIGNED,
    salesman_helper_id: DataTypes.BIGINT.UNSIGNED,
    incentive: DataTypes.DECIMAL(8, 2),
    salesman_type_id: DataTypes.BIGINT.UNSIGNED,
    salesman_role_id: DataTypes.BIGINT.UNSIGNED,
    category_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '1: Salesman, 2: Salesman cum driver, 3: Helper, 4: Driver cum helper, 5: Delivery Helper'
    },
    salesman_code: DataTypes.STRING(20),
    salesman_supervisor: DataTypes.STRING(191),
    salesman_user: DataTypes.INTEGER(11),
    status: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    profile_image: DataTypes.STRING(191),
    is_block: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    block_start_date: DataTypes.DATE,
    block_end_date: DataTypes.DATE,
    cash_discrepancy_block: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    cash_discrepancy_block_date: DataTypes.DATE,
    stemp_block: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0
    },
    stemp_block_date: DataTypes.DATE,
    current_stage: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      defaultValue: 'Pending'
    },
    current_stage_comment: DataTypes.TEXT,
    is_lob: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
      comment: '1=LOB'
    }
  }, {
    sequelize,
    modelName: 'salesman_info',
    tableName: 'salesman_infos',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  return salesman_info;
};

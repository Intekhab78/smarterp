module.exports = (sequelize, DataTypes) => {
  const company_level_stock = sequelize.define(
    "company_level_stock",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      company_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      total_stock: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      calculated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "company_level_stock",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  company_level_stock.associate = (models) => {
    company_level_stock.belongsTo(models.company, {
      as: "company",
      foreignKey: "company_id",
      targetKey: "id", // company model PK
    });

    company_level_stock.belongsTo(models.item_master, {
      as: "item",
      foreignKey: "item_id",
      targetKey: "uuid", // assuming item_master has uuid column
    });
  };

  return company_level_stock;
};

// item_location_master;

("use strict");
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item_location_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A test entry can have multiple images
      // this.hasMany(models.item_master_image, {
      //   foreignKey: "item_image_id",
      //   as: "item_master_image",
      // });
      // this.hasMany(models.item_master_image, {
      //   foreignKey: "item_image_id", // this should match image's FK
      //   as: "items", // this is the alias you use when including
      // });
      this.hasMany(models.item_master_image, {
        foreignKey: "item_image_id",
        as: "images",
      });

      this.belongsTo(models.item_category, {
        foreignKey: "itemcatname", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "itemcategory", // Alias, optional but useful for clarity in queries
      });

      this.hasMany(models.item_main_price, {
        foreignKey: "item_id",
        sourceKey: "id",
        as: "item_main_prices",
        constraints: false, // ✅ avoid conflict since same field used for item_master
      });
      this.hasMany(models.batch, {
        foreignKey: "item_id",
        sourceKey: "id",
        as: "item_batch",
        constraints: false, // ✅ avoid conflict since same field used for item_master
      });

      this.belongsTo(models.item_color, {
        foreignKey: "colorname", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "item_color", // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.size_master, {
        foreignKey: "sizename", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "size_master", // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.item_department, {
        foreignKey: "departname", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "item_department", // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.family_master, {
        foreignKey: "familyname", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "family_master", // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.sub_family_master, {
        foreignKey: "subfamliy", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "sub_family_master", // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.brand, {
        foreignKey: "brandname", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "brand", // Alias, optional but useful for clarity in queries
      });

      //   this.belongsTo(models.brand, {
      //   foreignKey: "brandname",
      //   targetKey: "id",
      //   as: "brandmaster",
      //   constraints: false,
      // });
      this.belongsTo(models.item_uom, {
        foreignKey: "itmuom", // Assuming 'user_id' is the foreign key in the customer_info table
        as: "item_uom", // Alias, optional but useful for clarity in queries
      });
      this.belongsTo(models.vendor_master, {
        foreignKey: "suppliername",
        as: "vendor",
      });
      this.belongsTo(models.customer_info, {
        foreignKey: "suppliername",
        as: "customer_info",
      });
      this.belongsTo(models.tax_master, {
        foreignKey: "itmtax1code",
        as: "tax_master_1",
      });

      this.belongsTo(models.tax_master, {
        foreignKey: "item_tax",
        as: "tax_master_item", // ✅ handles item_tax field
      });
      this.belongsTo(models.tax_master, {
        foreignKey: "itmtax2code",
        as: "tax_master_2",
      });
      this.belongsTo(models.tax_master, {
        foreignKey: "itmtax3code",
        as: "tax_master_3",
      });
      this.belongsTo(models.company, {
        foreignKey: "company_id",
        as: "company",
      });
      this.belongsTo(models.location, {
        foreignKey: "location_id",
        as: "location",
      });
      // this.belongsTo(models.item_master, {
      //   foreignKey: "item_id", // the FK in item_location_master
      //   targetKey: "uuid", // if you are using item_master.uuid as reference
      //   as: "item", // alias used when including
      // });
      item_location_master.belongsTo(models.item_master, {
        foreignKey: "item_id",
        targetKey: "uuid",
        as: "item",
      });
      this.hasMany(models.stock_movement, {
        foreignKey: "item_id",
        sourceKey: "id",
        as: "stock_movements",
      });
      this.hasMany(models.priceListItemDetails, {
        foreignKey: "item_id",
        sourceKey: "id",
        as: "price_list_items",
      });

      // this.hasMany(models.pr_apply_settings, {
      //   foreignKey: "location_id",
      //   sourceKey: "location_id",
      //   as: "pr_applied",
      // });
      this.hasMany(models.pr_apply_settings, {
        foreignKey: "location_id",
        as: "pr_apply_locations",
      });
    }
  }
  item_location_master.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      //   item_id: {
      //     type: DataTypes.BIGINT,
      //   },
      item_id: {
        type: DataTypes.UUID,
      },

      uuid: {
        type: DataTypes.STRING(255),
        defaultValue: DataTypes.UUIDV4,
      },
      organisation_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      item_major_category_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      item_group_id: DataTypes.BIGINT,
      brand_id: DataTypes.BIGINT,
      lob_id: DataTypes.BIGINT,
      is_variant: DataTypes.TINYINT(4),
      is_product_catalog: DataTypes.TINYINT(4),
      supervisor_category_id: DataTypes.BIGINT,
      is_promo_allocation: DataTypes.STRING(255),
      is_promotional: DataTypes.TINYINT(4),
      short_code: DataTypes.STRING(255),
      item_code: DataTypes.STRING(255),
      erp_code: DataTypes.STRING(255),
      item_name: DataTypes.STRING(255),
      item_description: DataTypes.TEXT,
      item_barcode_img: DataTypes.TEXT,
      item_barcode: DataTypes.STRING(255),
      item_weight: DataTypes.DECIMAL(18, 2),
      item_shelf_life: DataTypes.STRING(255),
      volume: DataTypes.DECIMAL(18, 2),
      lower_unit_item_upc: DataTypes.INTEGER(255),
      lower_unit_uom_id: DataTypes.BIGINT,
      lower_unit_item_price: DataTypes.DECIMAL(18, 2),
      unit_item_max_price: DataTypes.DECIMAL(18, 2),
      lower_unit_purchase_order_price: DataTypes.DECIMAL(18, 2),
      is_tax_apply: DataTypes.TINYINT(4),
      item_vat_percentage: DataTypes.DECIMAL(5, 2),
      is_item_excise: DataTypes.TINYINT(1),
      item_excise: DataTypes.DECIMAL(5, 2),
      item_excise_uom_id: DataTypes.BIGINT,
      new_lunch: DataTypes.TINYINT(1),
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      current_stage: DataTypes.STRING(255),
      current_stage_comment: DataTypes.TEXT,
      item_image: DataTypes.STRING(255),
      stock_keeping_unit: DataTypes.TINYINT(1),
      status: DataTypes.TINYINT(1),
      height: DataTypes.STRING(255),
      width: DataTypes.STRING(255),
      depth: DataTypes.STRING(255),
      is_coupon: DataTypes.INTEGER(11),
      coupon_id: DataTypes.INTEGER(11),
      // pallet_case: DataTypes.DECIMAL(18, 2),
      pallet_case: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0.0, // Set the default value to 0.00
      },
      rate: DataTypes.DECIMAL(18, 2),
      item_tax: DataTypes.BIGINT,
      opening_stock: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0.0,
      },
      stock: DataTypes.BIGINT,
      distributed_stock: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },

      remaining_stock: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      partNumber: DataTypes.STRING(255),
      barcode: DataTypes.STRING(255),
      batch_no: DataTypes.STRING(255),
      // itemcatname: DataTypes.BIGINT,
      itemcatname: DataTypes.BIGINT.UNSIGNED,

      itemdesclong: DataTypes.STRING(255),
      itemdesc3: DataTypes.STRING(255),
      itemdesc4: DataTypes.STRING(255),
      itemupc: DataTypes.STRING(255),
      itemref: DataTypes.STRING(255),
      stylecode: DataTypes.STRING(255),
      // colorname: DataTypes.BIGINT,
      colorname: DataTypes.BIGINT.UNSIGNED,

      // sizename: DataTypes.BIGINT,
      sizename: DataTypes.BIGINT.UNSIGNED,
      departname: DataTypes.BIGINT.UNSIGNED,
      familyname: DataTypes.BIGINT.UNSIGNED,
      subfamliy: DataTypes.BIGINT.UNSIGNED,
      brandname: DataTypes.BIGINT.UNSIGNED,
      hsncode: DataTypes.STRING(255),
      itemcost: DataTypes.STRING(255),
      itemprice: DataTypes.DECIMAL(18, 2),
      itemlanprice: DataTypes.DECIMAL(18, 2),
      minstklvl: DataTypes.STRING(255),
      maxstklvl: DataTypes.STRING(255),
      itmstkmgmt: DataTypes.STRING(255),
      itmuom: DataTypes.BIGINT.UNSIGNED,
      // itmwweight: DataTypes.DECIMAL(18, 2),
      itmwweight: DataTypes.DECIMAL(18, 4),
      // itmwpurunit: DataTypes.DECIMAL(18, 2),
      // itmwsalesunit: DataTypes.DECIMAL(18, 2),
      itmwpurunit: DataTypes.BIGINT.UNSIGNED,
      itmwsalesunit: DataTypes.BIGINT.UNSIGNED,
      itmtax1code: DataTypes.BIGINT.UNSIGNED,
      itmtax2code: DataTypes.BIGINT.UNSIGNED,
      itmtax3code: DataTypes.BIGINT.UNSIGNED,
      itmcostingmet: DataTypes.DECIMAL(18, 2),
      suppliername: DataTypes.BIGINT.UNSIGNED,
      note1: DataTypes.STRING(255),
      note2: DataTypes.STRING(255),
      note3: DataTypes.STRING(255),
      addedby: DataTypes.BIGINT,
      itemdesc: DataTypes.STRING(255),
      itmdt1: DataTypes.DATE,
      itmdt2: DataTypes.DATE,
      itmexpiry: DataTypes.DATE,
      exp_date: DataTypes.DATE,
      company_id: DataTypes.BIGINT.UNSIGNED,
      location_id: DataTypes.BIGINT.UNSIGNED,
    },
    {
      sequelize,
      modelName: "item_location_master",
      tableName: "item_location_master",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return item_location_master;
};

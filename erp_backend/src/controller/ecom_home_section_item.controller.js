"use strict";

const db = require("../models");
const { Op } = db.Sequelize;
const SectionItem = db.ecom_home_section_item;
const ItemLocation = db.item_location_master;
const itemMajorCategoryModel = db.item_category;
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const productModel = db.product_master;
const itemColorModel = db.item_color;
const itemSizeModel = db.size_master;
const itemDepartmentModel = db.item_department;
const familyModel = db.family_master;
const subFamilyModel = db.sub_family_master;
const brandModel = db.brand;
const TaxMasterModel = db.tax_master;
const UserModel = db.user_master;
const CustomerInfo = db.customer_info;
const CompanyModel = db.company;
const LocationModel = db.location;
const Batches = db.batch;
const priceListItemDetails = db.priceListItemDetails;
const priceListMaster = db.priceListMaster;
const item_master_image = db.item_master_image;

/**
 * ADD PRODUCT TO HOME SECTION
 */
exports.create = async (req, res) => {
  try {
    const {
      ecom_home_section_id,
      item_id,
      sort_order,
      company_id,
      location_id,
      website_ref,
      status,
    } = req.body;

    console.log("reqq body is -----------", req.body);

    if (!ecom_home_section_id || !item_id) {
      return res.status(400).json({
        success: false,
        message: "Section and product are required",
      });
    }

    // prevent duplicate product in same section
    const exists = await SectionItem.findOne({
      where: {
        ecom_home_section_id,
        item_id,
        deleted_at: null,
      },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already added to this section",
      });
    }

    const data = await SectionItem.create({
      ecom_home_section_id,
      item_id,
      sort_order: sort_order || 1,
      company_id,
      location_id,
      website_ref,
      status: status || "active",
      addedby: req.user?.id || null,
    });

    return res.json({
      success: true,
      message: "Product added to section",
      data,
    });
  } catch (error) {
    console.error("Create Section Item Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * LIST PRODUCTS OF A HOME SECTION
 */

exports.list = async (req, res) => {
  try {
    const {
      ecom_home_section_id,
      company_id,
      location_id,
      website_ref,
      status,
    } = req.query;

    let where = {};
    if (ecom_home_section_id) where.ecom_home_section_id = ecom_home_section_id;
    if (company_id) where.company_id = company_id;
    if (location_id) where.location_id = location_id;
    if (website_ref) where.website_ref = website_ref;
    if (status) where.status = status;

    const rows = await SectionItem.findAll({
      where,
      order: [["sort_order", "ASC"]],
      include: [
        {
          model: ItemLocation,
          as: "item",
          include: [
            {
              model: TaxMasterModel,
              as: "tax_master_1",
              attributes: ["id", "taxname", "taxcal", "taxpor1"],
            },
            {
              model: itemMainPriceModel,
              as: "item_main_prices",
              attributes: [
                "batch_number",
                "itemcost",
                "item_price",
                "itemlanprice",
                "item_id",
                "item_upc",
              ],
            },
            {
              model: Batches,
              as: "item_batch",
              attributes: [
                "batch_number",
                "qty",
                "current_in_stock",
                "expiry_date",
                "company",
                "location",
                "created_at",
              ],
            },
            {
              model: itemUomModel, // ✅ include UOM table
              as: "item_uom",
              attributes: ["id", "uomcode", "uomname", "symbol"],
            },
            {
              model: item_master_image,
              as: "images", // <-- correct alias matching association
              // ...
            },
            {
              model: brandModel, // ✅ include UOM table
              as: "brand",
              attributes: ["id", "brandcode", "brandname"],
            },
            {
              model: itemColorModel, // add this
              as: "item_color", // alias defined in association
              attributes: [
                "id",
                "itemcolcode",
                "itemcolname",
                "itemcoldesclong",
              ], // select the fields you need
            },
            {
              model: itemSizeModel, // add this
              as: "size_master", // alias defined in association
              attributes: [
                "id",
                "itemsizecode",
                "itemsizename",
                "itemsizelong",
              ],
            },
            {
              model: priceListItemDetails,
              as: "price_list_items",
              include: [
                {
                  model: priceListMaster,
                  as: "priceList",
                },
              ],
            },
          ],
        },
      ],
    });

    // 🔥 Same batch + price merge logic as getItemLocationList
    const data = rows.map((row) => {
      const json = row.toJSON();
      //   const item = json.item_location;
      const item = json.item;

      if (!item) return json;

      item.batches = item.item_batch.map((batch) => {
        const price = item.item_main_prices.find(
          (p) => p.batch_number === batch.batch_number
        );

        return {
          ...batch,
          price_data: price
            ? {
                itemcost: price.itemcost,
                itemprice: price.item_price,
                itemlanprice: price.itemlanprice,
              }
            : null,
        };
      });

      delete item.item_main_prices;
      delete item.item_batch;

      //   json.item_location = item;
      json.item = item;

      return json;
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Home Section Item List Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.list1 = async (req, res) => {
  try {
    const {
      ecom_home_section_id,
      company_id,
      location_id,
      website_ref,
      status,
    } = req.query;

    let where = {};

    if (ecom_home_section_id) where.ecom_home_section_id = ecom_home_section_id;
    if (company_id) where.company_id = company_id;
    if (location_id) where.location_id = location_id;
    if (website_ref) where.website_ref = website_ref;
    if (status) where.status = status;

    const data = await SectionItem.findAll({
      where,
      order: [["sort_order", "ASC"]],
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("List Section Items Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * UPDATE SECTION ITEM (SORT / STATUS)
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await SectionItem.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Section item not found",
      });
    }

    await item.update(req.body);

    return res.json({
      success: true,
      message: "Section item updated",
      data: item,
    });
  } catch (error) {
    console.error("Update Section Item Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * UPDATE STATUS (ENABLE / DISABLE)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const item = await SectionItem.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Section item not found",
      });
    }

    await item.update({ status });

    return res.json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/**
 * DELETE SECTION ITEM (SOFT DELETE)
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await SectionItem.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Section item not found",
      });
    }

    await item.destroy();

    return res.json({
      success: true,
      message: "Product removed from section",
    });
  } catch (error) {
    console.error("Delete Section Item Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

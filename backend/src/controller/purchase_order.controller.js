const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where, FLOAT } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
// const OrderModel = db.order;
// const OrderDetailModel = db.order_details;
const OrderModel = db.po_order;
const OrderDetailModel = db.po_order_details;

const UserModel = db.user_master;
const VendorModel = db.vendor_master;

const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_location_master;
const invoiceModel = db.invoice;
const GrnModel = db.grn;
const paymentTermsModel = db.payment_terms;
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const TaxMasterModel = db.tax_master;

const { codesettingupdate } = require("../utils/handler");

require("dotenv").config();
const paths = require("path");
const { log } = require("console");
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
  const { page, name, customer_code, limit = 10 } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await OrderModel.count();
    const festivalRes = await OrderModel.findAll({
      //     where: searchQuery,
      // attributes: ['id','customer_code','customer_id'],
      include: [
        {
          model: UserModel,
          as: "salesman",
          attributes: ["firstname", "lastname", "email", "id"],
          include: [
            {
              model: SalesmanInfo,
              as: "salesmanInfo",
              attributes: ["salesman_code", "user_id"], // Example attributes
            },
          ],
        },
        {
          model: UserModel,
          as: "customer",
          attributes: ["firstname", "lastname", "email", "id"],
          include: [
            {
              model: CustomerInfo,
              as: "customerInfo",
              attributes: ["customer_code", "user_id"], // Example attributes
            },
          ],
        },
        {
          model: OrderDetailModel,
          as: "po_order_details",
          // attributes: ['firstname', 'lastname', 'email'],
        },
        {
          model: VendorModel,
          as: "vendor_details",
        },
        {
          model: GrnModel,
          as: "grn",
          attributes: ["grn_number"],
          required: false,
        },
      ],
      where: { type: "purchase order" },
      order: [["id", "DESC"]],
      limit: limits,
      offset: offset,
    });

    // console.log("Base URL:", process.env.BASE_URL);
    const totalPages = Math.ceil(totalRecords / limits);
    const pagination = {
      records: festivalRes,
      currentPage: currentPage,
      pageSize: limits,
      totalRecords: totalRecords,
      totalPages: totalPages,
    };

    if (!festivalRes) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, " not found!", "Error", ""),
        );
    } else {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully record",
            "",
            pagination,
          ),
        );
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};

const store = async (req, res, next) => {
  const {
    customer_id,
    customer_lob,
    salesman_id,
    customer_lpo,
    order_number,
    delivery_date,
    payment_terms,
    due_date,
    discount,
    net,
    excise,
    vat,
    total,
    // status,
    order_type,
    taxable_total,
    cgst_amount,
    sgst_amount,
    igst_amount,
    items,
    type,
    company_id,
    location_id,
    vendor_note,
  } = req.body;

  try {
    codesettingupdate("purchase_order");
    console.log("items is -----------", req.body);

    const toDecimal = (val) => {
      if (val === "" || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };

    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);
    // const totalOpenQty = items.reduce((sum, item) => {
    //   return sum + Number(item.quantity || 0);
    // }, 0);
    let date = new Date();
    let Order = await OrderModel.create({
      customer_id: customer_id,
      vendor_id: customer_id,
      any_comment: vendor_note,
      customer_lob: customer_lob,
      salesman_id: salesman_id,
      customer_lpo: customer_lpo,
      order_number: order_number,
      delivery_date: delivery_date,
      order_date: date,
      payment_term_id: payment_terms,
      // due_date: due_date,
      due_date: due_date || new Date().toISOString().split("T")[0],

      total_discount_amount: discount,
      total_qty: totalItemQty,
      open_qty: totalItemQty,
      total_net: net,
      total_vat: vat,
      total_excise: excise,
      grand_total: total,
      taxable_total: taxable_total,
      cgst_amount: cgst_amount,
      sgst_amount: sgst_amount,
      igst_amount: igst_amount,
      status: "fresh",
      company_id: company_id,
      location_id: location_id,
      // status:'Open',
      order_type: order_type,
      type: type,
    });

    for (var i = 0; i < items.length; i++) {
      let item_stoke = await itemModel.findOne({
        where: {
          id: items[i].item_id,
        },
      });
      let OrderDetail = await OrderDetailModel.create({
        // order_id: Order.id,
        order_id: Order.id,
        item_id: items[i].item_id,
        item_uom_id: items[i].uom,
        discount_id: 0,
        is_free: 0,
        is_item_poi: 0,
        promotion_id: 0,
        item_qty: items[i].quantity,
        open_qty: items[i].quantity,
        discounttype: items[i].discounttype,
        item_weight: 0,
        total_pallet: 0,
        total_pallet_volume: 0,
        item_price: items[i].price,
        item_gross: items[i].price,
        item_discount_amount: items[i].discount,
        item_net: items[i].net,
        // item_vat: items[i].vat,
        item_excise: items[i].excise,
        item_grand_total: items[i].total,
        delivered_qty: 0,
        order_status: "Pending",
        // ptr_di: items[i].ptr_di,
        // taxa_ble: items[i].taxa_ble,
        ptr_di: items[i].ptr_di ? Number(items[i].ptr_di) : 0,
        taxa_ble: items[i].taxa_ble ? Number(items[i].taxa_ble) : 0,

        cgst: toDecimal(items[i].cgst),
        cgst_amount: toDecimal(items[i].cgst_amount),
        sgst: toDecimal(items[i].sgst),
        sgst_amount: toDecimal(items[i].sgst_amount),
        igst: toDecimal(items[i].igst),
        igst_amount: toDecimal(items[i].igst_amount),

        itemtype: items[i].itemtype,
        landed_cost_per_unit: toDecimal(items[i].landed_cost_per_unit),
        purchase_cost_per_unit: toDecimal(items[i].purchase_cost_per_unit),

        // expiry_delivery_date :items[i].expiry_delivery_date,
        // receiving_site :items[i].receiving_site,
        // hsn_code :items[i].hsn_code,
        // expiry_delivery_date : item_stoke.exp_date,
        // receiving_site : item_stoke.batch_no,
        // hsn_code : item_stoke.short_code,
      });
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          Order,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};
const details = async (req, res, next) => {
  const { id } = req.body;
  console.log("id is ---------", id);

  try {
    const detail = await OrderModel.findOne({
      include: [
        {
          model: UserModel,
          as: "salesman",
          attributes: ["firstname", "lastname", "email", "id", "mobile"],
          include: [
            {
              model: SalesmanInfo,
              as: "salesmanInfo",
              attributes: ["salesman_code", "user_id"], // Example attributes
            },
          ],
        },
        {
          model: UserModel,
          as: "customer",
          attributes: ["firstname", "lastname", "email", "id", "mobile"],
          include: [
            {
              model: CustomerInfo,
              as: "customerInfo",
              attributes: [
                "customer_code",
                "user_id",
                "customer_address_1",
                "customer_address_2",
              ], // Example attributes
            },
          ],
        },
        {
          model: VendorModel,
          as: "vendor_details",
        },
        {
          model: OrderDetailModel,
          as: "po_order_details",
          include: [
            {
              model: itemModel,
              as: "itemLocationModel",
              include: [
                {
                  model: TaxMasterModel,
                  as: "tax_master_1",
                  attributes: ["id", "taxname", "taxcal", "taxpor1"], // ✅ only required fields
                },
                {
                  model: itemMainPriceModel,
                  as: "item_main_prices",
                  attributes: ["id", "item_id", "item_uom_id", "item_price"],
                  include: [
                    {
                      model: itemUomModel,
                      as: "item_uom",
                      attributes: ["id", "code", "name"],
                    },
                  ],
                },
              ],
            },
          ],
          // attributes: ['firstname', 'lastname', 'email'],
        },
        {
          model: paymentTermsModel,
          as: "payment_terms",
          attributes: ["id", "name"],
        },
      ],
      where: {
        // id: id,
        id: Number(id),
      },
    });

    if (!detail) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "not found!", "Error", ""),
        );
    } else {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully show record",
            "",
            detail,
          ),
        );
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};

const UpdateOrder = async (req, res, next) => {
  const {
    id,
    customer_lob,
    customer_lpo,
    customer_id,
    delivery_date,
    payment_terms,
    due_date,
    discount,
    net,
    excise,
    vat,
    total,
    status,
    order_type,
    type,
    items,
    company_id,
    location_id,
    any_comment,
  } = req.body;

  try {
    console.log(
      "rew.body from the update order is /////////////////////",
      req.body,
    );

    // Find the existing order and its details
    const detail = await OrderModel.findOne({
      include: [
        {
          model: OrderDetailModel,
          as: "po_order_details",
        },
      ],
      where: {
        id: id,
      },
    });

    console.log("details is ", detail);

    if (!detail) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Order not found", "Error"),
        );
    }

    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    console.log("totalItemQty------------", totalItemQty);

    // Update the order details
    await OrderModel.update(
      {
        customer_lob: customer_lob,
        customer_lpo: customer_lpo,
        vendor_id: customer_id,
        delivery_date: delivery_date,
        payment_term_id: payment_terms,
        // due_date: due_date,
        due_date: due_date || new Date().toISOString().split("T")[0],
        total_discount_amount: discount,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        status: "fresh",
        order_type: order_type,
        company_id: company_id,
        location_id: location_id,
        type: type,
        total_qty: totalItemQty,
        open_qty: totalItemQty,
        any_comment: any_comment,
      },
      {
        where: {
          id: id,
        },
      },
    );

    // Process each item in the order
    for (let i = 0; i < items.length; i++) {
      const existingItem = detail.po_order_details.find(
        (orderDetail) =>
          orderDetail.item_id === items[i].item_id &&
          items[i].purchaseorder_details_id == orderDetail.id,
      );
      let item_stoke = await itemModel.findOne({
        where: {
          id: items[i].item_id,
        },
      });
      if (existingItem) {
        // If the item already exists, update the quantity and other details
        await OrderDetailModel.update(
          {
            // item_qty: parseFloat(existingItem.item_qty),
            item_uom_id: items[i].item_uom_id,
            item_price: items[i].price,
            discounttype: items[i].discounttype,
            item_gross: items[i].price,
            item_discount_amount: items[i].discount,
            item_net: items[i].net,
            // item_vat: items[i].vat,
            item_excise: items[i].excise,
            item_grand_total: items[i].total,
            taxa_ble: items[i].taxa_ble,
            // expiry_delivery_date :items[i].expiry_delivery_date,
            // receiving_site :items[i].receiving_site,
            // hsn_code :items[i].hsn_code,
            // expiry_delivery_date : item_stoke.exp_date,
            // receiving_site : item_stoke.batch_no,
            // hsn_code : item_stoke.short_code,
            item_qty: items[i].quantity,
            open_qty: items[i].quantity,
          },
          {
            where: {
              id: existingItem.id,
            },
          },
        );
      } else {
        // If the item does not exist, create a new order detail
        await OrderDetailModel.create({
          //   order_id: id,
          //   order_id: Order.id,
          order_id: id,

          item_id: items[i].item_id,
          item_uom_id: 0,
          discount_id: 0,
          is_free: 0,
          is_item_poi: 0,
          promotion_id: 0,
          item_qty: items[i].quantity,
          discounttype: items[i].discounttype,
          item_weight: 0,
          total_pallet: 0,
          total_pallet_volume: 0,
          item_price: items[i].price,
          item_gross: items[i].price,
          item_discount_amount: items[i].discount,
          item_net: items[i].net,
          // item_vat: items[i].vat,
          item_excise: items[i].excise,
          item_grand_total: items[i].total,
          delivered_qty: 0,
          open_qty: 0,
          order_status: "Pending",
          taxa_ble: items[i].taxa_ble,
          // expiry_delivery_date :items[i].expiry_delivery_date,
          // receiving_site :items[i].receiving_site,
          // hsn_code :items[i].hsn_code,
          // expiry_delivery_date : item_stoke.exp_date,
          // receiving_site : item_stoke.batch_no,
          // hsn_code : item_stoke.short_code,
        });
      }

      // Get existing and incoming detail IDs
      console.log("detail.order_details.", detail.order_details);

      //   const existingItemIds = detail.order_details.map((d) => d.id);
      const existingItemIds = detail.po_order_details.map((d) => d.id);

      const incomingItemIds = items
        .filter((i) => i.purchaseorder_details_id)
        .map((i) => i.purchaseorder_details_id);

      // Delete removed items
      const itemsToDelete = existingItemIds.filter(
        (id) => !incomingItemIds.includes(id),
      );

      if (itemsToDelete.length > 0) {
        await OrderDetailModel.destroy({ where: { id: itemsToDelete } });
        console.log("Deleted items:", itemsToDelete);
      }
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully updated record",
          "",
          detail,
        ),
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};

const delete_order = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await OrderModel.destroy({
      where: {
        id: id,
      },
    });

    if (deletedCount === 0) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "not found!", "Error", ""),
        );
    } else {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully deleted record",
            "",
            { deletedCount },
          ),
        );
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message,
        ),
      );
  }
};

module.exports = {
  list,
  store,
  UpdateOrder,
  details,
  delete_order,
};

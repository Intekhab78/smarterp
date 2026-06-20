const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where, FLOAT } = require("sequelize");
const paths = require("path");
const ResponseFormatter = require("../utils/ResponseFormatter");
const { codesettingupdate } = require("../utils/handler");

const Mail = require("nodemailer/lib/mailer");
const sendEmail = require("../utils/SendMail");
const orderStatusTemplate = require("../templates/orderStatus.template");
require("dotenv").config();
const db = require("../models");

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { Op, Sequelize, fn, col, where, FLOAT } from "sequelize";
// import dotenv from "dotenv";
// import path from "path";
// import ResponseFormatter from "../utils/ResponseFormatter.js";
// import { codesettingupdate } from "../utils/handler.js";
// import db from "../models/index.js";
// const Mail = require("nodemailer/lib/mailer");

// import sendEmail from "../utils/SendMail.js";
// import orderStatusTemplate from "../templates/orderStatus.template.js";
// dotenv.config();

const OrderModel = db.order;
const OrderStatusHistory = db.order_status_history;
const BatchModel = db.batch;
const userCompanyModel = db.user_company;
const OrderDetailModel = db.order_details;
const UserModel = db.user_master;
const VendorModel = db.vendor_master;
const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_master;
const itemLocationMaster = db.item_location_master;
const invoiceModel = db.invoice;
const paymentTermsModel = db.payment_terms;
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const countryMastersModel = db.country_masters;
const CompanyModel = db.company;
const LocationModel = db.location;
const TaxMasterModel = db.tax_master;
const CustomerModel = db.customer_master;
const CodeSettingModel = db.code_setting;

const PaymentCollection = db.collection;
const PaymentMethod = db.collection_details;
const OrderCancellation = db.order_cancellations;
const Payment = db.payments;
const PaymentTransaction = db.payment_transactions;
const PaymentsRefunds = db.payments_refunds;
const OrderBeneficiary = db.order_beneficiary;
const OrderTrackingModel = db.OrderTracking;
const EcomPendingOrders = db.ecom_pending_orders;

// const Payment = require("../models/payments");
// const PaymentTransaction = require("../models/payment_transactions");

const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
  const { page, name, customer_code, limit = 10, user_id } = req.body;

  try {
    let companyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: {
          user_id: user_id,
        },
        attributes: ["company_id"], // Only fetch the 'company_id' field
      });

      companyIds = userCompanies.map((company) => company.company_id);
    }
    const whereClause = {
      ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
    };
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await OrderModel.count();
    const festivalRes = await OrderModel.findAll({
      where: whereClause,
      //     where: searchQuery,
      // attributes: ['id','customer_code','customer_id'],
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: LocationModel,
          as: "location",
        },

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
          model: CustomerModel,
          as: "customer_details",
        },
        {
          model: VendorModel,
          as: "vendor_details",
        },

        {
          model: OrderDetailModel,
          as: "order_details",
          // attributes: ['firstname', 'lastname', 'email'],
        },
        {
          model: invoiceModel,
          as: "invoice",
          attributes: ["id", "invoice_number"],
          required: false,
        },
        // {
        //   model: invoiceModel,
        //   as: "invoice",
        //   attributes: ["invoice_number"],
        //   required: false,
        //   where: {
        //     order_id: { [Op.col]: "order.id" },
        //   },
        // },
        //        {
        //   model: invoiceModel,
        //   as: "invoices",
        //   attributes: ["invoice_number"],
        //   required: false,
        //   limit: 1,
        //   order: [["created_at", "DESC"]],
        //   separate: true,
        // }
      ],
      // where: { type: "sales order" },
      type: { [Op.or]: ["sales order", "Online Sales Order"] },

      order: [["id", "DESC"]],
      // limit: limits,
      // offset: offset
    });

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
    company_id,
    location_id,
    type,
    any_comment,
  } = req.body;

  try {
    codesettingupdate("order");
    let date = new Date();
    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);
    const totalOpenQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    let Order = await OrderModel.create({
      customer_id: customer_id,
      vendor_id: customer_id,
      customer_lob: customer_lob,
      salesman_id: salesman_id,
      customer_lpo: customer_lpo,
      order_number: order_number,
      delivery_date: delivery_date,
      order_date: date,
      payment_term_id: payment_terms,
      due_date: due_date,
      total_discount_amount: discount,
      total_qty: totalItemQty,
      open_qty: totalOpenQty,
      total_net: net,
      total_vat: vat,
      total_excise: excise,
      grand_total: total,
      taxable_total: taxable_total,
      cgst_amount: cgst_amount,
      sgst_amount: sgst_amount,
      igst_amount: igst_amount,
      status: "Open",
      order_type: order_type,
      company_id: company_id,
      location_id: location_id,
      type: type,
      any_comment: any_comment,
    });

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let is_free = item.skim === "Free" ? 1 : 0;
      const item_stoke = await itemModel.findOne({
        where: { id: item.item_id },
      });

      // Default to null or safe values if item_stoke is not found
      const expiry_delivery_date = item_stoke ? item_stoke.itmexpiry : null;
      const receiving_site = item_stoke ? item_stoke.batch_no : null;
      const hsn_code = item_stoke ? item_stoke.hsncode : null;

      let OrderDetail = await OrderDetailModel.create({
        order_id: Order.id,
        item_id: items[i].item_id,
        item_uom_id: items[i].uom,
        discount_id: 0,
        is_free: is_free,
        is_item_poi: 0,
        promotion_id: 0,
        item_qty: items[i].quantity,
        open_qty: items[i].quantity,
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
        ptr_di: items[i].ptr_di || 0,
        taxa_ble: items[i].taxa_ble || 0,
        cgst: items[i].cgst,
        cgst_amount: items[i].sgst,
        sgst: items[i].sgst,
        sgst_amount: items[i].sgst_amount,
        igst: items[i].igst,
        igst_amount: items[i].igst_amount,
        discounttype: items[i].discounttype,
        expiry_delivery_date,
        receiving_site,
        hsn_code,
        // expiry_delivery_date : item_stoke.itmexpiry,
        // receiving_site : item_stoke.batch_no,
        // hsn_code : item_stoke.hsncode,
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
          attributes: [
            "firstname",
            "lastname",
            "email",
            "id",
            "mobile",
            "country_id",
            "custax1",
          ],
          include: [
            {
              model: CustomerInfo,
              as: "customerInfo",
              attributes: [
                "customer_code",
                "user_id",
                "customer_address_1",
                "customer_address_2",
                "msme_no",
                "fssai_no",
                "state_code",
              ], // Example attributes
            },
            {
              model: countryMastersModel,
              as: "country", // The associated User model
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: VendorModel,
          as: "vendor_details",
        },
        {
          model: CustomerModel,
          as: "customer_details",
        },
        {
          model: OrderDetailModel,
          as: "order_details",
          where: {
            order_status: {
              [Op.ne]: "Cancelled",
            },
          },
          required: false, // 🔥 important
          include: [
            {
              model: itemLocationMaster,
              as: "itemLocationModel",
              include: [
                {
                  model: itemMainPriceModel,
                  as: "item_main_prices",
                  attributes: ["id", "item_id", "item_uom_id", "item_price"],
                  required: false, // ✅ ensure parent loads even if no item_main_price exists

                  include: [
                    {
                      model: itemUomModel,
                      as: "item_uom",
                      attributes: ["id", "code", "name"],
                      required: false, // ✅ ensure parent loads even if no item_main_price exists
                    },
                  ],
                },

                {
                  model: TaxMasterModel,
                  as: "tax_master_1",
                  attributes: ["id", "taxname", "taxcal", "taxpor1"], // ✅ only required fields
                },

                {
                  model: itemUomModel,
                  as: "item_uom",
                  attributes: ["id", "code", "name"],
                  required: false, // ✅ ensure parent loads even if no item_main_price exists
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

        // {
        //   model: Payment,
        //   as: "payments", // ✅ Payment details included
        // },
        // ✅ PAYMENT BLOCK (IMPORTANT)
        {
          model: Payment,
          as: "payments",
          include: [
            {
              model: PaymentTransaction,
              as: "transactions",
            },
            {
              model: PaymentsRefunds,
              as: "refunds",
            },
          ],
        },

        {
          model: OrderCancellation,
          as: "cancellations", // ✅ HERE
        },

        {
          model: invoiceModel,
          as: "invoice",
          attributes: ["invoice_number"],
          required: false,
        },
      ],
      where: {
        id: id,
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

const UpdateOrder1 = async (req, res, next) => {
  const {
    id,
    customer_lob,
    customer_lpo,
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
    company_id,
    location_id,
    any_comment,
    items,
  } = req.body;

  try {
    // Find the existing order and its details
    const detail = await OrderModel.findOne({
      include: [
        {
          model: OrderDetailModel,
          as: "order_details",
        },
      ],
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Order not found", "Error"),
        );
    }

    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);
    const totalOpenQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);
    // Update the order details
    await OrderModel.update(
      {
        customer_lob: customer_lob,
        customer_lpo: customer_lpo,
        delivery_date: delivery_date,
        payment_term_id: payment_terms,
        due_date: due_date,
        total_discount_amount: discount,
        total_qty: totalItemQty,
        open_qty: totalOpenQty,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        status: status,
        company_id: company_id,
        location_id: location_id,
        order_type: order_type,
        type: type,
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
      const existingItem = detail.order_details.find(
        (orderDetail) =>
          orderDetail.item_id === items[i].item_id &&
          items[i].order_details_id &&
          orderDetail.id,
      );
      let item_stoke = await itemModel.findOne({
        where: {
          id: items[i].item_id,
        },
      });
      // if(existingItem.item_qty != items[i].quantity){
      //     let batch = await BatchModel.findOne({
      //         where: {
      //             item_id: items[i].item_id,
      //             qty: { [Op.gt]: 0 } // Ensure there's stock available
      //         },
      //         order: [['expiry_date', 'ASC']] // Sort by nearest expiry date
      //     });
      //     let totalToOrder = parseInt(items[i].quantity);
      //     let remainingToOrder = totalToOrder;

      //     for (const batchRecord of batch) {
      //         if (remainingToOrder <= 0) break; // Stop if order is fulfilled

      //         const availableQty = batchRecord.qty;

      //         if (availableQty > 0) {
      //             // Determine how much to take from this batch
      //             const qtyToTake = Math.min(availableQty, remainingToOrder);

      //             // Update the batch record or perform necessary actions
      //             batchRecord.qty -= qtyToTake; // Reduce the qty in the batch
      //             remainingToOrder -= qtyToTake; // Reduce the remaining qty to order
      //         }
      //     }
      //     // let stoke_final = parseInt(batch.qty) - parseInt(items[i].quantity);
      //     // await BatchModel.update({ qty: stoke_final }, { where: { item_id: items[i].item_id } });
      ////////////////////////////////////////

      // i just remove the if exist item then add in the item Selection

      ///////////////////////////////////////////////////////////

      // }
      if (existingItem) {
        // If the item already exists, update the quantity and other details
        await OrderDetailModel.update(
          {
            item_qty: parseFloat(existingItem.item_qty),
            item_uom_id: items[i].uom,
            item_price: items[i].price,
            item_gross: items[i].price,
            item_discount_amount: items[i].discount,
            item_net: items[i].net,
            item_qty: items[i].quantity,
            open_qty: items[i].quantity,
            // item_vat: items[i].vat,
            item_excise: items[i].excise,
            item_grand_total: items[i].total,
            discounttype: items[i].discounttype,
            taxa_ble: items[i].taxa_ble || 0,
            expiry_delivery_date: null,
            // expiry_delivery_date: item_stoke?.itmexpiry || 0,
            receiving_site: null,
            // receiving_site: item_stoke.batch_no,
            hsn_code: null,
            // hsn_code: item_stoke.hsncode,
          },
          {
            where: {
              id: items[i].order_details_id,
            },
          },
        );
      } else {
        // If the item does not exist, create a new order detail
        await OrderDetailModel.create({
          order_id: id,
          item_id: items[i].item_id,
          item_uom_id: 0,
          discount_id: 0,
          is_free: 0,
          is_item_poi: 0,
          promotion_id: 0,
          item_qty: items[i].quantity,
          open_qty: items[i].quantity,
          delivered_qty: 0,
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
          discounttype: items[i].discounttype,
          order_status: "Pending",
          expiry_delivery_date: item_stoke.exp_date,
          receiving_site: item_stoke.batch_no,
          hsn_code: item_stoke.short_code,
        });
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

const UpdateOrder = async (req, res) => {
  const t = await OrderModel.sequelize.transaction();

  try {
    const {
      id,
      customer_lob,
      customer_lpo,
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
      company_id,
      location_id,
      any_comment,
      items = [],
    } = req.body;

    // 1️⃣ Fetch order with details
    const detail = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderDetailModel, as: "order_details" }],
      transaction: t,
    });

    if (!detail) {
      await t.rollback();
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Order not found", "Error"),
        );
    }

    // 2️⃣ Calculate totals
    const totalQty = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

    // 3️⃣ Update order header
    await OrderModel.update(
      {
        customer_lob,
        customer_lpo,
        delivery_date,
        payment_term_id: payment_terms,
        due_date,
        total_discount_amount: discount,
        total_qty: totalQty,
        open_qty: totalQty,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        status,
        company_id,
        location_id,
        order_type,
        type,
        any_comment,
      },
      { where: { id }, transaction: t },
    );

    // 4️⃣ Prepare incoming detail IDs
    const incomingDetailIds = items
      .filter((i) => i.order_details_id)
      .map((i) => i.order_details_id);

    // 5️⃣ Cancel removed items (VERY IMPORTANT)
    for (const od of detail.order_details) {
      if (!incomingDetailIds.includes(od.id)) {
        await OrderDetailModel.update(
          {
            order_status: "Cancelled",
            item_qty: 0,
            open_qty: 0,
          },
          { where: { id: od.id }, transaction: t },
        );
      }
    }

    // 6️⃣ Update / Create order items
    for (const item of items) {
      const existingItem = detail.order_details.find(
        (od) => od.id === item.order_details_id,
      );

      const item_stock = await itemModel.findOne({
        where: { id: item.item_id },
        transaction: t,
      });

      if (existingItem) {
        // UPDATE
        await OrderDetailModel.update(
          {
            item_id: item.item_id,
            item_uom_id: item.uom || 0,
            item_qty: item.quantity,
            open_qty: item.quantity,
            item_price: item.price,
            item_gross: item.price,
            item_discount_amount: item.discount,
            item_net: item.net,
            item_excise: item.excise,
            item_grand_total: item.total,
            discounttype: item.discounttype,
            taxa_ble: item.taxa_ble || 0,
            // order_status: "Pending",
            order_status: Number(item.quantity) === 0 ? "Cancelled" : "Pending",
          },
          { where: { id: existingItem.id }, transaction: t },
        );
      } else {
        // CREATE
        await OrderDetailModel.create(
          {
            order_id: id,
            item_id: item.item_id,
            item_uom_id: item.uom || 0,
            discount_id: 0,
            is_free: 0,
            is_item_poi: 0,
            promotion_id: 0,
            item_qty: item.quantity,
            open_qty: item.quantity,
            delivered_qty: 0,
            item_price: item.price,
            item_gross: item.price,
            item_discount_amount: item.discount,
            item_net: item.net,
            item_excise: item.excise,
            item_grand_total: item.total,
            discounttype: item.discounttype,
            order_status: "Pending",
            expiry_delivery_date: item_stock?.exp_date || null,
            receiving_site: item_stock?.batch_no || null,
            hsn_code: item_stock?.short_code || null,
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Order updated successfully",
          "",
          {},
        ),
      );
  } catch (error) {
    await t.rollback();
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message,
        ),
      );
  }
};

const UpdateOrderStatus = async (req, res) => {
  const { id, status, comment } = req.body;

  try {
    if (!id || !status) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Order ID and status are required",
            "Error",
          ),
        );
    }

    const order = await OrderModel.findOne({ where: { id } });
    if (!order) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Order not found", "Error"),
        );
    }

    // Update status and comment
    await OrderModel.update(
      {
        status,
        current_stage: status,
        any_comment: comment || order.any_comment,
      },
      { where: { id } },
    );

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Order status updated successfully",
          "",
          { id, status },
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ResponseFormatter.setResponse(
          false,
          500,
          "Failed to update order status",
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

// ecommerce order store here

// ===================== GENERATE ORDER NUMBER =====================

const generateOrderNumber = async (t) => {
  const lastOrder = await OrderModel.findOne({
    order: [["id", "DESC"]],
    transaction: t,
  });

  if (!lastOrder || !lastOrder.order_number) {
    return 1001; // or 1064 or your starting number
  }

  const lastNumber = lastOrder.order_number; // e.g. "S1O1064"
  const numericPart = parseInt(lastNumber.split("O").pop(), 10);

  return numericPart + 1;
};

const ecommerceOrderStore = async (req, res, next) => {
  const {
    customer_id,
    customer_code,
    customer_lob,
    salesman_id,
    customer_lpo,
    order_number,
    delivery_date,
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
    company_id,
    location_id,
    type,
    any_comment,
    payment_terms,
    payment_details,
    shipping_address,
    transaction_id,
    website,
    transaction_type,
  } = req.body;

  console.log("ecommerceOrderStore---------------------", req.body);

  const t = await OrderModel.sequelize.transaction();

  try {
    const generatedOrderNumber = await generateOrderNumber(t);

    let date = new Date();
    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);
    const totalOpenQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    let Order = await OrderModel.create(
      {
        customer_id: customer_code,
        vendor_id: customer_id,
        customer_lob: customer_lob,
        salesman_id: salesman_id,
        customer_lpo: "online customer",
        order_number: `S1O${generatedOrderNumber}`,
        delivery_date: delivery_date,
        order_date: date,
        payment_term_id: 1,
        due_date: due_date,
        total_discount_amount: discount,
        total_qty: totalItemQty,
        open_qty: totalOpenQty,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        taxable_total: taxable_total,
        cgst_amount: cgst_amount,
        sgst_amount: sgst_amount,
        igst_amount: igst_amount,
        // status: "Order Confirmed",
        current_stage: "Order Placed",
        status: "Order Placed",
        payment_type: payment_details.method,
        order_type: order_type,
        // company_id: company_id,
        // location_id: location_id,
        company_id: company_id || 21,
        location_id: location_id || 20,
        // type: type,
        type: "Online Sales Order",
        any_comment: any_comment,
        customer_address_id: shipping_address?.id,
      },
      { transaction: t },
    );

    // ================= CHARITY BENEFICIARY SAVE =================
    if (order_type === "online_charity" && items.person) {
      const fullName = items.person.name?.trim() || "";
      const nameParts = fullName.split(" ");

      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ") || "";

      await OrderBeneficiary.create(
        {
          order_number: Order.order_number,
          order_id: Order.id,
          donor_id: customer_code, // donor = customer
          beneficiary_firstName: firstName,
          beneficiary_lastName: lastName,
          beneficiary_fatherName: items.person.fatherName || null,
          beneficiary_motherName: items.person.motherName || null,
          beneficiary_mobileNo: items.person.mobile,
        },
        { transaction: t },
      );
    }

    const collection = await PaymentCollection.create(
      {
        organisation_id: 1,
        order_id: Order.id,
        // customer_id: customer_id,
        customer_id: customer_code,
        collection_type: 1,
        payment_type: payment_terms, // card / cash
        invoice_amount: total,
        discount: discount || 0,
        collection_status: "Pending",
        current_stage: "OPEN",
        total: total,
        pending_amount: 0,
        payment_mode: payment_terms,
        company_id: 21,
        location_id: 20,
        collection_date: new Date(),
        collection_time: new Date(),
        status: "OPEN",
      },
      { transaction: t },
    );

    if (payment_terms === "card") {
      await PaymentMethod.create(
        {
          collection_id: collection.id,
          order_id: Order.id,
          payment_mode: "card",
          card_type: "CARD",
          paymentcard_number: payment_details.cardNumber
            ? payment_details.cardNumber.slice(-4)
            : null,
          amount: total,
          pending_amount: 0,
          grand_total: total,
          total: total,
          type: "default",
        },
        { transaction: t },
      );
    }

    // After creating Order and OrderDetails loop
    await CodeSettingModel.update(
      {
        next_coming_number_order: `S1O${generatedOrderNumber + 1}`,
      },
      {
        where: {
          /* your condition */
        },
        transaction: t,
      },
    );

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let is_free = item.skim === "Free" ? 1 : 0;
      const item_stoke = await itemModel.findOne({
        where: { id: item.item_id },
      });

      // Default to null or safe values if item_stoke is not found
      const expiry_delivery_date = item_stoke ? item_stoke.itmexpiry : null;
      const receiving_site = item_stoke ? item_stoke.batch_no : null;
      const hsn_code = item_stoke ? item_stoke.hsncode : null;

      let OrderDetail = await OrderDetailModel.create(
        {
          order_id: Order.id,
          item_id: items[i].item_id,
          item_uom_id: items[i].uom,
          discount_id: 0,
          is_free: is_free,
          is_item_poi: 0,
          promotion_id: 0,
          item_qty: items[i].quantity,
          open_qty: items[i].quantity,
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
          ptr_di: items[i].ptr_di || 0,
          taxa_ble: items[i].taxa_ble || 0,
          cgst: items[i].cgst,
          cgst_amount: items[i].sgst,
          sgst: items[i].sgst,
          sgst_amount: items[i].sgst_amount,
          igst: items[i].igst,
          igst_amount: items[i].igst_amount,
          discounttype: items[i].discounttype,
          expiry_delivery_date,
          receiving_site,
          hsn_code,
        },
        { transaction: t },
      );
    }

    //////////////////////////////
    // ================= PAYMENT HEADER =================
    const payment = await Payment.create(
      {
        order_id: Order.id, // ✅ FK
        order_number: Order.order_number, // ✅ optional but useful
        invoice_id: "", // invoice not generated yet
        payment_method: payment_details.method, // cod / card / upi
        payment_type: payment_details.method === "cod" ? "OFFLINE" : "ONLINE",
        amount: payment_details.amount,
        payment_status: payment_details.method === "cod" ? "Pending" : "Paid",
        gateway_order_id: transaction_id || null,
        razorpay_order_id:
          payment_details?.razorpay?.razorpay_order_id ||
          payment_details?.payu?.bank_ref_num ||
          null,
        razorpay_payment_id:
          payment_details?.razorpay?.razorpay_payment_id ||
          payment_details?.payu?.mihpayid ||
          null,
        razorpay_signature:
          payment_details?.razorpay?.razorpay_signature || null,
        verified_at:
          payment_details?.razorpay?.verified_at ||
          payment_details?.payu?.addedon ||
          null,
        company_id: 21,
        location_id: 20,
        website: website || "islamicbookzone",
      },
      { transaction: t },
    );

    // ================= PAYMENT TRANSACTION =================
    await PaymentTransaction.create(
      {
        payment_id: payment.id,
        transaction_id: payment_details?.razorpay?.razorpay_payment_id || null,
        transaction_type: "PAYMENT",
        amount: payment_details.amount,
        status: payment_details.method === "cod" ? "Initiated" : "Success",
        // payment_mode: payment_details.method.toUpperCase(),
        payment_mode: (
          payment_details.method ||
          payment_terms ||
          "payu"
        ).toUpperCase(),

        raw_response: payment_details, // full payload for audit
        company_id: 21,
        location_id: 20,
        website: website || "islamicbookzone",
      },
      { transaction: t },
    );

    await t.commit();
    return res.status(201).json({
      status: true,
      message: "Order created successfully",
      order_number: `S1O${generatedOrderNumber}`,
      next_order_number: `S1O${generatedOrderNumber + 1}`,

      Order,
    });
  } catch (error) {
    await t.rollback(); // rollback on error
    return res
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

//Pending order for the PayU
const createPendingOrder = async (req, res) => {
  try {
    const { payload } = req.body;
    const txnid = "TXN_" + Date.now();
    console.log("re.body is ------------", req.body);

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "payload are required",
      });
    }

    // create pending transaction
    const transaction = await EcomPendingOrders.create({
      gateway: "PAYU",
      // txnid: payload.txnid,
      txnid,
      amount: payload.subtotal || payload.amount || 0,
      status: "PENDING",
      payload: payload, // full cart + customer data
    });

    return res.json({
      success: true,
      txnid: transaction.txnid, // ✅ SAME TXNID SENT BACK
      message: "Pending order created",
    });
  } catch (error) {
    console.error("Pending order create error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getTransactionByTxnid = async (req, res) => {
  try {
    const { txnid } = req.params;

    if (!txnid) {
      return res.status(400).json({
        success: false,
        message: "txnid is required",
      });
    }

    const transaction = await EcomPendingOrders.findOne({
      where: { txnid },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const ecommerceOrderUpdate = async (req, res) => {
  const t = await OrderModel.sequelize.transaction();

  try {
    const {
      id, // order_id
      delivery_date,
      due_date,
      discount,
      net,
      excise,
      vat,
      total,
      taxable_total,
      cgst_amount,
      sgst_amount,
      igst_amount,
      status,
      any_comment,
      payment_terms,
      items = [],
    } = req.body;

    // 1️⃣ Fetch order with details
    const order = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderDetailModel, as: "order_details" }],
      transaction: t,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    // 2️⃣ Calculate total quantity
    const totalQty = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

    // 3️⃣ Update order header
    await OrderModel.update(
      {
        delivery_date,
        due_date,
        total_discount_amount: discount,
        total_qty: totalQty,
        open_qty: totalQty,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        taxable_total,
        cgst_amount,
        sgst_amount,
        igst_amount,
        status,
        any_comment,
        payment_term_id: payment_terms,
      },
      { where: { id }, transaction: t },
    );

    // 4️⃣ Incoming order_detail IDs
    const incomingDetailIds = items
      .filter((i) => i.order_details_id)
      .map((i) => i.order_details_id);

    // 5️⃣ Cancel removed items + store cancellation
    for (const od of order.order_details) {
      if (!incomingDetailIds.includes(od.id)) {
        // Cancel item
        await OrderDetailModel.update(
          {
            order_status: "Cancelled",
            item_qty: 0,
            open_qty: 0,
          },
          { where: { id: od.id }, transaction: t },
        );

        // Store cancellation history (avoid duplicate)
        const alreadyCancelled = await OrderCancellation.findOne({
          where: {
            order_id: id,
            order_item_id: od.id,
            adjustment_type: "cancel",
          },
          transaction: t,
        });

        if (!alreadyCancelled) {
          await OrderCancellation.create(
            {
              order_id: id,
              order_item_id: od.id,
              adjustment_type: "cancel",
              reason: "Item removed from order",
              refund_amount: od.item_grand_total || 0,
              refund_status: "Pending",
              initiated_by: "Customer",
            },
            { transaction: t },
          );
        }
      }
    }

    // 6️⃣ Update / Create order items
    for (const item of items) {
      const existingItem = order.order_details.find(
        (od) => od.id === item.order_details_id,
      );

      const item_stock = await itemModel.findOne({
        where: { id: item.item_id },
        transaction: t,
      });

      // 🔁 UPDATE
      if (existingItem) {
        const isCancelled = Number(item.quantity) === 0;
        await OrderDetailModel.update(
          {
            item_id: item.item_id,
            item_uom_id: item.uom,
            item_qty: item.quantity,
            open_qty: item.quantity,
            item_price: item.price,
            item_gross: item.price,
            item_discount_amount: item.discount,
            item_net: item.net,
            item_excise: item.excise,
            item_grand_total: item.total,
            discounttype: item.discounttype,
            taxa_ble: item.taxa_ble || 0,
            cgst: item.cgst,
            cgst_amount: item.cgst_amount,
            sgst: item.sgst,
            sgst_amount: item.sgst_amount,
            igst: item.igst,
            igst_amount: item.igst_amount,
            order_status: isCancelled ? "Cancelled" : "Pending",
          },
          { where: { id: existingItem.id }, transaction: t },
        );

        // Store cancellation if qty = 0
        if (isCancelled) {
          const alreadyCancelled = await OrderCancellation.findOne({
            where: {
              order_id: id,
              order_item_id: existingItem.id,
              adjustment_type: "cancel",
            },
            transaction: t,
          });

          if (!alreadyCancelled) {
            await OrderCancellation.create(
              {
                order_id: id,
                order_item_id: existingItem.id,
                adjustment_type: "cancel",
                reason: "Item quantity set to zero",
                refund_amount: existingItem.item_grand_total || 0,
                refund_status: "Pending",
                initiated_by: "Customer",
              },
              { transaction: t },
            );
          }
        }
      }
      // ➕ CREATE
      else {
        await OrderDetailModel.create(
          {
            order_id: id,
            item_id: item.item_id,
            item_uom_id: item.uom,
            discount_id: 0,
            is_free: item.skim === "Free" ? 1 : 0,
            is_item_poi: 0,
            promotion_id: 0,
            item_qty: item.quantity,
            open_qty: item.quantity,
            delivered_qty: 0,
            item_price: item.price,
            item_gross: item.price,
            item_discount_amount: item.discount,
            item_net: item.net,
            item_excise: item.excise,
            item_grand_total: item.total,
            discounttype: item.discounttype,
            taxa_ble: item.taxa_ble || 0,
            cgst: item.cgst,
            cgst_amount: item.cgst_amount,
            sgst: item.sgst,
            sgst_amount: item.sgst_amount,
            igst: item.igst,
            igst_amount: item.igst_amount,
            order_status: "Pending",
            expiry_delivery_date: item_stock?.itmexpiry || null,
            receiving_site: item_stock?.batch_no || null,
            hsn_code: item_stock?.hsncode || null,
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    return res.status(200).json({
      status: true,
      message: "Ecommerce order updated successfully",
    });
  } catch (error) {
    await t.rollback();
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const ecommerceOrderCancel = async (req, res) => {
  const t = await OrderModel.sequelize.transaction();

  try {
    const { order_id, items = [], website } = req.body;

    // 1️⃣ FETCH ORDER WITH DETAILS (LOCK)
    const order = await OrderModel.findOne({
      where: { id: order_id },
      include: [{ model: OrderDetailModel, as: "order_details" }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    let cancelledQty = 0;
    let cancelledAmount = 0;
    const cancelledItemIds = [];

    // 2️⃣ CANCEL ORDER ITEMS
    for (const item of items) {
      const orderItem = order.order_details.find(
        (od) => od.id === Number(item.order_item_id),
      );

      if (!orderItem || orderItem.order_status === "Cancelled") continue;

      const qty = Number(orderItem.item_qty || 0);
      const total = Number(orderItem.item_grand_total || 0);

      await OrderDetailModel.update(
        {
          order_status: "Cancelled",
          open_qty: 0,
        },
        { where: { id: orderItem.id }, transaction: t },
      );

      cancelledQty += qty;
      cancelledAmount += total;
      cancelledItemIds.push(orderItem.id);

      const exists = await OrderCancellation.findOne({
        where: {
          order_id,
          order_item_id: orderItem.id,
          adjustment_type: "cancel",
        },
        transaction: t,
      });

      if (!exists) {
        await OrderCancellation.create(
          {
            order_id,
            order_item_id: orderItem.id,
            item_name: item.name,
            item_qty: item.quantity,
            adjustment_type: "cancel",
            cancel_status: item.cancel_status || "initiated",
            reason: item.reason || "Customer requested",
            refund_amount: total,
            refund_status: "Pending",
            initiated_by: item.initiated_by || "Customer",
            meta_details: item.selected_details || null,
          },
          { transaction: t },
        );
      }
    }

    // 3️⃣ RECALCULATE ORDER TOTALS
    const remainingItems = await OrderDetailModel.findAll({
      where: {
        order_id,
        order_status: { [Op.ne]: "Cancelled" },
      },
      transaction: t,
    });

    const remainingQty = remainingItems.reduce(
      (sum, item) => sum + Number(item.item_qty || 0),
      0,
    );

    const remainingAmount = remainingItems.reduce(
      (sum, item) => sum + Number(item.item_grand_total || 0),
      0,
    );

    const allItemsCancelled = remainingQty === 0;

    if (allItemsCancelled) {
      await OrderModel.update(
        { status: "Cancelled" },
        { where: { id: order_id }, transaction: t },
      );
    } else {
      await OrderModel.update(
        {
          total_qty: order.total_qty - cancelledQty,
          open_qty: order.open_qty - cancelledQty,
          grand_total: remainingAmount,
          status: "Partially Cancelled",
        },
        { where: { id: order_id }, transaction: t },
      );
    }

    // 4️⃣ FETCH PAYMENT (LOCK)
    const payment = await Payment.findOne({
      where: { order_id: order.id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!payment) {
      console.log("❌ Payment not found for order:", order.id);
    }

    // 5️⃣ HANDLE PAYMENT LOGIC
    let refund = null;

    // ---------------- ONLINE PAYMENT ----------------
    const isOnlinePaid =
      payment &&
      payment.payment_type === "ONLINE" &&
      payment.payment_status === "Paid";

    if (isOnlinePaid && cancelledAmount > 0) {
      const existingRefund = await PaymentsRefunds.findOne({
        where: {
          payment_id: payment.id,
          order_id: order.id,
        },
        transaction: t,
      });

      if (!existingRefund) {
        refund = await PaymentsRefunds.create(
          {
            payment_id: payment.id,
            order_id: order.id,
            refund_amount: cancelledAmount,
            refund_reason: "Order item cancelled",
            refund_status: "Pending",
            refund_mode: payment.payment_method.toUpperCase(),
            company_id: order.company_id,
            location_id: order.location_id,
            website: website || "islamicbookzone",
          },
          { transaction: t },
        );

        await PaymentTransaction.create(
          {
            payment_id: payment.id,
            transaction_id: `REF-${Date.now()}`,
            transaction_type: "REFUND",
            amount: cancelledAmount,
            status: "Initiated",
            payment_mode: payment.payment_method.toUpperCase(),
            raw_response: {
              order_id: order.id,
              cancelled_items: items,
            },
            company_id: order.company_id,
            location_id: order.location_id,
            website: website || "islamicbookzone",
          },
          { transaction: t },
        );

        await Payment.update(
          {
            payment_status:
              remainingAmount === 0 ? "Refunded" : "Partially Refunded",
          },
          { where: { id: payment.id }, transaction: t },
        );
      }
    }

    // ---------------- COD PAYMENT ----------------
    if (payment && payment.payment_method === "cod" && cancelledAmount > 0) {
      const newAmount = Number(payment.amount) - cancelledAmount;
      const finalAmount = newAmount < 0 ? 0 : newAmount;

      await Payment.update(
        {
          amount: finalAmount,
          payment_status: finalAmount === 0 ? "Cancelled" : "Pending",
        },
        { where: { id: payment.id }, transaction: t },
      );

      await PaymentTransaction.create(
        {
          payment_id: payment.id,
          transaction_id: `ADJ-${Date.now()}`,
          transaction_type: "PAYMENT_ADJUSTMENT",
          amount: cancelledAmount,
          status: "Adjusted",
          payment_mode: "COD",
          raw_response: {
            reason: "Order item cancelled",
            original_amount: payment.amount,
            adjusted_amount: finalAmount,
            cancelled_items: items,
          },
          company_id: order.company_id,
          location_id: order.location_id,
          website: website || "islamicbookzone",
        },
        { transaction: t },
      );
    }

    // 6️⃣ UPDATE CANCELLATION STATUS
    await OrderCancellation.update(
      {
        refund_status: refund ? "Pending" : "Not Applicable",
      },
      {
        where: {
          order_id,
          order_item_id: { [Op.in]: cancelledItemIds },
        },
        transaction: t,
      },
    );

    await t.commit();

    return res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
      cancelled_quantity: cancelledQty,
      cancelled_amount: cancelledAmount,
      refund_status: refund ? "Pending" : "Not Applicable",
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(400).json({
      status: false,
      message: "Cancellation failed",
      error: error.message,
    });
  }
};

const getEcommerceOrderPaymentDetails = async (req, res) => {
  try {
    const { order_number } = req.body;

    if (!order_number) {
      return res.status(400).json({
        status: false,
        message: "order_number is required",
      });
    }

    // =========================
    // 1️⃣ FETCH ORDER WITH ITEMS
    // =========================
    const order = await OrderModel.findOne({
      where: { order_number },
      include: [
        {
          model: OrderDetailModel,
          as: "order_details",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    // =========================
    // 2️⃣ FETCH CANCELLATIONS
    // =========================
    const cancellations = await OrderCancellation.findAll({
      where: { order_id: order.id },
      order: [["created_at", "DESC"]],
    });

    // =========================
    // 3️⃣ FETCH PAYMENT
    // =========================
    const payment = await Payment.findOne({
      where: {
        order_number: order.order_number,
      },
    });

    // =========================
    // 4️⃣ FETCH REFUNDS & TXNS
    // =========================
    let refunds = [];
    let transactions = [];

    if (payment) {
      refunds = await PaymentsRefunds.findAll({
        where: {
          payment_id: payment.id,
          order_id: order.id,
        },
        order: [["created_at", "DESC"]],
      });

      transactions = await PaymentTransaction.findAll({
        where: {
          payment_id: payment.id,
        },
        order: [["created_at", "DESC"]],
      });
    }

    // =========================
    // 5️⃣ DIFFERENTIATE ITEMS
    // =========================

    // Create quick lookup map for cancelled items
    const cancelledItemMap = {};
    cancellations.forEach((c) => {
      cancelledItemMap[c.order_item_id] = c;
    });

    const active_items = [];
    const cancelled_items = [];

    order.order_details.forEach((item) => {
      const cancelled = cancelledItemMap[item.id];

      if (cancelled) {
        cancelled_items.push({
          order_item_id: item.id,
          item_name: cancelled.item_name || item.item_name,
          qty: cancelled.item_qty,
          status: "Cancelled",
          cancel_reason: cancelled.reason,
          refund_amount: cancelled.refund_amount,
          refund_status: cancelled.refund_status,
          cancelled_at: cancelled.created_at,
        });
      } else {
        active_items.push({
          order_item_id: item.id,
          item_name: item.item_name,
          qty: item.qty,
          status: "Active",
        });
      }
    });

    // =========================
    // 6️⃣ FINAL RESPONSE
    // =========================
    return res.status(200).json({
      status: true,

      order_summary: {
        order_id: order.id,
        order_number: order.order_number,
        total_qty: order.total_qty,
        total_amount: order.total_gross,
      },

      items: {
        active_items,
        cancelled_items,
      },

      payment: payment || null,
      refunds,
      transactions,
    });
  } catch (error) {
    console.error("getEcommerceOrderPaymentDetails ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};

const getOrdersByCustomerId = async (req, res, next) => {
  const { customer_id, user_id, company_id, location_id } = req.body;

  if (!customer_id) {
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "customer_id is required!",
          "Error",
          "",
        ),
      );
  }

  try {
    // ---- Get allowed companies for this user ---- //
    let companyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: { user_id },
        attributes: ["company_id"],
      });

      companyIds = userCompanies.map((c) => c.company_id);
    }

    // ---- WHERE CONDITION ---- //
    // const whereClause = {
    //   customer_id: customer_id, // Filter by customer_id
    //   ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
    //   type: { [Op.or]: ["sales order", "Online Sales Order"] },
    // };

    // ---- WHERE CONDITION ---- //
    const whereClause = {
      customer_id: customer_id, // required

      ...(company_id && { company_id }), // optional filter
      ...(location_id && { location_id }), // optional filter

      ...(companyIds.length > 0 && {
        company_id: { [Op.in]: companyIds },
      }),

      type: { [Op.or]: ["sales order", "Online Sales Order"] },
    };

    // --- FETCH ORDERS --- //
    const orders = await OrderModel.findAll({
      where: whereClause,
      include: [
        { model: CompanyModel, as: "company" },
        { model: LocationModel, as: "location" },

        {
          model: UserModel,
          as: "salesman",
          attributes: ["firstname", "lastname", "email", "id"],
          include: [
            {
              model: SalesmanInfo,
              as: "salesmanInfo",
              attributes: ["salesman_code", "user_id"],
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
              attributes: ["customer_code", "user_id"],
            },
          ],
        },

        { model: CustomerModel, as: "customer_details" },
        { model: VendorModel, as: "vendor_details" },
        // { model: OrderDetailModel, as: "order_details" },
        {
          model: OrderDetailModel,
          as: "order_details",
          include: [
            {
              model: itemLocationMaster,
              as: "itemLocationModel",
              attributes: ["item_name", "item_image"],
            },
          ],
        },

        {
          model: invoiceModel,
          as: "invoice",
          attributes: ["invoice_number"],
          required: false,
        },
      ],

      order: [["id", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "No orders found for this customer!",
            "Error",
            "",
          ),
        );
    }

    return res.status(200).json(
      ResponseFormatter.setResponse(
        true,
        200,
        "Orders fetched successfully",
        "",
        {
          totalOrders: orders.length,
          orders: orders,
        },
      ),
    );
  } catch (error) {
    return res
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

const changeOrderStatus1 = async (req, res) => {
  try {
    const { order_id, status, newStatusName, remarks, tracking_info } =
      req.body;
    console.log("re.body is -----", req.body);

    if (!order_id || !status) {
      return res
        .status(400)
        .json({ success: false, message: "order_id and status are required" });
    }

    const order = await OrderModel.findByPk(order_id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 1️⃣ Update ORDER table
    await order.update({
      current_order_status: status,
      current_stage: newStatusName,
    });

    // 2️⃣ Update order details
    await OrderDetailModel.update(
      { current_order_status: status },
      { where: { order_id } },
    );

    // 3️⃣ Insert status history
    await OrderStatusHistory.create({
      order_id,
      status_id: status,
      company_id: order.company_id,
      location_id: order.location_id,
      changed_by: 1, // your user/admin id here
      remarks: remarks || null,
    });

    // 4️⃣ If tracking info sent, create or update tracking record
    if (tracking_info) {
      // Example: create a new tracking record or update existing one
      // Adjust this to your DB schema and logic

      await OrderTrackingModel.upsert({
        order_id,
        courier_company: tracking_info.courier_company,
        tracking_number: tracking_info.tracking_number,
        shipment_date: tracking_info.shipment_date,
        estimated_delivery: tracking_info.estimated_delivery,
        tracking_url: tracking_info.tracking_url,
        delivery_status: "Out for Delivery",
        remarks: tracking_info.remarks || null,
      });
    }

    return res.json({
      success: true,
      message: "Order status and tracking info updated successfully",
    });
  } catch (error) {
    console.error("❌ changeOrderStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const changeOrderStatus = async (req, res) => {
  try {
    const { order_id, status, newStatusName, remarks, tracking_info } =
      req.body;

    if (!order_id || !status) {
      return res
        .status(400)
        .json({ success: false, message: "order_id and status are required" });
    }

    const order = await OrderModel.findByPk(order_id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 1️⃣ Update ORDER table
    await order.update({
      current_order_status: status,
      current_stage: newStatusName,
    });

    // 2️⃣ Update order details
    await OrderDetailModel.update(
      { current_order_status: status },
      { where: { order_id } },
    );

    // 3️⃣ Insert status history
    await OrderStatusHistory.create({
      order_id,
      status_id: status,
      company_id: order.company_id,
      location_id: order.location_id,
      changed_by: 1, // admin/user id
      remarks: remarks || null,
    });

    // 4️⃣ Tracking info
    let trackingData = null;
    if (tracking_info) {
      trackingData = await OrderTrackingModel.upsert({
        order_id,
        courier_company: tracking_info.courier_company,
        tracking_number: tracking_info.tracking_number,
        shipment_date: tracking_info.shipment_date,
        estimated_delivery: tracking_info.estimated_delivery,
        tracking_url: tracking_info.tracking_url,
        delivery_status: "Out for Delivery",
        remarks: tracking_info.remarks || null,
      });
    }

    // 5️⃣ FETCH USER DETAILS (IMPORTANT)
    const user = await UserModel.findByPk(order.user_id);

    if (user?.email) {
      // 6️⃣ SEND EMAIL
      await sendEmail({
        to: user.email,
        subject: `Your Order #${order_id} Status Updated`,
        html: orderStatusTemplate({
          customerName: user.name,
          orderId: order_id,
          productName: "Your ordered item(s)", // or fetch from order details
          quantity: "Multiple", // optional
          orderStatus: newStatusName,
          trackingNumber: tracking_info?.tracking_number || null,
          courierCompany: tracking_info?.courier_company || null,
          trackingUrl: tracking_info?.tracking_url || null,
        }),
      });
    }

    return res.json({
      success: true,
      message: "Order status updated & email sent successfully",
    });
  } catch (error) {
    console.error("❌ changeOrderStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// export {
//   list,
//   store,
//   UpdateOrder,
//   details,
//   delete_order,
//   ecommerceOrderStore,
//   createPendingOrder,
//   getTransactionByTxnid,
//   ecommerceOrderUpdate,
//   ecommerceOrderCancel,
//   getEcommerceOrderPaymentDetails,
//   getOrdersByCustomerId,
//   UpdateOrderStatus,
//   changeOrderStatus,
// };

module.exports = {
  list,
  store,
  UpdateOrder,
  details,
  delete_order,
  ecommerceOrderStore,
  createPendingOrder,
  getTransactionByTxnid,
  ecommerceOrderUpdate,
  ecommerceOrderCancel,
  getEcommerceOrderPaymentDetails,
  getOrdersByCustomerId,
  UpdateOrderStatus,
  changeOrderStatus,
};

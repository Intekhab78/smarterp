// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import Sequelize, { Op, fn, col, where } from "sequelize";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import crypto from "crypto";
// import { Readable } from "stream";
// import { v4 as uuidv4 } from "uuid";
// import ResponseFormatter from "../utils/ResponseFormatter.js";
// import db from "../models/index.js";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where, FLOAT } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");
const { codesettingupdate, codesettingGet } = require("../utils/handler");
// require('dotenv').config();
// const { log } = require("console");

const GrnModel = db.grn;
const OrderModel = db.order;
const GrnExtraCost = db.grn_extra_cost;
const BatchModel = db.batch;
const InventoryMovementModel = db.inventory_movement;
const GrnDetailModel = db.good_receipt_note_details;
const OrderDetailModel = db.order_details;
const userCompanyModel = db.user_company;
const UserModel = db.user_master;
const VendorModel = db.vendor_master;

const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_master;
const itemLocationModel = db.item_location_master;
const TaxMasterModel = db.tax_master;
const paymentTermsModel = db.payment_terms;
const StockMovement = db.stock_movement;
const Batches = db.batch;
const { sequelize } = db;

const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const countryMastersModel = db.country_masters;
const CompanyModel = db.company;
const LocationModel = db.location;
const InvoiceDetailModel = db.invoice_details;
const InvoiceModel = db.invoice;

// import { codesettingupdate, codesettingGet } from "../utils/handler.js";

const { log } = console;
const itemColorModel = db.item_color; // singular
const sizeMasterModel = db.size_master; // singular
const itemCategoryModel = db.item_category;
const familyMasterModel = db.family_master;
const subFamilyMasterModel = db.sub_family_master;
const departmentModel = db.item_department;
const brandMasterModel = db.brand;
// log(path.join(__dirname, "test.txt"));

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
    const totalRecords = await GrnModel.count();
    const festivalRes = await GrnModel.findAll({
      where: whereClause,
      //     where: searchQuery,
      // attributes: ['id','customer_code','customer_id'],
      include: [
        {
          model: UserModel,
          as: "salesman",
          attributes: ["firstname", "lastname", "email"],
          include: [
            {
              model: SalesmanInfo,
              as: "salesmanInfo",
              attributes: ["salesman_code"], // Example attributes
            },
          ],
        },
        {
          model: UserModel,
          as: "customer",
          attributes: ["firstname", "lastname", "email"],
          include: [
            {
              model: CustomerInfo,
              as: "customerInfo",
              attributes: ["customer_code"], // Example attributes
            },
          ],
        },
        {
          model: VendorModel,
          as: "vendor_details",
        },
        {
          model: GrnDetailModel,
          as: "grn_details",
          include: [
            {
              // model: itemModel,
              // as: "itemModel",
              model: itemLocationModel,
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
                {
                  model: itemColorModel,
                  as: "item_color",
                  attributes: ["id", "itemcolname"], // choose fields
                },

                //  ✅ ADD SIZE
                {
                  model: sizeMasterModel,
                  as: "size_master",
                  attributes: ["id", "itemsizename"], // choose fields
                },

                //  OPTIONAL: department
                {
                  model: departmentModel,
                  as: "item_department",
                  attributes: ["id", "itemdeptname"],
                },
                //  OPTIONAL:  category etc
                {
                  model: itemCategoryModel,
                  as: "itemcategory",
                  attributes: ["id", "itemcatname"],
                },
                // ✔ BRAND
                {
                  model: brandMasterModel,
                  as: "brand",
                  attributes: ["id", "brandname"],
                },

                // ✔ FAMILY
                {
                  model: familyMasterModel,
                  as: "family_master",
                  attributes: ["id", "itemfamname"],
                },

                // ✔ SUB-FAMILY
                {
                  model: subFamilyMasterModel,
                  as: "sub_family_master",
                  attributes: ["id", "itemsfamname"],
                },

                // ✔ ITEM BATCH
                {
                  model: BatchModel,
                  as: "item_batch",
                  attributes: ["id", "batch_number", "expiry_date"],
                },
              ],
            },
          ],
        },
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: LocationModel,
          as: "location",
        },
      ],
      order: [["id", "DESC"]],
      // limit: limits,
      // offset: offset
    });
    for (var i = 0; i < festivalRes.length; i++) {
      const grnPdfFullPaths = festivalRes[i].grn_pdf
        ? base_url + path.posix.join("uploads/grns", festivalRes[i].grn_pdf)
        : null;
      festivalRes[i].grn_pdf = grnPdfFullPaths;
    }
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

//this controller is sue for generate the grn direcltty
const store = async (req, res, next) => {
  const {
    customer_id,
    customer_lob,
    salesman_id,
    customer_lpo,
    delivery_date,
    payment_terms,
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
    items,
    company_id,
    location_id,
    vendor_invoice_no,
    vendor_invoice_date,
    delivery_note,
    current_stage_comment,
  } = req.body;

  try {
    let getgrnNumber = await codesettingGet("goodreceiptnote");
    codesettingupdate("goodreceiptnote");

    console.log("store from grn models  req body is------------", req.body);

    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    // =========================
    // ✅ Create GRN header
    // =========================
    let Grn = await GrnModel.create({
      customer_id,
      vendor_id: customer_id,
      customer_lob,
      salesman_id,
      customer_lpo,
      payment_term_id: payment_terms,
      grn_date: delivery_date || new Date().toISOString().split("T")[0],
      grn_number: getgrnNumber,
      grn_due_date: due_date || new Date().toISOString().split("T")[0],
      vendor_invoice_no,
      vendor_invoice_date,
      delivery_note,
      total_discount_amount: discount,
      total_net: net,
      total_vat: vat,
      total_excise: excise,
      total_qty: totalItemQty,
      grand_total: total,
      taxable_total,
      cgst_amount,
      sgst_amount,
      igst_amount,
      company_id,
      location_id,
      status: "received",
      order_type: "Manual",
      current_stage_comment,
    });

    // =========================
    // ✅ Process each GRN item
    // =========================
    for (let item of items) {
      let is_free = item.skim === "Free" ? 1 : 0;

      let item_stoke = await itemLocationModel.findOne({
        where: {
          id: item.item_id,
          company_id: company_id,
          location_id: location_id,
        },
      });

      if (!item_stoke) {
        throw new Error(
          `Item ${item.item_id} not found in item_location_master for company ${company_id}, location ${location_id}`,
        );
      }

      let uomData = null;
      if (item_stoke.itmuom) {
        uomData = await itemUomModel.findOne({
          where: { id: item_stoke.itmuom },
        });
      }

      const parseDecimal = (val) => (val === "" || val === null ? 0 : val);

      // =========================
      // ✅ Stock calculations (initial)
      // =========================
      // let oldStock = parseInt(item_stoke.stock || 0); // existing stock
      let oldStock = parseInt(
        item_stoke.remaining_stock ?? item_stoke.stock ?? 0,
      );

      let newStock = parseInt(item.quantity || 0); // incoming GRN qty for this item
      // Note: finalAddedToStock will be adjusted below when negative invoice filling happens

      // compute avg price (as before)
      let oldPrice = parseFloat(item_stoke.itemprice || 0);
      let newPrice = parseFloat(item.price || 0);

      let stoke_final = oldStock + newStock; // tentative final, will be adjusted after negative-fill
      let avgPrice =
        stoke_final > 0
          ? (oldStock * oldPrice + newStock * newPrice) / stoke_final
          : newPrice;

      const now = new Date();
      const batchNo =
        `${now.getFullYear().toString().slice(-2)}${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}` +
        `${String(now.getDate()).padStart(2, "0")}${String(
          now.getHours(),
        ).padStart(2, "0")}` +
        `${String(now.getMinutes()).padStart(2, "0")}${String(
          now.getSeconds(),
        ).padStart(2, "0")}${item.item_id}`;

      // =========================
      // >>> ADDED: Fill negative invoice details first (if any)
      // - Find InvoiceDetail rows with required_qty < 0 for this item,
      //   company and location.
      // - Use incoming GRN qty to reduce negative required_qty (toward zero)
      // - Increase invoice_detail.ship_quantity by the amount used
      // - Only then the remaining GRN qty (if any) becomes actual stock added to batch
      // =========================

      // remainingGRNQty = how much of newStock is still available to add to stock after fulfilling invoices
      let remainingGRNQty = newStock;
      const negativeInvoiceDetails = await InvoiceDetailModel.findAll({
        where: {
          item_id: item.item_id,
          required_qty: { [Op.lt]: 0 },
        },
        include: [
          {
            model: InvoiceModel,
            as: "invoiceModel", // <-- Must match your association name
            where: {
              company_id: company_id,
              location_id: location_id,
            },
          },
        ],
        order: [["id", "ASC"]],
      });

      // If your InvoiceDetailModel doesn't have company_id/location_id, you can filter by invoice's company/location via include.
      // But above is the simplest approach assuming invoice_detail stores company/location columns.

      if (negativeInvoiceDetails && negativeInvoiceDetails.length > 0) {
        for (const invDet of negativeInvoiceDetails) {
          if (remainingGRNQty <= 0) break;

          const deficit = Math.abs(Number(invDet.required_qty || 0)); // positive number
          if (deficit <= 0) continue;

          if (remainingGRNQty >= deficit) {
            // Fully satisfy this invoice detail
            invDet.ship_quantity = Number(invDet.ship_quantity || 0) + deficit;
            invDet.required_qty = 0; // cleared
            remainingGRNQty -= deficit;
          } else {
            // Partially satisfy
            invDet.ship_quantity =
              Number(invDet.ship_quantity || 0) + remainingGRNQty;
            invDet.required_qty =
              Number(invDet.required_qty || 0) + remainingGRNQty; // less negative
            remainingGRNQty = 0;
          }
          // ============================================
          // ADD CURRENT GRN BATCH NUMBER TO INVOICE DETAIL
          // ============================================
          let previousBatches = invDet.batch_number || "";
          invDet.batch_number = previousBatches
            ? `${batchNo},${previousBatches}`
            : `${batchNo}`;

          // Save updated invoice detail

          // Save updated invoice detail
          await invDet.save();
        }
      }

      // =========================
      // After negative-fill:
      // effectiveAddedToStock = how many units to actually add to stock/batch
      // =========================
      const effectiveAddedToStock = Math.max(0, remainingGRNQty);

      // Adjust final stock using only the effective added amount
      stoke_final = oldStock + effectiveAddedToStock;

      // =========================
      // Update item_location_master aggregated fields (updated: uses effectiveAddedToStock)
      // =========================

      console.log("stoke_final============", stoke_final);
      console.log("stoke_final============", stoke_final);
      console.log(
        "remaining_stock============",
        stoke_final - (parseInt(item_stoke.distributed_stock) || 0),
      );

      // await itemLocationModel.update(
      //   {
      //     stock: stoke_final,
      //     remaining_stock:
      //       stoke_final - (parseInt(item_stoke.distributed_stock) || 0),
      //     exp_date: item.expiry_delivery_date || item_stoke.exp_date,
      //     updated_at: new Date(),
      //   },
      //   { where: { id: item_stoke.id } },
      // );

      const newRemainingStock = oldStock + effectiveAddedToStock;

      await itemLocationModel.update(
        {
          stock: (parseInt(item_stoke.stock) || 0) + item.quantity, // lifetime received
          remaining_stock: newRemainingStock, // actual on-hand
          exp_date: item.expiry_delivery_date || item_stoke.exp_date,
          updated_at: new Date(),
        },
        { where: { id: item_stoke.id } },
      );

      let itemLocationId = item_stoke.id;

      // =========================
      // Create GRN Detail (unchanged behavior)
      // Note: we keep item.ship_quantity coming from request; you may want to update it
      //       using the invoice adjustment above — but current logic will keep the posted ship_quantity.
      // =========================
      await GrnDetailModel.create({
        uuid: uuidv4(),
        grn_id: Grn.id,
        item_id: item.item_id,
        item_location_id: itemLocationId,
        item_uom_id: item.uom || 0,
        discount_id: 0,
        is_free,
        is_item_poi: 0,
        promotion_id: 0,
        item_qty: item.quantity,
        ship_quantity: item.ship_quantity,
        item_price: item_stoke.itemprice,
        item_mrp: item_stoke.itemprice,
        item_gross: item.price,
        item_discount_amount: item.discount,
        item_net: item.net,
        item_excise: item.excise,
        item_vat: item.vat,
        item_grand_total: item.total,
        ptr_di: item.ptr_di,
        taxa_ble: item.taxa_ble,
        discounttype: item.discounttype,
        cgst: parseDecimal(item.cgst),
        cgst_amount: parseDecimal(item.cgst_amount),
        sgst: parseDecimal(item.sgst),
        sgst_amount: parseDecimal(item.sgst_amount),
        igst: parseDecimal(item.igst),
        igst_amount: parseDecimal(item.igst_amount),
        itemtype: item.itemtype,
        landed_cost_per_unit: item.landed_cost_per_unit,
        expiry_delivery_date: item.expiry_delivery_date,
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        purchase_cost_per_unit: item.purchase_cost_per_unit,
        hsn_code: item.hsn_code,
        rate: item.price,
      });

      const perItemLandedCost =
        (parseFloat(item.total) || 0) / (parseFloat(item.quantity) || 1);

      // =========================
      // Create Batch record
      // - current_in_stock must be effectiveAddedToStock (GRN qty minus what we used to fill negatives)
      // - qty remains the GRN quantity (total received), but current_in_stock is only the remainder available
      // =========================
      const createdBatch = await Batches.create({
        item_id: item.item_id,
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        grn_number: getgrnNumber,
        batch_mcu: customer_id,
        manufacturing_date: null,
        expiry_date: item.expiry_delivery_date || null,
        qty: item.quantity,
        // itemcost: item.price,
        itemcost: parseFloat(item.price) || 0,

        itemlanprice: perItemLandedCost,
        current_in_stock: effectiveAddedToStock, // <<< important: only the remainder is actual stock on hand
        location: location_id,
        company: company_id,
        status: 1,
      });

      // =========================
      // Item Price Table (unchanged)
      // =========================
      await itemMainPriceModel.create({
        item_id: item.item_id,
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        item_upc: item_stoke.itemupc,
        item_uom_id: item_stoke.itmuom || null,
        uom_type: uomData ? uomData.name : null,
        stock_keeping_unit: item.quantity,
        purchase_order_price: item.landed_cost_per_unit,
        itemcost: item.itemcost,
        itemlanprice: perItemLandedCost,
        item_price: item.price,
        sell_enable: 1,
        return_enable: 1,
        location: location_id,
        company: company_id,
        grn_no: getgrnNumber,
        status: 1,
      });

      // =========================
      // Stock Movement
      // - qty_on_hand_previous = oldStock
      // - qty_on_hand_new = stoke_final (which accounts for used negatives)
      // - note: qty (for GRN) remains item.quantity (total received), but effective on-hand change is effectiveAddedToStock
      // =========================
      await StockMovement.create({
        item_id: item.item_id,
        transaction_no: Grn.grn_number,
        transaction_type: "GRN",
        // qty: item.quantity,
        uom_id: item_stoke.itmuom || null,
        uom_name: uomData ? uomData.name : null,
        itemupc: item_stoke.itemupc,
        supplier_name: customer_id || null,
        type: "IN",
        loc_type: "Add GRN",
        comp_id: company_id,
        loc_id: location_id,
        stock_code: item.item_code || null,
        batch:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        expirydate: item.expiry_delivery_date || null,
        stock_desc: `Goods Receipt Note -${Grn.grn_number} | Batch:${
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo
        } `,
        // qty_on_hand_previous: oldStock,
        // qty_on_hand_new: stoke_final,
        qty_on_hand_previous: oldStock,
        qty_on_hand_new: oldStock + effectiveAddedToStock,
        qty: effectiveAddedToStock,

        average_cost_previous: oldPrice,
        average_cost_new: avgPrice,
        date: delivery_date,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // =========================
      // Inventory Movement (unchanged)
      // =========================
      await InventoryMovementModel.create({
        item_id: item.item_id,
        tranno: Grn.id,
        trantype: "Manual GRN",
        trandate: delivery_date,
        tranqty: item.quantity,
        trancstock: stoke_final,
      });

      // >>> OPTIONAL: If you want to record how much of GRN was used to satisfy previous invoices,
      // you can create a StockMovement rows of type 'ALLOCATED' or similar for the allocated amount.
      // For now we only adjusted invoice_detail.ship_quantity and required_qty and adjusted batch/current stock.
    }

    // =========================
    // Done
    // =========================
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "GRN  generated successfully",
          "",
          Grn,
        ),
      );
  } catch (error) {
    console.error("GRN store error:", error);
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

//below store1 code si working there no issue  just i want to invoice negative logic in the above code
const store1 = async (req, res, next) => {
  const {
    customer_id,
    customer_lob,
    salesman_id,
    customer_lpo,
    delivery_date,
    payment_terms,
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
    items,
    company_id,
    location_id,
    vendor_invoice_no,
    vendor_invoice_date,
    delivery_note,
    current_stage_comment,
  } = req.body;

  try {
    let getgrnNumber = await codesettingGet("goodreceiptnote");
    codesettingupdate("goodreceiptnote");

    console.log("store from grn models  req body is------------", req.body);

    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    // ✅ Create GRN
    let Grn = await GrnModel.create({
      customer_id,
      vendor_id: customer_id,
      customer_lob,
      salesman_id,
      customer_lpo,
      payment_term_id: payment_terms,
      grn_date: delivery_date || new Date().toISOString().split("T")[0],
      grn_number: getgrnNumber,
      // grn_due_date: due_date,
      grn_due_date: due_date || new Date().toISOString().split("T")[0],

      vendor_invoice_no,
      vendor_invoice_date,
      delivery_note,
      total_discount_amount: discount,
      total_net: net,
      total_vat: vat,
      total_excise: excise,
      total_qty: totalItemQty,
      grand_total: total,
      taxable_total,
      cgst_amount,
      sgst_amount,
      igst_amount,
      company_id,
      location_id,
      status: "received",
      order_type: "Manual",
      current_stage_comment,
    });

    // ✅ Process items
    for (let item of items) {
      let is_free = item.skim === "Free" ? 1 : 0;

      let item_stoke = await itemLocationModel.findOne({
        where: {
          id: item.item_id,
          company_id: company_id,
          location_id: location_id,
        },
      });

      if (!item_stoke) {
        throw new Error(
          `Item ${item.item_id} not found in item_location_master for company ${company_id}, location ${location_id}`,
        );
      }

      let uomData = null;
      if (item_stoke.itmuom) {
        uomData = await itemUomModel.findOne({
          where: { id: item_stoke.itmuom },
        });
      }

      const parseDecimal = (val) => (val === "" || val === null ? 0 : val);

      // ✅ Stock calculations
      let oldStock = parseInt(item_stoke.stock || 0);
      let newStock = parseInt(item.quantity);
      let stoke_final = oldStock + newStock;

      let oldPrice = parseFloat(item_stoke.itemprice || 0);
      let newPrice = parseFloat(item.price || 0);

      let avgPrice =
        stoke_final > 0
          ? (oldStock * oldPrice + newStock * newPrice) / stoke_final
          : newPrice;

      const now = new Date();
      const batchNo = `${now.getFullYear().toString().slice(-2)}${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
        now.getHours(),
      ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
        now.getSeconds(),
      ).padStart(2, "0")}${item.item_id}`; // append item_id
      // ✅ Update item stock
      await itemLocationModel.update(
        {
          stock: stoke_final,
          remaining_stock:
            stoke_final - (parseInt(item_stoke.distributed_stock) || 0),
          // itemprice: avgPrice,
          // last_purchase_price: newPrice,
          // itemlanprice: item.landed_cost_per_unit || item_stoke.itemlanprice,
          // itemcost: item.net || item_stoke.itemcost,
          // itemcost: (item.net / item.quantity) || item_stoke.itemcost,

          exp_date: item.expiry_delivery_date || item_stoke.exp_date,
          updated_at: new Date(),
        },
        { where: { id: item_stoke.id } },
      );

      let itemLocationId = item_stoke.id;

      // ✅ Create GRN Detail
      await GrnDetailModel.create({
        uuid: uuidv4(),
        grn_id: Grn.id,
        item_id: item.item_id,
        item_location_id: itemLocationId,
        item_uom_id: item.uom || 0,
        discount_id: 0,
        is_free,
        is_item_poi: 0,
        promotion_id: 0,
        item_qty: item.quantity,
        ship_quantity: item.ship_quantity,
        // item_price: item.price,
        item_price: item_stoke.itemprice,
        item_mrp: item_stoke.itemprice,

        item_gross: item.price,
        item_discount_amount: item.discount,
        item_net: item.net,
        item_excise: item.excise,
        item_vat: item.vat,

        item_grand_total: item.total,
        ptr_di: item.ptr_di,
        taxa_ble: item.taxa_ble,
        discounttype: item.discounttype,
        cgst: parseDecimal(item.cgst),
        cgst_amount: parseDecimal(item.cgst_amount),
        sgst: parseDecimal(item.sgst),
        sgst_amount: parseDecimal(item.sgst_amount),
        igst: parseDecimal(item.igst),
        igst_amount: parseDecimal(item.igst_amount),
        itemtype: item.itemtype,
        landed_cost_per_unit: item.landed_cost_per_unit,
        expiry_delivery_date: item.expiry_delivery_date,
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        purchase_cost_per_unit: item.purchase_cost_per_unit,
        hsn_code: item.hsn_code,
        rate: item.price,
      });

      const perItemLandedCost =
        (parseFloat(item.total) || 0) / (parseFloat(item.quantity) || 1);

      // console.log("perItemLandedCost--------", perItemLandedCost);

      // ✅ Batch Table
      await Batches.create({
        item_id: item.item_id,
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        grn_number: getgrnNumber,
        batch_mcu: customer_id,
        manufacturing_date: null,
        expiry_date: item.expiry_delivery_date || null,
        qty: item.quantity,
        itemcost: item.itemcost,
        itemlanprice: perItemLandedCost,
        current_in_stock: item.quantity,
        location: location_id,
        company: company_id,
        status: 1,
      });

      // ✅ Item Price Table
      await itemMainPriceModel.create({
        item_id: item.item_id,
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        item_upc: item_stoke.itemupc,
        item_uom_id: item_stoke.itmuom || null,
        uom_type: uomData ? uomData.name : null,

        stock_keeping_unit: item.quantity,
        purchase_order_price: item.landed_cost_per_unit,
        itemcost: item.itemcost,
        itemlanprice: perItemLandedCost,
        item_price: item.price,
        sell_enable: 1,
        return_enable: 1,
        location: location_id,
        company: company_id,
        grn_no: getgrnNumber,
        status: 1,
      });

      // ✅ Stock Movement
      await StockMovement.create({
        item_id: item.item_id,
        transaction_no: Grn.grn_number,
        transaction_type: "GRN",
        qty: item.quantity,
        uom_id: item_stoke.itmuom || null,
        uom_name: uomData ? uomData.name : null,
        itemupc: item_stoke.itemupc,
        supplier_name: customer_id || null,
        type: "IN",
        loc_type: "Add GRN",
        comp_id: company_id,
        loc_id: location_id,
        // to_location: location_id,
        stock_code: item.item_code || null,
        batch:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        expirydate: item.expiry_delivery_date || null,
        // stock_desc: `Goods Receipt Note - ${Grn.grn_number}`,
        stock_desc: `Goods Receipt Note -${Grn.grn_number} | Batch:${
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo
        } `,
        // stock_desc: `Goods Receipt Note -${Grn.grn_number} | Batch: ${Batches.batch_number}`,
        qty_on_hand_previous: oldStock,
        qty_on_hand_new: stoke_final,
        average_cost_previous: oldPrice,
        average_cost_new: avgPrice,
        date: delivery_date,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // ✅ Inventory Movement
      await InventoryMovementModel.create({
        item_id: item.item_id,
        tranno: Grn.id,
        trantype: "Manual GRN",
        trandate: delivery_date,
        tranqty: item.quantity,
        trancstock: stoke_final,
      });
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "GRN  generated successfully",
          "",
          Grn,
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

//this is for insert the grn direclty using Purchase order grn
const manualgrn = async (req, res, next) => {
  const {
    id,
    customer_id,
    customer_lob,
    salesman_id,
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
    order_number,
    taxable_total,
    cgst_amount,
    sgst_amount,
    igst_amount,
    items,
    company_id,
    location_id,
    vendor_invoice_no,
    vendor_invoice_date,
    delivery_note,
    current_stage_comment,
  } = req.body;

  console.log("manul grn inster is --------", req.body);

  try {
    let getgrnNumber = await codesettingGet("goodreceiptnote");
    codesettingupdate("goodreceiptnote");

    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    let Grn = await GrnModel.create({
      order_id: id,
      order_number: order_number,
      vendor_id: customer_id,
      customer_id,
      customer_lob,
      salesman_id,
      customer_lpo,
      payment_term_id: payment_terms,
      grn_date: delivery_date || new Date().toISOString().split("T")[0],
      grn_number: getgrnNumber,
      // grn_due_date: due_date || "",
      grn_due_date: due_date || new Date().toISOString().split("T")[0],

      vendor_invoice_no,
      vendor_invoice_date,
      delivery_note,
      total_discount_amount: discount,
      total_net: net,
      total_vat: vat,
      total_excise: excise,
      total_qty: totalItemQty,
      grand_total: total,
      taxable_total,
      cgst_amount,
      sgst_amount,
      igst_amount,
      company_id,
      location_id,
      status: "Recevied",
      order_type,
      current_stage_comment,
    });

    //update open_qty from order and order_Details table form the pruchase order/generate grn

    // Step 1: Reduce open_qty in OrderDetail for all items
    for (let item of items) {
      await OrderDetailModel.update(
        {
          open_qty: sequelize.literal(
            `GREATEST(open_qty - ${parseInt(item.quantity || 0)}, 0)`,
          ),
        },
        {
          where: {
            order_id: id,
            item_id: item.item_id,
          },
        },
      );
    }

    // Step 2: Update Order open_qty as sum of remaining OrderDetail open_qty
    const orderDetails = await OrderDetailModel.findAll({
      where: { order_id: id },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("open_qty")), "total_open_qty"],
      ],
      raw: true,
    });

    const newOpenQty = orderDetails[0].total_open_qty || 0;
    // await OrderModel.update({ open_qty: newOpenQty }, { where: { id } });

    // Step 3: Update order status based on remaining open quantity
    let orderStatus = "Completed";

    if (newOpenQty > 0) {
      orderStatus = "Partially Rcd";
    }

    // Update status and open_qty in Order table
    await OrderModel.update(
      { open_qty: newOpenQty, status: orderStatus },
      { where: { id } },
    );

    for (let item of items) {
      let is_free = item.skim === "Free" ? 1 : 0;

      let item_stoke = await itemLocationModel.findOne({
        where: {
          id: item.item_id,
          company_id: company_id,
          location_id: location_id,
        },
      });

      if (!item_stoke) {
        throw new Error(
          `Item ${item.item_id} not found in item_location_master for company ${company_id}, location ${location_id}`,
        );
      }

      let uomData = null;
      if (item_stoke.itmuom) {
        uomData = await itemUomModel.findOne({
          where: { id: item_stoke.itmuom },
        });
      }

      const parseDecimal = (val) => (val === "" || val === null ? 0 : val);

      // ✅ Stock calculations
      // let oldStock = parseInt(item_stoke.stock || 0);
      let oldStock = parseInt(
        item_stoke.remaining_stock ?? item_stoke.stock ?? 0,
      );

      let newStock = parseInt(item.quantity);

      let remainingGRNQty = newStock;

      // find negative invoice details
      const negativeInvoiceDetails = await InvoiceDetailModel.findAll({
        where: {
          item_id: item.item_id,
          required_qty: { [Op.lt]: 0 },
        },
        include: [
          {
            model: InvoiceModel,
            as: "invoiceModel",
            where: { company_id, location_id },
          },
        ],
        order: [["id", "ASC"]],
      });

      // consume GRN to fill negatives
      for (const invDet of negativeInvoiceDetails) {
        if (remainingGRNQty <= 0) break;

        const deficit = Math.abs(invDet.required_qty);
        const usedQty = Math.min(deficit, remainingGRNQty);

        invDet.ship_quantity += usedQty;
        invDet.required_qty += usedQty;
        remainingGRNQty -= usedQty;

        await invDet.save();
      }

      const effectiveAddedToStock = Math.max(0, remainingGRNQty);

      // let stoke_final = oldStock + newStock;
      let stoke_final = oldStock + effectiveAddedToStock;

      let oldPrice = parseFloat(item_stoke.itemprice || 0);
      let newPrice = parseFloat(item.price || 0);

      let avgPrice =
        stoke_final > 0
          ? (oldStock * oldPrice + newStock * newPrice) / stoke_final
          : newPrice;

      const now = new Date();

      const batchNo = `${now.getFullYear().toString().slice(-2)}${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
        now.getHours(),
      ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
        now.getSeconds(),
      ).padStart(2, "0")}${item.item_id}`; // append item_id

      // ✅ Update item stock
      await itemLocationModel.update(
        {
          stock: (parseInt(item_stoke.stock) || 0) + item.quantity, // lifetime
          remaining_stock: oldStock + effectiveAddedToStock, // real on-hand
          updated_at: new Date(),
        },
        { where: { id: item_stoke.id } },
      );

      let itemLocationId = item_stoke.id;
      const perItemLandedCost =
        (parseFloat(item.total) || 0) / (parseFloat(item.quantity) || 1);
      // ✅ Create GRN Detail
      await GrnDetailModel.create({
        uuid: uuidv4(),
        grn_id: Grn.id,
        item_id: item.item_id,
        item_location_id: itemLocationId,
        item_uom_id: item.uom || 0,
        discount_id: 0,
        is_free,
        is_item_poi: 0,
        promotion_id: 0,
        item_qty: item.quantity,
        ship_quantity: item.ship_quantity,
        item_weight: 0,
        total_pallet: 0,
        total_pallet_volume: 0,
        item_price: item_stoke.itemprice,
        item_mrp: item_stoke.itemprice,
        // item_price: item.price,
        item_gross: item.price,
        item_discount_amount: item.discount,
        item_net: item.net,
        item_vat: item.vat,
        item_excise: item.excise,
        item_grand_total: item.total,
        ptr_di: item.ptr_di,
        taxa_ble: item.taxa_ble,
        discounttype: item.discounttype,
        cgst: parseDecimal(item.cgst),
        cgst_amount: parseDecimal(item.cgst_amount),
        sgst: parseDecimal(item.sgst),
        sgst_amount: parseDecimal(item.sgst_amount),
        igst: parseDecimal(item.igst),
        igst_amount: parseDecimal(item.igst_amount),
        itemtype: item.itemtype,
        landed_cost_per_unit: item.landed_cost_per_unit,
        expiry_delivery_date: item.expiry_delivery_date,
        // receiving_site: item.receiving_site || "",
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,

        purchase_cost_per_unit: item.purchase_cost_per_unit,
        hsn_code: item.hsn_code,
        rate: item.price,
      });

      const itemCostValue = Number(item.price);
      console.log("Inserting itemcost:", itemCostValue);
      // ✅ Batch Table  maintain
      await Batches.create({
        item_id: item.item_id,
        // batch_number: item.receiving_site || batchNo,
        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        grn_number: getgrnNumber,
        batch_mcu: customer_id,
        manufacturing_date: null,
        expiry_date: item.expiry_delivery_date || null,
        qty: item.quantity,
        // current_in_stock: item.quantity, // ✅ only this batch’s qty
        current_in_stock: effectiveAddedToStock,
        itemcost: parseFloat(item.price) || 0,
        itemlanprice: perItemLandedCost,
        location: location_id,
        company: company_id,
        status: 1,
      });
      // ✅ Item price  Table  maintain
      await itemMainPriceModel.create({
        item_id: item.item_id,
        batch_no:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,

        batch_number:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        // batch_no: item.receiving_site || batchNo,
        item_upc: item_stoke.itemupc,
        item_uom_id: item_stoke.itmuom || null,
        uom_type: uomData ? uomData.name : null,
        stock_keeping_unit: item.quantity,
        purchase_order_price: item.landed_cost_per_unit,
        temcost: item.itemcost,
        itemlanprice: perItemLandedCost,
        item_price: item.price,
        sell_enable: 1,
        return_enable: 1,
        location: location_id,
        company: company_id,
        grn_no: getgrnNumber,
        status: 1,
      });

      // ✅ Save Stock Movement AFTER stock calculation
      await StockMovement.create({
        item_id: item.item_id,
        transaction_no: Grn.grn_number,
        transaction_type: "GRN",
        // qty: item.quantity,
        uom_id: item_stoke.itmuom || null,
        uom_name: uomData ? uomData.name : null,
        itemupc: item_stoke.itemupc,
        // item_id: item_stoke.id,
        supplier_name: customer_id || null,
        type: "IN",
        route_id: Grn.route_id || null,
        warehouse_id: null,
        loc_type: "Add GRN",
        comp_id: company_id,
        loc_id: location_id,
        // to_location: location_id,
        from_location: null,
        stock_code: item.item_code || null,
        // batch: item.receiving_site || batchNo,
        batch:
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo,
        // batch: item.batch_number || null,
        expirydate: item.expiry_delivery_date || null,

        stock_desc: `Goods Receipt Note -${Grn.grn_number} | Batch:${
          item.receiving_site && item.receiving_site !== "0"
            ? item.receiving_site
            : batchNo
        } `,

        // qty_on_hand_previous: oldStock,
        // qty_on_hand_new: stoke_final,
        qty: effectiveAddedToStock,
        qty_on_hand_previous: oldStock,
        qty_on_hand_new: oldStock + effectiveAddedToStock,
        average_cost_previous: oldPrice,
        average_cost_new: avgPrice,
        date: delivery_date,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // ✅ Save Inventory Movement (optional if you still need it)
      await InventoryMovementModel.create({
        item_id: item.item_id,
        tranno: Grn.id,
        trantype: "Manual GRN",
        trandate: delivery_date,
        tranqty: item.quantity,
        // trancstock: stoke_final,
        trancstock: oldStock + effectiveAddedToStock,
      });
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Manual GRN generated successfully",
          "",
          Grn,
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

const Grndetails = async (req, res, next) => {
  const { id } = req.body;
  try {
    // console.log(id);
    const detail = await GrnModel.findOne({
      include: [
        {
          model: UserModel,
          as: "salesman",
          attributes: ["firstname", "lastname", "email", "mobile"],
          include: [
            {
              model: SalesmanInfo,
              as: "salesmanInfo",
              attributes: ["salesman_code"], // Example attributes
            },
          ],
        },
        // {
        //   model: UserModel,
        //   as: "customer",
        //   attributes: [
        //     "firstname",
        //     "lastname",
        //     "email",
        //     "mobile",
        //     "country_id",
        //     "custax1",
        //   ],
        //   include: [
        //     {
        //       model: CustomerInfo,
        //       as: "customerInfo",
        //       attributes: [
        //         "customer_code",
        //         "customer_address_1",
        //         "customer_address_2",
        //         "msme_no",
        //         "fssai_no",
        //         "state_code",
        //       ], // Example attributes
        //     },
        //     {
        //       model: countryMastersModel,
        //       as: "country", // The associated User model
        //       attributes: ["id", "name"],
        //     },
        //   ],
        // },
        {
          model: VendorModel,
          as: "vendor_details",
        },
        {
          model: GrnDetailModel,
          as: "grn_details",
          include: [
            {
              model: itemLocationModel,
              as: "itemLocationModel",
              include: [
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
                { model: TaxMasterModel, as: "tax_master_1" },
              ],
              attributes: ["item_name", "item_code"],
            },
          ],
          // attributes: ['firstname', 'lastname', 'email'],
        },

        // 🔹 Include extra costs
        {
          model: GrnExtraCost,
          as: "extra_costs", // Make sure your association alias matches
          attributes: [
            "grn_number",
            "cost_type",
            "vendor_type",
            "vendor_name",
            "mode_of_payment",
            "cheque_number",
            "bank_name",
            "amount",
            "number_of_item_types",
            "remarks",
            "date",
          ],
        },
        {
          model: paymentTermsModel,
          as: "payment_terms",
          attributes: ["id", "name"],
        },
      ],
      where: {
        id: id,
      },
    });
    // console.log(detail);
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

//tiis grn update is work for extra cost

const UpdateGrn = async (req, res, next) => {
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
    status,
    company_id,
    location_id,
    order_type,
    header,
    extraCost,
  } = req.body;

  try {
    // 🔹 Find GRN with details
    const detail = await GrnModel.findOne({
      include: [{ model: GrnDetailModel, as: "grn_details" }],
      where: { id },
    });

    console.log("rew.body from the update grn ----------", req.body);

    if (!detail) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Order not found", "Error"),
        );
    }

    // const totalItemQty = items.reduce((sum, item) => {
    //   return sum + Number(item.quantity || 0);
    // }, 0);
    // 🔹 Save extra cost records
    let extraTotal = 0;
    if (extraCost && extraCost.length > 0) {
      for (let ec of extraCost) {
        await GrnExtraCost.create({
          grn_number: ec.grn_number,
          cost_type: ec.cost_type,
          vendor_type: ec.vendor_type,
          vendor_name: ec.vendor_name,
          supplier_id: header.customer_id,
          mode_of_payment: ec.mode_of_payment,
          cheque_number: ec.cheque_number || null,
          bank_name: ec.bank_name || null,
          amount: ec.amount,
          number_of_item_types: ec.number_of_item_types,
          remarks: ec.remarks,
          date: ec.date,
        });
      }

      extraTotal = extraCost.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0,
      );
    }

    // 🔹 Calculate base total
    let baseTotal = 0;
    if (detail.grn_details?.length > 0) {
      for (let d of detail.grn_details) {
        baseTotal += parseFloat(d.item_grand_total || 0);
      }
    }

    // 🔹 Weighted extra cost allocation (qty × cost)
    if (detail.grn_details?.length > 0) {
      const totalItemValue = detail.grn_details.reduce(
        (sum, x) =>
          sum + parseFloat(x.item_qty || 0) * parseFloat(x.item_gross || 0),
        0,
      );

      for (let d of detail.grn_details) {
        const qty = parseFloat(d.item_qty || 0);
        const itemCost = parseFloat(d.item_gross || 0);
        const baseValue = qty * itemCost;

        const allocatedExtra =
          totalItemValue > 0 ? (baseValue / totalItemValue) * extraTotal : 0;

        const existingDetail = await GrnDetailModel.findOne({
          where: { id: d.id },
        });
        const prevExtraCost = parseFloat(existingDetail.item_extra_cost || 0);
        const newExtraCost = prevExtraCost + allocatedExtra;

        const newGrandTotal =
          parseFloat(d.item_grand_total || 0) + allocatedExtra;
        const landedCostPerUnit = newGrandTotal / qty;

        console.log(
          `Item ${
            d.item_name || d.item_id
          }: qty=${qty}, cost=${itemCost}, allocatedExtra=${allocatedExtra.toFixed(
            2,
          )}, landedCostPerUnit=${landedCostPerUnit.toFixed(2)}`,
        );

        if (d.batch_number) {
          await BatchModel.update(
            { itemlanprice: landedCostPerUnit },
            {
              where: {
                batch_number: d.batch_number,
                item_id: d.item_id,
                grn_number: detail.grn_number, // or Grn.grn_number if you have it in scope
              },
            },
          );
        }

        await GrnDetailModel.update(
          {
            item_extra_cost: newExtraCost,
            item_grand_total: newGrandTotal,
            landed_cost_per_unit: landedCostPerUnit,
          },
          { where: { id: d.id } },
        );

        // 🔹 Update landed cost in item_location_master, BatchModel, and itemMainPriceModel
        // const itemRecord = await itemLocationModel.findOne({
        //   where: {
        //     id: d.item_id,
        //     company_id,
        //     location_id,
        //   },
        // });

        // if (itemRecord) {
        //   const oldLandedCost = parseFloat(itemRecord.itemlanprice || 0);
        //   const newLandedCost = landedCostPerUnit;

        //   console.log("✅ Updating Landed Cost:");
        //   console.log("Item:", d.item_id);
        //   console.log("Old Landed Cost:", oldLandedCost);
        //   console.log("New Landed Cost:", newLandedCost);
        //   console.log("Company:", company_id, "Location:", location_id);

        //   await itemLocationModel.update(
        //     { itemlanprice: newLandedCost },
        //     {
        //       where: {
        //         id: d.item_id,
        //         company_id,
        //         location_id,
        //       },
        //     }
        //   );

        //   if (d.batch_number) {
        //     await BatchModel.update(
        //       { itemlanprice: newLandedCost },
        //       { where: { batch_number: d.batch_number } }
        //     );

        //     await itemMainPriceModel.update(
        //       {
        //         itemlanprice: newLandedCost,
        //         item_price: newLandedCost + newLandedCost * 0.2,
        //       },
        //       { where: { batch_number: d.batch_number } }
        //     );
        //   }
        // }
      }
    }

    // 🔹 Final totals
    const finalGrandTotal = baseTotal + extraTotal;

    // 🔹 Update GRN master
    await GrnModel.update(
      {
        customer_lob,
        customer_lpo,
        delivery_date,
        payment_term_id: payment_terms,
        due_date,
        total_discount_amount: discount,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        total_gross: baseTotal,
        grand_total: finalGrandTotal,
        status: "received",
        order_type,
        company_id,
        location_id,
        // total_qty: totalItemQty,
      },
      { where: { id } },
    );

    // 🔹 Response
    res.status(200).json(
      ResponseFormatter.setResponse(
        true,
        200,
        "Successfully updated record with proportional extra cost and landed cost",
        "",
        {
          ...detail.toJSON(),
          total_gross: baseTotal,
          extra_total: extraTotal,
          grand_total: finalGrandTotal,
        },
      ),
    );
  } catch (error) {
    console.error("❌ Update GRN Error:", error.message);
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

const UpdateGrn4 = async (req, res, next) => {
  const {
    // id,
    // customer_lob,
    // customer_lpo,
    // delivery_date,
    // payment_terms,
    // due_date,
    // discount,
    // net,
    // excise,
    // vat,
    // total,
    // status,
    // order_type,
    // items,
    id,
    customer_id,
    salesman_id,
    company_id,
    location_id,
    customer_lob,
    customer_lpo,
    delivery_date,
    payment_terms,
    due_date,
    vendor_invoice_no,
    vendor_invoice_date,
    delivery_note,
    status,
    grn_type,
    current_stage_comment,
    discount,
    net,
    excise,
    vat,
    total,
    order_type,
    items,
  } = req.body;

  try {
    console.log("Request body:", req.body);

    const grn = await GrnModel.findOne({
      include: [{ model: GrnDetailModel, as: "grn_details" }],
      where: { id },
    });

    if (!grn) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "GRN not found", "Error"),
        );
    }

    // 🔹 Update GRN master
    await GrnModel.update(
      {
        // customer_lob,
        // customer_lpo,
        // delivery_date,
        // payment_terms,
        // due_date,
        // total_discount_amount: discount,
        // total_net: net,
        // total_vat: vat,
        // total_excise: excise,
        // grand_total: total,
        // status,
        // order_type,
        vendor_id: customer_id,
        salesman_id,
        company_id,
        location_id,
        customer_lob,
        customer_lpo,
        delivery_date,
        payment_terms,
        due_date,
        vendor_invoice_no,
        vendor_invoice_date,
        delivery_note,
        status,
        grn_type,
        current_stage_comment,
        total_discount_amount: discount,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        order_type,
        total_qty: items.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0,
        ),
      },
      { where: { id } },
    );

    // 🔹 Update or create GRN details
    for (const item of items) {
      if (item.grn_details_id) {
        // Use grn_details_id from request to match DB
        await GrnDetailModel.update(
          {
            item_id: item.item_id,
            item_qty: item.quantity,
            ship_quantity: item.ship_quantity,
            item_gross: item.price,
            item_discount_amount: item.discount,
            item_net: item.net,
            item_vat: item.vat,
            item_excise: item.excise,
            item_grand_total: item.total,
          },
          { where: { id: item.grn_details_id } },
        );
      } else {
        // Create new detail if not exist
        await GrnDetailModel.create({
          order_id: id,
          item_id: item.item_id,
          item_uom_id: 0,
          discount_id: 0,
          is_free: 0,
          is_item_poi: 0,
          promotion_id: 0,
          item_qty: item.quantity,
          ship_quantity: item.ship_quantity,
          item_weight: 0,
          total_pallet: 0,
          total_pallet_volume: 0,
          item_price: 0,
          item_gross: item.price,
          item_discount_amount: item.discount,
          item_net: item.net,
          item_vat: item.vat,
          item_excise: item.excise,
          item_grand_total: item.total,
          delivered_qty: 0,
          open_qty: 0,
          order_status: "Pending",
        });
      }
    }

    // 🔹 Fetch updated GRN with details
    const updatedGRN = await GrnModel.findOne({
      include: [{ model: GrnDetailModel, as: "grn_details" }],
      where: { id },
    });

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully updated GRN and details",
          "",
          updatedGRN,
        ),
      );
  } catch (error) {
    console.error("❌ Update GRN Error:", error.message);
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

const delete_grn = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await GrnModel.destroy({
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
  UpdateGrn,
  Grndetails,
  delete_grn,
  manualgrn,
  UpdateGrn4,
};

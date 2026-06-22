const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where, FLOAT } = require("sequelize");
// const { fn, col } = require("sequelize");

const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const OrderModel = db.order;
const itemMajorCategoryModel = db.item_category;
const InventoryMovementModel = db.inventory_movement;
const InvoiceModel = db.invoice;
const InvoiceDetailModel = db.invoice_details;
const VendorModel = db.vendor_master;
const CustomerModel = db.customer_master;
const OrderDetailModel = db.order_details;
const UserModel = db.user_master;
const BatchModel = db.batch;
const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_master;
const itemLocationMaster = db.item_location_master;
const paymentTermsModel = db.payment_terms;
const userCompanyModel = db.user_company;
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Readable } = require("stream");
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const countryMastersModel = db.country_masters;
const CompanyModel = db.company;
const LocationModel = db.location;
const Pos_Payment = db.pos_payment;
const PaymentCollection = db.collection;
const PaymentMethod = db.collection_details;
const StockMovement = db.stock_movement;
const TaxMasterModel = db.tax_master;
const itemColorModel = db.item_color; // singular
const sizeMasterModel = db.size_master; // singular
const itemCategoryModel = db.item_category;
const familyMasterModel = db.family_master;
const subFamilyMasterModel = db.sub_family_master;
const departmentModel = db.item_department;
const brandMasterModel = db.brand;
const { v4: uuidv4 } = require("uuid");

const { codesettingupdate, codesettingGet } = require("../utils/handler");

// require('dotenv').config();
const paths = require("path");
const { log } = require("console");
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
    const totalRecords = await InvoiceModel.count();
    const festivalRes = await InvoiceModel.findAll({
      where: whereClause,

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
        // ✅ ADD THIS
        {
          model: OrderModel,
          as: "orderModel",
          include: [
            {
              model: OrderDetailModel,
              as: "order_details",
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

        // {
        //   model: InvoiceDetailModel,
        //   as: "invoice_details",
        //   // attributes: ['firstname', 'lastname', 'email'],
        // },

        {
          model: InvoiceDetailModel,
          as: "invoice_details",
          include: [
            {
              // model: itemModel,
              // as: "itemModel",
              model: itemLocationMaster,
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
          // attributes: ['firstname', 'lastname', 'email'],
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
      const invoicePdfFullPaths = festivalRes[i].invoice_pdf
        ? base_url +
          path.posix.join("uploads/invoices", festivalRes[i].invoice_pdf)
        : null;
      festivalRes[i].invoice_pdf = invoicePdfFullPaths;
    }
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

// this is working form the generate invoice function(directlly generate invoice)

const add = async (req, res, next) => {
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
    taxable_total,
    cgst_amount,
    sgst_amount,
    igst_amount,
    items,
    company_id,
    location_id,
    isNegStockAllowed,
  } = req.body;

  console.log("add invocie by the --------", req.body);

  const formatToday = () => new Date().toISOString().split("T")[0];

  // parseDecimal: treat "", null as 0
  const parseDecimal = (v) =>
    v === "" || v === null || typeof v === "undefined" ? 0 : parseFloat(v);

  const percentOrAbsolute = (value, base) => {
    // If value looks like a percent (0-100) treat as percent of base
    // Else treat as absolute (already an amount)
    const v = parseDecimal(value);
    if (v > 0 && v <= 100) return (base * v) / 100;
    return v; // absolute amount
  };

  const t = await db.sequelize.transaction();

  try {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for invoice.");
    }

    const total_qty = items.reduce(
      (sum, itm) => sum + parseFloat(itm.quantity || 0),
      0,
    );

    // -------------------------------
    // 1) PRE-VALIDATE ALL STOCK
    // -------------------------------
    for (const item of items) {
      const requiredQty = parseFloat(item.quantity || 0);

      const batches = await BatchModel.findAll({
        where: {
          item_id: item.item_id,
          company: company_id,
          location: location_id,
          current_in_stock: { [Op.gt]: 0 },
        },
        order: [["id", "ASC"]],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      const totalAvailable = batches.reduce(
        (s, b) => s + parseFloat(b.current_in_stock || 0),
        0,
      );

      // if (totalAvailable < requiredQty) {
      //   throw new Error(
      //     `Not enough stock for item ${item.item_id}. Required ${requiredQty}, Available ${totalAvailable}`
      //   );
      // }
      if (isNegStockAllowed != 1) {
        if (totalAvailable < requiredQty) {
          throw new Error(
            `Not enough stock for item ${item.item_id}. Required ${requiredQty}, Available ${totalAvailable}`,
          );
        }
      }
    }

    // -------------------------------
    // 2) CREATE INVOICE
    // -------------------------------
    const invoice_number = await codesettingGet("invoice");
    await codesettingupdate("invoice");

    const Invoice = await InvoiceModel.create(
      {
        order_id: id || null,
        customer_id,
        customer_lob,
        salesman_id,
        company_id,
        location_id,
        total_qty,
        customer_lpo,
        payment_term_id: payment_terms,
        invoice_date: delivery_date || formatToday(),
        invoice_number,
        invoice_due_date: due_date || formatToday(),
        total_discount_amount: discount,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        taxable_total,
        cgst_amount,
        sgst_amount,
        igst_amount,
        status,
        order_type,
        invoice_type: "Normal",
      },
      { transaction: t },
    );

    // -------------------------------
    // 3) PROCESS EACH ITEM (single invoice detail per item)
    // -------------------------------
    for (const item of items) {
      const soldQty = parseFloat(item.quantity || 0);
      let totalItemQtyPerItem = 0; // accumulate deducted batches

      // fetch and lock item_location_master row
      const item_stoke = await itemLocationMaster.findOne({
        where: { id: item.item_id, company_id, location_id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!item_stoke) {
        throw new Error(
          `Item location master not found for item ${item.item_id}`,
        );
      }

      // Update item_location_master aggregated fields
      const distributed_stock_final =
        parseFloat(item_stoke.distributed_stock || 0) + soldQty;
      const remaining_stock =
        parseFloat(item_stoke.stock || 0) - distributed_stock_final;

      await itemLocationMaster.update(
        {
          distributed_stock: distributed_stock_final,
          remaining_stock,
          updated_at: new Date(),
        },
        { where: { id: item_stoke.id }, transaction: t },
      );

      // FIFO batches for deduction
      let remainingQty = soldQty;
      const batches = await BatchModel.findAll({
        where: {
          item_id: item.item_id,
          company: company_id,
          location: location_id,
          current_in_stock: { [Op.gt]: 0 },
        },
        order: [["id", "ASC"]],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      // Process FIFO batches
      for (const batch of batches) {
        if (remainingQty <= 0) break;

        const batchStock = parseFloat(batch.current_in_stock || 0);
        const deductQty = Math.min(batchStock, remainingQty);

        await batch.update(
          { current_in_stock: batchStock - deductQty },
          { transaction: t },
        );

        remainingQty -= deductQty;
        totalItemQtyPerItem += deductQty; // accumulate qty

        // STOCK MOVEMENT (multiple rows)
        await StockMovement.create(
          {
            item_id: item.item_id,
            itemupc: item_stoke.itemupc || "",
            transaction_no: Invoice.invoice_number,
            transaction_type: "Sale",
            qty: deductQty,
            type: "OUT",
            warehouse_id: location_id,
            loc_id: location_id,
            comp_id: company_id,
            batch: batch.batch_number,
            qty_on_hand_previous: batchStock,
            qty_on_hand_new: batchStock - deductQty,
            date: delivery_date,
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t },
        );
      }

      // if (remainingQty > 0) {
      //   throw new Error(
      //     `Not enough stock for item ${item.item_id}. Missing ${remainingQty}`
      //   );
      // }
      if (remainingQty > 0) {
        if (isNegStockAllowed != 1) {
          throw new Error(
            `Not enough stock for item ${item.item_id}. Missing ${remainingQty}`,
          );
        }
      }

      // -------------------------------
      // Correct item-level financial calculations
      // -------------------------------
      const unit_price = parseDecimal(item.price); // price per unit
      const qty = parseDecimal(soldQty);

      // Discount handling:
      // - Percentage: item.discount is treated as percent (per-unit percent)
      // - Amount: item.discount is treated as total discount for the line (not per-unit)
      let unit_discount_amount = 0;
      let total_discount_amount = 0;
      const discountValue = parseDecimal(item.discount);
      const discountType = (item.discounttype || "").toLowerCase();

      if (discountType === "percentage") {
        unit_discount_amount = (unit_price * discountValue) / 100;
        total_discount_amount = unit_discount_amount * qty;
      } else if (discountType === "amount") {
        // treat discount value as total discount for the whole line
        total_discount_amount = discountValue;
        unit_discount_amount = qty > 0 ? total_discount_amount / qty : 0;
      } else {
        // fallback: if discount looks like percent (0-100) assume percent
        if (discountValue > 0 && discountValue <= 100) {
          unit_discount_amount = (unit_price * discountValue) / 100;
          total_discount_amount = unit_discount_amount * qty;
        } else {
          total_discount_amount = discountValue;
          unit_discount_amount = qty > 0 ? total_discount_amount / qty : 0;
        }
      }

      // Unit net after discount
      const unit_net = unit_price - unit_discount_amount;
      const total_net_amount = unit_net * qty;

      // VAT and Excise handling: if item.vat/item.excise are percentages (0-100) treat as percent of unit_net,
      // otherwise if they are absolute amounts treat as amount per unit.
      const itemVatRaw = parseDecimal(item.vat); // Could be percent or amount
      const itemExciseRaw = parseDecimal(item.excise); // Could be percent or amount

      const unit_vat_amount =
        itemVatRaw > 0 && itemVatRaw <= 100
          ? (unit_net * itemVatRaw) / 100
          : itemVatRaw; // absolute per unit if >100 or not percentage-like

      const total_vat_amount = unit_vat_amount * qty;

      const unit_excise_amount =
        itemExciseRaw > 0 && itemExciseRaw <= 100
          ? (unit_net * itemExciseRaw) / 100
          : itemExciseRaw;

      const total_excise_amount = unit_excise_amount * qty;
      // Per-item total (unit_net + unit taxes)
      const perItem_Total = unit_net + unit_vat_amount + unit_excise_amount;
      // Grand total for this invoice detail line
      const item_grand_total =
        total_net_amount + total_vat_amount + total_excise_amount;

      // CGST/SGST/IGST: handle similarly if present (allow either percent or amounts)
      const cgst = parseDecimal(item.cgst);
      const sgst = parseDecimal(item.sgst);
      const igst = parseDecimal(item.igst);

      const cgst_amount =
        parseDecimal(item.cgst_amount) ||
        (cgst > 0 && cgst <= 100
          ? ((unit_net * cgst) / 100) * qty
          : parseDecimal(item.cgst_amount || 0));
      const sgst_amount =
        parseDecimal(item.sgst_amount) ||
        (sgst > 0 && sgst <= 100
          ? ((unit_net * sgst) / 100) * qty
          : parseDecimal(item.sgst_amount || 0));
      const igst_amount =
        parseDecimal(item.igst_amount) ||
        (igst > 0 && igst <= 100
          ? ((unit_net * igst) / 100) * qty
          : parseDecimal(item.igst_amount || 0));

      // Normal behavior
      let final_item_qty = totalItemQtyPerItem;
      let final_ship_qty = totalItemQtyPerItem;
      let final_required_qty = parseDecimal(item.required_qty) || soldQty;
      console.log("final_item_qty------------", final_item_qty);
      console.log("final_ship_qty------------", final_ship_qty);
      console.log("final_required_qty------------", final_required_qty);

      // Negative stock handling
      if (isNegStockAllowed == 1) {
        final_item_qty = soldQty; // full sold qty
        final_ship_qty = totalItemQtyPerItem; // actual stock deducted
        final_required_qty = totalItemQtyPerItem - soldQty; // will become negative
      }

      // Create one invoice detail row per item (aggregate across batches)
      await InvoiceDetailModel.create(
        {
          invoice_id: Invoice.id,
          item_id: item.item_id,
          item_location_id: item_stoke.id,
          // item_qty: totalItemQtyPerItem, // quantity deducted from stock (should equal soldQty)
          // ship_quantity: totalItemQtyPerItem,
          //           required_qty: parseDecimal(item.required_qty) || 0,

          item_qty: final_item_qty,
          ship_quantity: final_ship_qty,
          required_qty: final_required_qty,

          batch_number: "-", // merged batches
          item_price: unit_price,
          item_gross: unit_price, // gross per unit before discount
          item_discount_amount: item.discount, // total discount for line
          // item_discount_amount: total_discount_amount, // total discount for line
          discounttype: item.discounttype || "",
          item_net: total_net_amount, // total net for the line (after discount, before tax)
          item_vat: total_vat_amount,
          item_excise: total_excise_amount,
          perItem_Total,
          item_grand_total, // total_net + total taxes (VAT/Excise)
          cgst: cgst,
          cgst_amount: cgst_amount,
          sgst: sgst,
          sgst_amount: sgst_amount,
          igst: igst,
          igst_amount: igst_amount,
          expiry_delivery_date: item.expiry_delivery_date,
          hsn_code: item.hsn_code,
          rate: unit_price,
          ptr_di: parseDecimal(item.ptr_di) || 0,
          taxa_ble: parseDecimal(item.taxa_ble) || 0,
          receiving_site: item.receiving_site || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction: t },
      );
    }

    await t.commit();

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully Invoice Created and Stock Updated",
          "",
          Invoice,
        ),
      );
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message || String(error),
        ),
      );
  }
};

// This is working as generate invocie for the Order page

const store = async (req, res, next) => {
  // Destructure request body
  const {
    id,
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
    status,
    order_type,
    taxable_total,
    cgst_amount,
    sgst_amount,
    igst_amount,
    items,
    company_id,
    location_id,
    any_comment,
    customer_address_id,
  } = req.body;

  console.log("req.body---------------", req.body);

  // helper parsers
  const parseDecimal = (val) =>
    val === "" || val === null || typeof val === "undefined" ? 0 : Number(val);

  // Begin transaction
  const t = await db.sequelize.transaction();

  try {
    // Basic validations
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for invoice.");
    }

    // -------------------------------
    // 1) PRE-VALIDATE STOCK FOR ALL ITEMS (using FIFO totals)
    // -------------------------------
    for (const item of items) {
      const requiredQty = parseFloat(item.quantity || 0);
      if (isNaN(requiredQty) || requiredQty <= 0) {
        throw new Error(`Invalid quantity for item ${item.item_id}.`);
      }

      // Fetch all batches with stock > 0 (FIFO order)
      const batches = await BatchModel.findAll({
        where: {
          item_id: item.item_id,
          company: company_id,
          location: location_id,
          current_in_stock: { [Op.gt]: 0 },
        },
        order: [["id", "ASC"]],
        transaction: t,
        lock: t.LOCK.UPDATE, // lock selected rows for update to avoid race conditions
      });

      if (!batches || batches.length === 0) {
        throw new Error(
          `No stock available for item ${item.item_id} in company ${company_id}, location ${location_id}`,
        );
      }

      // Sum up total available in batches
      const totalAvailable = batches.reduce(
        (sum, b) => sum + parseFloat(b.current_in_stock || 0),
        0,
      );

      if (totalAvailable < requiredQty) {
        throw new Error(
          `Not enough stock for item ${item.item_id}. Required: ${requiredQty}, Available: ${totalAvailable}`,
        );
      }
    }

    // -------------------------------
    // 2) ALL ITEMS VALIDATED - CREATE INVOICE (inside transaction)
    // -------------------------------

    // Generate invoice number (your helper)
    const getinvoiceNumber = await codesettingGet("invoice");
    // Update codesetting (counter) - keep as you had it
    await codesettingupdate("invoice");

    // Calculate total_qty from items (ensure numeric)
    const total_qty = items.reduce(
      (sum, itm) => sum + parseFloat(itm.quantity || 0),
      0,
    );

    // Create invoice (initial values, we'll update totals after details)
    const Invoice = await InvoiceModel.create(
      {
        order_id: id,
        customer_id,
        customer_lob,
        salesman_id,
        company_id,
        location_id,
        customer_lpo,
        payment_term_id: payment_terms,
        invoice_date: delivery_date || "",
        invoice_number: getinvoiceNumber,
        invoice_due_date: due_date || "",
        total_discount_amount: discount || 0,
        total_net: net || 0,
        total_vat: vat || 0,
        total_excise: excise || 0,
        grand_total: total || 0,
        taxable_total: taxable_total || 0,
        cgst_amount: cgst_amount || 0,
        sgst_amount: sgst_amount || 0,
        igst_amount: igst_amount || 0,
        status,
        order_type,
        invoice_type: "Order",
        current_stage_comment: any_comment,
        total_qty: total_qty,
        deliver_address_id: customer_address_id,
      },
      { transaction: t },
    );

    // Optionally fetch order details (if needed)
    const detail = await OrderModel.findOne({
      include: [{ model: OrderDetailModel, as: "order_details" }],
      where: { id: id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // -------------------------------
    // 3) DEDUCT STOCK (FIFO) & CREATE INVOICE DETAILS + STOCK MOVEMENTS
    // -------------------------------

    // Accumulators to recompute invoice totals on server-side
    let accum_total_net = 0; // sum of item_net (line totals after discount, before tax)
    let accum_total_vat = 0;
    let accum_total_excise = 0;
    let accum_total_discount = 0;
    let accum_grand_total = 0;
    let accum_total_qty = 0;

    for (const item of items) {
      const is_free = (item.skim || "").toLowerCase() === "free" ? 1 : 0;

      // Fetch item location master (and lock for update)
      const item_stock = await itemLocationMaster.findOne({
        where: {
          id: item.item_id,
          company_id,
          location_id,
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!item_stock) {
        throw new Error(
          `Item ${item.item_id} not found in item_location_master for company ${company_id}, location ${location_id}`,
        );
      }

      // distributed_stock logic (existing)
      const oldDistributedStock = parseInt(
        item_stock.distributed_stock || 0,
        10,
      );
      const soldQty = parseFloat(item.quantity || 0);
      const distributed_stock_final = oldDistributedStock + soldQty;
      const remaining_stock =
        parseInt(item_stock.stock || 0, 10) - distributed_stock_final;

      // Update distributed_stock & remaining_stock in item location master
      await itemLocationMaster.update(
        {
          distributed_stock: distributed_stock_final,
          remaining_stock: remaining_stock,
          updated_at: new Date(),
        },
        { where: { id: item_stock.id }, transaction: t },
      );

      // uom data if present
      let uomData = null;
      if (item_stock.itmuom) {
        uomData = await itemUomModel.findOne({
          where: { id: item_stock.itmuom },
          transaction: t,
        });
      }

      // Remaining quantity to deduct from batches
      let remainingQty = parseFloat(item.quantity || 0);

      // NEW: collect total qty for invoice detail (single row)
      let totalQtyForItem = 0;

      // Fetch FIFO batches again (locked) for deduction
      const batchesForDeduct = await BatchModel.findAll({
        where: {
          item_id: item.item_id,
          company: company_id,
          location: location_id,
          current_in_stock: { [Op.gt]: 0 },
        },
        order: [["id", "ASC"]],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!batchesForDeduct || batchesForDeduct.length === 0) {
        // Defensive check; should not happen due to pre-check, but safe
        throw new Error(
          `No stock available for item ${item.item_id} in company ${company_id}, location ${location_id}`,
        );
      }

      for (const batch of batchesForDeduct) {
        if (remainingQty <= 0) break;

        const batchStock = parseFloat(batch.current_in_stock || 0);
        if (!batchStock || batchStock <= 0) continue;

        const deductQty = Math.min(batchStock, remainingQty);

        // Update batch's current_in_stock
        await batch.update(
          { current_in_stock: batchStock - deductQty },
          { transaction: t },
        );

        remainingQty -= deductQty;

        // Accumulate total quantity for single invoice detail row
        totalQtyForItem += deductQty;

        // Create StockMovement record for this deduction (unchanged — per batch)
        await StockMovement.create(
          {
            item_id: item.item_id,
            itemupc: item_stock?.itemupc || "",
            transaction_no: Invoice.invoice_number,
            transaction_type: "Sale",
            qty: deductQty,
            type: "OUT",
            warehouse_id: location_id,
            loc_id: location_id,
            comp_id: company_id,
            batch: batch.batch_number,
            expirydate: item.expiry_delivery_date || "",
            stock_desc: `Sale invoice ${Invoice.invoice_number}, Batch ${batch.batch_number}`,
            qty_on_hand_previous: batchStock,
            qty_on_hand_new: batchStock - deductQty,
            average_cost_previous: item_stock.purchase_cost_per_unit || 0,
            average_cost_new: item_stock.purchase_cost_per_unit || 0,
            date: delivery_date,
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t },
        );
      } // end batches loop

      // After all batches processed, if still remainingQty > 0 -> error
      if (remainingQty > 0) {
        throw new Error(
          `Not enough stock for "${item.item_id}". Missing ${remainingQty}.`,
        );
      }

      const unit_price = parseDecimal(item.price); // per unit price
      const qty = parseFloat(totalQtyForItem || 0);
      const rawDiscount = parseDecimal(item.discount);
      const discountType = (item.discounttype || "").toString().toLowerCase();
      let total_discount_amount = 0;
      let unit_discount_amount = 0;

      if (discountType === "percentage") {
        unit_discount_amount = (unit_price * rawDiscount) / 100;
        total_discount_amount = unit_discount_amount * qty;
      } else if (discountType === "amount") {
        // treat rawDiscount as total discount for the line (client already sent it that way in samples)
        total_discount_amount = rawDiscount;
        unit_discount_amount = qty > 0 ? total_discount_amount / qty : 0;
      } else {
        // Fallback: if provided item.net equals unit_net*qty then rawDiscount may have been normalized already.
        // Default safe behavior: treat rawDiscount as total discount for the line
        total_discount_amount = rawDiscount;
        unit_discount_amount = qty > 0 ? total_discount_amount / qty : 0;
      }
      const client_item_net = parseDecimal(item.net); // could be line total or unit net

      // Heuristic: if client_item_net is roughly equal to unit_price*qty - total_discount_amount OR greater than unit_price, treat as line net
      const computed_unit_net = unit_price - unit_discount_amount;
      const computed_line_net = computed_unit_net * qty;

      let item_net_line;
      if (client_item_net === 0 && computed_line_net !== 0) {
        item_net_line = computed_line_net;
      } else {
        // If client provided value is close to computed_line_net (within small epsilon) or larger than unit_price, trust client
        if (
          Math.abs(client_item_net - computed_line_net) <=
            Math.max(0.01, computed_line_net * 0.001) ||
          client_item_net > unit_price
        ) {
          item_net_line = client_item_net;
        } else {
          // fallback to computed value
          item_net_line = computed_line_net;
        }
      }

      // Taxes: support percentage (0-100) or absolute per unit amounts (rare)
      const rawVat = parseDecimal(item.vat);
      const rawExcise = parseDecimal(item.excise);

      // If vat looks like percent (0-100), compute on unit_net
      const unit_vat_amount =
        rawVat > 0 && rawVat <= 100
          ? (computed_unit_net * rawVat) / 100
          : rawVat;
      const total_vat_amount = unit_vat_amount * qty;

      const unit_excise_amount =
        rawExcise > 0 && rawExcise <= 100
          ? (computed_unit_net * rawExcise) / 100
          : rawExcise;
      const total_excise_amount = unit_excise_amount * qty;

      // CGST/SGST/IGST amounts: if client provided amounts use them; else compute if percentage-like provided
      const cgstPercent = parseDecimal(item.cgst);
      const sgstPercent = parseDecimal(item.sgst);
      const igstPercent = parseDecimal(item.igst);

      const cgst_amount =
        parseDecimal(item.cgst_amount) ||
        (cgstPercent > 0 && cgstPercent <= 100
          ? ((computed_unit_net * cgstPercent) / 100) * qty
          : 0);
      const sgst_amount =
        parseDecimal(item.sgst_amount) ||
        (sgstPercent > 0 && sgstPercent <= 100
          ? ((computed_unit_net * sgstPercent) / 100) * qty
          : 0);
      const igst_amount =
        parseDecimal(item.igst_amount) ||
        (igstPercent > 0 && igstPercent <= 100
          ? ((computed_unit_net * igstPercent) / 100) * qty
          : 0);

      // perItem_Total: net per unit + taxes per unit
      const perItem_Total =
        computed_unit_net + unit_vat_amount + unit_excise_amount;

      // item_grand_total = item_net_line + taxes (we prefer computed taxes but allow client-provided vat/excise)
      const item_grand_total =
        item_net_line +
        total_vat_amount +
        total_excise_amount +
        cgst_amount +
        sgst_amount +
        igst_amount;

      // Update accumulators
      accum_total_net += item_net_line;
      accum_total_vat += total_vat_amount;
      accum_total_excise += total_excise_amount;
      accum_total_discount += total_discount_amount;
      accum_grand_total += item_grand_total;
      accum_total_qty += qty;

      // -----------------------------------------------
      // CREATE ONLY ONE INVOICE DETAIL FOR THE ITEM
      // -----------------------------------------------
      await InvoiceDetailModel.create(
        {
          invoice_id: Invoice.id,
          item_id: item.item_id,
          item_location_id: item_stock.id,
          item_qty: totalQtyForItem,
          ship_quantity: totalQtyForItem,
          batch_number: "Mixed", // or null, or set to first batch.batch_number if you prefer
          item_price: unit_price,
          item_gross: unit_price,
          item_discount_amount: item.discount,
          // item_discount_amount: total_discount_amount,
          discounttype: item.discounttype,
          item_net: item_net_line,
          item_vat: total_vat_amount,
          item_excise: total_excise_amount,
          perItem_Total,
          item_grand_total: item_grand_total,
          cgst: cgstPercent,
          cgst_amount,
          sgst: sgstPercent,
          sgst_amount,
          igst: igstPercent,
          igst_amount,
          expiry_delivery_date: item.expiry_delivery_date,
          hsn_code: item.hsn_code,
          rate: unit_price,
          ptr_di: parseDecimal(item.ptr_di) || 0,
          taxa_ble: parseDecimal(item.taxa_ble) || 0,
          required_qty: parseDecimal(item.required_qty) || 0,
          receiving_site: item.receiving_site || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction: t },
      );

      // ---------------------------------------------
      // UPDATE ORDER DETAILS delivered_qty + open_qty
      // ---------------------------------------------
      const orderDetail = await OrderDetailModel.findOne({
        where: { order_id: id, item_id: item.item_id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!orderDetail) {
        throw new Error(`Order detail not found for item ${item.item_id}`);
      }

      const prevDelivered = parseFloat(orderDetail.delivered_qty || 0);
      const newDelivered = prevDelivered + parseFloat(item.quantity);

      await orderDetail.update(
        {
          delivered_qty: newDelivered,
          open_qty: parseFloat(orderDetail.item_qty) - newDelivered,
        },
        { transaction: t },
      );

      // Optional: Create Inventory Movement
      await InventoryMovementModel.create(
        {
          item_id: item.item_id,
          tranno: Invoice.id,
          trantype: "Invoice",
          trandate: delivery_date,
          tranqty: soldQty,
          trancstock: remaining_stock,
          created_at: new Date(),
          updated_at: new Date(),
        },
        { transaction: t },
      );
    } // end items loop

    // ----------------------------------------------------------
    // UPDATE ORDER open_qty & payment_status
    // ----------------------------------------------------------
    const allOrderDetails = await OrderDetailModel.findAll({
      where: { order_id: id },
      transaction: t,
    });

    let totalDelivered = 0;
    let totalItemQty = 0;

    for (const od of allOrderDetails) {
      totalDelivered += parseFloat(od.delivered_qty || 0);
      totalItemQty += parseFloat(od.item_qty || 0);
    }

    const newOpenQty = totalItemQty - totalDelivered;

    let paymentStatus = "Partially Rcvd";
    if (newOpenQty <= 0) paymentStatus = "Completed";

    await OrderModel.update(
      {
        open_qty: newOpenQty,
        payment_status: paymentStatus,
      },
      { where: { id: id }, transaction: t },
    );

    // -------------------------------
    // 4) UPDATE ORDER STATUS (inside transaction)
    // -------------------------------
    await OrderModel.update(
      {
        status: newOpenQty <= 0 ? "Close" : "Open",
      },
      { where: { id: id }, transaction: t },
    );

    // -------------------------------
    // 5) RECOMPUTE & PERSIST INVOICE SUMMARY (server-truth)
    // -------------------------------
    await Invoice.update(
      {
        total_discount_amount: accum_total_discount,
        total_net: accum_total_net,
        total_vat: accum_total_vat,
        total_excise: accum_total_excise,
        grand_total: accum_grand_total,
        taxable_total: accum_total_net, // or whatever taxable logic you prefer
        total_qty: accum_total_qty,
      },
      { where: { id: Invoice.id }, transaction: t },
    );

    // Commit transaction
    await t.commit();

    // Reload invoice to return updated values
    const updatedInvoice = await InvoiceModel.findOne({
      where: { id: Invoice.id },
    });

    // Respond success
    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully Invoice Created and Distributed Stock Updated",
          "",
          updatedInvoice,
        ),
      );
  } catch (error) {
    // ---------------------------------------
    // ANY ERROR -> ROLLBACK TRANSACTION & RETURN ERROR
    // ---------------------------------------
    try {
      await t.rollback();
    } catch (rbErr) {
      console.error("Transaction rollback failed:", rbErr);
    }

    console.error("Invoice creation error:", error);

    return res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message || String(error),
        ),
      );
  }
}; // backend/controller/invoice.js

const getNextInvoiceNumber1 = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
    const dateStr = `${year}${month}`; // YYYYMM

    // Start and end of current month
    const monthStart = new Date(year, today.getMonth(), 1);
    const monthEnd = new Date(year, today.getMonth() + 1, 0, 23, 59, 59, 999);

    const countInvoices = await InvoiceModel.count({
      where: {
        created_at: {
          [Op.between]: [monthStart, monthEnd],
        },
        invoice_number: { [Op.like]: `POS-${dateStr}-%` },
      },
    });

    const nextNumber = 1001 + countInvoices;
    const nextInvoiceNumber = `POS-${dateStr}-${nextNumber}`;

    res.status(200).json({
      success: true,
      invoice_number: nextInvoiceNumber,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice number",
    });
  }
};
// backend/controller/invoice.js invoice number not break if month chnage
//this is last working
const getNextInvoiceNumber2 = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const dateStr = `${year}${month}`; // YYYYMM

    // 🔑 Get LAST invoice (not monthly)
    const lastInvoice = await InvoiceModel.findOne({
      where: {
        invoice_number: {
          [Op.like]: "POS-%",
        },
      },
      order: [["id", "DESC"]], // IMPORTANT
    });

    let nextNumber = 1001;

    if (lastInvoice?.invoice_number) {
      const parts = lastInvoice.invoice_number.split("-");
      const lastSeq = parseInt(parts[2], 10);

      if (!isNaN(lastSeq)) {
        nextNumber = lastSeq + 1;
      }
    }

    const nextInvoiceNumber = `POS-${dateStr}-${nextNumber}`;

    res.status(200).json({
      success: true,
      invoice_number: nextInvoiceNumber,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice number",
    });
  }
};

const generateNextInvoiceNumber = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const dateStr = `${year}${month}`;

  const lastInvoice = await InvoiceModel.findOne({
    where: {
      invoice_number: {
        [Op.like]: "POS-%",
      },
    },
    order: [["id", "DESC"]],
  });

  let nextNumber = 1001;

  if (lastInvoice?.invoice_number) {
    const parts = lastInvoice.invoice_number.split("-");
    const lastSeq = parseInt(parts[2], 10);

    if (!isNaN(lastSeq)) {
      nextNumber = lastSeq + 1;
    }
  }

  return `POS-${dateStr}-${nextNumber}`;
};
const getNextInvoiceNumber = async (req, res) => {
  try {
    const invoice_number = await generateNextInvoiceNumber();

    res.status(200).json({
      success: true,
      invoice_number,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice number",
    });
  }
};

//

const getMultipleItemsStock = async ({
  item_ids = [],
  company_id,
  location_id,
}) => {
  try {
    if (!Array.isArray(item_ids) || item_ids.length === 0) {
      throw new Error("item_ids must be a non-empty array");
    }

    const stocks = await BatchModel.findAll({
      attributes: [
        "item_id",
        [fn("SUM", col("current_in_stock")), "total_stock"],
      ],
      where: {
        item_id: {
          [Op.in]: item_ids,
        },
        company: company_id,
        location: location_id,
      },
      group: ["item_id"],
      raw: true,
    });

    // Convert to easy object format
    const stockMap = {};

    item_ids.forEach((id) => {
      stockMap[id] = 0; // default 0 if no batch found
    });

    stocks.forEach((row) => {
      stockMap[row.item_id] = parseFloat(row.total_stock || 0);
    });

    return stockMap;
  } catch (error) {
    console.error("getMultipleItemsStock error:", error);
    throw error;
  }
};

// this resuable function that ise use for in reposne of the invice in sales,return,exchnage
const getInvoiceWithDetails = async ({ id, invoice_number }) => {
  const whereCondition = {};

  if (id) {
    whereCondition.id = id;
  } else if (invoice_number) {
    whereCondition.invoice_number = invoice_number;
  }

  return await InvoiceModel.findOne({
    where: whereCondition,
    include: [
      {
        model: UserModel,
        as: "salesman",
        attributes: ["firstname", "lastname", "email", "mobile"],
        include: [
          {
            model: SalesmanInfo,
            as: "salesmanInfo",
            attributes: ["salesman_code"],
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
              "customer_address_1",
              "customer_address_2",
              "msme_no",
              "fssai_no",
              "state_code",
            ],
          },
          {
            model: countryMastersModel,
            as: "country",
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: InvoiceDetailModel,
        as: "invoice_details",
        include: [
          {
            model: itemLocationMaster,
            as: "itemLocationModel",
            include: [
              {
                model: TaxMasterModel,
                as: "tax_master_1",
              },
            ],
          },
        ],
      },
      {
        model: paymentTermsModel,
        as: "payment_terms",
      },
      {
        model: PaymentMethod,
        as: "payment_method_details",
      },
    ],
  });
};

// this is work on POS handle Save

const invoice_insert = async (req, res, next) => {
  console.log("re.body from the insert is --------", req.body);

  const {
    customer_id,
    salesman_id,
    bank_name,
    type,
    discountAmount,
    discountType,
    Payment_Method,
    paidAmount,
    invoice_number,
    updatePrevInvoice,
    total_qty,
    vat,
    net,
    total,
    total_gross,
    payment_terms,
  } = req.body;

  console.log("re.body from the item save", req.body);

  const t = await db.sequelize.transaction(); // 👈 MOVE HERE
  try {
    // ================= PARSE INPUT =================
    let selectedItems = req.body.selectedItems;
    let paymentDetails = req.body.PaymentDetails;

    if (typeof selectedItems === "string") {
      selectedItems = JSON.parse(selectedItems);
    }
    if (!Array.isArray(selectedItems)) selectedItems = [];

    if (typeof paymentDetails === "string") {
      paymentDetails = JSON.parse(paymentDetails);
    }
    if (!Array.isArray(paymentDetails)) paymentDetails = [];
    const finalInvoiceNumber = await generateNextInvoiceNumber();
    while (
      await InvoiceModel.findOne({
        where: { invoice_number: finalInvoiceNumber },
      })
    ) {
      numberPart++;
      finalInvoiceNumber = `${prefix}${numberPart}`;
    }

    // ================= SALE / RETURN =================
    const isReturn = payment_terms == 2 || type === "Return";
    const invoice_type = isReturn ? "Return" : "Default";
    const invoice_type_id = isReturn ? 2 : 1;
    const payment_term_id = isReturn ? 2 : 1;
    let Invoice;
    // Pre-calc totals (these are used as fallback; will be corrected for sale path)
    let totalQty = 0,
      totalVat = 0,
      totalNet = 0,
      grandTotal = 0,
      totalGross = 0;

    for (const item of selectedItems) {
      const qty = parseFloat(item.quantity ?? item.item_qty ?? item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      const netPerUnit = parseFloat(item.net) || price;
      const vatPerUnit = (netPerUnit * (item.vat || 0)) / 100;
      const itemTotal = (netPerUnit + vatPerUnit) * qty;

      totalQty += qty;
      totalNet += netPerUnit * qty;
      totalVat += vatPerUnit * qty;
      grandTotal += itemTotal;
      totalGross += price * qty;
    }

    if (isReturn) {
      let return_total_qty = 0;
      let return_total_net = 0;
      let return_total_vat = 0;
      let return_grand_total = 0;
      let return_total_gross = 0;

      // Return flow (unchanged)
      Invoice = await InvoiceModel.create(
        {
          customer_id,
          salesman_id,
          // invoice_number,
          invoice_number: finalInvoiceNumber, // ✅ FIXED
          invoice_type,
          invoice_type_id,
          payment_term_id,
          total_discounttype: discountType,
          total_discount_amount: discountAmount,
          bank_name,
          type,
          total_qty: return_total_qty,
          total_net: return_total_net,
          total_vat: return_total_vat,
          total_gross: return_total_gross,
          grand_total: return_grand_total,
          ret_bal_qty: totalQty,
          ret_exc_qty: 0,
          ret_exc_status: 2,
          company_id: req.body.cashier_comp_id,
          location_id: req.body.cashier_loc_id,
          exchange_number: updatePrevInvoice,
        },
        { transaction: t },
      );

      const prevInvoice = await InvoiceModel.findOne({
        where: { invoice_number: updatePrevInvoice },
      });
      if (!prevInvoice) throw new Error("Original invoice not found");

      for (const item of selectedItems) {
        let remainingQty = parseFloat(item.quantity || item.item_qty || 0);
        if (!remainingQty) continue;

        // --- Fetch original batches ---
        const originalBatches = await InvoiceDetailModel.findAll({
          where: { invoice_id: prevInvoice.id, item_id: item.item_id },
          order: [["id", "ASC"]],
        });

        let totalReturnedQty = 0;

        // ✅ FIRST: fetch itemLoc
        const itemLoc = await itemLocationMaster.findOne({
          where: {
            company_id: req.body.cashier_comp_id,
            location_id: req.body.cashier_loc_id,
            item_name: item.item_name,
          },
          transaction: t,
        });

        if (!itemLoc) {
          throw new Error(`Item location not found for ${item.item_name}`);
        }

        const qtyOnHandBefore =
          parseFloat(itemLoc.remaining_stock ?? itemLoc.stock) || 0;

        let runningQty = qtyOnHandBefore;

        for (const origBatch of originalBatches) {
          if (remainingQty <= 0) break;

          const batchQty = parseFloat(origBatch.item_qty || 0);
          const prevRetExcQty = parseFloat(origBatch.ret_exc_qty) || 0;
          const itemQty = batchQty;
          const returnQty = Math.min(itemQty - prevRetExcQty, remainingQty);
          if (returnQty <= 0) continue;
          totalReturnedQty += returnQty; // ✅ ADD THIS

          // Update original InvoiceDetail
          const newRetExcQty = prevRetExcQty + returnQty;
          const newRetBalQty = itemQty - newRetExcQty;
          const netPerUnit = parseFloat(origBatch.item_net) || 0;
          const vatPerUnit = parseFloat(origBatch.item_vat) || 0;
          const updatedItemGrandTotal =
            (netPerUnit + vatPerUnit) * newRetBalQty;

          await origBatch.update(
            {
              ret_exc_qty: newRetExcQty,
              ret_bal_qty: newRetBalQty,
              ret_exc_status: newRetBalQty > 0 ? 2 : 3,
              item_grand_total: updatedItemGrandTotal,
            },
            { transaction: t },
          );

          // Update batch stock
          const batch = await BatchModel.findOne({
            where: {
              batch_number: origBatch.batch_number,
              item_id: item.item_id,
              company: req.body.cashier_comp_id,
              location: req.body.cashier_loc_id,
            },
          });
          if (batch) {
            batch.current_in_stock =
              (parseFloat(batch.current_in_stock) || 0) + returnQty;
            await batch.save({ transaction: t });
          }
          const origQty = parseFloat(origBatch.item_qty) || 1;
          // Net per unit
          const unitNet = (parseFloat(origBatch.item_net) || 0) / origQty;
          // Per-item grand (net + vat)
          const unitGrand = parseFloat(origBatch.perItem_Total) || 0;
          // VAT per unit = grand − net
          const unitVat = unitGrand - unitNet;
          // Returned line values
          const lineNet = unitNet * returnQty;
          const lineVat = unitVat * returnQty;
          const lineGross =
            parseFloat(origBatch.item_gross || unitNet) * returnQty;
          const lineGrand = lineNet + lineVat;

          // ✅ ACCUMULATE RETURN TOTALS
          return_total_qty += returnQty;
          return_total_net += lineNet;
          return_total_vat += lineVat;
          return_total_gross += lineGross;
          return_grand_total += lineGrand;
          const unitDocDiscount =
            (parseFloat(origBatch.doc_discount) || 0) / origQty;

          const unitDiscount =
            (parseFloat(origBatch.item_discount_amount) || 0) / origQty;

          const returnDiscount = unitDiscount * returnQty;

          await InvoiceDetailModel.create(
            {
              invoice_id: Invoice.id,
              item_id: origBatch.item_id,
              item_salesman_id: origBatch.item_salesman_id,
              item_uom_id: origBatch.item_uom_id,
              item_qty: returnQty,
              ret_bal_qty: returnQty,
              ret_exc_qty: 0,
              ret_exc_status: 2,
              act_inv_ref: updatePrevInvoice,
              item_price: origBatch.item_price,
              item_gross: origBatch.item_gross,
              discounttype: origBatch.discounttype,
              item_discount_amount: returnDiscount,
              doc_discount: unitDocDiscount * returnQty,
              landed_cost_per_unit: "",
              rate: origBatch.rate,
              item_net: unitNet * returnQty,
              item_vat: origBatch.item_vat,
              item_excise: origBatch.item_excise,
              taxa_ble: origBatch.taxa_ble,
              // ---- TOTALS ----
              perItem_Total: origBatch.perItem_Total,
              item_grand_total:
                (parseFloat(origBatch.perItem_Total) || 0) * returnQty,
              batch_number: origBatch.batch_number,
              landed_cost_per_unit: origBatch.itemlanprice || 0,

              created_at: new Date(),
              updated_at: new Date(),
            },
            { transaction: t },
          );

          remainingQty -= returnQty;

          // Stock Movement
          await StockMovement.create(
            {
              uuid: uuidv4(),
              transaction_no: Invoice.invoice_number,
              transaction_type: "Return",
              qty: totalReturnedQty,
              type: "IN",
              item_id: item.item_id,
              itemupc: itemLoc?.itemupc,
              batch: origBatch.batch_number,
              warehouse_id: req.body.cashier_loc_id,
              loc_id: req.body.cashier_loc_id,
              comp_id: req.body.cashier_comp_id,
              qty_on_hand_previous: runningQty,
              qty_on_hand_new: runningQty + totalReturnedQty,
              stock_desc: `Return invoice ${Invoice.invoice_number} for ${item.item_name}`,
              date: new Date(),
            },
            { transaction: t },
          );
        }

        if (remainingQty > 0) {
          return res.status(400).json({
            status: false,
            message: `Return qty exceeds original sale for ${item.item_name}`,
          });
        }

        const returnQty = totalReturnedQty;

        const newDistributed =
          (parseFloat(itemLoc.distributed_stock) || 0) - returnQty;

        const newRemaining =
          (parseFloat(itemLoc.remaining_stock ?? itemLoc.stock) || 0) +
          returnQty;

        await itemLoc.update(
          {
            distributed_stock: newDistributed,
            remaining_stock: newRemaining,
          },
          { transaction: t },
        );

        // let runningQty = qtyOnHandBefore;
      }

      // ✅ UPDATE RETURN INVOICE HEADER TOTALS (FINAL STEP)
      await Invoice.update(
        {
          total_qty: return_total_qty,
          total_net: return_total_net,
          total_vat: return_total_vat,
          total_gross: return_total_gross,
          grand_total: return_grand_total,
        },
        { transaction: t },
      );

      // ================= PAYMENTS IN RETURN =================
      console.log("PAYMENT DETAILS RECEIVED:", paymentDetails);

      // ================= PAYMENTS IN RETURN =================
      if (paymentDetails.length) {
        // 🔥 Calculate real total from details
        const totalRefund = paymentDetails.reduce(
          (sum, p) => sum + Number(p.amount || 0),
          0,
        );

        const collection = await PaymentCollection.create({
          customer_id: req.body.customer_id,
          salesman_id: req.body.salesman_id,
          invoice_id: Invoice.id,
          payment_mode: null, // header shouldn't rely on single method
          total: totalRefund, // ✅ correct
          total_payment_amount: totalRefund,
          invoice_amount: return_grand_total, // optional but better
          accounting_date: new Date(),
          bank_name: req.body.bank_name,
          type: "Return",
          collection_status: "Completed",
          company_id: req.body.cashier_comp_id,
          location_id: req.body.cashier_loc_id,
        });

        for (const p of paymentDetails) {
          await PaymentMethod.create({
            collection_id: collection.id,
            payment_mode: p.method,
            amount: Number(p.amount),
            status: "success",
            invoice_id: Invoice.id,
            register_tbl_hdr_id: req.body.registerID,
            // ✅ ADD THESE
            card_type: p.cardType || null,
            auth_code: p.authCode || null,
          });
        }
      }
    } else {
      // ================= SALE FLOW =================

      Invoice = await InvoiceModel.create(
        {
          customer_id: req.body.customer_id,
          salesman_id: req.body.salesman_id,
          invoice_number: finalInvoiceNumber,
          invoice_type: "Default",
          invoice_type_id: 1,
          payment_term_id: 1,
          type: req.body.type,
          bank_name: req.body.bank_name,
          total_discounttype: req.body.discountType,
          total_discount_amount: req.body.discountAmount,
          total_vat: 0,
          total_net: 0,
          grand_total: 0,
          total_gross: 0,
          total_qty: 0,
          ret_bal_qty: 0,
          ret_exc_qty: 0,
          ret_exc_status: 1,
          register_tbl_hdr_id: req.body.registerID,
          company_id: req.body.cashier_comp_id,
          location_id: req.body.cashier_loc_id,
        },
        { transaction: t },
      );

      // ================= HEADER TOTALS =================
      let header_total_net = 0;
      let header_total_vat = 0;
      let header_grand_total = 0;
      let header_total_qty = 0;
      let header_total_gross = 0;
      //================================================
      // Get all item IDs from selected items
      const itemIds = selectedItems.map((i) => i.id);

      // Get stock for all items at once
      const stockMap = await getMultipleItemsStock({
        item_ids: itemIds,
        company_id: req.body.cashier_comp_id,
        location_id: req.body.cashier_loc_id,
      });

      console.log("stock map is ----------", stockMap);

      // ================= ITEM LOOP =================
      for (const item of selectedItems) {
        const qty = Number(item.qty || item.quantity || item.item_qty || 0);
        // if (!qty) continue;

        const availableStock = stockMap[item.id] || 0;

        if (qty > availableStock) {
          return res.status(400).json({
            status: false,
            message: `Not enough stock for ${item.itemName}. Available: ${availableStock}`,
          });
        }

        const unitPrice = Number(item.price || 0);
        const globalDiscountPercent = Number(req.body.discountPercent || 0);

        // -------- ITEM DISCOUNT --------
        let itemDiscountPerQty = 0;

        if (item.discountTypeItem === "Percentage") {
          itemDiscountPerQty =
            (unitPrice * Number(item.discountValueItem || 0)) / 100;
        } else if (item.discountTypeItem === "amount") {
          itemDiscountPerQty =
            qty > 0 ? Number(item.discountValueItem || 0) / qty : 0;
        }

        // -------- PRICE AFTER ITEM DISCOUNT --------
        const priceAfterItemDiscount = unitPrice - itemDiscountPerQty;

        // -------- GLOBAL DISCOUNT (APPLIED AFTER ITEM DISCOUNT) --------
        // const globalDiscountPerQty = Number(
        //   ((priceAfterItemDiscount * globalDiscountPercent) / 100).toFixed(2),
        // );

        const globalDiscountPerQty =
          (priceAfterItemDiscount * globalDiscountPercent) / 100;

        const globalDiscount = Number(
          (
            ((priceAfterItemDiscount * globalDiscountPercent) / 100) *
            qty
          ).toFixed(2),
        );

        // -------- FINAL NET --------
        const itemNet = priceAfterItemDiscount - globalDiscountPerQty;

        // -------- VAT --------
        const itemVAT = (itemNet * Number(item.item_tax || 0)) / 100;

        // -------- ROW TOTALS --------
        const rowNet = itemNet * qty;
        const rowVAT = itemVAT * qty;
        const rowGrand = (itemNet + itemVAT) * qty;

        // ================= UPDATE ITEM LOCATION MASTER (SALE) =================
        const itemLoc = await itemLocationMaster.findOne({
          where: {
            company_id: req.body.cashier_comp_id,
            location_id: req.body.cashier_loc_id,
            item_name: item.itemName, // or item.item_name (be consistent)
          },
        });

        const qtyOnHandBefore =
          parseFloat(itemLoc.remaining_stock ?? itemLoc.stock) || 0;
        let runningQty = qtyOnHandBefore; // ✅ create ONCE

        if (!itemLoc) {
          return res.status(400).json({
            status: false,
            message: `Item location not found for ${item.itemName}`,
          });
        }

        const soldQty = qty;

        const newDistributed =
          (parseFloat(itemLoc.distributed_stock) || 0) + soldQty;

        const newRemaining =
          (parseFloat(itemLoc.remaining_stock ?? itemLoc.stock) || 0) - soldQty;

        await itemLoc.update(
          {
            distributed_stock: newDistributed,
            remaining_stock: newRemaining,
          },
          { transaction: t },
        );

        //==================================================
        let remainingQty = qty;

        const batches = await BatchModel.findAll({
          where: {
            item_id: item.id,
            company: req.body.cashier_comp_id,
            location: req.body.cashier_loc_id,
            current_in_stock: { [Op.gt]: 0 },
          },
          order: [["id", "ASC"]],
        });

        let totalLandedCost = 0;

        for (const batch of batches) {
          if (remainingQty <= 0) break;
          const batchStock = parseFloat(batch.current_in_stock || 0);
          if (!batchStock) continue;
          const deductQty = Math.min(batchStock, remainingQty);
          // 🔻 Update batch
          await batch.update(
            {
              current_in_stock: batchStock - deductQty,
            },
            { transaction: t },
          );
          // ✅ STOCK MOVEMENT (FIFO-CORRECT)
          await StockMovement.create(
            {
              uuid: uuidv4(),
              date: new Date(),
              transaction_no: Invoice.invoice_number,
              transaction_type: "Sale",
              type: "OUT",
              qty: deductQty,
              item_id: item.id,
              itemupc: item.itemupc || null,
              batch: batch.batch_number,
              warehouse_id: req.body.cashier_loc_id,
              loc_id: req.body.cashier_loc_id,
              comp_id: req.body.cashier_comp_id,
              // ✅ FIXED
              qty_on_hand_previous: runningQty,
              qty_on_hand_new: runningQty - deductQty,

              stock_desc: `Sale invoice ${Invoice.invoice_number}`,
            },
            { transaction: t },
          );

          totalLandedCost += (batch.itemlanprice || 0) * deductQty;

          // ✅ MOVE RUNNING BALANCE
          runningQty -= deductQty;
          remainingQty -= deductQty;
        }

        const avgLandedCost = qty > 0 ? totalLandedCost / qty : 0;

        await InvoiceDetailModel.create(
          {
            invoice_id: Invoice.id,
            item_id: item.id,
            item_qty: qty,
            ret_bal_qty: qty,
            ret_exc_qty: 0,
            ret_exc_status: 1,

            item_price: unitPrice,
            item_gross: unitPrice,
            item_net: rowNet,
            item_vat: rowVAT,
            item_grand_total: rowGrand,

            rate: itemNet,
            perItem_Total: itemNet + itemVAT,
            discounttype: item.discountTypeItem,
            item_discount_amount: item.discountValueItem,
            // doc_discount: Number(globalDiscount.toFixed(1)),
            // doc_discount: globalDiscount,
            doc_discount: item.doc_discount,

            taxa_ble: item.item_tax,

            landed_cost_per_unit: avgLandedCost,

            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t },
        );

        if (remainingQty > 0) {
          return res.status(400).json({
            status: false,
            message: `Not enough stock for ${item.itemName}`,
          });
        }

        if (!itemLoc) {
          return res.status(400).json({
            status: false,
            message: `Item ${item.itemName} not found in stock`,
          });
        }

        // -------- HEADER AGGREGATION --------
        header_total_net += rowNet;
        header_total_vat += rowVAT;
        header_grand_total += rowGrand;
        header_total_qty += qty;
        header_total_gross += unitPrice * qty;
      }

      // ================= UPDATE HEADER =================
      await Invoice.update(
        {
          total_net: header_total_net,
          total_vat: header_total_vat,
          grand_total: header_grand_total,
          total_qty: header_total_qty,
          total_gross: header_total_gross,
        },
        { transaction: t },
      );

      // ================= PAYMENTS =================
      // if (paymentDetails.length) {
      //   const collection = await PaymentCollection.create({
      //     customer_id: req.body.customer_id,
      //     salesman_id: req.body.salesman_id,
      //     invoice_id: Invoice.id,
      //     payment_mode: req.body.Payment_Method,
      //     total: req.body.paidAmount,
      //     accounting_date: new Date(),
      //     bank_name: req.body.bank_name,
      //     type: req.body.type,
      //   });

      //   for (const p of paymentDetails) {
      //     await PaymentMethod.create({
      //       collection_id: collection.id,
      //       payment_mode: p.method,
      //       amount: p.amount,
      //       status: "success",
      //       invoice_id: Invoice.id,
      //       register_tbl_hdr_id: req.body.registerID,
      //     });
      //   }
      // }

      if (paymentDetails.length) {
        const invoiceTotal = header_grand_total;

        // Calculate total paid by customer
        const totalPaid = paymentDetails.reduce(
          (sum, p) => sum + Number(p.amount || 0),
          0,
        );

        let remainingToAllocate = invoiceTotal;

        const collection = await PaymentCollection.create({
          customer_id: req.body.customer_id,
          salesman_id: req.body.salesman_id,
          invoice_id: Invoice.id,
          payment_mode: null,
          total: invoiceTotal, // always store actual invoice total
          total_payment_amount: totalPaid, // 🔥 what customer gave
          accounting_date: new Date(),
          bank_name: req.body.bank_name,
          type: req.body.type,
        });

        for (const p of paymentDetails) {
          const paymentAmount = Number(p.amount || 0);

          if (remainingToAllocate > 0) {
            const usableAmount = Math.min(paymentAmount, remainingToAllocate);

            // Save only usable part
            await PaymentMethod.create({
              collection_id: collection.id,
              payment_mode: p.method,
              amount: usableAmount,
              status: "success",
              invoice_id: Invoice.id,
              register_tbl_hdr_id: req.body.registerID,
              // ✅ ADD THESE
              card_type: p.cardType || null,
              auth_code: p.authCode || null,
            });

            remainingToAllocate -= usableAmount;

            // If payment was larger → store extra as exchange
            if (paymentAmount > usableAmount) {
              const exchangeAmount = paymentAmount - usableAmount;

              await PaymentMethod.create({
                collection_id: collection.id,
                payment_mode: "Change Returned",
                amount: exchangeAmount,
                status: "success",
                invoice_id: Invoice.id,
                register_tbl_hdr_id: req.body.registerID,
                // ✅ ADD THESE
                card_type: p.cardType || null,
                auth_code: p.authCode || null,
              });
            }
          } else {
            // Everything extra becomes exchange
            await PaymentMethod.create({
              collection_id: collection.id,
              payment_mode: "Change Returned",
              amount: paymentAmount,
              status: "success",
              invoice_id: Invoice.id,
              register_tbl_hdr_id: req.body.registerID,
              // ✅ ADD THESE
              card_type: p.cardType || null,
              auth_code: p.authCode || null,
            });
          }
        }
      }
    }
    await t.commit();
    const fullInvoice = await getInvoiceWithDetails({ id: Invoice.id });
    return res.status(200).json({
      status: true,
      message: "Invoice created successfully",
      data: fullInvoice,
    });
  } catch (error) {
    await t.rollback();

    console.error("invoice_insert1 error:", error);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const exchange_invoice = async (req, res, next) => {
  const {
    customer_id,
    salesman_id,
    discountAmount,
    discountType,
    selectedItem,
    returnItems,
    invoice_number,
    updatePrevInvoice,
    cashier_comp_id,
    cashier_loc_id,
  } = req.body;

  console.log("exchnage invoice data ------", req.body);
  const t = await db.sequelize.transaction();

  try {
    const addedItems = Array.isArray(selectedItem)
      ? selectedItem
      : JSON.parse(selectedItem || "[]");

    const returnedItems = Array.isArray(returnItems)
      ? returnItems
      : JSON.parse(returnItems || "[]");
    const finalInvoiceNumber = await generateNextInvoiceNumber();
    while (
      await InvoiceModel.findOne({
        where: { invoice_number: finalInvoiceNumber },
      })
    ) {
      numberPart++;
      finalInvoiceNumber = `${prefix}${numberPart}`;
    }

    // ================= TOTALS =================
    const addedTotal = addedItems.reduce(
      (sum, i) => sum + Number(i.totalWithVat || 0),
      0,
    );

    const returnTotal = returnedItems.reduce(
      (sum, i) => sum + Number(i.totalWithVat || 0),
      0,
    );

    const netPayable = addedTotal - returnTotal;

    // ================= CREATE INVOICE =================
    const Invoice = await InvoiceModel.create(
      {
        customer_id,
        salesman_id,
        invoice_number: finalInvoiceNumber,
        invoice_type: "Exchange",
        invoice_type_id: 3,
        payment_term_id: 2,
        total_gross: addedTotal,
        total_net: netPayable,
        grand_total: netPayable,
        total_discounttype: discountType,
        total_discount_amount: discountAmount,
        total_qty: addedItems.reduce((s, i) => s + Number(i.qty || 0), 0),
        ret_exc_status: 2,
        company_id: cashier_comp_id,
        location_id: cashier_loc_id,
        exchange_number: updatePrevInvoice,
      },
      { transaction: t },
    );

    // const prevInvoice = await InvoiceModel.findOne({
    //   where: { invoice_number: updatePrevInvoice },
    // });

    const prevInvoice = await InvoiceModel.findOne({
      where: { invoice_number: updatePrevInvoice },
      transaction: t,
    });

    if (!prevInvoice) throw new Error("Original invoice not found");

    // ==========================================================
    // ===================== RETURN ITEMS (IN) ===================
    // ==========================================================

    for (const item of returnedItems) {
      let remainingQty = Number(item.qty || 0);
      if (!remainingQty) continue;

      const itemLoc = await itemLocationMaster.findOne({
        where: {
          company_id: cashier_comp_id,
          location_id: cashier_loc_id,
          id: item.item_id,
        },
        transaction: t,
      });

      let runningQty =
        parseFloat(itemLoc.remaining_stock ?? itemLoc.stock) || 0;

      const originalDetails = await InvoiceDetailModel.findAll({
        where: {
          invoice_id: prevInvoice.id,
          item_id: item.item_id,
        },
        order: [["id", "ASC"]],
      });

      console.log("origina details is ");

      for (const detail of originalDetails) {
        if (remainingQty <= 0) break;

        const soldQty = Number(detail.item_qty || 0);
        const alreadyReturned = Number(detail.ret_exc_qty || 0);
        const availableQty = soldQty - alreadyReturned;
        if (availableQty <= 0) continue;

        const returnQty = Math.min(availableQty, remainingQty);

        // UPDATE ORIGINAL DETAIL
        await detail.update(
          {
            ret_exc_qty: alreadyReturned + returnQty,
            ret_bal_qty: soldQty - (alreadyReturned + returnQty),
            ret_exc_status: soldQty - (alreadyReturned + returnQty) > 0 ? 2 : 3,
          },
          { transaction: t },
        );

        // RESTORE BATCH
        const batch = await BatchModel.findOne({
          where: {
            batch_number: detail.batch_number,
            item_id: item.item_id,
            company: cashier_comp_id,
            location: cashier_loc_id,
          },
          transaction: t, // ✅ must be inside
        });

        if (batch) {
          await batch.update(
            {
              current_in_stock: Number(batch.current_in_stock || 0) + returnQty,
            },
            { transaction: t },
          );
        }

        // STOCK MOVEMENT (IN)
        await StockMovement.create(
          {
            uuid: uuidv4(),
            transaction_no: finalInvoiceNumber,
            transaction_type: "EXCHANGE_RETURN",
            type: "IN",
            qty: returnQty,
            item_id: item.item_id,
            itemupc: item.itemupc,
            batch: detail.batch_number,
            comp_id: cashier_comp_id,
            loc_id: cashier_loc_id,
            qty_on_hand_previous: runningQty,
            qty_on_hand_new: runningQty + returnQty,
            stock_desc: `EXCHANGE RETURN invoice ${finalInvoiceNumber}`,
            date: new Date(),
          },
          { transaction: t },
        );

        // ===== INSERT EXCHANGE RETURN DETAIL =====
        const unitNet =
          Number(detail.rate) ||
          Number(detail.item_net || 0) / soldQty ||
          Number(detail.item_price || 0);

        const unitVat = Number(detail.perItem_Total || 0) - unitNet || 0;

        const unitGrand = unitNet + unitVat;

        const perUnitDiscount =
          soldQty > 0 ? Number(detail.item_discount_amount || 0) / soldQty : 0;

        const returnDiscount = perUnitDiscount * returnQty;

        await InvoiceDetailModel.create(
          {
            invoice_id: Invoice.id,
            item_id: detail.item_id,
            item_salesman_id: detail.item_salesman_id || null,
            item_uom_id: detail.item_uom_id || 0,
            item_qty: returnQty,
            ret_bal_qty: 0,
            ret_exc_qty: returnQty,
            ret_exc_status: 2,
            act_inv_ref: updatePrevInvoice,
            is_free: 3, //Means this item is comes with exchnage in return
            item_price: detail.item_price,
            item_gross: detail.item_gross,
            discounttype: detail.discounttype || "amount",
            // item_discount_amount: detail.item_discount_amount || 0,
            item_discount_amount: returnDiscount,
            doc_discount: detail.doc_discount || 0,

            rate: unitNet,
            item_net: unitNet * returnQty,
            item_vat: unitVat,
            item_excise: detail.item_excise || 0,
            taxa_ble: detail.taxa_ble || 0,

            perItem_Total: unitGrand,
            item_grand_total: unitGrand * returnQty,

            batch_number: detail.batch_number,
            landed_cost_per_unit: detail.itemlanprice || 0,

            purchase_cost_per_unit: detail.purchase_cost_per_unit || 0,

            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t },
        );

        runningQty += returnQty;
        remainingQty -= returnQty;
      }

      if (remainingQty > 0)
        throw new Error("Return quantity exceeds sold quantity");

      // UPDATE LOCATION AFTER MOVEMENT
      await itemLoc.update(
        {
          distributed_stock:
            Number(itemLoc.distributed_stock || 0) - Number(item.qty || 0),
          remaining_stock:
            Number(itemLoc.remaining_stock || 0) + Number(item.qty || 0),
        },
        { transaction: t },
      );
    }

    // ==========================================================
    // ===================== ADDED ITEMS (OUT) ===================
    // ==========================================================

    for (const item of addedItems) {
      let remainingQty = Number(item.qty || 0);
      if (!remainingQty) continue;

      const itemLoc = await itemLocationMaster.findOne({
        where: {
          company_id: cashier_comp_id,
          location_id: cashier_loc_id,
          id: item.id,
        },
        transaction: t,
      });

      let runningQty =
        parseFloat(itemLoc.remaining_stock ?? itemLoc.stock) || 0;

      const batches = await BatchModel.findAll({
        where: {
          item_id: item.id,
          company: cashier_comp_id,
          location: cashier_loc_id,
          current_in_stock: { [Op.gt]: 0 },
        },
        order: [["id", "ASC"]],
        transaction: t,
      });

      for (const batch of batches) {
        if (remainingQty <= 0) break;

        const stock = Number(batch.current_in_stock || 0);
        if (!stock) continue;

        const deductQty = Math.min(stock, remainingQty);

        await batch.update(
          {
            current_in_stock: stock - deductQty,
          },
          { transaction: t },
        );

        // STOCK MOVEMENT (OUT)
        await StockMovement.create(
          {
            uuid: uuidv4(),
            transaction_no: finalInvoiceNumber,
            transaction_type: "EXCHANGE_ADDED",
            type: "OUT",
            qty: deductQty,
            item_id: item.id,
            itemupc: item.itemupc,
            batch: batch.batch_number,
            comp_id: cashier_comp_id,
            loc_id: cashier_loc_id,
            qty_on_hand_previous: runningQty,
            qty_on_hand_new: runningQty - deductQty,
            stock_desc: `EXCHANGE ADDED invoice ${finalInvoiceNumber}`,

            date: new Date(),
          },
          { transaction: t },
        );

        // ===== INSERT EXCHANGE SALE DETAIL =====
        const unitPrice = Number(item.price || 0);
        const unitNet = Number(item.net || unitPrice);
        const unitVat = (unitNet * Number(item.vatRate || 0)) / 100;
        const unitGrand = unitNet + unitVat;

        await InvoiceDetailModel.create(
          {
            invoice_id: Invoice.id,
            item_id: item.id,
            item_salesman_id: item.salesman_item_id || null,
            item_uom_id: 0,

            item_qty: deductQty,
            ret_bal_qty: deductQty,
            ret_exc_qty: 0,
            ret_exc_status: 1,

            item_price: unitPrice,
            item_gross: unitPrice,
            discounttype: item.discountTypeItem || "amount",
            item_discount_amount: item.discountValueItem || 0,
            doc_discount: 0,

            rate: unitNet,
            item_net: unitNet * deductQty,
            item_vat: unitVat,
            item_excise: 0,
            taxa_ble: 0,

            perItem_Total: unitGrand,
            item_grand_total: unitGrand * deductQty,

            batch_number: batch.batch_number,
            landed_cost_per_unit: batch.itemlanprice || 0,
            purchase_cost_per_unit: batch.purchase_cost_per_unit || 0,

            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t },
        );

        runningQty -= deductQty;
        remainingQty -= deductQty;
      }

      if (remainingQty > 0) throw new Error("Not enough batch stock");

      // UPDATE LOCATION AFTER MOVEMENT
      await itemLoc.update(
        {
          distributed_stock:
            Number(itemLoc.distributed_stock || 0) + Number(item.qty || 0),
          remaining_stock:
            Number(itemLoc.remaining_stock || 0) - Number(item.qty || 0),
        },
        { transaction: t },
      );
    }

    // ===================== EXCHANGE PAYMENTS =====================

    if (netPayable <= 0) {
      throw new Error("Exchange must result in customer payment");
    }

    const paymentDetailsRaw = req.body.PaymentDetails;
    let paymentDetails = [];

    if (typeof paymentDetailsRaw === "string") {
      paymentDetails = JSON.parse(paymentDetailsRaw);
    } else if (Array.isArray(paymentDetailsRaw)) {
      paymentDetails = paymentDetailsRaw;
    }

    // Remove any exchange or system rows
    // const realPayments = paymentDetails.filter(
    //   (p) => p.method !== "exchange" && p.mode !== "Exchange",
    // );
    // Keep ONLY exchange modal payments
    const realPayments = paymentDetails.filter((p) => p.mode === "Exchange");

    // Calculate total customer paid
    const totalPaid = realPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0,
    );

    if (totalPaid < netPayable) {
      throw new Error("Customer payment is less than required amount");
    }

    // Create payment collection
    const collection = await PaymentCollection.create(
      {
        customer_id,
        salesman_id,
        invoice_id: Invoice.id,
        payment_mode: null,
        total: netPayable,
        total_payment_amount: totalPaid, // 🔥 ADD THIS
        accounting_date: new Date(),
        type: "Exchange",
        company_id: cashier_comp_id,
        location_id: cashier_loc_id,
      },
      { transaction: t },
    );

    let remaining = netPayable;

    // Store only usable amounts
    for (const p of realPayments) {
      if (remaining <= 0) break;

      const amount = Number(p.amount || 0);
      const usable = Math.min(amount, remaining);

      await PaymentMethod.create(
        {
          collection_id: collection.id,
          payment_mode: p.method,
          amount: usable,
          status: "success",
          invoice_id: Invoice.id,
          // ✅ ADD THESE
          card_type: p.cardType || null,
          auth_code: p.authCode || null,
        },
        { transaction: t },
      );

      remaining -= usable;
    }

    // If customer overpaid → store change
    const change = totalPaid - netPayable;

    if (change > 0) {
      await PaymentMethod.create(
        {
          collection_id: collection.id,
          payment_mode: "Change Returned",
          amount: change,
          status: "success",
          invoice_id: Invoice.id,
          // ✅ ADD THESE
          card_type: null,
          auth_code: null,
        },
        { transaction: t },
      );
    }

    await t.commit();

    // GET FULL INVOICE WITH DETAILS
    const fullInvoice = await getInvoiceWithDetails({ id: Invoice.id });

    return res.status(200).json({
      status: true,
      message: "Exchange invoice created successfully",
      data: fullInvoice,
    });
  } catch (error) {
    await t.rollback(); // 🔥 IMPORTANT
    console.log("Exchange Error: ", error);
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

//search invoice for the POS enter some data you will get the more data

const searchInvoiceNumbers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(200).json({
        status: true,
        data: [],
      });
    }

    const invoices = await InvoiceModel.findAll({
      attributes: ["invoice_number"],
      where: {
        invoice_type: "Default", // ✅ Only sale invoices
        invoice_number: {
          [Op.like]: `${query}%`,
        },
      },
      order: [["invoice_number", "DESC"]],
      limit: 20,
    });

    return res.status(200).json({
      status: true,
      data: invoices,
    });
  } catch (error) {
    console.error("searchInvoiceNumbers error:", error);
    return res.status(400).json({
      status: false,
      message: "Error searching invoices",
      error: error.message,
    });
  }
};

const exchange_invoice1 = async (req, res, next) => {
  const {
    customer_id,
    salesman_id,
    bank_name,
    type,
    subtotal,
    discountAmount,
    discountPercent,
    total,
    total_gross,
    discountType,
    Payment_Method,
    selectedItem, // added items
    returnItems, // returned items
    paidAmount,
    invoice_number,
    // total_qty,
    updatePrevInvoice,
    registerID,
    cashier_comp_id,
    cashier_loc_id,
  } = req.body;

  console.log("req.body for exchange invoice:-------- ", req.body);

  try {
    let addedItems = Array.isArray(selectedItem)
      ? selectedItem
      : JSON.parse(selectedItem || "[]");
    let returnedItems = Array.isArray(returnItems)
      ? returnItems
      : JSON.parse(returnItems || "[]");
    // 🔹 Calculate total quantity from selected items
    let total_qty = addedItems.reduce(
      (sum, item) => sum + (Number(item.qty) || 0),
      0,
    );
    let retun_total_qty = returnedItems.reduce(
      (sum, item) => sum + (Number(item.qty) || 0),
      0,
    );

    // Generate unique invoice number
    let baseInvoiceNumber = invoice_number;
    let prefix =
      baseInvoiceNumber.substring(0, baseInvoiceNumber.lastIndexOf("-") + 1) ||
      "EX-";
    let numberPart = parseInt(baseInvoiceNumber.split("-").pop()) || 1001;
    let finalInvoiceNumber = `${prefix}${numberPart}`;

    while (true) {
      const existingInvoice = await InvoiceModel.findOne({
        where: { invoice_number: finalInvoiceNumber },
      });
      if (!existingInvoice) break;
      numberPart += 1;
      finalInvoiceNumber = `${prefix}${numberPart}`;
    }

    // Create Exchange Invoice
    const Invoice = await InvoiceModel.create({
      customer_id,
      salesman_id,
      invoice_number: finalInvoiceNumber,
      invoice_type: "Exchange",
      invoice_type_id: 3,
      payment_term_id: 2,
      total_discounttype: discountType,
      total_discount_amount: discountAmount,
      total_qty,
      total_net: paidAmount,
      grand_total: paidAmount,
      total_gross: paidAmount,
      // total_net: total,
      // grand_total: total + (total * 5) / 100,
      // total_gross,
      ret_bal_qty: total_qty,
      ret_exc_qty: 0,
      ret_exc_status: 2,
    });

    // ----------------- Handle Returned Items -----------------
    for (const item of returnedItems) {
      const qty = parseFloat(item.qty || item.item_qty || item.quantity) || 0;
      if (!qty) continue;

      // Update original invoice detail
      const prevInvoice = await InvoiceModel.findOne({
        where: { invoice_number: updatePrevInvoice },
      });
      if (!prevInvoice)
        throw new Error("Original invoice not found for return items");

      const originalItem = await InvoiceDetailModel.findOne({
        where: { invoice_id: prevInvoice.id, item_id: item.item_id },
      });

      if (originalItem) {
        const prevRetExcQty = parseFloat(originalItem.ret_exc_qty) || 0;
        const itemQty = parseFloat(originalItem.item_qty) || 0;
        const newRetQty = prevRetExcQty + qty;
        const newRetBalQty = itemQty - newRetQty;

        await originalItem.update({
          ret_exc_qty: newRetQty,
          ret_bal_qty: newRetBalQty,
          ret_exc_status: newRetBalQty > 0 ? 2 : 3,
        });
      }

      // Update stock (add returned quantity)
      const itemLoc = await itemLocationMaster.findOne({
        where: {
          company_id: cashier_comp_id,
          location_id: cashier_loc_id,
          id: item.item_id,
        },
      });
      if (!itemLoc) {
        return res.status(400).json({
          status: false,
          message: `Item ${item.item_name} not in stock`,
        });
      }
      let uomData = null;
      if (itemLoc.itmuom) {
        uomData = await itemUomModel.findOne({
          where: { id: itemLoc.itmuom },
        });
      }
      const currentDistributed = parseFloat(itemLoc.distributed_stock) || 0;
      const currentStock = parseFloat(itemLoc.stock) || 0;
      const newDistributed = Math.max(0, currentDistributed - qty);
      const newRemaining = currentStock - newDistributed;

      await itemLoc.update({
        distributed_stock: newDistributed,
        remaining_stock: newRemaining,
      });

      // Insert invoice_detail for returned item
      await InvoiceDetailModel.create({
        invoice_id: Invoice.id,
        item_id: item.item_id,
        item_qty: qty,
        item_net: item.price || 0,
        item_vat: item.vat || 0,
        item_grand_total: item.totalWithVat || 0,
        perItem_Total: item.totalWithVat / qty || 0,
        item_price: item.price || 0,
        discounttype: "amount",
        item_discount_amount: 0,
        item_salesman_id: salesman_id,
        ret_bal_qty: 0,
        ret_exc_qty: qty,
        ret_exc_status: 2,
      });

      await StockMovement.create({
        item_id: item.item_id,
        transaction_no: finalInvoiceNumber,
        transaction_type: "EXCHANGE_RETURN",
        type: "IN",
        loc_type: "POS",
        comp_id: cashier_comp_id,
        loc_id: cashier_loc_id,
        warehouse_id: cashier_loc_id,
        qty_on_hand_previous: currentStock,
        qty_on_hand_new: newRemaining,
        average_cost_previous: itemLoc.purchase_cost_per_unit || 0,
        average_cost_new: itemLoc.purchase_cost_per_unit || 0,
        qty,
        uom_id: itemLoc.itmuom || null,
        uom_name: uomData ? uomData.name : null,
        itemupc: itemLoc.itemupc,
        item_id: itemLoc.id,
        supplier_name: customer_id || null,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // ----------------- Handle Added Items -----------------
    for (const item of addedItems) {
      const qty = parseFloat(item.qty || item.item_qty || item.quantity) || 0;
      if (!qty) continue;

      const itemLoc = await itemLocationMaster.findOne({
        where: {
          company_id: cashier_comp_id,
          location_id: cashier_loc_id,
          id: item.id,
        },
      });
      if (!itemLoc) {
        return res.status(400).json({
          status: false,
          message: `Item ${item.itemName} not in stock`,
        });
      }

      const currentDistributed = parseFloat(itemLoc.distributed_stock) || 0;
      const currentStock = parseFloat(itemLoc.stock) || 0;
      const newDistributed = currentDistributed + qty;
      const newRemaining = currentStock - newDistributed;

      await itemLoc.update({
        distributed_stock: newDistributed,
        remaining_stock: newRemaining,
      });

      let uomData = null;
      if (itemLoc.itmuom) {
        uomData = await itemUomModel.findOne({
          where: { id: itemLoc.itmuom },
        });
      }

      const net = parseFloat(item.price || 0);
      const vat = parseFloat(item.item_tax || 0);

      await InvoiceDetailModel.create({
        invoice_id: Invoice.id,
        item_id: item.id,
        item_qty: qty,
        item_net: net,
        item_vat: vat,
        item_grand_total: item.totalWithVat,
        perItem_Total: item.totalWithVat / qty,
        item_price: parseFloat(item.price || 0),
        discounttype: item.discountTypeItem || "amount",
        item_discount_amount: item.discountValueItem || 0,
        item_salesman_id: salesman_id || null,
        ret_bal_qty: qty,
        ret_exc_qty: 0,
        ret_exc_status: 1,
      });

      await StockMovement.create({
        item_id: item.id,
        transaction_no: finalInvoiceNumber,
        transaction_type: "EXCHANGE_ADDED",
        type: "OUT",
        loc_type: "POS",
        comp_id: cashier_comp_id,
        loc_id: cashier_loc_id,
        warehouse_id: cashier_loc_id,
        qty_on_hand_previous: currentStock,
        qty_on_hand_new: newRemaining,
        average_cost_previous: itemLoc.purchase_cost_per_unit || 0,
        average_cost_new: itemLoc.purchase_cost_per_unit || 0,
        qty,
        uom_id: itemLoc.itmuom || null,
        uom_name: uomData ? uomData.name : null,
        itemupc: itemLoc.itemupc,
        item_id: itemLoc.id,
        supplier_name: customer_id || null,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // ----------------- Handle Payments -----------------
    const InvoicePayment = await Pos_Payment.create({
      customer_id,
      salesman_id,
      organisation_id: 1,
      payment_mode: Payment_Method,
      invoice_id: Invoice.id,
      total_payment_amount: total,
      bank_name,
      type: "exchange",
      accounting_date: new Date(),
    });

    const Payment_Collection = await PaymentCollection.create({
      customer_id,
      salesman_id,
      organisation_id: 1,
      payment_mode: Payment_Method,
      invoice_id: Invoice.id,
      invoice_amount: total,
      total_payment_amount: total,
      type: "exchange",
      accounting_date: new Date(),
      bank_name,
    });

    if (req.body.PaymentDetails && Array.isArray(req.body.PaymentDetails)) {
      for (let payment of req.body.PaymentDetails) {
        await PaymentMethod.create({
          collection_id: Payment_Collection.id,
          payment_mode: payment.method || null,
          card_type: payment.cardType || null,
          amount: payment.amount || 0,
          grand_total: payment.amount || 0,
          status: "success",
          type: "exchange",
          paymentcard_number: payment.authCode || null,
          coupon_voucher_gift_code: payment.code || null,
          currency: payment.currency || null,
          invoice_id: Invoice.id,
        });
      }
    }

    res.status(200).json({
      status: true,
      message: "Exchange invoice created successfully",
      data: Invoice,
    });
  } catch (error) {
    console.log("Exchange Error: ", error);
    res.status(400).json({
      status: false,
      message: "Something went wrong!",
      data: error.message,
    });
  }
};

const manualInvoice = async (req, res, next) => {
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
    status,
    order_type,
    taxable_total,
    cgst_amount,
    sgst_amount,
    igst_amount,
    items,
    company_id,
    location_id,
  } = req.body;

  try {
    let getinvoiceNumber = await codesettingGet("invoice");
    codesettingupdate("invoice");
    // console.log("getinvoiceNumber--------------", getinvoiceNumber);

    const Invoice = await InvoiceModel.create({
      order_id: null, // No order id here
      customer_id,
      customer_lob,
      salesman_id,
      customer_lpo,
      payment_term_id: payment_terms,
      invoice_date: delivery_date || null,
      invoice_number: getinvoiceNumber,
      invoice_due_date: due_date || null,
      total_discount_amount: discount,
      total_net: net,
      total_vat: vat,
      total_excise: excise,
      grand_total: total,
      taxable_total,
      cgst_amount,
      sgst_amount,
      igst_amount,
      status,
      company_id,
      location_id,
      order_type,
    });

    for (const item of items) {
      const is_free = item.skim === "Free" ? 1 : 0;

      await InvoiceDetailModel.create({
        invoice_id: Invoice.id,
        item_id: item.item_id,
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
        item_price: item.price,
        item_gross: item.price,
        item_discount_amount: item.discount,
        item_net: item.net,
        // item_vat: item.vat,
        item_excise: item.excise,
        item_grand_total: item.total,
        ptr_di: item.ptr_di,
        taxa_ble: item.taxa_ble,
        discounttype: item.discounttype,
        cgst: item.cgst,
        cgst_amount: item.cgst_amount,
        sgst: item.sgst,
        sgst_amount: item.sgst_amount,
        igst: item.igst,
        igst_amount: item.igst_amount,
        itemtype: item.itemtype || "",
        landed_cost_per_unit: item.landed_cost_per_unit || "",
        expiry_delivery_date: item.expiry_delivery_date || null,
        receiving_site: item.receiving_site || "",
        purchase_cost_per_unit: item.purchase_cost_per_unit || "",
        hsn_code: item.hsn_code || "",
        rate: item.price,
      });
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Invoice created manually",
          "",
          Invoice,
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
  const { id, invoice_number } = req.body;
  try {
    // Ensure at least one identifier is present
    if (!id && !invoice_number) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Either 'id' or 'invoice_number' must be provided",
            "Error",
            "",
          ),
        );
    }

    const whereCondition = {};

    if (id) {
      whereCondition.id = id;
    } else if (invoice_number) {
      whereCondition.invoice_number = invoice_number;
    }

    const detail = await InvoiceModel.findOne({
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
        {
          model: UserModel,
          as: "customer",
          attributes: [
            "firstname",
            "lastname",
            "email",
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

        // ✅ ADD THIS
        {
          model: OrderModel,
          as: "orderModel",
          include: [
            {
              model: OrderDetailModel,
              as: "order_details",
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
          model: InvoiceDetailModel,
          as: "invoice_details",
          include: [
            {
              // model: itemModel,
              // as: "itemModel",
              model: itemLocationMaster,
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
        {
          model: PaymentMethod,
          as: "payment_method_details",
        },
      ],
      where: whereCondition,
    });

    if (!detail) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "not found!", "Error", ""),
        );
    }
    // ✅ Check if payment_term_id is 1
    if (invoice_number && detail.payment_term_id !== 1) {
      // if (detail.payment_term_id !== 1) {
      return res
        .status(403)
        .json(
          ResponseFormatter.setResponse(
            false,
            403,
            "Access denied:Please insert original invoice number.",
            "Error",
            "",
          ),
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

const detailsByInvoiceNumber = async (req, res, next) => {
  const { invoice_number } = req.body;
  // const { id } = req.body;
  try {
    const detail = await InvoiceModel.findOne({
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
        {
          model: UserModel,
          as: "customer",
          attributes: [
            "firstname",
            "lastname",
            "email",
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
          model: InvoiceDetailModel,
          as: "invoice_details",
          include: [
            {
              model: itemModel,
              as: "itemModel",
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
        invoice_number: invoice_number,
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

const UpdateInvoice = async (req, res, next) => {
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
    items,
    company_id,
    location_id,
    current_stage_comment,
  } = req.body;

  try {
    // Find the existing order and its details
    const detail = await InvoiceModel.findOne({
      include: [
        {
          model: InvoiceDetailModel,
          as: "invoice_details",
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

    // console.log("items is -------", items);

    // sum all item_qty from items
    const totalItemQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    // console.log("totalItemQty--------------", totalItemQty);

    const totalOpenQty = items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);

    // Update the order details
    await InvoiceModel.update(
      {
        customer_lob: customer_lob,
        customer_lpo: customer_lpo,
        customer_id: customer_id,
        delivery_date: delivery_date,
        payment_term_id: payment_terms,
        due_date: due_date,
        total_discount_amount: discount,
        total_net: net,
        total_vat: vat,
        total_excise: excise,
        grand_total: total,
        status: status,
        company_id: company_id,
        location_id: location_id,
        order_type: order_type,
        total_qty: totalItemQty,
        current_stage_comment: current_stage_comment,

        // open_qty: totalOpenQty,
      },
      {
        where: {
          id: id,
        },
      },
    );

    // Process each item in the order
    // for (let i = 0; i < items.length; i++) {
    //   const existingItem = detail.invoice_details.find(
    //     (orderDetail) =>
    //       orderDetail.item_id === items[i].item_id &&
    //       items[i].invoice_details_id == orderDetail.id
    //   );

    for (let i = 0; i < items.length; i++) {
      // console.log("Item index:", i);
      // console.log("items[i]:", items[i]);
      // console.log("items[i].invoice_details_id:", items[i].invoice_details_id);

      // const existingItem = detail.invoice_details.find(
      //   (orderDetail) =>
      //     orderDetail.item_id === items[i].item_id &&
      //     items[i].invoice_details_id == orderDetail.id
      // );

      const existingItem = detail.invoice_details.find(
        (orderDetail) =>
          orderDetail.item_id === items[i].item_id &&
          orderDetail.id === items[i].order_details_id,
      );

      // console.log("Matching existingItem:", existingItem);
      // }

      //       const existingItem = detail.invoice_details.find(
      //   (orderDetail) => orderDetail.id === items[i].invoice_details_id
      // );

      let item_stoke = await itemModel.findOne({
        where: {
          id: items[i].item_id,
        },
      });
      // let expiry_delivery_date = item_stoke.itmexpiry;
      // let receiving_site = item_stoke.batch_no;
      // let hsn_code = item_stoke.hsncode;

      // if (detail.type == "purchase order") {
      //   expiry_delivery_date = items[i].expiry_delivery_date;
      //   receiving_site = items[i].receiving_site;
      //   hsn_code = items[i].hsn_code;
      // }
      if (existingItem) {
        // If the item already exists, update the quantity and other details
        await InvoiceDetailModel.update(
          {
            // item_qty: parseFloat(existingItem.item_qty),
            item_qty: parseFloat(items[i].quantity),

            item_uom_id: items[i].uom,
            ship_quantity: parseFloat(existingItem.ship_quantity),
            item_gross: items[i].price,
            item_price: items[i].price,
            item_discount_amount: items[i].discount,
            item_net: items[i].net,
            item_vat: items[i].vat,
            item_excise: items[i].excise,
            item_grand_total: items[i].total,
            taxa_ble: items[i].taxa_ble,
            discounttype: items[i].discounttype,
            rate: items[i].rate,
            // expiry_delivery_date: expiry_delivery_date,
            // receiving_site: receiving_site,
            // hsn_code: hsn_code,
            expiry_delivery_date: null,
            receiving_site: null,
            hsn_code: null,
            // open_qty: items[i].quantity,
          },
          {
            where: {
              id: existingItem.id,
            },
          },
        );
      } else {
        // If the item does not exist, create a new order detail
        await InvoiceDetailModel.create({
          order_id: id,
          item_uom_id: items[i].uom,
          item_id: items[i].item_id,
          size: items[i].size,
          color: items[i].color,
          item_uom_id: 0,
          discount_id: 0,
          is_free: 0,
          is_item_poi: 0,
          promotion_id: 0,
          item_qty: items[i].quantity,
          ship_quantity: items[i].ship_quantity,
          item_weight: 0,
          total_pallet: 0,
          total_pallet_volume: 0,
          item_price: items[i].price,
          item_gross: items[i].price,
          discounttype: items[i].discounttype,
          item_discount_amount: items[i].discount,
          item_net: items[i].net,
          item_vat: items[i].vat,
          item_excise: items[i].excise,
          item_grand_total: items[i].total,
          rate: items[i].rate,
          // expiry_delivery_date: expiry_delivery_date,
          // receiving_site: receiving_site,
          // hsn_code: hsn_code,
          expiry_delivery_date: null,
          receiving_site: null,
          hsn_code: null,
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

// for ecommerce return
// ------------------------------------------
// ecommerce return via order payload
// --------------------------------------------------
const createEcomReturnInvoice = async (req, res) => {
  const t = await InvoiceModel.sequelize.transaction();

  try {
    const {
      orderId,
      invoiceNumber,
      returnReason,
      refundMethod,
      returnItems = [],
    } = req.body;

    console.log("req.body for return item is----------", req.body);

    // 1️⃣ Fetch invoice using invoiceNumber
    const invoice = await InvoiceModel.findOne({
      where: { invoice_number: invoiceNumber },
      include: [
        {
          model: InvoiceDetailModel,
          as: "invoice_details",
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!invoice) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Invoice not found for this order",
      });
    }

    let totalReturnQty = 0;

    // 2️⃣ Process return items
    for (const item of returnItems) {
      const returnQty = Number(item.quantity || 0);

      if (returnQty <= 0) continue;

      // Match invoice detail using order_item_id
      const invItem = invoice.invoice_details.find(
        (d) => d.order_item_id === Number(item.id),
      );

      if (!invItem) continue;

      const alreadyReturned = Number(invItem.ret_exc_qty || 0);
      const maxReturnable = Number(invItem.item_qty) - alreadyReturned;

      if (returnQty > maxReturnable) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Invalid return qty for item ${invItem.item_id}`,
        });
      }

      const newReturnedQty = alreadyReturned + returnQty;
      const newBalanceQty = Number(invItem.item_qty) - newReturnedQty;

      // 3️⃣ Update invoice item
      await InvoiceDetailModel.update(
        {
          ret_exc_status: "RETURN",
          ret_exc_qty: newReturnedQty,
          ret_bal_qty: newBalanceQty,
          act_inv_ref: invoice.invoice_number,
        },
        {
          where: { id: invItem.id },
          transaction: t,
        },
      );

      totalReturnQty += returnQty;
    }

    // 4️⃣ Update invoice summary
    const invoiceReturnedQty =
      Number(invoice.ret_exc_qty || 0) + totalReturnQty;
    const invoiceBalanceQty = Number(invoice.total_qty) - invoiceReturnedQty;

    await InvoiceModel.update(
      {
        ret_exc_status: "RETURN",
        ret_exc_qty: invoiceReturnedQty,
        ret_bal_qty: invoiceBalanceQty,
        reason: returnReason || "Ecommerce return",
        refund_method: refundMethod || "original",
        status: invoiceBalanceQty === 0 ? "Returned" : "Partially Returned",
      },
      {
        where: { id: invoice.id },
        transaction: t,
      },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "E-commerce return processed successfully",
      invoice_number: invoice.invoice_number,
      returned_qty: totalReturnQty,
      remaining_qty: invoiceBalanceQty,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);

    return res.status(400).json({
      success: false,
      message: "Return processing failed",
      error: error.message,
    });
  }
};

const delete_invoice = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await InvoiceModel.destroy({
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

function createInvoicePDF(invoiceData) {
  // Validate invoiceData
  if (!invoiceData || !invoiceData.invoice_details) {
    throw new Error("Invalid invoice data");
  }

  const doc = new PDFDocument({ margin: 50 });
  let buffers = [];
  let pdfBuffer;

  // Collect the PDF data in buffers
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    pdfBuffer = Buffer.concat(buffers);
  });

  // Header
  doc.fontSize(25).text("Valansa Lifescience", { align: "center" });
  doc.moveDown(1.5);

  // Invoice details (on the same row)
  const invoiceNumber = `Invoice Number: ${
    invoiceData.invoice_number || "N/A"
  }`;
  const invoiceDate = `Date: ${invoiceData.invoice_date || "N/A"}`;
  doc
    .fontSize(12)
    .text(invoiceNumber, { align: "left" })
    .text(invoiceDate, { align: "right" });
  doc.moveDown(2);

  // Customer and Salesman details (on the same row)
  const customer = `Customer: ${invoiceData.customer || "N/A"}`;
  const salesman = `Salesman: ${invoiceData.salesman || "N/A"}`;
  doc
    .fontSize(12)
    .text(customer, { align: "left" })
    .text(salesman, { align: "right" });
  doc.moveDown(1.5);

  // (Optional) Add the table headers, content, and totals here

  // Finalize PDF
  doc.end();

  // Wait for the PDF to be fully generated
  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      // Convert the buffer to a base64 string and create a data URL
      const base64 = pdfBuffer.toString("base64");
      const dataUrl = `data:application/pdf;base64,${base64}`;
      resolve(dataUrl);
    });

    doc.on("error", reject);
  });
}

const html_re = async (req, res, next) => {
  const { id } = req.body;

  try {
    const invoice_data = await InvoiceModel.findOne({
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
          model: InvoiceDetailModel,
          as: "invoice_details",
          include: [
            {
              model: itemModel,
              as: "itemModel",
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
        id: id,
      },
    });
    let invoiceDetailsRows = "";
    invoice_data.invoice_details.forEach((detail, index) => {
      invoiceDetailsRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${detail.itemModel.item_name}</td>
                    <td>${detail.item_qty}</td>
                    <td>${detail.item_price}</td>
                    <td>${detail.item_discount_amount}</td>
                    <td>${detail.item_net}</td>
                    <td>${detail.item_vat}</td>
                    <td>${detail.item_excise}</td>
                    <td>${detail.item_grand_total}</td>
                </tr>
            `;
    });
    let invoiceRows = "";
    invoiceRows += `
                <td colspan="12">
                    <strong>Total:</strong> ₹${invoice_data.grand_total}<br>
                    <!-- <strong>CGST:</strong> ₹103.73<br>
                    <strong>SGST:</strong> ₹103.73<br> -->
                    <strong>Net Amount:</strong> ₹${invoice_data.total_net}<br>
                </td>
                    
            `;
    let date = "";

    let cur_date = new Date();

    let formatted_date = `${cur_date.getDate()}/${
      cur_date.getMonth() + 1
    }/${cur_date.getFullYear()}`;

    date += `
                Date: ${formatted_date}
                    
            `;
    const details = `
      <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px !important;
            padding: 0  !important;
            box-sizing: border-box  !important;
            font-size: '2px !important';
            width:"100%";
        }
    </style>
</head>

<body>
    <table style="font-size:10px;">
        <tr class="header">
            <td style="width: 33.33%;">
                <strong>MEDISPAN PHARMACEUTICAL</strong><br>
                K-113, OKHLA, NEW DELHI-25<br>
                Tel No.: 9971768821<br>
                MSME NO: 08-0047457<br>
                GST No.: 07ABWFM5189R1ZV<br>
                FASSAI No.: 13323010000214<br>
                E-mail: medisppharmaceutical@gmail.com<br>
            </td>
            <td style="width: 33.33%; text-align: center;">
                <strong>AHMED GASTRO-LIVER & DENTAL CLINIC</strong><br>
                A-2/4, RAFI COMPLEX, NEAR OKHLA METRO STATION<br>
                ABUL FAZAL EBC-1, JAMIA NAGAR, OKHLA, NEW DELHI<br>
                Tel No.: 9319188872<br>
            </td>
            <td style="width: 33.33%; text-align: right;">
                <strong>Invoice No.: ${invoice_data.invoice_number}</strong><br>
                Invoice Date: ${invoice_data.invoice_date}<br>
            </td>
        </tr>
    </table>

    <table>
        <tr class="heading">
            <th>Sr.</th>
            <th>Item Name</th>
            <th>QTY</th>
            <th>Price</th>
            <!-- <th>Amount</th> -->
            <th>Discount Amount</th>
            <th>Net</th>
            <th>Vat</th>
            <th>Excise</th>
            <th>Grand Total</th>
        </tr>
         ${invoiceDetailsRows}
    </table>

    <table>
        <tr class="footer">
            <td colspan="4">
                <strong>Bank Details</strong><br>
                Bank Name: STATE BANK OF INDIA<br>
                Account No.: 4266379126<br>
                IFSC Code: SBIN0011483<br>
            </td>

            ${invoiceRows}


        </tr>
        <tr class="footer">
            <td colspan="16" style="text-align: left;">
                Received by:<br>

               ${date}


            </td>
        </tr>
    </table>
</body>

</html`;
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully Invoice Create",
          "",
          details,
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

const listInvoicesByRegisterHdrId = async (req, res) => {
  const { page = 1, limit = 10, user_id, register_tbl_hdr_id } = req.body;

  try {
    if (!register_tbl_hdr_id) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "register_tbl_hdr_id is required",
            "Error",
            "",
          ),
        );
    }

    let companyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: { user_id },
        attributes: ["company_id"],
      });
      companyIds = userCompanies.map((company) => company.company_id);
    }

    const whereClause = {
      register_tbl_hdr_id, // 🔍 filter by this ID
      ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
    };

    const currentPage = parseInt(page);
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;

    const totalRecords = await InvoiceModel.count({ where: whereClause });

    const invoiceList = await InvoiceModel.findAll({
      where: whereClause,
      include: [
        {
          model: UserModel,
          as: "salesman",
          attributes: ["firstname", "lastname", "email"],
          include: [
            {
              model: SalesmanInfo,
              as: "salesmanInfo",
              attributes: ["salesman_code"],
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
              attributes: ["customer_code"],
            },
          ],
        },
        {
          model: InvoiceDetailModel,
          as: "invoice_details",
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
      limit: limits,
      offset: offset,
    });

    // Set full PDF path
    invoiceList.forEach((invoice) => {
      if (invoice.invoice_pdf) {
        invoice.invoice_pdf = `${base_url}/uploads/invoices/${invoice.invoice_pdf}`;
      }
    });

    const totalPages = Math.ceil(totalRecords / limits);

    return res.status(200).json(
      ResponseFormatter.setResponse(true, 200, "Success", "", {
        records: invoiceList,
        currentPage,
        pageSize: limits,
        totalRecords,
        totalPages,
      }),
    );
  } catch (error) {
    console.error("Error fetching filtered invoices:", error);
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

// Generate invoice PDF
const getInvoicePdf = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Fetch invoice with related data
    const invoice = await InvoiceModel.findOne({
      where: { id: invoiceId },
      include: [
        { model: CustomerInfo, as: "customer" },
        { model: CompanyModel, as: "company" },
        { model: LocationModel, as: "location" },
        {
          model: InvoiceDetailModel,
          as: "invoice_details",
          include: [{ model: itemModel, as: "item" }],
        },
      ],
    });

    if (!invoice) {
      return res
        .status(404)
        .json({ message: `Invoice with id ${invoiceId} not found` });
    }

    // === Create PDF ===
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${invoice.invoice_number}.pdf`,
    );

    doc.pipe(res);

    // === HEADER ===
    doc.fontSize(20).text("INVOICE", { align: "center" }).moveDown();

    doc.fontSize(12).text(`Invoice No: ${invoice.invoice_number}`);
    doc.text(`Date: ${invoice.invoice_date}`).moveDown();

    // === COMPANY INFO ===
    doc.fontSize(12).text(`Company: ${invoice.company?.company_name || ""}`);
    doc.text(`Location: ${invoice.location?.location_name || ""}`).moveDown();

    // === CUSTOMER INFO ===
    doc.fontSize(12).text("Bill To:", { underline: true }).moveDown(0.5);
    doc.text(`Name: ${invoice.customer?.customer_name || ""}`);
    doc.text(`Phone: ${invoice.customer?.phone || ""}`);
    doc.text(`Email: ${invoice.customer?.email || ""}`).moveDown();

    // === TABLE HEADER ===
    doc.fontSize(12).text("Items", { underline: true }).moveDown(0.5);

    const tableTop = doc.y;
    const itemColX = 50;
    const qtyColX = 250;
    const priceColX = 320;
    const totalColX = 400;

    doc.text("Item", itemColX, tableTop);
    doc.text("Qty", qtyColX, tableTop);
    doc.text("Price", priceColX, tableTop);
    doc.text("Total", totalColX, tableTop);

    doc.moveDown();

    // === TABLE ROWS ===
    let position = tableTop + 20;

    invoice.invoice_details.forEach((detail, idx) => {
      doc.text(detail.item?.item_name || "-", itemColX, position);
      doc.text(detail.qty.toString(), qtyColX, position);
      doc.text(`₹${detail.price}`, priceColX, position);
      doc.text(`₹${detail.total}`, totalColX, position);
      position += 20;
    });

    // === GRAND TOTAL ===
    doc.moveDown(2);
    doc.fontSize(14).text(`Grand Total: ₹${invoice.grand_total}`, {
      align: "right",
    });

    // Finalize
    doc.end();
  } catch (err) {
    console.error("Error generating invoice PDF:", err);
    res.status(500).json({ message: "Error generating invoice PDF" });
  }
};

module.exports = {
  list,
  store,
  add,
  UpdateInvoice,
  createEcomReturnInvoice,
  details,
  detailsByInvoiceNumber,
  delete_invoice,
  html_re,
  invoice_insert,
  exchange_invoice,
  manualInvoice,
  getNextInvoiceNumber,
  listInvoicesByRegisterHdrId,
  getInvoicePdf,
  searchInvoiceNumbers,
};

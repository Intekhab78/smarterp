const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where, FLOAT } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const OrderModel = db.order;
const itemMajorCategoryModel = db.item_category;
const InventoryMovementModel = db.inventory_movement;
const InvoiceModel = db.invoice_log;
const InvoiceDetailModel = db.invoice_log_details;
const OrderDetailModel = db.order_details;
const UserModel = db.user_master;
const BatchModel = db.batch;
const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_master;
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

const { codesettingupdate, codesettingGet } = require("../utils/handler");

// require('dotenv').config();
const paths = require("path");
const { log } = require("console");
const base_url = process.env.BASE_URL;

const invoice_log_insert = async (req, res, next) => {
  const {
    // id,
    customer_id,
    salesman_id,
    bank_name,
    type,
    subtotal,
    discountAmount,
    total,
    discountType,
    Payment_Method,
    selectedItems,
    paidAmount,
  } = req.body;

  console.log("req.body is from insert invoice ----------", req.body);

  try {
    let getinvoiceNumber = await codesettingGet("invoice");
    codesettingupdate("invoice");
    let total_qty = selectedItems.reduce((acc, item) => acc + item.qty, 0);

    let Invoice = await InvoiceModel.create({
      customer_id: customer_id,
      salesman_id: salesman_id,
      total_discounttype: discountType,
      total_discount_amount: discountAmount,
      bank_name: bank_name,
      invoice_type_id: 2,
      type: type,
      total_vat: (total * 5) / 100,
      total_net: total,
      grand_total: total + (total * 5) / 100,
      total_gross: subtotal,
      total_qty: total_qty, // 👈 Add this line
    });
    let InvoicePayment = await Pos_Payment.create({
      customer_id: customer_id,
      salesman_id: salesman_id,
      organisation_id: 1,
      entry_reference: "",
      payment_mode: Payment_Method,
      invoice_id: Invoice.id,
      accounting_date: new Date(),
      bank_name: bank_name,
      total_payment_amount: total,
      type: type,
    });

    let Payment_Collection = await PaymentCollection.create({
      customer_id: customer_id,
      salesman_id: salesman_id,
      organisation_id: 1,
      entry_reference: "",
      payment_mode: Payment_Method,
      invoice_id: Invoice.id,
      accounting_date: new Date(),
      bank_name: bank_name,
      invoice_amount: total,
      total: paidAmount,
      total_payment_amount: total,
      type: type,
    });

    if (req.body.PaymentDetails && Array.isArray(req.body.PaymentDetails)) {
      for (let payment of req.body.PaymentDetails) {
        await PaymentMethod.create({
          payment_mode: payment.method || null,
          card_type: payment.cardType || null,
          amount: payment.amount || 0,
          grand_total: payment.amount || 0,
          cheque_no: null, // Not provided in input, set to null
          cheque_date: null, // Not provided in input, set to null
          status: "success", // Default status
          paymentcard_number: payment.authCode || null, // Save authCode if available
          order_id: req.body.order_id || null,
          invoice_id: Invoice.id,
        });
      }
    }

    for (var i = 0; i < selectedItems.length; i++) {
      const qty = parseFloat(selectedItems[i].qty || selectedItems[i].quantity);
      if (!qty || qty <= 0) continue;
      let is_free = 0;
      if (selectedItems[i].skim == "Free") {
        is_free = 1;
      }
      let OrderDetail = await InvoiceDetailModel.create({
        invoice_id: Invoice.id,
        item_id: selectedItems[i].id,
        item_qty: qty,
        // item_qty: selectedItems[i].qty || selectedItems[i].quantity,
        item_price: selectedItems[i].price,
        item_gross: selectedItems[i].price,
        item_net: selectedItems[i].price,
        item_vat: selectedItems[i].item_vat,
        // item_net: selectedItems[i].net,
        item_grand_total: selectedItems[i].finalTotalItem,
        discounttype: selectedItems[i].discountTypeItem,
        item_discount_amount: selectedItems[i].discountValueItem,
        item_salesman_id: selectedItems[i].salesman_item_id,
      });
    }
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully Invoice Create",
          "",
          Invoice
        )
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
          error.message
        )
      );
  }
};

module.exports = {
  invoice_log_insert,
};

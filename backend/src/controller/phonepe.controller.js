const crypto = require("crypto");
const db = require("../models");
const PaymentGatewayTransaction = db.payment_gateway_transactions;

exports.generatePaymentHash = (req, res) => {
  try {
    const { amount, firstname, email, phone, txnid } = req.body;
    console.log("req.body-----generatePaymentHash", req.body);

    if (!amount || !firstname || !email) {
      return res.status(400).json({ error: "Missing payment fields" });
    }
    // const txnid = "TXN_" + Date.now();
    const formattedAmount = Number(amount).toFixed(2);
    // ✅ Correct PayU hash format
    const hashString = [
      // key,
      process.env.PAYU_TEST_KEY,
      txnid,
      formattedAmount,
      "Order Payment",
      firstname,
      email,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // salt,
      process.env.PAYU_TEST_SALT,
    ].join("|");

    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    console.log("process.env.PAYU_ACTION", process.env.PAYU_ACTION);

    res.json({
      action: process.env.PAYU_ACTION,
      key: process.env.PAYU_TEST_KEY,
      txnid,
      amount: formattedAmount,
      productinfo: "Order Payment",
      firstname,
      email,
      phone: phone || "9999999999",

      // ✅ IMPORTANT: PayU must reach these URLs
      surl: `${process.env.BACKEND_BASE_URL}payment/payu-success`,
      furl: `${process.env.BACKEND_BASE_URL}payment/payu-failure`,
      hash,
    });
  } catch (err) {
    console.error("PayU hash error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.payuSuccess = async (req, res) => {
  try {
    if (req.body.status !== "success") {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}cart`);
    }

    await PaymentGatewayTransaction.create({
      gateway: "PAYU",
      txnid: req.body.txnid,
      status: req.body.status,
      amount: req.body.amount,
      raw_response: req.body,
      website: "islamicbookzone",
    });

    return res.redirect(
      `${process.env.FRONTEND_BASE_URL}payu-processing?txnid=${req.body.txnid}`
    );
  } catch (err) {
    console.error("PayU Success Error:", err);
    return res.redirect(`${process.env.FRONTEND_BASE_URL}cart`);
  }
};

exports.getPayuPaymentDetails = async (req, res) => {
  const payment = await PaymentGatewayTransaction.findOne({
    where: { txnid: req.params.txnid },
  });

  if (!payment) {
    return res.status(404).json({ success: false });
  }

  res.json({
    success: true,
    data: payment.raw_response,
  });
};

exports.payuFailure = (req, res) => {
  console.error("❌ PayU FAILURE:", req.body);
  return res.redirect(`${process.env.FRONTEND_BASE_URL}cart`);
};

// const payuPayments = new Map();

exports.payuSuccess1 = async (req, res) => {
  try {
    console.log("✅ PayU SUCCESS:", req.body);

    if (req.body.status !== "success") {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}cart`);
    }
    // Save payu payment info keyed by txnid
    const txnid = req.body.txnid;
    payuPayments.set(txnid, req.body);

    // Redirect user to frontend payu-processing with txnid param
    return res.redirect(
      `${process.env.FRONTEND_BASE_URL}payu-processing?txnid=${txnid}`
    );
  } catch (err) {
    console.error("PayU success error:", err);
    return res.redirect(`${process.env.FRONTEND_BASE_URL}cart`);
  }
};

// New API to get PayU details by txnid
exports.getPayuPaymentDetails1 = (req, res) => {
  const { txnid } = req.params;
  const payuData = payuPayments.get(txnid);

  if (!payuData) {
    return res.status(404).json({ error: "Payment info not found" });
  }

  res.json({ success: true, data: payuData });
};

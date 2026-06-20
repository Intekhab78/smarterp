import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

const doc = new jsPDF({
  unit: "pt",
  format: "a4",
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 48;
const contentWidth = pageWidth - margin * 2;
let y = margin;

const ensurePageSpace = (needed = 24) => {
  if (y + needed > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
};

const addTitle = (text) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const lines = doc.splitTextToSize(text, contentWidth);
  ensurePageSpace(lines.length * 24);
  doc.text(lines, margin, y);
  y += lines.length * 24 + 6;
};

const addSection = (text) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const lines = doc.splitTextToSize(text, contentWidth);
  ensurePageSpace(lines.length * 18);
  doc.text(lines, margin, y);
  y += lines.length * 18 + 4;
};

const addParagraph = (text, indent = 0) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, contentWidth - indent);
  ensurePageSpace(lines.length * 14);
  doc.text(lines, margin + indent, y);
  y += lines.length * 14 + 4;
};

const addBullet = (text) => {
  const bulletIndent = 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, contentWidth - bulletIndent);
  ensurePageSpace(lines.length * 14);
  doc.text("\u2022", margin, y);
  doc.text(lines, margin + bulletIndent, y);
  y += lines.length * 14 + 2;
};

const addEndpoint = ({ method, endpoint, purpose, auth, usedIn, request, response }) => {
  addParagraph(`${method} ${endpoint}`);
  addBullet(`Purpose: ${purpose}`);
  if (auth) addBullet(`Auth: ${auth}`);
  if (request?.length) {
    addBullet(`Request fields: ${request.join(", ")}`);
  }
  if (response?.length) {
    addBullet(`Response fields used: ${response.join(", ")}`);
  }
  if (usedIn?.length) {
    addBullet(`Used in: ${usedIn.join("; ")}`);
  }
  y += 4;
};

addTitle("Payment and Payment-Related API Document");
addParagraph("Project: islamic_book");
addParagraph("Generated on: 2026-04-29");
addParagraph("Active base URL: http://localhost:5610/api");
addParagraph("Other configured base URLs: https://api.jtserp.cloud/api, https://api.islamicbookzone.com/api");
y += 8;

addSection("Direct Payment APIs");
addEndpoint({
  method: "POST",
  endpoint: "/payment/generate-hash",
  purpose: "Starts the PayU payment flow by generating the hash and redirect form fields.",
  auth: "Bearer token sent from frontend.",
  request: ["amount", "firstname", "email", "phone", "txnid", "source"],
  response: ["action", "PayU form fields returned by backend"],
  usedIn: ["src/components/Payments/payU.js"],
});
addEndpoint({
  method: "GET",
  endpoint: "/payment/payu-details/{txnid}",
  purpose: "Fetches PayU transaction details after the user returns from the gateway.",
  auth: "Not explicit in frontend call.",
  request: ["txnid path parameter"],
  response: [
    "mihpayid",
    "mode",
    "status",
    "unmappedstatus",
    "key",
    "txnid",
    "amount",
    "cardCategory",
    "discount",
    "net_amount_debit",
    "addedon",
    "productinfo",
    "firstname",
    "email",
    "phone",
    "hash",
    "field1-field9",
    "payment_source",
    "PG_TYPE",
    "bank_ref_num",
    "bankcode",
    "error",
    "error_Message",
    "cardnum",
  ],
  usedIn: [
    "src/components/Payments/PayUOrderHandler.jsx",
    "src/Pages/PayUOrderHandlerPOS.jsx",
  ],
});
addEndpoint({
  method: "POST",
  endpoint: "/razorpay/create-order",
  purpose: "Creates a Razorpay order before opening the Razorpay checkout widget.",
  auth: "Not explicit in frontend call.",
  request: ["amount"],
  response: ["order.id", "order.amount", "order.currency", "order.receipt"],
  usedIn: [
    "src/components/Payments/RazorpayPayment.jsx",
    "src/Pages/Cart.jsx",
  ],
});
addEndpoint({
  method: "POST",
  endpoint: "/razorpay/verify-payment",
  purpose: "Verifies the Razorpay payment signature after checkout succeeds.",
  auth: "Not explicit in frontend call.",
  request: [
    "razorpay_payment_id",
    "razorpay_order_id",
    "razorpay_signature",
    "receipt",
    "verified_at",
  ],
  response: ["success"],
  usedIn: [
    "src/components/Payments/RazorpayPayment.jsx",
    "src/Pages/Cart.jsx",
  ],
});

addSection("Payment Flow Support APIs");
addEndpoint({
  method: "POST",
  endpoint: "/order/ecommerce/pending/create",
  purpose: "Stores a pending order before redirecting to the PayU gateway.",
  auth: "Uses API client with credentials in some flows.",
  request: ["payload"],
  response: ["txnid"],
  usedIn: ["src/Pages/Checkout.jsx", "src/Pages/Cart.jsx", "src/Pages/PaymentTest.jsx"],
});
addEndpoint({
  method: "GET",
  endpoint: "/order/ecommerce/pending/{txnid}",
  purpose: "Loads the pending order payload after PayU redirects the user back.",
  auth: "Uses API client.",
  request: ["txnid path parameter"],
  response: ["success", "data.payload"],
  usedIn: [
    "src/components/Payments/PayUOrderHandler.jsx",
    "src/Pages/PayUOrderHandlerPOS.jsx",
  ],
});
addEndpoint({
  method: "POST",
  endpoint: "/order/ecommerce/order-add",
  purpose: "Creates the final order for COD, PayU, and Razorpay flows.",
  auth: "Uses API client or axios depending on page.",
  request: [
    "customer_id",
    "payment_terms",
    "payment_details",
    "transaction_type",
    "shipping_address",
    "billing_address",
    "items",
  ],
  response: ["status", "order_id and order data depending on flow"],
  usedIn: [
    "src/Pages/Cart.jsx",
    "src/Pages/Payment.jsx",
    "src/Pages/PaymentTest.jsx",
    "src/components/Payments/PayUOrderHandler.jsx",
    "src/Pages/PayUOrderHandlerPOS.jsx",
  ],
});

addSection("Order, Invoice, and Return APIs Related to Payments");
addEndpoint({
  method: "POST",
  endpoint: "/order/ecommerce_orders/by-customer",
  purpose: "Fetches customer order history, including paid orders.",
  usedIn: [
    "src/Pages/Accounts.jsx",
    "src/Pages/OrderSuccess.jsx",
    "src/components/SendOrderStatusMail.jsx",
  ],
});
addEndpoint({
  method: "POST",
  endpoint: "/order/ecommerce_orders/details",
  purpose: "Fetches detailed order information for review and tracking.",
  usedIn: ["src/Pages/DeliveryTracking.jsx", "src/Pages/OrderReview.jsx"],
});
addEndpoint({
  method: "POST",
  endpoint: "/order/ecommerce/order-cancel",
  purpose: "Cancels an existing order.",
  usedIn: ["src/Pages/CancelOrder.jsx"],
});
addEndpoint({
  method: "POST",
  endpoint: "/order/ecommerce/order-exchange",
  purpose: "Submits an order exchange request.",
  usedIn: ["src/Pages/ExchangeOrder.jsx"],
});
addEndpoint({
  method: "GET",
  endpoint: "/order-status/list",
  purpose: "Fetches available order statuses used by order tracking and account views.",
  usedIn: ["src/Pages/Accounts.jsx", "src/Pages/DeliveryTracking.jsx"],
});
addEndpoint({
  method: "GET",
  endpoint: "/order-action-reason-mapping/findAll",
  purpose: "Fetches allowed cancel and return reasons.",
  usedIn: ["src/Pages/CancelOrder.jsx", "src/Pages/ReturnOrder.jsx"],
});
addEndpoint({
  method: "POST",
  endpoint: "/invoice/details",
  purpose: "Fetches invoice details connected to completed orders and payment state.",
  usedIn: ["src/utils/invoiceUtils.jsx", "src/Pages/OrderReview.jsx"],
});
addEndpoint({
  method: "POST",
  endpoint: "/invoice/ecommerce/ecom_return",
  purpose: "Submits ecommerce return requests tied to invoices and completed orders.",
  usedIn: ["src/Pages/ReturnOrder.jsx"],
});

addSection("Source References");
addParagraph("Primary references used for this document:");
addBullet("src/components/Payments/payU.js");
addBullet("src/components/Payments/PayUOrderHandler.jsx");
addBullet("src/components/Payments/RazorpayPayment.jsx");
addBullet("src/Pages/PayUOrderHandlerPOS.jsx");
addBullet("src/Pages/Cart.jsx");
addBullet("src/Pages/Checkout.jsx");
addBullet("src/Pages/Payment.jsx");
addBullet("src/constantApi.js");
addBullet("reports/api-report.json");

const outputDir = path.resolve("reports");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "payment-api-document.pdf");
fs.writeFileSync(outputPath, Buffer.from(doc.output("arraybuffer")));

console.log(`Generated ${outputPath}`);

const express = require("express");
const items = require("../controller/order.controller");
const Auth = require("../middleware/Auth");
const customerAuth = require("../middleware/customerAuth");
const { upload, uploadFile } = require("../middleware/UploadFile");

const router = new express.Router();

router.post("/list", items.list);
router.post("/add", items.store);
router.post("/delete", items.delete_order);
router.post("/details", items.details);
router.post("/update", items.UpdateOrder);
router.post("/update-status", items.UpdateOrderStatus);
router.post(
  "/ecommerce_orders/by-customer",
  // customerAuth,
  items.getOrdersByCustomerId
);
router.post("/ecommerce/order-add", customerAuth, items.ecommerceOrderStore);
router.post(
  "/ecommerce/pending/create",
  customerAuth,
  items.createPendingOrder
);
router.get(
  "/ecommerce/pending/:txnid",
  customerAuth,
  items.getTransactionByTxnid
);

router.post("/ecommerce/order-update", items.ecommerceOrderUpdate);
router.post("/ecommerce/order-cancel", items.ecommerceOrderCancel);
router.post(
  "/ecommerce/order-payment-details",
  items.getEcommerceOrderPaymentDetails
);
router.post("/ecommerce/update-order-status", items.changeOrderStatus);

module.exports = router;

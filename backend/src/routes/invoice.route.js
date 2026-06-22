const express = require("express");
const items = require("../controller/invoice.controller");
const Auth = require("../middleware/Auth");
const { upload, uploadFile } = require("../middleware/UploadFile");

const router = new express.Router();
router.post("/html", items.html_re);
router.post("/list", items.list);
router.post("/add", items.store); // this is using for the generatebinvocie from the Order to generate INvoice
router.post("/add_direct_invoice", items.add); // from add direct Invoice from incvoice add
router.post("/delete", items.delete_invoice);
router.post("/details", items.details);
router.post("/details_by_invoice", items.detailsByInvoiceNumber);
router.post("/update", items.UpdateInvoice);
router.post("/ecommerce/ecom_return", items.createEcomReturnInvoice); //this is for ecom webiste
router.post("/invoice_insert", items.invoice_insert); // this ai is using for the POS
router.post("/exchange_invoice", items.exchange_invoice);
router.post("/invoice_number", items.getNextInvoiceNumber);
router.post("/invoice_manual", items.manualInvoice);
router.post("/by_register_id", items.listInvoicesByRegisterHdrId);
router.get("/pdf/:id", items.getInvoicePdf);
router.get("/search", items.searchInvoiceNumbers); //this is use for search  for dropdown

module.exports = router;

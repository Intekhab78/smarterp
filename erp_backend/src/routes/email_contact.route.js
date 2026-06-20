const express = require("express");
const router = express.Router();
// const { upload } = require("../middlewares/upload");
const { upload, uploadFile } = require("../UploadFile");

const controller = require("../controller/email_contact.controller");

/**
 * EMAIL CONTACT ROUTES
 */
router.post("/add", controller.create);
router.get("/list", controller.getAll);

module.exports = router;

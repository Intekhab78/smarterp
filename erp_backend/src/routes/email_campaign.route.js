const express = require("express");
const {
  create,
  getAll,
  update,
} = require("../controller/email_campaign.controller");

const Auth = require("../middleware/Auth");
const { upload, uploadFile } = require("../UploadFile");

const router = new express.Router();

/**
 * EMAIL CAMPAIGN ROUTES
 */
router.post("/add", upload.single("attachment"), create);
router.get("/list", getAll);
// Your route for update:
router.post(
  "/update/:id",
  upload.single("attachment"), // multer middleware parses multipart form data here
  update
);
module.exports = router;

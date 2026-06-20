const express = require("express");
const router = express.Router();
const { upload, uploadFile } = require("../UploadFile");

const controller = require("../controller/item_location_master_img.controller");

router.post(
  "/create",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "left_image", maxCount: 1 },
    { name: "right_image", maxCount: 1 },
    { name: "front_image", maxCount: 1 },
    { name: "back_image", maxCount: 1 },
  ]),
  controller.createItemImages,
);

router.post(
  "/update",
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "left_image", maxCount: 1 },
    { name: "right_image", maxCount: 1 },
    { name: "front_image", maxCount: 1 },
    { name: "back_image", maxCount: 1 },
  ]),
  controller.updateItemImages,
);

module.exports = router;

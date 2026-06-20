const express = require("express");
const items = require("../controller/item_department.controller");
const Auth = require("../middleware/Auth");
// const { upload, uploadFile } = require("../middleware/UploadFile")
// const { upload, uploadFile } = require("../middleware/UploadFile"); //i change this from below
const { upload, uploadFile } = require("../UploadFile"); //may be it can create issue to generate barcode but usefull in send the image in itemsImage folder only issue is from the above upload file that bstore in middleware it store the image outsdie the itemsImage folder

const router = new express.Router();

router.post("/list", items.list);
router.post("/filtered_list", items.filtered_list);
router.post("/filtered_list_by_key", items.filtered_list_by_key);
router.get("/dropdown-list", items.DropDownlist);
router.post("/catImage/store", upload.single("image"), items.store);
router.post("/update", upload.single("file"), items.update);
router.post("/details", items.details);
router.post("/delete", items.delete_item_department);
router.post(
  "/list/:company_id/:location_id",
  items.getDepartmentsByCompanyAndLocation
);

module.exports = router;

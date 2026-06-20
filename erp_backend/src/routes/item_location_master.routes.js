const express = require("express");
const router = express.Router();
const itemLocationController = require("../controller/item_location_master.controller");
const { upload, uploadFile } = require("../UploadFile");
//may be it can create issue to generate barcode but usefull in send the image in itemsImage folder only issue is from the above upload file that bstore in middleware it store the image outsdie the itemsImage folder

// router.post("/store", itemLocationController.storeItemLocations);
router.post(
  "/create-with-location",
  upload.single("item_image"),
  itemLocationController.storeItemWithLocation,
);

router.post("/update-stock-excel", itemLocationController.updateStockFromExcel);
router.post("/list", itemLocationController.getItemLocationList);
// filtere by price and stock
router.post(
  "/filter_list_by_stock_price",
  itemLocationController.getFilteredItemList,
);
router.post(
  "/filter_item_details/:item_id",
  itemLocationController.getItemDetailsById,
);
router.get("/pagination_list", itemLocationController.getItemByPagination);
router.get("/pagination_list5", itemLocationController.getItemByPagination5);
router.get("/getItemByVisibility", itemLocationController.getItemByVisibility);
router.post("/filtered_list", itemLocationController.getItemByCompLoc);
// router.post("/filtered_list_by_pr", itemLocationController.getItemByPrCompLoc);
// router.post("/details", itemLocationController.detailsItemLocation);
router.post("/details", itemLocationController.details);
router.post(
  "/update",
  upload.single("item_image"),
  itemLocationController.update,
);

///charity api
router.post(
  "/charity/list/:comp_id",
  itemLocationController.getCharityItemList,
);
//Printer

router.post("/print/barcode", itemLocationController.printBarcode);

module.exports = router;

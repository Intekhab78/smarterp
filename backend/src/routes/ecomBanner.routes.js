const express = require("express");
const router = express.Router();
// const { upload } = require("../middlewares/upload");
const { upload, uploadFile } = require("../UploadFile");

const controller = require("../controller/ecomBanner.controller");

router.post("/create", upload.single("banner_image"), controller.create);
router.get("/list", controller.getAll);
router.get("/details/:id", controller.getById);
router.put("/update/:id", upload.single("banner_image"), controller.update);
router.delete("/delete/:id", controller.remove);
router.patch("/:id/status", controller.toggleStatus);

module.exports = router;

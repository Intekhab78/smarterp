const express = require("express");
const router = express.Router();
const controller = require("../controller/item_column_translation.controller");

router.post("/create", controller.create);
router.post("/bulk-upsert", controller.bulkUpsert);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/department/:department_id", controller.getByDepartment);

router.put("/update/:id", controller.update);
router.delete("/delete/:id", controller.remove);

module.exports = router;

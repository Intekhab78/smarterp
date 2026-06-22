"use strict";

const express = require("express");
const router = express.Router();

const itemVisibilityController = require("../controller/item_visibility.controller");

// ✅ Create / Update
router.post(
  "/save",
  itemVisibilityController.createOrUpdateItemVisibilityRules
);

// ✅ Get (list / filter)
router.get("/list", itemVisibilityController.getItemVisibilityRules);

// ✅ Get by scope (edit)
router.get(
  "/view/:organisation_id/:company_id/:location_id",
  itemVisibilityController.getItemVisibilityRulesByScope
);

// ✅ Delete by scope
router.delete(
  "/delete/:organisation_id/:company_id/:location_id",
  itemVisibilityController.deleteItemVisibilityRules
);

module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();

const permissionController = require("../controller/role_permissions.controller");

// Get permissions by role
router.get("/permissions/:role_id", permissionController.getPermissionsByRole);
router.post("/permissions", permissionController.upsertPermissions);

module.exports = router;

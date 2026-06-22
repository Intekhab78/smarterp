const express = require("express");
const userGroupController = require("../controller/user_group.controller"); // Adjust the path based on where your controller is located
const router = express.Router();

// Route for fetching all user roles
router.get("/list", userGroupController.getAll); // /user-groups/
// router.get("/:id", userGroupController.getById); // /user-groups/:id
router.post("/bulk", userGroupController.bulkCreate); // /user-groups/bulk

// Route for fetching permissions by role ID
router.get('/permissions/:role_id', userGroupController.getPermissionsByRoleId);

// router.put("/:id", userGroupController.update); // /user-groups/:id
// router.delete("/:id", userGroupController.delete); // /user-groups/:id

module.exports = router;

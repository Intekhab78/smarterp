const express = require("express");
const router = express.Router();

const emailCategoryController = require("../controller/email_category_controller");

// Create a new category
router.post("/create", emailCategoryController.createCategory);

// Get all categories
router.get("/list", emailCategoryController.getAllCategories);

// Update a category by ID
router.patch("/update/:id", emailCategoryController.updateCategory);

// Delete a category by ID
router.delete("/delete/:id", emailCategoryController.deleteCategory);

router.get("/campaigns", emailCategoryController.getCategoriesWithCampaigns);

module.exports = router;

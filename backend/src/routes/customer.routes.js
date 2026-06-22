const express = require("express");
const router = express.Router();
const customerController = require("../controller/customer.controller");
const customerAuth = require("../middleware/customerAuth");

// Add Customer
router.post("/add", customerController.addCustomer);
// Add Online Customer
router.post("/online_customer_add", customerController.addEcommerceCustomer);
router.post("/online_cust_reg_login", customerController.Reg_Login_EcomCust);
// Add login
router.post("/customer_login", customerController.loginEcommerceCustomer);

router.get("/me", customerAuth, (req, res) => {
  res.json({
    success: true,
    customer: req.customer,
  });
});
// Add logout"
router.post("/customer_logout", customerController.logoutEcommerceCustomer);
// Add password update
router.post("/customer_pass_update", customerController.updatePassword);

// Edit Customer
router.put("/edit/:id", customerController.editCustomer);

// View Customer
router.get("/view/:id", customerController.viewCustomer);

// List All Customers
router.get("/list", customerController.listCustomers);

// Delete Customer
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;

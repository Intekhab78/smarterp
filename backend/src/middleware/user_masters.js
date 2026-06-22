// validations/user_masters.js
const { body } = require("express-validator");

const punchLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password").notEmpty().withMessage("Password is required"),
  body("id").optional().isNumeric().withMessage("Id must be a number"), // if you want to validate id optionally
];

module.exports = {
  punchLogin,
  // other validations...
};

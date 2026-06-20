const express = require("express");
const user = require("../controller/user.controller");
const { upload, uploadFile } = require("../middleware/UploadFile");
const Auth = require("../middleware/Auth");

const { validate } = require("../middleware/Validation");

/*** Import Validations rules using in Validation middleware ***/
const {
  login,
  forgotPassword,
  restPassword,
  changePassword,
} = require("../validations/user_masters");

const router = new express.Router();

router.post("/auth/login", validate(login), user.login);
router.post("/auth/punchlogin", validate(login), user.punchLogin);

router.post("/forgot-password", validate(forgotPassword), user.forgotPassword);
router.post(
  "/reset-password/:token",
  validate(restPassword),
  user.resetPassword
);
router.post("/change_password", user.changePassword);

//web
module.exports = router;

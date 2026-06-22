const {
  customer_master,
  customer_login,
  code_setting,
  shipping_address,
} = require("../models");

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

// Add Customer
exports.addCustomer = async (req, res) => {
  try {
    const customer = await customer_master.create(req.body);
    res.status(201).json({ success: true, customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit Customer
exports.editCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customer_master.findByPk(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    await customer.update(req.body);
    res.json({ success: true, customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// View Customer by ID
exports.viewCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customer_master.findByPk(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List All Customers
exports.listCustomers = async (req, res) => {
  try {
    const customers = await customer_master.findAll();
    res.json({ success: true, customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customer_master.findByPk(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    await customer.destroy(); // Since you have paranoid=true, it will soft-delete
    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Customer with Login form ecommerce website

exports.addEcommerceCustomer = async (req, res) => {
  const t = await customer_master.sequelize.transaction();

  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      address_line_1,
      city,
      state,
      country,
      postal_code,
    } = req.body;

    // ------------------ VALIDATIONS ------------------

    // 1️⃣ CHECK EMPTY FIELDS
    if (!email || !phone_number || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, Phone Number, and Password are required",
      });
    }

    // 2️⃣ PASSWORD LENGTH CHECK
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 3️⃣ EMAIL ALREADY EXISTS?
    const emailExists = await customer_login.findOne({
      where: { email: email },
    });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 4️⃣ PHONE NUMBER ALREADY EXISTS?
    const phoneExists = await customer_login.findOne({
      where: { phone: phone_number },
    });

    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // ------------------ GET LAST CUSTOMER CODE ------------------

    const lastCustomer = await customer_master.findOne({
      order: [["id", "DESC"]],
    });

    let customer_code = 801313;
    if (lastCustomer && lastCustomer.customer_code) {
      customer_code = parseInt(lastCustomer.customer_code) + 1;
    }

    // ------------------ HASH PASSWORD ------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ------------------ SAVE CUSTOMER ------------------
    const customer = await customer_master.create(
      {
        customer_code,
        first_name,
        last_name,
        email,
        phone: phone_number,
        billing_address: address_line_1,
        city,
        state,
        country,
        zipcode: postal_code,
      },
      { transaction: t },
    );

    // ------------------ SAVE LOGIN ------------------
    await customer_login.create(
      {
        customer_id: customer.id,
        customer_code,
        email,
        phone: phone_number,
        password: hashedPassword,
      },
      { transaction: t },
    );

    // ------------------ UPDATE CODE SETTING ------------------
    await code_setting.update(
      {
        next_coming_number_customer: customer_code + 1,
        is_final_update_customer: 1,
      },
      { where: {}, transaction: t },
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer_code,
      next_customer_code: customer_code + 1,
      customer,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login controller by the customer

exports.loginEcommerceCustomer = async (req, res) => {
  try {
    const { login_id, password } = req.body;

    // VALIDATION
    if (!login_id || !password) {
      return res.status(400).json({
        success: false,
        message: "Login ID and Password are required",
      });
    }

    // FIND CUSTOMER
    const customerLogin = await customer_login.findOne({
      where: {
        [Op.or]: [{ email: login_id }, { phone: login_id }],
      },
    });

    if (!customerLogin) {
      return res.status(400).json({
        success: false,
        message: "Invalid login ID",
      });
    }

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, customerLogin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // ⭐ FETCH NAME FROM MASTER TABLE USING customer_id
    const customerMaster = await customer_master.findOne({
      where: { id: customerLogin.customer_id },
      attributes: ["first_name", "last_name"],
    });

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        customer_id: customerLogin.customer_id,
        customer_code: customerLogin.customer_code,
        first_name: customerMaster?.first_name || "",
        last_name: customerMaster?.last_name || "",
        email: customerLogin.email,
        phone: customerLogin.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // ✅ SET COOKIE

    // res.cookie("customer_token", token, {
    //   httpOnly: true,
    //   sameSite: "Lax", // 🔥 REQUIRED for PayU redirect
    //   secure: false, // true in production (HTTPS)
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("customer_token", token, {
      httpOnly: true,
      secure: true, // 🔥 REQUIRED on HTTPS
      sameSite: "None", // 🔥 REQUIRED for cross-domain
      domain: ".jtserp.cloud", // 🔥 IMPORTANT
     // domain: ".islamicbookzone.com", // 🔥 IMPORTANT
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ SEND CUSTOMER ONLY
    return res.status(200).json({
      success: true,
      message: "Login successful",
      // token,
      customer: {
        customer_id: customerLogin.customer_id,
        customer_code: customerLogin.customer_code,
        first_name: customerMaster?.first_name || "",
        last_name: customerMaster?.last_name || "",
        email: customerLogin.email,
        phone: customerLogin.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//this controller id for the registraion and instant login

exports.Reg_Login_EcomCust = async (req, res) => {
  const t = await customer_master.sequelize.transaction();

  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      address_line_1,
      city,
      state,
      country,
      postal_code,
      dob,
      gender,
      is_guest = false,
    } = req.body;

    /* -------------------- */
    /* VALIDATIONS          */
    /* -------------------- */
    if (!email || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Email and Phone Number are required",
      });
    }

    if (!is_guest && (!password || password.length < 6)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const cleanPhone = phone_number.replace(/\D/g, "");

    /* -------------------- */
    /* DUPLICATE CHECKS     */
    /* -------------------- */
    const emailExists = await customer_login.findOne({
      where: { email },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (emailExists) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const phoneExists = await customer_login.findOne({
      where: { phone: cleanPhone },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (phoneExists) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    /* -------------------- */
    /* CUSTOMER CODE (LOCK) */
    /* -------------------- */
    const codeRow = await code_setting.findOne({
      where: {},
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!codeRow) {
      throw new Error("Customer code setting not found");
    }

    // const customer_code = codeRow.next_coming_number_customer;
    const customer_code = Number(codeRow.next_coming_number_customer);

    if (isNaN(customer_code)) {
      throw new Error("Invalid customer code format in code_setting table");
    }

    console.log("next customer code is ", customer_code);

    /* -------------------- */
    /* PASSWORD             */
    /* -------------------- */
    let hashedPassword = null;
    if (!is_guest) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    /* -------------------- */
    /* CREATE CUSTOMER      */
    /* -------------------- */
    const customer = await customer_master.create(
      {
        customer_code,
        first_name,
        last_name,
        email,
        phone: cleanPhone,
        billing_address: address_line_1,
        city,
        state,
        country,
        dob,
        gender,
        zipcode: postal_code,
      },
      { transaction: t },
    );

    /* -------------------- */
    /* CREATE SHIPPING ADDR */
    /* -------------------- */
    await shipping_address.create(
      {
        customer_id: customer.id,
        customer_code: customer_code,

        full_name: `${first_name} ${last_name}`,
        phone_number: cleanPhone,
        alternate_phone_number: null,

        pincode: postal_code,
        address_line1: address_line_1,
        address_line2: null,

        city,
        state,
        country,

        address_type: "Home",
        is_default: 1,

        latitude: null,
        longitude: null,

        status: "Active",
      },
      { transaction: t },
    );

    /* -------------------- */
    /* CREATE LOGIN         */
    /* -------------------- */
    if (!is_guest) {
      await customer_login.create(
        {
          customer_id: customer.id,
          customer_code,
          email,
          phone: cleanPhone,
          password: hashedPassword,
        },
        { transaction: t },
      );
    }

    /* -------------------- */
    /* UPDATE NEXT CODE     */
    /* -------------------- */
    await code_setting.update(
      {
        next_coming_number_customer: customer_code + 1,
        is_final_update_customer: 1,
      },
      { where: {}, transaction: t },
    );

    /* -------------------- */
    /* COMMIT TRANSACTION   */
    /* -------------------- */
    await t.commit();

    /* -------------------- */
    /* TOKEN                */
    /* -------------------- */
    const token = jwt.sign(
      {
        customer_id: customer.id,
        customer_code,
        first_name,
        last_name,
        email,
        phone: cleanPhone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // res.cookie("customer_token", token, {
    //   httpOnly: true,
    //   sameSite: "Lax", // 🔥 REQUIRED for PayU redirect
    //   secure: false, // true in production (HTTPS)
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("customer_token", token, {
      httpOnly: true,
      secure: true, // 🔥 REQUIRED on HTTPS
      sameSite: "None", // 🔥 REQUIRED for cross-domain
      domain: ".jtserp.cloud", // 🔥 IMPORTANT
      //domain: ".islamicbookzone.com", // 🔥 IMPORTANT

      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      customer: {
        customer_id: customer.id,
        customer_code,
        first_name,
        last_name,
        email,
        phone: cleanPhone,
        is_guest,
      },
    });
  } catch (error) {
    if (!t.finished) await t.rollback();

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update password
exports.updatePassword = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.json({ status: false, message: "Missing details" });
    }

    const user = await customer_login.findOne({
      where: {
        [Op.or]: [{ email: loginId }, { phone: loginId }],
      },
    });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ status: false, message: "Server error" });
  }
};
//logout
exports.logoutEcommerceCustomer = async (req, res) => {
  try {
    // res.clearCookie("customer_token", {
    //   httpOnly: true,
    //   sameSite: "Lax", // MUST match login
    //   secure: false, // true in production
    //   path: "/", // IMPORTANT
    // });
    res.clearCookie("customer_token", {
      httpOnly: true,
      secure: true, // 🔥 MUST match
      sameSite: "None", // 🔥 MUST match
      domain: ".jtserp.cloud", // 🔥 MUST match
      //domain: ".islamicbookzone.com", // 🔥 IMPORTANT

      path: "/", // 🔥 MUST match
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCustomerLogin = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const login = await customer_login.findOne({
      where: { customer_id },
    });

    if (!login) {
      return res.status(404).json({
        success: false,
        message: "Login record not found",
      });
    }

    await login.update(req.body);

    res.json({ success: true, login });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLastLogin = async (customer_id) => {
  await customer_login.update(
    { last_login: new Date() },
    { where: { customer_id } },
  );
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// const { Op } = require("sequelize");
const { Op, Sequelize } = require("sequelize");
const { sendMail } = require("../utils/SendMail");
const { sendMessage } = require("../utils/Twilio");
const ResponseFormatter = require("../utils/ResponseFormatter");
const otpGenerator = require("otp-generator");
const QRCode = require("qrcode");
var ejs = require("ejs");
const db = require("../models");
const { UserCheckStatus, translate_message } = require("../utils/handler");
const userModel = db.user_master;
const employeeModel = db.Employee;
const WorkModel = db.Work_details;
const userUserModel = db.user_user_master;
const role_master = db.role_master;
const permissionsModel = db.permissions;
const user_group = db.user_group;
const UserTempOtp = db.user_temp_otp;
const passwordResetsModel = db.password_resets;
const emailContentModel = db.email_content;
const festivalModel = db.festival_master;
const StandMaster = db.stand_master;
const UserWalletHistory = db.user_wallet_history;
const standUserModel = db.standUser;
const serviceModel = db.service;
const serviceProductModel = db.service_product;
const serviceProductLikeModel = db.service_product_like;
const servicebuyModel = db.service_buy;
const serviceproductattributeModel = db.service_product_attribute;

const otp_msg = "Your One Time Password for securely accessing CPH4 app is ";

const punchLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", req.body);

    // Find user by email only
    const user = await userModel.findOne({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "User not found!",
            "Error",
            ""
          )
        );
    }

    // Check password
    let hash = user.password.replace(/^\$2y(.+)$/i, "$2a$1");
    const passwordMatched = await bcrypt.compare(password, hash);
    if (!passwordMatched) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Incorrect password!",
            "Error",
            ""
          )
        );
    }

    // Fetch employee details by email
    const employee = await employeeModel.findOne({
      where: { emp_email: user.email },
    });

    let workData = null;
    if (employee) {
      workData = await WorkModel.findOne({
        where: { emp_id: employee.emp_id },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userId: user.id },
      "secreatnoteforfestivalapp",
      { expiresIn: "300d" }
    );
    const BASE_URL = process.env.BASE_IMAGE_URL;
    const PROFILE_PATH = process.env.EMPLOYEE_PROFILE_PATH;
    // Prepare filtered employee data
    const filteredEmployee = employee
      ? {
          emp_id: employee.emp_id,
          emp_title: employee.emp_title,
          emp_fname: employee.emp_fname,
          emp_lname: employee.emp_lname,
          emp_email: employee.emp_email,
          emp_phone: employee.emp_phone,
          emp_address: employee.emp_address,
          emp_department: employee.emp_department,
          emp_designation: employee.emp_designation,
          // emp_profile_pic: employee.emp_profile_pic,
          emp_profile_pic: employee.emp_profile_pic
            ? `${BASE_URL}${PROFILE_PATH}${employee.emp_profile_pic}`
            : null,
          created_at: employee.created_at,
          updated_at: employee.updated_at,
          deleted_at: employee.deleted_at,
        }
      : null;
    const filteredManager = workData
      ? {
          manager_id: workData.manager,
        }
      : null;

    // return res.status(200).json(
    //   ResponseFormatter.setResponse(true, 200, "Login successful!", "", {
    //     employee: filteredEmployee,
    //     manager_id: filteredManager.manager_id, // ⭐ ADD WORK TABLE HERE
    //     token,
    //   })
    // );

    return res.status(200).json(
      ResponseFormatter.setResponse(true, 200, "Login successful!", "", {
        employee: filteredEmployee,
        manager: workData ? workData.manager : null,
        token,
      })
    );
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json(
        ResponseFormatter.setResponse(
          false,
          500,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

//user login code for the ERP like POS,Admin,saleman
const login5 = async (req, res) => {
  try {
    const { email, password, id } = req.body;

    console.log("Login attempt:", req.body);

    // ✅ Build dynamic where condition
    const whereCondition = [];

    if (email) {
      whereCondition.push({ email });
    }

    if (id) {
      whereCondition.push({ id });
    }

    // ❗ Safety check
    if (whereCondition.length === 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email or User ID is required!",
            "Error",
            ""
          )
        );
    }

    // 🔍 Find user
    const user = await userModel.findOne({
      where: {
        [Op.or]: whereCondition,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "User not found!",
            "Error",
            ""
          )
        );
    }

    // 🔐 Password check
    const hash = user.password.replace(/^\$2y(.+)$/i, "$2a$1");
    const passwordMatched = await bcrypt.compare(password, hash);

    if (!passwordMatched) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Incorrect password!",
            "Error",
            ""
          )
        );
    }

    // 👤 Employee (optional)
    const employee = await employeeModel.findOne({
      where: { emp_email: user.email },
    });

    // 🧠 ROLE (ONLY 2)
    let role;

    if (user.role_id === 1) {
      role = "admin";
    } else if (user.role_id === 2) {
      role = "user";
    } else {
      return res
        .status(403)
        .json(
          ResponseFormatter.setResponse(
            false,
            403,
            "Access denied!",
            "Error",
            ""
          )
        );
    }

    // 🔑 JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "30d" }
    );

    // 📦 Response
    const responseUser = {
      id: user.id,
      email: user.email,
      role,
      employeeData: employee ? employee.toJSON() : null,
      token,
    };

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Login successful!",
          "",
          responseUser
        )
      );
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json(
        ResponseFormatter.setResponse(
          false,
          500,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, type, id } = req.body;
    console.log("Login attempt:", req.body);

    // Get user from DB by email or ID
    const user = await userModel.findOne({
      where: {
        [Op.or]: [{ email }, { id }],
      },
    });

    if (!user) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "User not found!",
            "Error",
            ""
          )
        );
    }

    // ✅ Check password
    let hash = user.password.replace(/^\$2y(.+)$/i, "$2a$1");
    const passwordMatched = await bcrypt.compare(password, hash);
    if (!passwordMatched) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Incorrect password!",
            "Error",
            ""
          )
        );
    }

    //===========================
    // ⭐ FETCH EMPLOYEE DETAILS
    //===========================
    const employee = await employeeModel.findOne({
      where: { emp_email: user.email },
    });

    // ✅ Enforce role/type restriction
    // Let's assume you store role info in user.role_id or user.type
    // Example mapping:
    // 1 => Admin
    // 2 => Salesman
    // 4 => POS
    let userRole = user.role_id; // or user.type if that’s your column

    // if (
    //   (type === "Salesman" && userRole !== 1) ||
    //   (type === "User" && userRole !== 2)
    //   // ||
    //   // (type === "Pos" && userRole !== 4)
    // ) {
    //   return res
    //     .status(403)
    //     .json(
    //       ResponseFormatter.setResponse(
    //         false,
    //         403,
    //         "Access denied for this role!",
    //         "Error",
    //         ""
    //       )
    //     );
    // }

    // ✅ Create JWT
    const jWtToken = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        type: type,
      },
      "secreatnoteforfestivalapp",
      { expiresIn: "300d" }
    );

    const refreshToken = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        type: type,
      },
      "secreatnoteforfestivalapp",
      { expiresIn: "300d" }
    );

    const responseUser = {
      ...user.toJSON(),
      employeeData: employee ? employee.toJSON() : null, // ⭐ ADD EMPLOYEE DATA

      token: jWtToken,
      refreshToken,
      type,
    };

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Login successful!",
          "",
          responseUser
        )
      );
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json(
        ResponseFormatter.setResponse(
          false,
          500,
          "Something went wrong!",
          "Error",
          error
        )
      );
  }
};

const login1 = async (req, res, next) => {
  const { email, password, type, id } = req.body;

  console.log(", req.body", req.body);
  let firstName = "";
  let lastName = "";

  // Split full name only if it contains a space
  if (email && email.includes(" ")) {
    const parts = email.trim().split(" ");
    firstName = parts[0];
    lastName = parts.slice(1).join(" ");
  }

  try {
    let user;
    // if (type == "User" || type == 4) {
    //   user = await userModel.findOne({
    //     include: [
    //       {
    //         model: role_master,
    //         as: "role", // The associated User model
    //         include: [
    //           {
    //             model: permissionsModel,
    //             as: "permissions",
    //           },
    //         ],
    //       },
    //       // {
    //       //   model: user_group,
    //       //   as: "user_group",
    //       // },
    //     ],

    //     where: {
    //       [Op.or]: [
    //         { email: email },
    //         { id: id },
    //         { firstname: email }, // check with just first name
    //         { lastname: email }, // check with just last name
    //         {
    //           [Op.and]: [{ firstname: firstName }, { lastname: lastName }],
    //         },
    //       ],
    //     },
    //     // where: {
    //     //   [Op.or]: [
    //     //     { email: email },
    //     //     { id: id }, // assuming `id` is coming from the frontend if user enters ID
    //     //     { firstname: email }, // ✅ added for name login
    //     //   ],
    //     // },

    //     // where: {
    //     //   email: email,
    //     // },
    //   });
    // }

    if (type == "User" || type == 4) {
      user = await userModel.findOne({
        where: { email },
      });
    } else {
      user = await userModel.findOne({
        where: {
          email: email,
        },
      });
    }
    /** Get user by Email Address **/
    if (!user) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "user not found",
            "Error",
            ""
          )
        );
      return;
    }

    /** match the password **/
    var hash = user.password;
    hash = hash.replace(/^\$2y(.+)$/i, "$2a$1");
    const passwordMatched = await bcrypt.compare(password, hash);
    if (!passwordMatched) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "password not match",
            "Error",
            ""
          )
        );
      return;
    }

    const jWtToken = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        type: type, // ✅ Add this line
      },
      "secreatnoteforfestivalapp",
      { expiresIn: "300d" }
    );

    const refreshToken = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        type: type, // ✅ Add this line
      },
      "secreatnoteforfestivalapp",
      { expiresIn: "300d" }
    );

    user = {
      ...user.toJSON(),
      ...{ token: jWtToken, refreshToken: refreshToken, type: "user" },
    };
    res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "", "", user));
  } catch (error) {
    // res.status(400).json(ResponseFormatter.setResponse(false, 400, message.lablevalue, 'Error', ''));
    res
      .status(200)
      .json(ResponseFormatter.setResponse(false, 500, "", "", error));
  }
};

const forgotPassword = async (req, res, next) => {
  const { language_id } = req.body;

  try {
    const { count: emailCount, rows: user } = await userModel.findAndCountAll({
      where: {
        email: { [Op.eq]: req.body.email },
      },
    });
    console.log("emalCount -------.", user);
    if (emailCount === 0) {
      let message = await translate_message(14, language_id);
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            message.lablevalue,
            "Error",
            ""
          )
        );
      return;
    }

    let token = await bcrypt.hash(req.body.email, 8);
    token = token.replace("/", "");
    const tokenObj = await passwordResetsModel.create({
      email: req.body.email,
      token: token,
    });

    const emailContent = await emailContentModel
      .findOne({
        where: {
          name: "FORGOT PASSWORD",
        },
      })
      .then((res) => {
        const local_url = "http://localhost:3000/reset-password";
        const placeholders = {
          username: user[0].first_name,
          resetpasswordlink: `http://festivalappapi.cph4.ch/reset-password/${token}`,
        };

        var content = res.content.replace(
          "##reset link##",
          `<a href="http://festivalappapi.cph4.ch/reset-password/${token}">
                                                                    <button style="font-size: 20px; border: 0px; height: 55px; line-height: 55px; color: #ffffff; padding: 0 50px; border-radius: 30px; background-image: linear-gradient(to right,#ab02ff 0%,#0cb8f3 57%,#01fb7a 100%); cursor: pointer;">
                                                                        Reset Password
                                                                    </button>
                                                                </a>`
        );
        var content_final = content.replace("##USERNAME##", user[0].email);
        const mailContent = ejs.render(content_final, placeholders);

        sendMail("info@cph4.ch", req.body.email, res.subject, mailContent);
      });
    let message = await translate_message(31, language_id);
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          message.lablevalue,
          "Success",
          { token: token }
        )
      );
  } catch (error) {
    console.log(error);
    let message = await translate_message(13, language_id);
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          message.lablevalue,
          "Error",
          error.message
        )
      );
  }
};

const resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const { password, language_id } = req.body;

  try {
    const tokenFound = await passwordResetsModel.findOne({
      where: {
        token: token,
      },
    });

    if (!tokenFound) {
      let message = await translate_message(32, language_id);
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            message.lablevalue,
            "Error",
            ""
          )
        );
    }

    let User = await userModel.findOne({
      where: {
        email: tokenFound.email,
      },
    });

    if (!User) {
      let message = await translate_message(21, language_id);
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            message.lablevalue,
            "Error",
            ""
          )
        );
    }

    User = Object.assign(User, {
      password: password,
    });
    User.save();
    let message = await translate_message(33, language_id);
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          message.lablevalue,
          "Success",
          User
        )
      );
  } catch (error) {
    let message = await translate_message(32, language_id);
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          message.lablevalue,
          "Error",
          error.message
        )
      );
  }
};

const changePassword = async (req, res, next) => {
  const { user_id, old_password, new_password, confirm_password } = req.body;

  try {
    let User = await userModel.findOne({
      where: {
        id: user_id,
      },
    });

    if (!User) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "User not found",
            "Error",
            ""
          )
        );
    }

    var hash = User.password;
    hash = hash.replace(/^\$2y(.+)$/i, "$2a$1");

    const passwordMatched = await bcrypt.compare(old_password, hash);

    if (!passwordMatched) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Old password not match",
            "Error",
            ""
          )
        );
      return;
    }
    var hashedpass = await bcrypt.hash(new_password, 8);
    User = await userModel.update(
      {
        password: hashedpass,
      },
      {
        where: {
          id: user_id,
        },
      }
    );
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Password changed",
          "Success",
          User
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(false, 400, "", "Error", error.message)
      );
  }
};

const Check_user = async (req, res, next) => {
  const { email, festival_name, phone } = req.body;

  try {
    /** Check email address exits **/
    const { count: emailCount } = await userModel.findAndCountAll({
      where: { email: email },
    });

    const { count: festivalCount } = await festivalModel.findAndCountAll({
      where: { name: festival_name },
    });

    if (festivalCount > 0) {
      let message = await translate_message(46, 1);
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            message.lablevalue,
            "Error",
            ""
          )
        );
      return;
    }

    //let user;
    if (emailCount > 0) {
      let message = await translate_message(2, 1);
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            message.lablevalue,
            "Error",
            ""
          )
        );
      return;
      // user = await userModel.findOne({
      //     where: { email: email }
      // })
    }

    if (phone != "") {
      const { count: phonecount } = await userModel.findAndCountAll({
        where: { phone: phone },
      });

      if (phonecount > 0) {
        let message = await translate_message(24, 1);
        res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              message.lablevalue,
              "Error",
              ""
            )
          );
        return;
      }
    }
    let message = await translate_message(21, 1);
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(false, 200, message.lablevalue, "", "")
      );

    // if (!user) {
    //     res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
    // } else {
    //     res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', user));
    //     return
    // }
  } catch (error) {
    let message = await translate_message(13, 1);
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          message.lablevalue,
          "Error",
          ""
        )
      );
  }
};

const WebsendOtp = async (req, res, next) => {
  const { phonecode, mobileno, email, language_id } = req.body;

  try {
    let user = await userModel.findOne({
      where: {
        phone: mobileno,
        email: email,
      },
    });

    if (user) {
      let message = await translate_message(34, language_id);
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            message.lablevalue,
            "Error",
            ""
          )
        );
      return;
    }

    // const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
    const otp = Math.floor(Math.random() * (999 - 9999 + 1) + 9999);
    var PhoneNumber = phonecode + mobileno;
    var sendMsgOtpMessage = otp_msg + otp;
    var sendMsgOtp = otp;
    var response = sendMessage(PhoneNumber, sendMsgOtpMessage);

    const StoreOtp = await UserTempOtp.findOne({
      where: {
        mobile_no: mobileno,
      },
    });

    if (StoreOtp) {
      const Store = await UserTempOtp.update(
        {
          mobile_no: mobileno,
          otp: otp,
          status: "active",
        },
        {
          where: {
            id: StoreOtp.id,
          },
        }
      );
    } else {
      const Store = await UserTempOtp.create({
        mobile_no: mobileno,
        otp: otp,
        status: "active",
      });
    }

    let message = await translate_message(35, language_id);
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          message.lablevalue,
          "Success",
          sendMsgOtp
        )
      );
  } catch (error) {
    let message = await translate_message(13, language_id);
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          message.lablevalue,
          "Error",
          error.message
        )
      );
  }
};

const getuserById = async (req, res, next) => {
  const { id, standId, type, language_id, user_id } = req.body;

  try {
    const UserCheck = await UserCheckStatus(id, standId, type);
    if (UserCheck === null || UserCheck === "") {
      let message = await translate_message(20, language_id);
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            message.lablevalue,
            "Error",
            "Deactive"
          )
        );
      return;
    }
    let UserDetail = await userModel.findByPk(id);

    if (!UserDetail) {
      let message = await translate_message(25, language_id);
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            message.lablevalue,
            "Error",
            ""
          )
        );
    } else {
      let UserDetail_photo;
      if (UserDetail.photo != "") {
        UserDetail_photo =
          "https://cph4.ch/uploads/artist_user/" + UserDetail.photo;
      } else {
        UserDetail_photo = "https://cph4.ch/images/no-image.png";
      }
      UserDetail.photo = UserDetail_photo;

      let UserDetail_art_image;
      if (UserDetail.art_image != "") {
        UserDetail_art_image =
          "https://cph4.ch/uploads/artist_user/" + UserDetail.art_image;
      } else {
        UserDetail_art_image = "https://cph4.ch/images/no-image.png";
      }
      UserDetail.art_image = UserDetail_art_image;

      const serviceRes = await serviceModel.findAll({
        where: {
          artist_id: id,
        },
      });
      UserDetail = UserDetail.toJSON();

      let product_array = [];
      for (var i = 0; i < serviceRes.length; i++) {
        let product_list = await serviceProductModel.findOne({
          where: {
            service_id: serviceRes[i].id,
          },
        });
        // for (var p = 0; p < product_list.length; p++) {
        product_list = product_list.toJSON();
        // product_list.service_display_id = '#' + product_list.service_display_id;

        const zeroPad = (num, places) => String(num).padStart(places, "0");
        if (product_list.service_display_id == null) {
          product_list.service_display_id =
            "#" + zeroPad(product_list.service_id, 6);
        } else {
          product_list.service_display_id =
            "#" + zeroPad(product_list.service_id, 6);
        }

        let like_count = await serviceProductLikeModel.findAndCountAll({
          where: {
            service_product_id: product_list.id,
          },
        });
        product_list.like_count = like_count.count;
        let like_by_user_list = await serviceProductLikeModel.findOne({
          where: {
            service_product_id: product_list.id,
            user_id: user_id,
          },
        });
        var like_by_user;
        if (!like_by_user_list) {
          like_by_user = false;
        } else {
          like_by_user = true;
        }
        product_list.like_by_user = like_by_user;
        if (product_list.file != "") {
          // product_list[p].file = product_list[p].file.replace('public/', 'http://festivalappapi.cph4.ch:5500/');
          product_list.file =
            "https://cph4.ch/uploads/service/" + product_list.file;
        } else {
          product_list.file = "https://cph4.ch/images/no-image.png";
        }
        var servive_detail = serviceRes[i].toJSON();
        var number_of_tickets = servive_detail.number_of_tickets;
        let servicebuyList = await servicebuyModel.findAll({
          where: {
            service_id: serviceRes[i].id,
            product_id: product_list.id,
          },
        });
        let tickets_sold = 0;
        //res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', servicebuyList));
        for (var s = 0; s < servicebuyList.length; s++) {
          tickets_sold = tickets_sold + servicebuyList[s].no_of_ticket;
        }
        if (tickets_sold > number_of_tickets) {
          tickets_sold = number_of_tickets;
        }
        servive_detail.available_ticket =
          tickets_sold + " OF " + number_of_tickets;
        let attribute_detail = await serviceproductattributeModel.findAll({
          where: {
            product_id: product_list.id,
            checkbox_status: 1,
          },
        });
        product_list.attribute_detail = attribute_detail;

        // }
        product_array.push(product_list);
        // UserDetail.servive_product_list = product_list
      }

      UserDetail.servive_product_list = product_array;

      const RelatedUserDetail = await userModel.findAll({
        where: {
          category_id: UserDetail.category_id,
          id: { [Op.ne]: id },
          deleted_at: null,
        },
      });
      for (var j = 0; j < RelatedUserDetail.length; j++) {
        RelatedUserDetail[j] = RelatedUserDetail[j].toJSON();
        let RelatedUserDetail_photo = "https://cph4.ch/images/no-image.png";
        if (RelatedUserDetail[j].photo != "") {
          RelatedUserDetail_photo =
            "https://cph4.ch/uploads/artist_user/" + RelatedUserDetail[j].photo;
        }
        RelatedUserDetail[j].photo = RelatedUserDetail_photo;
        var RelatedUserDetail_art_image = "https://cph4.ch/images/no-image.png";
        if (RelatedUserDetail[j].art_image != "") {
          RelatedUserDetail_art_image =
            "https://cph4.ch/uploads/artist_user/" +
            RelatedUserDetail[j].art_image;
        }
        RelatedUserDetail[j].art_image = RelatedUserDetail_art_image;
      }

      UserDetail.related_user_detail = RelatedUserDetail;

      res
        .status(200)
        .json(ResponseFormatter.setResponse(true, 200, "", "", UserDetail));
    }
  } catch (error) {
    let message = await translate_message(13, language_id);
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          message.lablevalue,
          "Error",
          error.message
        )
      );
  }
};

const refreshToken = async (req, res, next) => {
  const { refreshToken, language_id } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, "secreatnoteforfestivalapp");

    // /** match the password **/
    const jWtToken = jwt.sign(
      {
        email: decoded.email,
        userId: decoded.userId,
      },
      "secreatnoteforfestivalapp",
      { expiresIn: "300d" }
    );

    let token = {
      refreshToken: jWtToken,
    };

    res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "", "", token));
  } catch (error) {
    let message = await translate_message(13, language_id);
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          message.lablevalue,
          "Error",
          "Session expired"
        )
      );
  }
};

module.exports = {
  login,
  punchLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
};

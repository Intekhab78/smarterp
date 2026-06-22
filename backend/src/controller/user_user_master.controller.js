const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize } = require("sequelize");
const { sendMail } = require("../utils/SendMail");
const { sendMessage } = require("../utils/Twilio");
const ResponseFormatter = require("../utils/ResponseFormatter");
const otpGenerator = require("otp-generator");
const QRCode = require("qrcode");
var ejs = require("ejs");
const db = require("../models");
const { UserCheckStatus, translate_message } = require("../utils/handler");
// const userModel = db.user_user_master;
const userModel = db.user_master;
const UserCompanyModel = db.user_company;
const role_master = db.role_master;
const permissionsModel = db.permissions;
const UserTempOtp = db.user_temp_otp;
const passwordResetsModel = db.password_resets;
const emailContentModel = db.email_content;
const festivalModel = db.festival_master;
const CompanyModel = db.company;
const LocationModel = db.location;
const serviceModel = db.service;
const serviceProductModel = db.service_product;
const serviceProductLikeModel = db.service_product_like;
const servicebuyModel = db.service_buy;
const serviceproductattributeModel = db.service_product_attribute;

const otp_msg = "Your One Time Password for securely accessing CPH4 app is ";

const list = async (req, res, next) => {
  const { page, limit = 10 } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await userModel.count();
    const festivalRes = await userModel.findAll({
      include: [
        // {
        //   model: UserCompanyModel,
        //   as: "user_company",
        //   // attributes: ['user_id', 'company_id','id'],
        // },
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: LocationModel,
          as: "location",
        },
        {
          model: role_master,
          as: "role", // The associated User model
          include: [
            {
              model: permissionsModel,
              as: "permissions",
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
    const finalResponse = [];

    for (let i = 0; i < festivalRes.length; i++) {
      const user = festivalRes[i].toJSON(); // Convert user instance to plain object
      const userCompanies = user.user_company; // Access associated user_company

      if (userCompanies && userCompanies.length > 0) {
        for (let j = 0; j < userCompanies.length; j++) {
          const userCompany = userCompanies[j];

          // Find company details
          const companyDetails = await CompanyModel.findOne({
            where: { id: userCompany.company_id },
            attributes: ["compdesc"], // Fetch only the 'compdesc' field
          });

          // Add the company_name field to userCompany
          userCompany.company_name = companyDetails
            ? companyDetails.compdesc
            : "";
        }
      }

      finalResponse.push(user); // Push modified user object to the final response array
    }

    const totalPages = Math.ceil(totalRecords / limits);
    const pagination = {
      records: finalResponse,
      currentPage: currentPage,
      pageSize: limits,
      totalRecords: totalRecords,
      totalPages: totalPages,
    };

    if (!festivalRes) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, " not found!", "Error", "")
        );
    } else {
      res
        .status(200)
        .json(ResponseFormatter.setResponse(true, 200, "", "", pagination));
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};
const store = async (req, res, next) => {
  const {
    email,
    firstname,
    lastname,
    mobile,
    password,
    hire_date,
    base_subsidiary,
    home_store,
    job_title,
    till,
    drawer,
    max_disc,
    company_id, // single company ID
    location_id,
    role_id,
  } = req.body;

  console.log("req.body from store user user model is", req.body);

  try {
    // Basic validations
    if (!firstname) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "firstname field is required",
            "Error",
            ""
          )
        );
    }
    if (!lastname) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "lastname field is required",
            "Error",
            ""
          )
        );
    }
    if (!email) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "email field is required",
            "Error",
            ""
          )
        );
    }
    if (!password) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "password field is required",
            "Error",
            ""
          )
        );
    }
    if (!mobile) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "mobile field is required",
            "Error",
            ""
          )
        );
    }
    if (!company_id) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "company_id field is required",
            "Error",
            ""
          )
        );
    }
    if (!location_id) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "location_id field is required",
            "Error",
            ""
          )
        );
    }
    if (!role_id) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "role_id field is required",
            "Error",
            ""
          )
        );
    }

    // Check email uniqueness
    const email_check = await userModel.count({ where: { email: email } });
    if (email_check > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email already exist",
            "Error",
            ""
          )
        );
    }

    // Create user record
    const user = await userModel.create({
      email,
      firstname,
      lastname,
      mobile,
      password,
      hire_date,
      base_subsidiary,
      home_store,
      job_title,
      till,
      drawer,
      max_disc,
      company_id: company_id || null, // Use company_id directly
      location_id,
      role_id,
    });

    // If you want to handle multiple companies in the future,
    // you can add that logic here safely by checking if an array exists.

    // Respond success
    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          user
        )
      );
  } catch (error) {
    console.error("Error in store user:", error);

    return res
      .status(500)
      .json(
        ResponseFormatter.setResponse(
          false,
          500,
          "Server Error",
          "Error",
          error.message || error
        )
      );
  }
};

const details = async (req, res, next) => {
  const { id } = req.body;

  try {
    const festivalRes = await userModel.findOne({
      where: {
        id: id,
      },
    });

    if (!festivalRes) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "User not found!",
            "Error",
            ""
          )
        );
    } else {
      res
        .status(200)
        .json(ResponseFormatter.setResponse(true, 200, "", "", festivalRes));
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
  }
};
const update = async (req, res, next) => {
  const {
    id,
    email,
    firstname,
    lastname,
    mobile,
    password,
    hire_date,
    base_subsidiary,
    home_store,
    job_title,
    till,
    drawer,
    max_disc,
    company_id,
    location_id,
    companies,
  } = req.body;

  try {
    if (id == "" || id == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "id field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (firstname == "" || firstname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "firstname field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (lastname == "" || lastname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "lastname field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (email == "" || email == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "email field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (mobile == "" || mobile == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "mobile field is required",
            "Error",
            ""
          )
        );
      return;
    }
    let detail = await userModel.findOne({
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "User not found", "Error")
        );
    }
    if (email != detail.email) {
      let email_check = await userModel.count({ where: { email: email } });
      if (email_check > 0) {
        res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "Email already exist",
              "Error",
              ""
            )
          );
        return;
      }
    }

    detail = Object.assign(detail, {
      email: email,
      firstname: firstname,
      lastname: lastname,
      mobile: mobile,
      password: password,
      hire_date: hire_date,
      base_subsidiary: base_subsidiary,
      home_store: home_store,
      job_title: job_title,
      till: till,
      drawer: drawer,
      max_disc: max_disc,
      // company_id: company_id,
      company_id: companies?.[0],

      location_id: location_id,
    });
    detail.save();

    UserCompanyModel.destroy({
      where: {
        user_id: id,
      },
    });

    for (var i = 0; i < companies.length; i++) {
      let user_company = await UserCompanyModel.create({
        user_id: detail.id,
        company_id: companies[i],
      });
    }
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully updated record",
          "",
          detail
        )
      );
  } catch (error) {
    // res.status(400).json(ResponseFormatter.setResponse(false, 400, message.lablevalue, 'Error', ''));
    res
      .status(200)
      .json(ResponseFormatter.setResponse(false, 500, "", "", error));
  }
};

const delete_user = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await userModel.destroy({
      where: {
        id: id,
      },
    });

    if (deletedCount === 0) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "User not found!",
            "Error",
            ""
          )
        );
    } else {
      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully deleted record",
            "",
            { deletedCount }
          )
        );
    }
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong!",
          "Error",
          error.message
        )
      );
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
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully record",
          "",
          token
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
          "Session expired"
        )
      );
  }
};

module.exports = {
  store,
  list,
  details,
  delete_user,
  update,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
};

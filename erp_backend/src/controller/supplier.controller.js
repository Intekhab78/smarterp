const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const CustomerInfoModel = db.customer_info;
const UserModel = db.user_master;
const countryMastersModel = db.country_masters;
const { codesettingupdate } = require("../utils/handler");

require("dotenv").config();
const paths = require("path");
const { includes } = require("lodash");
const base_url = process.env.BASE_URL;
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const list = async (req, res, next) => {
  const { page, name, customer_code, limit = 10 } = req.body;

  try {
    // let searchQuery;

    //     // Initialize the array to hold individual conditions
    //     let conditions = [];

    //     if (customer_code) {
    //         conditions.push({
    //             customer_code: { [Op.eq]: customer_code }
    //         });
    //     }
    //     if (name) {
    //         conditions.push({
    //             [Op.or]: [
    //                 { '$users.firstname$': { [Op.iLike]: `%${name}%` } },
    //                 { '$users.lastname$': { [Op.iLike]: `%${name}%` } }
    //             ]
    //         });
    //     }

    //     // Combine all conditions into the search query
    //     if (conditions.length > 0) {
    //         searchQuery = { [Op.or]: conditions };
    //     }

    // console.log('searchQuery', searchQuery);

    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await CustomerInfoModel.count();
    const festivalRes = await CustomerInfoModel.findAll({
      //     where: searchQuery,
      attributes: [
        "id",
        "customer_code",
        "user_id",
        "status",
        "customer_address_1",
      ],
      include: [
        {
          model: UserModel,
          as: "users", // The associated User model
          // attributes: ['firstname', 'lastname', 'email', 'mobile', 'country_id'],
          include: [
            {
              model: countryMastersModel,
              as: "countrys", // The associated User model
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      // where: {
      //     [Op.or]: searchQuery
      // },
      where: { is_supplier: 1 },
      order: [["id", "DESC"]],
      // limit: limits,
      // offset: offset
    });

    // console.log("Base URL:", process.env.BASE_URL);
    const totalPages = Math.ceil(totalRecords / limits);
    const pagination = {
      records: festivalRes,
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
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully record",
            "",
            pagination
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
const store = async (req, res, next) => {
  const {
    // lastname,
    // firstname,
    cusname,
    country_id,
    cusemail1,
    mobile,
    status,
    // customer_code,
    cuscode,
    customer_address_1,
    customer_address_2,
    custax1,
    company_id,
    location_id,
  } = req.body;

  try {
    if (cusname == "" || cusname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Customer Name field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (country_id == "" || country_id == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "country field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (cusemail1 == "" || cusemail1 == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "country field is required",
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
            "country field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (customer_address_1 == "" || customer_address_1 == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Address field is required",
            "Error",
            ""
          )
        );
      return;
    }
    let email_check = await UserModel.count({
      where: { usertype: 4, email: cusemail1 },
    });
    if (email_check > 0) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email all ready exit",
            "Error",
            ""
          )
        );
      return;
    }

    codesettingupdate("supplier");

    let user = await UserModel.create({
      email: cusemail1,
      usertype: 4,
      firstname: cusname,
      // firstname: firstname,
      // lastname: lastname,
      mobile: mobile,
      password: "12345",
      country_id: country_id,
      custax1: custax1,
    });

    const customer = await CustomerInfoModel.create({
      user_id: user.id,
      organisation_id: 2,
      company_id: company_id,
      location_id: location_id,
      // customer_code: customer_code,
      customer_code: cuscode,
      customer_address_1: customer_address_1,
      customer_address_2: customer_address_2,
      customer_phone: mobile,
      status: parseInt(status),
      is_supplier: 1,
    });
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          customer
        )
      );
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

// ===== IMPORT SUPPLIERS FROM EXCEL =====
const importSuppliers = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "No file uploaded",
            "Error",
            ""
          )
        );
    }

    const filePath = req.file.path; // multer provided full path

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let insertedSuppliers = [];
    let duplicateEmails = [];

    for (let row of sheetData) {
      const {
        cusname,
        country_id,
        cusemail1,
        mobile,
        status,
        cuscode,
        customer_address_1,
        customer_address_2,
        custax1,
        company_id,
        location_id,
      } = row;

      // Check for existing email
      const emailExists = await UserModel.count({
        where: { usertype: 4, email: cusemail1 },
      });
      if (emailExists > 0) {
        duplicateEmails.push(cusemail1);
        continue; // Skip this entry
      }

      // Create user
      const user = await UserModel.create({
        email: cusemail1,
        usertype: 4,
        firstname: cusname,
        mobile: mobile,
        password: "12345",
        country_id: country_id,
        custax1: custax1,
      });

      // Create supplier entry
      const supplier = await CustomerInfoModel.create({
        user_id: user.id,
        organisation_id: 2,
        company_id: company_id,
        location_id: location_id,
        customer_code: cuscode,
        customer_address_1: customer_address_1,
        customer_address_2: customer_address_2,
        customer_phone: mobile,
        status: parseInt(status),
        is_supplier: 1,
      });

      insertedSuppliers.push(supplier);
    }

    fs.unlinkSync(filePath); // Delete the uploaded file after processing

    res.status(200).json(
      ResponseFormatter.setResponse(true, 200, "Import completed", "", {
        inserted: insertedSuppliers.length,
        duplicates: duplicateEmails,
      })
    );
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

// ===== EXPORT SUPPLIERS TO EXCEL =====
const exportSuppliers = async (req, res) => {
  try {
    const suppliers = await CustomerInfoModel.findAll({
      where: { is_supplier: 1 },
      include: [{ model: UserModel, as: "users" }],
    });

    const exportData = suppliers.map((s) => ({
      cusname: s.users.firstname,
      country_id: s.users.country_id,
      cusemail1: s.users.email,
      mobile: s.users.mobile,
      status: s.status,
      cuscode: s.customer_code,
      customer_address_1: s.customer_address_1,
      customer_address_2: s.customer_address_2,
      custax1: s.users.custax1,
      company_id: s.company_id,
      location_id: s.location_id,
    }));

    const XLSX = require("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");

    // Write to buffer instead of file
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=suppliers.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
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
    // lastname,
    // firstname,
    cusname,
    country_id,
    mobile,
    status,
    customer_address_1,
    customer_address_2,
    cusemail1,
    // subemail2,
    // cusemail3,
    // cusemail4,
    // cussname,
    // cuscomname,
    custax1,
    company_id,
    location_id,
    // custax2,
    // custax3,
    // cusauth,
    // cusfax,
    // cusdob,
    // cusanndt,
    // custoll,
    // cusconpername,
    // cusconpername2,
    // cusconpername3,
    // cusphone,
    // cusphone2,
    // cusphone3,
    // mobile2,
    // custaxdt1,
    // custaxdt2,
    // note1,
    // note2,
    // addedby,
    // createddt,
    // category,
    // custitle,
    // cusadd3,
    // cusbrand,
    // otherno,
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
    if (cusname == "" || cusname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Customer Name field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (country_id == "" || country_id == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "country field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (cusemail1 == "" || cusemail1 == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "country field is required",
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
            "country field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (customer_address_1 == "" || customer_address_1 == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Address field is required",
            "Error",
            ""
          )
        );
      return;
    }
    // codesettingupdate('customer');
    const customer_find = await CustomerInfoModel.findOne({
      //     where: searchQuery,
      attributes: ["id", "customer_code", "user_id"],
      include: [
        {
          model: UserModel,
          as: "users", // The associated User model
          attributes: ["firstname", "lastname", "email"],
        },
      ],
      where: {
        id: id,
      },
    });
    if (!customer_find) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "customer not found",
            "Error"
          )
        );
    }

    let email_check = await UserModel.count({
      where: {
        usertype: 4,
        email: { [Op.eq]: cusemail1 },
        id: { [Op.ne]: customer_find.user_id },
      },
    });
    if (email_check > 0) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email all ready exit",
            "Error",
            ""
          )
        );
      return;
    }

    let user = await UserModel.update(
      {
        email: cusemail1,
        usertype: 2,
        firstname: cusname,

        // firstname: firstname,
        // lastname: lastname,
        mobile: mobile,
        password: "12345",
        country_id: country_id,
        custax1: custax1,
      },
      {
        where: {
          id: customer_find.user_id,
        },
      }
    );

    const customer = await CustomerInfoModel.update(
      {
        // user_id:user.id,
        // payment_term_id: payment_term_id,
        // organisation_id: 2,
        // is_parent: is_parent,
        // customer_type_id: customer_type_id,
        // customer_address_1: customer_address_1,
        // customer_address_2: customer_address_2,
        // customer_city: customer_city,
        // customer_state: customer_state,
        // customer_zipcode: customer_zipcode,
        // customer_phone: mobile,
        user_id: user.id,
        organisation_id: 2,
        company_id: company_id,
        location_id: location_id,
        customer_address_1: customer_address_1,
        customer_address_2: customer_address_2,
        customer_phone: mobile,
        status: parseInt(status),
      },
      {
        where: {
          id: id,
        },
      }
    );

    const customer_finds = await CustomerInfoModel.findOne({
      //     where: searchQuery,
      attributes: ["id", "customer_code", "user_id"],
      include: [
        {
          model: UserModel,
          as: "users", // The associated User model
          attributes: ["firstname", "lastname", "email"],
        },
      ],
      where: {
        id: id,
      },
    });
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully updated record",
          "",
          customer_finds
        )
      );
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
const details = async (req, res, next) => {
  const { id } = req.body;

  try {
    // codesettingupdate('customer');
    const customer_find = await CustomerInfoModel.findOne({
      //     where: searchQuery,
      // attributes: ['id', 'customer_code', 'user_id'],
      include: [
        {
          model: UserModel,
          as: "users", // The associated User model
          // attributes: ['firstname', 'lastname', 'email'],
          include: [
            {
              model: countryMastersModel,
              as: "countrys",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });
    if (!customer_find) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "customer not found",
            "Error"
          )
        );
    }
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully show record",
          "",
          customer_find
        )
      );
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
const delete_customer = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const customer_find = await CustomerInfoModel.findOne({
      where: {
        id: id,
      },
    });
    if (!customer_find) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "customer not found",
            "Error"
          )
        );
    }

    const cust_del = await CustomerInfoModel.destroy({
      where: {
        id: id,
      },
    });
    const user_del = await UserModel.destroy({
      where: {
        id: customer_find.user_id,
      },
    });
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully deleted record",
          ""
        )
      );
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
module.exports = {
  list,
  store,
  update,
  details,
  delete_customer,
  importSuppliers,
  exportSuppliers,
};

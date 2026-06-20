const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const CustomerInfoModel = db.customer_info;
const InvoiceModel = db.invoice;
const userCompanyModel = db.user_company;
const OrderModel = db.order;
const InventoryMovementModel = db.inventory_movement;
const InvoiceDetailModel = db.invoice_details;
const OrderDetailModel = db.order_details;
const BatchModel = db.batch;
const customer_master = db.customer_master;
const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_master;
const paymentTermsModel = db.payment_terms;
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Readable } = require("stream");
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const UserModel = db.user_master;
const countryMastersModel = db.country_masters;
const GrnModel = db.grn;
const GrnDetailModel = db.good_receipt_note_details;
const CompanyModel = db.company;
const LocationModel = db.location;
const { codesettingupdate, codesettingGet } = require("../utils/handler");
require("dotenv").config();
const paths = require("path");
const { includes } = require("lodash");
const base_url = process.env.BASE_URL;
const ExcelJS = require("exceljs");
const multer = require("multer");
const { log } = require("console");

const list1 = async (req, res, next) => {
  const { page, name, customer_code, user_id, limit = 10 } = req.body;

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
    let companyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: {
          user_id: user_id,
        },
        attributes: ["company_id"], // Only fetch the 'company_id' field
      });

      companyIds = userCompanies.map((company) => company.company_id);
    }
    const whereClause = {
      ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
    };
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await CustomerInfoModel.count();
    const festivalRes = await CustomerInfoModel.findAll({
      //     where: searchQuery,
      where: whereClause,
      attributes: ["id", "customer_code", "user_id", "status"],
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: LocationModel,
          as: "locations",
        },
        {
          model: UserModel,
          as: "users", // The associated User model
          // attributes: ['firstname', 'lastname', 'email', 'mobile', 'cuscountry'],
          include: [
            {
              model: countryMastersModel,
              as: "country", // The associated User model
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      // where: {
      //     [Op.or]: searchQuery
      // },
      // where: searchQuery,
      where: { is_supplier: 0 },
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

const list = async (req, res, next) => {
  const { page, name, customer_code, user_id, limit = 10 } = req.body;

  try {
    // Handle pagination
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;

    // 🔹 Build search conditions
    let conditions = { deleted_at: null };

    if (customer_code) {
      conditions.customer_code = { [Op.eq]: customer_code };
    }

    if (name) {
      conditions[Op.or] = [
        { first_name: { [Op.iLike]: `%${name}%` } },
        { last_name: { [Op.iLike]: `%${name}%` } },
        { email: { [Op.iLike]: `%${name}%` } },
        { phone: { [Op.iLike]: `%${name}%` } },
      ];
    }

    // 🔹 Filter by companies if user_id is passed
    let companyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: { user_id: user_id },
        attributes: ["company_id"],
      });
      companyIds = userCompanies.map((company) => company.company_id);

      if (companyIds.length > 0) {
        conditions.company_id = { [Op.in]: companyIds };
      }
    }

    // 🔹 Fetch total count
    const totalRecords = await customer_master.count({ where: conditions });

    // 🔹 Fetch data
    const customers = await customer_master.findAll({
      where: conditions,
      attributes: [
        "id",
        "customer_code",
        "first_name",
        "last_name",
        "email",
        "phone",
        "alternate_phone",
        "dob",
        "gender",
        "billing_address",
        "shipping_address",
        "city",
        "state",
        "country",
        "zipcode",
        "gst_number",
        "customer_type",
        "loyalty_points",
        "status",
        "created_at",
        "updated_at",
      ],
      // include: [
      //   {
      //     model: CompanyModel,
      //     as: "company",
      //     attributes: ["id", "name"],
      //   },
      //   {
      //     model: LocationModel,
      //     as: "locations",
      //     attributes: ["id", "name"],
      //   },
      //   {
      //     model: countryMastersModel,
      //     as: "country_detail",
      //     attributes: ["id", "name"],
      //   },
      // ],
      order: [["id", "DESC"]],
      limit: limits,
      offset: offset,
    });

    // 🔹 Pagination response
    const totalPages = Math.ceil(totalRecords / limits);
    const pagination = {
      records: customers,
      currentPage: currentPage,
      pageSize: limits,
      totalRecords: totalRecords,
      totalPages: totalPages,
    };

    if (!customers || customers.length === 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "No customers found",
            "Error",
            ""
          )
        );
    }

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully fetched customers",
          "",
          pagination
        )
      );
  } catch (error) {
    return res
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

const exportCustomers = async (req, res) => {
  try {
    // Fetch customer data with all the fields needed for export
    const customers = await CustomerInfoModel.findAll({
      where: { is_supplier: 0 },
      include: [
        {
          model: UserModel,
          as: "users",
          attributes: [
            "firstname",
            "lastname",
            "mobile",
            "email",
            "cuscat",
            "cuscountry",
            "cussname",
            "custax1",
            "custitle",
            // "cusemail2",
            // "cusemail3",
            // "cusemail4",
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    // Match the import headers exactly
    worksheet.columns = [
      { header: "cuscode", key: "cuscode", width: 20 },
      { header: "custitle", key: "custitle", width: 15 },
      { header: "firstname", key: "firstname", width: 25 },
      { header: "lastname", key: "lastname", width: 25 },
      { header: "mobile", key: "mobile", width: 15 },
      { header: "email", key: "email", width: 30 },
      // { header: "cusemail1", key: "cusemail1", width: 30 },

      { header: "customer_address_1", key: "customer_address_1", width: 30 },

      { header: "cuscat", key: "cuscat", width: 20 },
      { header: "cuscountry", key: "cuscountry", width: 20 },
      { header: "company_id", key: "company_id", width: 15 },
      { header: "location_id", key: "location_id", width: 15 },
      { header: "customer_address_2", key: "customer_address_2", width: 30 },
      { header: "status", key: "status", width: 10 },
    ];

    // Fill rows
    customers.forEach((cust) => {
      worksheet.addRow({
        custitle: cust.users?.custitle || "",
        firstname: cust.users?.firstname || "",
        lastname: cust.users?.lastname || "",
        // custax1: cust.users?.custax1 || "",
        mobile: cust.users?.mobile || "",
        email: cust.users?.email || "",

        customer_address_1: cust.customer_address_1 || "",

        cuscat: cust.users?.cuscat || "",
        cuscountry: cust.users?.cuscountry || "",

        company_id: cust.company_id || "",
        location_id: cust.location_id || "",
        cuscode: cust.customer_code || "",
        customer_address_2: cust.customer_address_2 || "",
        // cusemail2: cust.users?.cusemail2 || "",
        // cusemail3: cust.users?.cusemail3 || "",
        // cusemail4: cust.users?.cusemail4 || "",
        status: cust.status || 1,
      });
    });

    // Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=customers.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error exporting data",
      error: error.message,
    });
  }
};

const store = async (req, res, next) => {
  const {
    customer_code,
    first_name,
    last_name,
    email,
    phone,
    alternate_phone,
    dob,
    gender,
    billing_address,
    shipping_address,
    city,
    state,
    country,
    zipcode,
    gst_number,
    customer_type,
    loyalty_points,
    status,
    created_at,
    updated_at,
    deleted_at,
  } = req.body;

  try {
    // Required field validations
    if (!first_name || first_name.trim() === "") {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "First Name field is required",
            "Error",
            ""
          )
        );
    }

    if (!gst_number || gst_number.trim() === "") {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "GST Number field is required",
            "Error",
            ""
          )
        );
    }

    if (!phone || phone.trim() === "") {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Phone field is required",
            "Error",
            ""
          )
        );
    }

    if (!billing_address || billing_address.trim() === "") {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Billing Address field is required",
            "Error",
            ""
          )
        );
    }

    if (email) {
      // Check if email already exists for usertype = 2
      let email_check = await UserModel.count({
        where: { usertype: 2, email: email },
      });

      if (email_check > 0) {
        return res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "Email already exists",
              "Error",
              ""
            )
          );
      }
    }

    // Update customer code setting
    codesettingupdate("customer");

    // Create customer record
    let customer = await customer_master.create({
      customer_code: customer_code,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      alternate_phone: alternate_phone || null,
      dob: dob || null,
      gender: gender || null,
      billing_address: billing_address,
      shipping_address: shipping_address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      zipcode: zipcode || null,
      gst_number: gst_number,
      customer_type: customer_type || null,
      loyalty_points: loyalty_points || 0,
      status: status || "1",
      created_at: created_at || new Date(),
      updated_at: updated_at || new Date(),
      deleted_at: deleted_at || null,
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

const importCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, message: "No file uploaded" });
    }

    function getCellValue(cell) {
      if (!cell) return null;
      if (typeof cell === "object") {
        if ("text" in cell) return cell.text;
        if ("richText" in cell)
          return cell.richText.map((rt) => rt.text).join("");
        return null;
      }
      return cell;
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0];
    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      rows.push({
        cuscode: getCellValue(row.getCell(1).value),
        custitle: getCellValue(row.getCell(2).value),
        firstname: getCellValue(row.getCell(3).value),
        lastname: getCellValue(row.getCell(4).value),
        mobile: getCellValue(row.getCell(5).value),
        email: getCellValue(row.getCell(6).value),
        customer_address_1: getCellValue(row.getCell(7).value),
        cuscat: getCellValue(row.getCell(8).value),
        cuscountry: getCellValue(row.getCell(9).value),
        company_id: Number(getCellValue(row.getCell(10).value)) || null,
        location_id: Number(getCellValue(row.getCell(11).value)) || null,
        customer_address_2: getCellValue(row.getCell(12).value),
        status: parseInt(getCellValue(row.getCell(13).value)) || 1,
        addedby: req.user?.name || "Imported",
        createddt: new Date().toLocaleString(),
      });
    });

    for (const data of rows) {
      console.log("Processing user/email:", data.email);

      // Check for duplicate email
      const existingUser = await UserModel.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: `Import failed: User with email "${data.email}" already exists.`,
        });
      }

      // Check for duplicate customer_code
      const existingCustomerInfo = await CustomerInfoModel.findOne({
        where: { customer_code: data.cuscode },
      });
      if (existingCustomerInfo) {
        return res.status(400).json({
          status: false,
          message: `Import failed: Customer with customer_code "${data.cuscode}" already exists.`,
        });
      }

      // Create user
      const user = await UserModel.create({
        email: data.email,
        usertype: 2,
        role_id: 2,
        firstname: data.firstname,
        lastname: data.lastname,
        mobile: data.mobile,
        cuscat: data.cuscat,
        cuscountry: data.cuscountry,
        cussname: data.firstname,
        custax1: "",
        custitle: data.custitle,
      });
      console.log("Created new user with id:", user.id);

      // Create customer info
      await CustomerInfoModel.create({
        user_id: user.id,
        organisation_id: 2,
        fssai_no: "",
        state_code: "",
        msme_no: "",
        company_id: data.company_id,
        location_id: data.location_id,
        customer_code: data.cuscode,
        customer_address_1: data.customer_address_1,
        customer_address_2: data.customer_address_2,
        customer_phone: data.mobile,
        status: data.status,
        is_supplier: 0,
      });
      console.log("Created CustomerInfo for customer_code:", data.cuscode);
    }

    res.status(200).json({
      status: true,
      message: "Customers imported successfully",
      total: rows.length,
    });
  } catch (error) {
    console.error("Import failed:", error);
    res
      .status(500)
      .json({ status: false, message: "Import failed", error: error.message });
  }
};

const update = async (req, res, next) => {
  const {
    id,
    customer_code,
    first_name,
    last_name,
    email,
    phone,
    alternate_phone,
    dob,
    gender,
    billing_address,
    shipping_address,
    city,
    state,
    country,
    gst_number,
    zipcode,
    status,
  } = req.body;

  console.log("re is form udate customer is ---------", req.body);

  try {
    // Required field validation
    if (!id)
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "ID is required",
            "Error",
            ""
          )
        );
    if (!first_name)
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "First name is required",
            "Error",
            ""
          )
        );
    if (!last_name)
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Last name is required",
            "Error",
            ""
          )
        );
    if (!email)
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email is required",
            "Error",
            ""
          )
        );
    if (!phone)
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Phone is required",
            "Error",
            ""
          )
        );
    if (!billing_address)
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Billing address is required",
            "Error",
            ""
          )
        );

    // Find customer
    const customer_find = await customer_master.findOne({ where: { id } });
    if (!customer_find)
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Customer not found",
            "Error"
          )
        );

    // Update customer_master
    await customer_master.update(
      {
        customer_code: customer_code || customer_find.customer_code,
        first_name,
        last_name,
        email,
        phone,
        alternate_phone: alternate_phone || phone,
        dob: dob || null,
        gender: gender || null,
        billing_address,
        shipping_address: shipping_address || null,
        state: state || null,
        city: city || null,
        country: country || null,
        gst_number: gst_number || null,
        zipcode: zipcode || null,
        status: status || "Active",
        updated_at: new Date(),
      },
      { where: { id } }
    );

    const updatedCustomer = await customer_master.findOne({ where: { id } });

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully updated record",
          "",
          updatedCustomer
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
  const { id } = req.body; // or req.params.id if using URL param

  try {
    const customer_find = await customer_master.findOne({
      where: { id },
      attributes: [
        "id",
        "customer_code",
        "first_name",
        "last_name",
        "email",
        "phone",
        "alternate_phone",
        "dob",
        "gender",
        "billing_address",
        "shipping_address",
        "city",
        "state",
        "country",
        "zipcode",
        "gst_number",
        "customer_type",
        "loyalty_points",
        "status",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
    });

    if (!customer_find) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Customer not found",
            "Error"
          )
        );
    }

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully fetched record",
          "",
          customer_find
        )
      );
  } catch (error) {
    return res
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
    const customer_find = await customer_master.findOne({
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

    const cust_del = await customer_master.destroy({
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
const customer_details = async (req, res, next) => {
  const { customer_id, type } = req.body;

  try {
    let festivalRes;
    if (type == "supplier") {
      festivalRes = await GrnModel.findAll({
        // attributes: ['id','customer_code','customer_id'],
        include: [
          {
            model: UserModel,
            as: "salesman",
            attributes: ["firstname", "lastname", "email"],
            include: [
              {
                model: SalesmanInfo,
                as: "salesmanInfo",
                attributes: ["salesman_code"], // Example attributes
              },
            ],
          },
          {
            model: UserModel,
            as: "customer",
            // attributes: ['firstname', 'lastname', 'email'],
            include: [
              {
                model: CustomerInfo,
                as: "customerInfo",
                attributes: ["customer_code"], // Example attributes
              },
            ],
          },
          {
            model: GrnDetailModel,
            as: "grn_details",
            // attributes: ['firstname', 'lastname', 'email'],
          },
        ],
        where: {
          customer_id: customer_id,
        },
        order: [["id", "DESC"]],
        // limit: limits,
        // offset: offset
      });
      for (var i = 0; i < festivalRes.length; i++) {
        const grnPdfFullPaths = festivalRes[i].grn_pdf
          ? base_url + path.posix.join("uploads/grns", festivalRes[i].grn_pdf)
          : null;
        festivalRes[i].grn_pdf = grnPdfFullPaths;
      }
    } else {
      festivalRes = await InvoiceModel.findAll({
        where: {
          customer_id: customer_id,
        },
        // attributes: ['id','customer_code','customer_id'],
        include: [
          {
            model: UserModel,
            as: "salesman",
            // attributes: ['firstname','lastname','email'],
            include: [
              {
                model: SalesmanInfo,
                as: "salesmanInfo",
                attributes: ["salesman_code"], // Example attributes
              },
            ],
          },
          {
            model: UserModel,
            as: "customer",
            // attributes: ['firstname', 'lastname', 'email'],
            include: [
              {
                model: CustomerInfo,
                as: "customerInfo",
                attributes: ["customer_code"], // Example attributes
              },
            ],
          },
          {
            model: InvoiceDetailModel,
            as: "invoice_details",
            // attributes: ['firstname', 'lastname', 'email'],
          },
        ],
        order: [["id", "ASC"]],
        // limit: limits,
        // offset: offset
      });
      for (var i = 0; i < festivalRes.length; i++) {
        const invoicePdfFullPaths = festivalRes[i].invoice_pdf
          ? base_url +
            path.posix.join("uploads/invoices", festivalRes[i].invoice_pdf)
          : null;
        festivalRes[i].invoice_pdf = invoicePdfFullPaths;
      }
    }
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
            festivalRes
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
const details_by_mobile = async (req, res, next) => {
  const { mobile } = req.body;
  try {
    // codesettingupdate('customer');
    let customer_find = await customer_master.findOne({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "billing_address",
        "phone",
        "email",
        "gst_number",
      ],
      where: {
        phone: mobile,
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
    customer_find = customer_find.toJSON();
    customer_find.user_id = customer_find.id;
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully record",
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
const store_by_mobile = async (req, res, next) => {
  try {
    // Debug: log request body
    console.log("Request body:", req.body);

    // Support both nested formData or flat fields
    const body = req.body.formData || req.body;

    // Destructure fields
    const { mobile_no, first_name, last_name, address, cuscountry, email } =
      body;

    // Validation
    if (!mobile_no || !first_name || !address) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Mobile number, first name, and address are required.",
            "Error",
            []
          )
        );
    }

    // Check if user already exists
    const existingUser = await customer_master.findOne({
      where: { phone: mobile_no },
    });

    if (existingUser) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "User with this mobile number already exists.",
            "Error",
            []
          )
        );
    }

    // Generate customer code
    const customer_code = await codesettingGet("customer");
    await codesettingupdate("customer");

    // Create customer
    const user = await customer_master.create({
      customer_code,
      first_name,
      last_name: last_name || "",
      phone: mobile_no,
      country: cuscountry || null,
      email: email || null,
      billing_address: address,
      alternate_phone: "",
      shipping_address: "",
      city: "",
      state: "",
      zipcode: "",
      gst_number: "",
      customer_type: "Individual",
      loyalty_points: 0,
      status: "Active",
    });

    // Prepare response in your required format
    const responseData = {
      id: "",
      customer_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      mobile_no: user.phone,
      mobile_no_search: "",
      address: user.billing_address,
      bank_name: "",
      type: "",
      customer_code: user.customer_code,
    };

    // Send success response
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          responseData
        )
      );
  } catch (error) {
    console.error("Error in store_by_mobile:", error);
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
  exportCustomers,
  store,
  importCustomers,
  update,
  details,
  delete_customer,
  details_by_mobile,
  customer_details,
  store_by_mobile,
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const bwipjs = require("bwip-js");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const itemModel = db.item_master;
const item_master_image = db.item_master_image;
const OrderModel = db.order;
const userCompanyModel = db.user_company;
const OrderDetailModel = db.order_details;
const itemMajorCategoryModel = db.item_category;
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const productModel = db.product_master;
const itemColorModel = db.item_color;
const itemSizeModel = db.size_master;
const itemDepartmentModel = db.item_department;
const familyModel = db.family_master;
const subFamilyModel = db.sub_family_master;
const brandModel = db.brand;
const TaxMasterModel = db.tax_master;
const vendor_master = db.vendor_master;
const UserModel = db.user_master;
const CustomerInfo = db.customer_info;
const CompanyModel = db.company;
const LocationModel = db.location;

const { codesettingupdate } = require("../utils/handler");

require("dotenv").config();
const paths = require("path");
const { log } = require("console");
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
  const { page, limit = 10, item, user_id } = req.body;

  try {
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
    ///////////////////////////
    const branches = await CompanyModel.findAll({
      where: { main_company_id: 20 },
      attributes: ["id"],
    });

    const branchIds = branches.map((b) => b.id);
    // console.log("branchIds---------------", branchIds);

    ////////////////////////////////////////////////

    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await itemModel.count();
    const festivalRes = await itemModel.findAll({
      where: whereClause,
      include: [
        {
          model: item_master_image,
          as: "item_master_image",
        },
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: LocationModel,
          as: "location",
        },

        {
          model: itemMajorCategoryModel,
          as: "itemcategory",
          attributes: ["itemcatname"],
        },
        {
          model: itemColorModel,
          as: "item_color",
          //attributes: ['name'],
        },
        {
          model: itemSizeModel,
          as: "size_master",
          //attributes: ['name'],
        },
        {
          model: itemDepartmentModel,
          as: "item_department",
          //attributes: ['name'],
        },
        {
          model: familyModel,
          as: "family_master",
          //attributes: ['name'],
        },
        {
          model: subFamilyModel,
          as: "sub_family_master",
          //attributes: ['name'],
        },
        {
          model: brandModel,
          as: "brand",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_2",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_3",
          //attributes: ['name'],
        },
        {
          model: vendor_master,
          as: "vendor",
          //attributes: ['name'],
        },
        // {
        //   model: CustomerInfo,
        //   as: "customer_info",
        //   // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile', 'country_id'],
        //   include: [
        //     {
        //       model: UserModel,
        //       as: "users",
        //       // attributes: ['customer_code', 'user_id', 'customer_address_1', 'customer_address_2'], // Example //attributes
        //     },
        //   ],
        // },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: ["id", "item_id", "item_uom_id", "item_price"],
          include: [
            {
              model: itemUomModel,
              as: "item_uom",
              attributes: ["id", "code", "name"],
            },
          ],
        },

        // {
        //   model: db.item_location_master,
        //   as: "item_location_master_data",
        //   required: false,
        // },
        {
          model: db.item_location_master,
          as: "item_location_master_data",
          required: false,
          where: {
            company_id: { [Op.in]: branchIds },
          },
        },
      ],
      order: [["id", "DESC"]],
    });

    if (festivalRes.length > 0) {
      for (const item of festivalRes) {
        if (item.item_barcode_img && item.item_barcode_img !== "") {
          let new_url =
            base_url + path.posix.join("uploads/items", item.item_barcode_img);
          item.item_barcode_img = new_url;
        } else {
          item.item_barcode_img = "";
        }
      }
    }
    ///////////////////////////////

    for (const item of festivalRes) {
      let totalQty = 0;
      let distributedQty = 0;

      if (item.item_location_master_data?.length > 0) {
        item.item_location_master_data.forEach((loc) => {
          totalQty += parseFloat(loc.stock) || 0;
          distributedQty += parseFloat(loc.distributed_stock) || 0;
        });
      }

      // console.log("totalQty--------------", totalQty);
      // console.log("distributedQty--------------", distributedQty);

      item.dataValues.stock = totalQty;
      item.dataValues.distributed_stock = distributedQty;
      item.dataValues.remaining_stock = totalQty - distributedQty;
    }

    ////////////////////////////////
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

const getItemByPagination = async (req, res) => {
  try {
    // const { page = 1, limit = 10, user_id, company_id, location_id } = req.body;
    const {
      page = 1,
      limit = 10,
      user_id,
      company_id,
      location_id,
      search, // ✅ ADD THIS
    } = req.body;

    const currentPage = parseInt(page);
    const pageLimit = parseInt(limit);
    const offset = (currentPage - 1) * pageLimit;

    /* ================= USER COMPANY ACCESS ================= */
    let companyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: { user_id },
        attributes: ["company_id"],
      });

      companyIds = userCompanies.map((c) => c.company_id);
    }

    /* ================= MAIN WHERE CLAUSE ================= */
    // const whereClause = {
    //   ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
    //   ...(company_id && { company_id }),
    //   ...(location_id && { location_id }),
    // };

    const whereClause = {
      ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
      ...(company_id && { company_id }),
      ...(location_id && { location_id }),
      ...(search && {
        [Op.or]: [
          { item_code: { [Op.like]: `%${search}%` } },
          { itemupc: { [Op.like]: `%${search}%` } },
          { item_name: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    /* ================= BRANCH COMPANIES ================= */
    let branchIds = [];
    if (company_id) {
      const branches = await CompanyModel.findAll({
        where: { main_company_id: company_id },
        attributes: ["id"],
      });

      branchIds = branches.map((b) => b.id);
    }

    /* ================= TOTAL COUNT ================= */
    const totalRecords = await itemModel.count({
      where: whereClause,
    });

    /* ================= FETCH ITEMS ================= */
    const items = await itemModel.findAll({
      where: whereClause,
      limit: pageLimit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: item_master_image,
          as: "item_master_image",
        },
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: LocationModel,
          as: "location",
        },
        {
          model: itemMajorCategoryModel,
          as: "itemcategory",
          attributes: ["itemcatname"],
        },
        {
          model: itemColorModel,
          as: "item_color",
        },
        {
          model: itemSizeModel,
          as: "size_master",
        },
        {
          model: itemDepartmentModel,
          as: "item_department",
        },
        {
          model: familyModel,
          as: "family_master",
        },
        {
          model: subFamilyModel,
          as: "sub_family_master",
        },
        {
          model: brandModel,
          as: "brand",
        },
        {
          model: vendor_master,
          as: "vendor",
        },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: ["id", "item_id", "item_uom_id", "item_price"],
          include: [
            {
              model: itemUomModel,
              as: "item_uom",
              attributes: ["id", "code", "name"],
            },
          ],
        },
        {
          model: db.item_location_master,
          as: "item_location_master_data",
          required: false,
          ...(branchIds.length > 0 || location_id
            ? {
                where: {
                  ...(branchIds.length > 0 && {
                    company_id: { [Op.in]: branchIds },
                  }),
                  ...(location_id && { location_id }),
                },
              }
            : {}),
        },
      ],
    });

    /* ================= IMAGE + STOCK ================= */
    items.forEach((item) => {
      // Barcode image
      item.item_barcode_img = item.item_barcode_img
        ? base_url + path.posix.join("uploads/items", item.item_barcode_img)
        : "";

      let totalQty = 0;
      let distributedQty = 0;

      item.item_location_master_data?.forEach((loc) => {
        totalQty += Number(loc.stock || 0);
        distributedQty += Number(loc.distributed_stock || 0);
      });

      item.dataValues.stock = totalQty;
      item.dataValues.distributed_stock = distributedQty;
      item.dataValues.remaining_stock = totalQty - distributedQty;
    });

    /* ================= RESPONSE ================= */
    res.status(200).json(
      ResponseFormatter.setResponse(true, 200, "Item list fetched", "", {
        records: items,
        pagination: {
          currentPage,
          pageSize: pageLimit,
          totalRecords,
          totalPages: Math.ceil(totalRecords / pageLimit),
        },
      })
    );
  } catch (error) {
    res
      .status(400)
      .json(
        ResponseFormatter.setResponse(
          false,
          400,
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

const store = async (req, res, next) => {
  const {
    price,
    code,
    batch_no,
    name,
    uom,
    tax,
    stock,
    partNumber,
    barcode,
    rate,
    itemcatname,
    itemdesc,
    itemdesclong,
    itemdesc3,
    itemdesc4,
    itemupc,
    itemref,
    stylecode,
    colorname,
    sizename,
    departname,
    familyname,
    subfamliy,
    brandname,
    hsncode,
    itemcost,
    itemprice,
    itemlanprice,
    minstklvl,
    maxstklvl,
    itmstkmgmt,
    itmuom,
    itmwweight,
    itmwpurunit,
    itmwsalesunit,
    itmtax1code,
    itmtax2code,
    itmtax3code,
    itmcostingmet,
    suppliername,
    note1,
    note2,
    note3,
    itmdt1,
    itmdt2,
    itmexpiry,
    addedby,
    company_id,
    location_id,
    // item_barcode,
    item_description,
    status,
  } = req.body;

  try {
    let name_check = await itemModel.count({
      where: {
        itemdesc: itemdesc,
        colorname: colorname,
        sizename: sizename,
      },
    });
    if (name_check > 0) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Item already exist ",
            "Error",
            ""
          )
        );
      return;
    }

    // ✅ Check duplicate item UPC
    let upc_check = await itemModel.count({ where: { itemupc } });
    if (upc_check > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Item UPC already exist",
            "Error",
            ""
          )
        );
    }

    codesettingupdate("item");

    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: code, // The text to encode in the barcode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center",
      backgroundcolor: "FFFFFF",
      paddingwidth: 10, // Adds 10 units of padding on the left and right
      spaddingheight: 10, // Align text to the center
    });
    const fileName = `barcode_${code}.jpeg`;
    const imagePath = path.join(
      __dirname,
      "../../public",
      "uploads/items",
      fileName
    );
    fs.writeFileSync(imagePath, barcodeBuffer);

    // for items images
    let imageFileName = null;

    if (req.file) {
      imageFileName = req.file.filename; // Filename from multer
    }

    let item = await itemModel.create({
      item_code: code,
      batch_no: batch_no,
      item_name: itemdesc,
      item_barcode_img: fileName,
      item_vat_percentage: price,
      item_tax: tax ?? 0,
      stock: stock,
      partNumber: partNumber,
      barcode: barcode,
      rate: rate,
      itemcatname: itemcatname,
      itemdesc: itemdesc,
      itemdesclong: itemdesclong,
      itemdesc3: itemdesc3,
      itemdesc4: itemdesc4,
      itemupc: itemupc,
      itemref: itemref,
      stylecode: stylecode,
      colorname: colorname,
      sizename: sizename,
      departname: departname,
      familyname: familyname,
      subfamliy: subfamliy,
      brandname: brandname,
      hsncode: hsncode,
      itemcost: itemcost,
      itemprice: itemprice,
      itemlanprice: itemlanprice,
      minstklvl: minstklvl,
      maxstklvl: maxstklvl,
      itmstkmgmt: itmstkmgmt,
      itmuom: itmuom,
      itmwweight: itmwweight,
      itmwpurunit: itmwpurunit,
      itmwsalesunit: itmwsalesunit,
      itmtax1code: itmtax1code,
      itmtax2code: null,
      itmtax3code: null,
      itmcostingmet: itmcostingmet,
      suppliername: suppliername,
      note1: note1,
      note2: note2,
      note3: note3,
      itmdt1: itmdt1,
      itmdt2: itmdt2,
      itmexpiry: itmexpiry,
      addedby: addedby,
      company_id: company_id,
      location_id: location_id,
      item_image: imageFileName, // ✅ Add this line
      item_barcode: code,
      // item_barcode: item_barcode,
      item_description: item_description,

      status: status,
    });

    let item_main_prices = await itemMainPriceModel.create({
      //save Main Price
      item_id: item.id,
      item_uom_id: uom,
    });

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          item
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

const storeBulk1 = async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      status: false,
      message: "No items received",
    });
  }

  const savedItems = [];
  const skippedItems = [];

  for (const item of items) {
    const {
      itemupc,
      itemcatname,
      item_name,
      author,
      publisher,
      language,
      pages,
      khana,
      cost,
      mrp,
      hsncode,
      description,

      itemcost,
      item_code,
      color,
      size,
      department,
      family,
      sub_family,
      brand_name,
      uom,
      tax,
      costing_method,
      supplier_name,
      company_id,
      location_id,
      status,
    } = item;

    // console.log("items for the bulk upload", item);

    // ✅ Validation
    if (!itemupc || !item_name || !uom || !company_id || !location_id) {
      skippedItems.push({
        item_name: item_name || itemupc,
        reason: "Missing required fields",
      });
      continue;
    }

    try {
      const existing = await itemModel.count({
        where: { item_name: item_name },
      });

      if (existing > 0) {
        skippedItems.push({
          item_name,
          reason: "Item already exists",
        });
        continue;
      }

      // ✅ Generate barcode image
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: "code128",
        text: String(itemupc), // 👈 force to string
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
        backgroundcolor: "FFFFFF",
        paddingwidth: 10,
      });

      const fileName = `barcode_${itemupc}.jpeg`;
      const imagePath = path.join(
        __dirname,
        "../../public/uploads/items",
        fileName
      );
      fs.writeFileSync(imagePath, barcodeBuffer);

      // Lookups

      const departmentData = department
        ? await itemDepartmentModel.findOne({
            where: { itemdeptcode: department },
          })
        : null;
      const familyData = family
        ? await familyModel.findOne({ where: { itemfamcode: family } })
        : null;
      const sumFamData = sub_family
        ? await subFamilyModel.findOne({ where: { itemsfamcode: sub_family } })
        : null;
      const brandData = brand_name
        ? await brandModel.findOne({ where: { brandcode: brand_name } })
        : null;
      ////////////////////////////////////////////

      const colorData = color
        ? await itemColorModel.findOne({ where: { itemcolcode: color } })
        : null;
      const sizeData = size
        ? await itemSizeModel.findOne({ where: { itemsizecode: size } })
        : null;
      const itemcatData = itemcatname
        ? await itemMajorCategoryModel.findOne({
            where: { itemcatcode: itemcatname },
          })
        : null;
      const uomData = uom
        ? await itemUomModel.findOne({ where: { code: uom } })
        : null;
      const taxData = tax
        ? await TaxMasterModel.findOne({ where: { taxcode: tax } })
        : null;
      const companyData = company_id
        ? await CompanyModel.findOne({ where: { compcode: company_id } })
        : null;
      const locationData = location_id
        ? await LocationModel.findOne({ where: { loccode: location_id } })
        : null;

      // ✅ Create Item
      const newItem = await itemModel.create({
        itemupc: itemupc,
        item_code: item_code,
        item_name,

        itemdesclong: author,
        itemdesc3: publisher,
        itemdesc4: language,
        volume: pages,
        supervisor_category_id: khana ?? 0,
        itemcost: cost ?? 0,
        unit_item_max_price: mrp ?? 0,
        hsncode,
        item_description: description,

        item_vat_percentage: 0,
        stock: 0,
        rate: 0,
        departname: departmentData ? departmentData.id : null,
        familyname: familyData ? familyData.id : null,
        subfamliy: sumFamData ? sumFamData.id : null,
        brandname: brandData ? brandData.id : null,
        //////////////////////////////////////////////
        colorname: colorData ? colorData.id : null,
        sizename: sizeData ? sizeData.id : null,
        itemcatname: itemcatData ? itemcatData.id : null,
        itmuom: uomData ? uomData.id : null,
        itmtax1code: taxData ? taxData.id : null,
        company_id: companyData ? companyData.id : null,
        location_id: locationData ? locationData.id : null,

        // itmuom: uom,
        // itmtax1code: tax ?? 0,
        // company_id,
        //         location_id,
        // itemcatname: itemcatname,
        // departname: department,
        // colorname: color,
        // sizename: size,
        // brandname: brand_name,
        // familyname: family,
        // subfamliy: sub_family,
        suppliername: supplier_name,
        itmcostingmet: costing_method,
        hsncode: 0,
        itemprice: 0,
        status:
          typeof status === "string"
            ? status.toLowerCase() === "active"
              ? 1
              : 0
            : Number(status) || 0,
        item_barcode_img: fileName,
        item_barcode: itemupc,
      });

      // ✅ Save Main Price
      await itemMainPriceModel.create({
        item_id: newItem.id,
        item_uom_id: uom,
      });

      savedItems.push({ id: newItem.id, item_name });
    } catch (err) {
      skippedItems.push({
        item_name: item_name || itemupc,
        reason: err.message,
      });
    }
  }

  // console.log("Skipped Items with errors:", skippedItems);

  if (skippedItems.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(skippedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Skipped Items");

    const filePath = path.join(
      __dirname,
      "../../public/uploads/Skipped_items/skipped_items.xlsx"
    );
    XLSX.writeFile(workbook, filePath);

    return res.status(200).json({
      status: true,
      message: "Bulk upload completed with some skipped items",
      inserted: savedItems.length,
      skipped: skippedItems.length,
      downloadUrl: `/Skipped_items/skipped_items.xlsx`, // 👈 frontend will use this
    });
  }

  return res.status(200).json({
    status: true,
    message: "Bulk upload completed successfully",
    inserted: savedItems.length,
    skipped: 0,
  });

  // return res.status(200).json({
  //   status: true,
  //   message: "Bulk upload completed",
  //   inserted: savedItems.length,
  //   skipped: skippedItems.length,
  //   savedItems,
  //   skippedItems,
  // });
};

const sanitizeRow = (row) => {
  const cleaned = {};

  for (const key in row) {
    const value = row[key];

    // Trim only strings
    cleaned[key] = typeof value === "string" ? value.trim() : value;
  }

  return cleaned;
};

const storeBulk = async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      status: false,
      message: "No items received",
    });
  }

  const savedItems = [];
  const skippedItems = [];

  // for (const item of items) {
  for (const rawItem of items) {
    const item = sanitizeRow(rawItem);

    const {
      itemupc,
      itemcatname,
      item_name,
      author,
      publisher,
      language,
      pages,
      khana,
      cost,
      mrp,
      hsncode,
      description,
      itemcost,
      item_code,
      color,
      size,
      department,
      family,
      sub_family,
      brand_name,
      uom,
      tax,
      costing_method,
      supplier_name,
      company_id,
      location_id,
      status,
      itemref,
      stylecode,
      minstklvl,
      maxstklvl,
      itmstkmgmt,
      itmwweight,
      itmwpurunit,
      itmwsalesunit,
      note1,
      note2,
      note3,
      itmdt1,
      itmdt2,
      itmexpiry,
    } = item;

    // console.log("items for the bulk upload", item);

    // ✅ Validation
    if (!itemupc || !item_name || !uom || !company_id || !location_id) {
      skippedItems.push({
        item_name: item_name || itemupc,
        reason: "Missing required fields",
      });
      continue;
    }

    try {
      // 🔹 FIRST: lookups
      const colorData = color
        ? await itemColorModel.findOne({ where: { itemcolcode: color } })
        : null;

      const sizeData = size
        ? await itemSizeModel.findOne({ where: { itemsizecode: size } })
        : null;

      // 🔹 OPTIONAL: validation
      if (color && !colorData) {
        skippedItems.push({
          item_name,
          reason: "Invalid color code",
        });
        continue;
      }

      if (size && !sizeData) {
        skippedItems.push({
          item_name,
          reason: "Invalid size code",
        });
        continue;
      }
      const existing = await itemModel.count({
        where: {
          item_name: item_name,
          // colorname: colorname,
          // sizename: sizename,
          colorname: colorData ? colorData.id : null,
          sizename: sizeData ? sizeData.id : null,
        },
      });

      if (existing > 0) {
        skippedItems.push({
          item_name,
          reason: "Item already exists",
        });
        continue;
      }

      // ✅ Generate barcode image
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: "code128",
        text: String(itemupc), // 👈 force to string
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
        backgroundcolor: "FFFFFF",
        paddingwidth: 10,
      });

      const fileName = `barcode_${itemupc}.jpeg`;
      const imagePath = path.join(
        __dirname,
        "../../public/uploads/items",
        fileName
      );
      fs.writeFileSync(imagePath, barcodeBuffer);

      // Lookups

      const departmentData = department
        ? await itemDepartmentModel.findOne({
            where: { itemdeptcode: department },
          })
        : null;
      const familyData = family
        ? await familyModel.findOne({ where: { itemfamcode: family } })
        : null;
      const sumFamData = sub_family
        ? await subFamilyModel.findOne({ where: { itemsfamcode: sub_family } })
        : null;
      const brandData = brand_name
        ? await brandModel.findOne({ where: { brandcode: brand_name } })
        : null;
      ////////////////////////////////////////////

      // const colorData = color
      //   ? await itemColorModel.findOne({ where: { itemcolcode: color } })
      //   : null;
      // const sizeData = size
      //   ? await itemSizeModel.findOne({ where: { itemsizecode: size } })
      //   : null;
      const itemcatData = itemcatname
        ? await itemMajorCategoryModel.findOne({
            where: { itemcatcode: itemcatname },
          })
        : null;
      const uomData = uom
        ? await itemUomModel.findOne({ where: { code: uom } })
        : null;
      const itemPurchaseUnit = itmwpurunit
        ? await itemUomModel.findOne({ where: { code: itmwpurunit } })
        : null;
      const itemSalesUnit = itmwsalesunit
        ? await itemUomModel.findOne({ where: { code: itmwsalesunit } })
        : null;

      const taxData = tax
        ? await TaxMasterModel.findOne({ where: { taxcode: tax } })
        : null;
      const companyData = company_id
        ? await CompanyModel.findOne({ where: { compcode: company_id } })
        : null;
      const locationData = location_id
        ? await LocationModel.findOne({ where: { loccode: location_id } })
        : null;

      // ✅ Create Item
      const newItem = await itemModel.create({
        itemupc: itemupc,
        item_code: item_code,
        item_name,

        itemdesclong: author,
        itemdesc3: publisher,
        itemdesc4: language,
        volume: pages,
        supervisor_category_id: khana ?? 0,
        itemcost: cost ?? 0,
        unit_item_max_price: mrp ?? 0,
        hsncode,
        item_description: description,

        item_vat_percentage: 0,
        stock: 0,
        rate: 0,
        departname: departmentData ? departmentData.id : null,
        familyname: familyData ? familyData.id : null,
        subfamliy: sumFamData ? sumFamData.id : null,
        brandname: brandData ? brandData.id : null,
        //////////////////////////////////////////////
        colorname: colorData ? colorData.id : null,
        sizename: sizeData ? sizeData.id : null,
        itemcatname: itemcatData ? itemcatData.id : null,
        itmuom: uomData ? uomData.id : null,
        itmwpurunit: itemPurchaseUnit ? itemPurchaseUnit.id : null,
        itmwsalesunit: itemSalesUnit ? itemSalesUnit.id : null,
        itmtax1code: taxData ? taxData.id : null,
        company_id: companyData ? companyData.id : null,
        location_id: locationData ? locationData.id : null,
        suppliername: supplier_name,
        itmcostingmet: costing_method,
        hsncode: 0,
        itemprice: 0,
        itemref,
        stylecode,
        minstklvl,
        maxstklvl,
        itmstkmgmt,
        itmwweight,
        note1,
        note2,
        note3,
        itmdt1,
        itmdt2,
        itmexpiry,
        status:
          typeof status === "string"
            ? status.toLowerCase() === "active"
              ? 1
              : 0
            : Number(status) || 0,
        item_barcode_img: fileName,
        item_barcode: itemupc,
      });

      // ✅ Save Main Price
      await itemMainPriceModel.create({
        item_id: newItem.id,
        item_uom_id: uom,
      });

      savedItems.push({ id: newItem.id, item_name });
    } catch (err) {
      skippedItems.push({
        item_name: item_name || itemupc,
        reason: err.message,
      });
    }
  }

  // console.log("Skipped Items with errors:", skippedItems);

  if (skippedItems.length > 0) {
    const worksheet = XLSX.utils.json_to_sheet(skippedItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Skipped Items");

    const filePath = path.join(
      __dirname,
      "../../public/uploads/Skipped_items/skipped_items.xlsx"
    );
    XLSX.writeFile(workbook, filePath);

    return res.status(200).json({
      status: true,
      message: "Bulk upload completed with some skipped items",
      inserted: savedItems.length,
      skipped: skippedItems.length,
      downloadUrl: `/Skipped_items/skipped_items.xlsx`, // 👈 frontend will use this
    });
  }

  return res.status(200).json({
    status: true,
    message: "Bulk upload completed successfully",
    inserted: savedItems.length,
    skipped: 0,
  });

  // return res.status(200).json({
  //   status: true,
  //   message: "Bulk upload completed",
  //   inserted: savedItems.length,
  //   skipped: skippedItems.length,
  //   savedItems,
  //   skippedItems,
  // });
};

const details = async (req, res, next) => {
  const { id } = req.body;

  const branches = await CompanyModel.findAll({
    where: { main_company_id: 20 }, // or dynamic req.body.main_company_id
    attributes: ["id"],
  });

  const branchIds = branches.map((b) => b.id);
  // console.log("branchIds in details---------------", branchIds);
  try {
    const festivalRes = await itemModel.findOne({
      include: [
        {
          model: item_master_image,
          as: "item_master_image",
        },
        {
          model: itemMajorCategoryModel,
          as: "itemcategory",
          attributes: ["itemcatname"],
        },
        {
          model: itemColorModel,
          as: "item_color",
          //attributes: ['name'],
        },
        {
          model: itemSizeModel,
          as: "size_master",
          //attributes: ['name'],
        },
        {
          model: itemDepartmentModel,
          as: "item_department",
          //attributes: ['name'],
        },
        {
          model: familyModel,
          as: "family_master",
          //attributes: ['name'],
        },
        {
          model: subFamilyModel,
          as: "sub_family_master",
          //attributes: ['name'],
        },
        {
          model: brandModel,
          as: "brand",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_2",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_3",
          //attributes: ['name'],
        },
        {
          model: vendor_master,
          as: "vendor",
          //attributes: ['name'],
        },
        // {
        //   model: CustomerInfo,
        //   as: "customer_info",
        //   // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile', 'country_id'],
        //   include: [
        //     {
        //       model: UserModel,
        //       as: "users",
        //       // attributes: ['customer_code', 'user_id', 'customer_address_1', 'customer_address_2'], // Example //attributes
        //     },
        //   ],
        // },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: ["id", "item_id", "item_uom_id", "item_price"],
          include: [
            {
              model: itemUomModel,
              as: "item_uom",
              attributes: ["id", "code", "name"],
            },
          ],
        },
        {
          model: db.item_location_master,
          as: "item_location_master_data",
          required: false,
          where: {
            company_id: { [Op.in]: branchIds },
          },
        },
      ],
      where: {
        // id: id,
        uuid: id,
      },
    });

    let totalQty = 0;
    let distributedQty = 0;

    if (festivalRes.item_location_master_data?.length > 0) {
      festivalRes.item_location_master_data.forEach((loc) => {
        totalQty += parseFloat(loc.stock) || 0;
        distributedQty += parseFloat(loc.distributed_stock) || 0;
      });
    }

    festivalRes.dataValues.stock = totalQty;
    festivalRes.dataValues.distributed_stock = distributedQty;
    festivalRes.dataValues.remaining_stock = totalQty - distributedQty;

    // console.log("DETAIL STOCK =>", {
    //   totalQty,
    //   distributedQty,
    //   remaining: totalQty - distributedQty,
    // });

    if (!festivalRes) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Not found!", "Error", "")
        );
    } else {
      // Handle barcode image URL as before
      if (festivalRes.item_barcode_img && festivalRes.item_barcode_img !== "") {
        let new_url =
          base_url +
          path.posix.join("uploads/items", festivalRes.item_barcode_img);
        festivalRes.item_barcode_img = new_url;
      } else {
        festivalRes.item_barcode_img = "";
      }

      // Keep item_image as filename only
      if (festivalRes.item_image && festivalRes.item_image !== "") {
        festivalRes.item_image = festivalRes.item_image; // filename only
      } else {
        festivalRes.item_image = "";
      }

      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully show record",
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

const itemcode_details = async (req, res, next) => {
  const { item_code } = req.body;

  try {
    const festivalRes = await itemModel.findOne({
      include: [
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: ["id", "item_id", "item_uom_id", "item_price"],
          include: [
            {
              model: itemUomModel,
              as: "item_uom",
              attributes: ["id", "code", "name"],
            },
          ],
        },
      ],
      // attributes: ['id', 'item_name', 'item_code'],
      where: {
        item_code: item_code,
      },
    });
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
            "Successfully show record",
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

const update = async (req, res, next) => {
  const {
    id,
    price,
    code,
    name,
    uom,
    tax,
    stock,
    partNumber,
    barcode,
    rate,
    itemcatname,
    itemdesc,
    itemdesclong,
    itemdesc3,
    itemdesc4,
    itemupc,
    itemref,
    stylecode,
    colorname,
    sizename,
    departname,
    familyname,
    subfamliy,
    brandname,
    hsncode,
    itemcost,
    itemprice,
    itemlanprice,
    minstklvl,
    maxstklvl,
    itmstkmgmt,
    itmuom,
    itmwweight,
    itmwpurunit,
    itmwsalesunit,
    itmtax1code,
    itmtax2code,
    itmtax3code,
    itmcostingmet,
    suppliername,
    note1,
    note2,
    note3,
    itmdt1,
    itmdt2,
    itmexpiry,
    addedby,
    company_id,
    location_id,
    status,
    // item_major_category_id,
    // item_group_id,
    // brand_id,
    // is_product_catalog,
    // is_promotional,
    // item_code,
    // erp_code,
    // item_name,
    item_description,
    // item_barcode,
    // item_weight,
    // item_shelf_life,
    // volume,
    // lower_unit_uom_id,
    // is_tax_apply,
    // lower_unit_item_upc,
    // lower_unit_item_price,
    // lower_unit_purchase_order_price,
    // item_vat_percentage,
    // stock_keeping_unit,
    // unit_item_max_price,
    // item_excise,
    // new_lunch,
    // is_variant,
    // start_date,
    // end_date,
    // supervisor_category_id,
    // current_stage,
    // current_stage_comment,
    // status,
    // lob_id,
    // is_coupon,
    // is_promo_allocation,
    // coupon_id,
    // item_main_price
  } = req.body;

  console.log("req.body is from item udate is ", req.body);

  try {
    const detail = await itemModel.findOne({
      where: {
        uuid: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }

    let imageFileName = detail.item_image; // default to old image

    if (req.file) {
      imageFileName = req.file.filename;
    }

    if (itemdesc != detail.itemdesc) {
      let name_check = await itemModel.count({
        where: {
          itemdesc: itemdesc,
          colorname: colorname,
          sizename: sizename,
        },
      });
      if (name_check > 0) {
        res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "Item already exist",
              "Error",
              ""
            )
          );
        return;
      }
    }

    let item = await itemModel.update(
      {
        item_code: code,
        // item_name: name,
        item_image: imageFileName,
        item_name: itemdesc,
        item_vat_percentage: price,
        item_tax: tax,
        stock: stock,
        // item_image: newStr,
        partNumber: partNumber,
        barcode: barcode,
        rate: rate,
        itemcatname: itemcatname,
        itemdesc: itemdesc,
        itemdesclong: itemdesclong,
        itemdesc3: itemdesc3,
        itemdesc4: itemdesc4,
        itemupc: itemupc,
        itemref: itemref,
        stylecode: stylecode,
        colorname: colorname,
        sizename: sizename,
        departname: departname,
        familyname: familyname,
        subfamliy: subfamliy,
        brandname: brandname,
        hsncode: hsncode,
        itemcost: itemcost,
        itemprice: itemprice,
        itemlanprice: itemlanprice,
        minstklvl: minstklvl,
        maxstklvl: maxstklvl,
        itmstkmgmt: itmstkmgmt,
        itmuom: itmuom,
        itmwweight: itmwweight,
        itmwpurunit: itmwpurunit,
        itmwsalesunit: itmwsalesunit,
        itmtax1code: itmtax1code,
        itmtax2code: null,
        itmtax3code: null,
        itmcostingmet: itmcostingmet,
        suppliername: suppliername,
        note1: note1,
        note2: note2,
        note3: note3,
        itmdt1: itmdt1,
        itmdt2: itmdt2,
        itmexpiry: itmexpiry,
        addedby: 1,
        // addedby: addedby,
        company_id: company_id,
        location_id: location_id,
        status: status,
        // item_major_category_id: item_major_category_id,
        // item_group_id: item_group_id,
        // brand_id: brand_id,
        // is_product_catalog: is_product_catalog ? 1 : 0,
        // is_promotional: is_promotional ? 1 : 0,
        // item_code: item_code,
        // erp_code: erp_code,
        // item_name: item_name,
        item_description: item_description,
        // item_barcode: item_barcode,
        // item_weight: item_weight,
        // item_shelf_life: item_shelf_life,
        // volume: volume,
        // lower_unit_uom_id: lower_unit_uom_id,
        // is_tax_apply: is_tax_apply,
        // lower_unit_item_upc: lower_unit_item_upc,
        // lower_unit_item_price: lower_unit_item_price,
        // lower_unit_purchase_order_price: lower_unit_purchase_order_price,
        // item_vat_percentage: item_vat_percentage,
        // stock_keeping_unit: stock_keeping_unit ? 1 : 0,
        // unit_item_max_price: unit_item_max_price ? unit_item_max_price : 0,
        // // secondary_stock_keeping_unit : secondary_stock_keeping_unit ? 1 : 0,
        // item_excise: item_excise,

        // new_lunch: new_lunch ? 1 : 0,
        // is_variant: is_variant ? 1 : 0,
        // start_date: start_date,
        // end_date: end_date,
        // supervisor_category_id: supervisor_category_id ,

        // current_stage: current_stage,
        // current_stage_comment: current_stage_comment,
        // status: status,
        // // lob_id :  (!empty(lob_id)) ? lob_id : null,
        // lob_id: lob_id,

        // is_coupon: is_coupon,
        // is_promo_allocation: is_promo_allocation,
        // coupon_id: coupon_id,
      },
      {
        where: {
          // id: id,
          uuid: id, // ✅ Match based on UUID
        },
      }
    );

    if (uom != "") {
      const deletedCount = await itemMainPriceModel.destroy({
        where: {
          item_id: id,
        },
      });
      let item_main_prices = await itemMainPriceModel.create({
        //save Main Price
        item_id: id,
        item_uom_id: itmuom,
        // item_upc: item_main_price[i].item_upc,
        // item_price: item_main_price[i].item_price,
        // purchase_order_price: item_main_price[i].purchase_order_price,
        // stock_keeping_unit: item_main_price[i].stock_keeping_unit ? 1 : 0,
        // status: item_main_price[i].status,
        // item_main_max_price: item_main_price[i].item_main_max_price ? 1 : 0,
        // uom_barcode: item_main_price[i].uom_barcode,
        // uom_cost: item_main_price[i].uom_cost,
        // sell_enable: item_main_price[i].sell_enable ? item_main_price[i].sell_enable : 0,
        // return_enable: item_main_price[i].return_enable ? item_main_price[i].return_enable : 0,
        // uom_type: uom_type,
        // uom_type
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

const delete_item = async (req, res, next) => {
  const { id } = req.body;

  try {
    const festivalRes = await OrderDetailModel.findAll({
      where: {
        item_id: id,
      },
      order: [["id", "DESC"]],
    });

    if (festivalRes.length > 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "You dont delete this item because this item is exist in order!",
            "Error",
            ""
          )
        );
    }
    // Attempt to soft delete the order
    const deletedCount = await itemModel.destroy({
      where: {
        id: id,
      },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "not found!", "Error", "")
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

const DropDownList = async (req, res, next) => {
  try {
    const itemList = await itemModel.findAll({
      include: [
        {
          model: itemMajorCategoryModel,
          as: "itemcategory",
          attributes: ["itemcatname"],
        },
        {
          model: itemColorModel,
          as: "item_color",
          //attributes: ['name'],
        },
        {
          model: itemSizeModel,
          as: "size_master",
          //attributes: ['name'],
        },
        {
          model: itemDepartmentModel,
          as: "item_department",
          //attributes: ['name'],
        },
        {
          model: familyModel,
          as: "family_master",
          //attributes: ['name'],
        },
        {
          model: subFamilyModel,
          as: "sub_family_master",
          //attributes: ['name'],
        },
        {
          model: brandModel,
          as: "brand",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_2",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_3",
          //attributes: ['name'],
        },
        // {
        //   model: CustomerInfo,
        //   as: "customer_info",
        //   // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile', 'country_id'],
        //   include: [
        //     {
        //       model: UserModel,
        //       as: "users",
        //       // attributes: ['customer_code', 'user_id', 'customer_address_1', 'customer_address_2'], // Example //attributes
        //     },
        //   ],
        // },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: ["id", "item_id", "item_uom_id", "item_price"],
          include: [
            {
              model: itemUomModel,
              as: "item_uom",
              attributes: ["id", "code", "name"],
            },
          ],
        },
      ],
      where: {
        status: 1,
      },
      order: [["id", "DESC"]],
    });

    if (itemList.length > 0) {
      for (const item of itemList) {
        if (item.item_barcode_img && item.item_barcode_img !== "") {
          let new_url =
            base_url + path.posix.join("uploads/items", item.item_barcode_img);
          item.item_barcode_img = new_url;
        } else {
          item.item_barcode_img = "";
        }
      }
    }
    // const totalPages = Math.ceil(totalRecords / limits);
    // const pagination = {
    //     records: festivalRes,
    //     currentPage: currentPage,
    //     pageSize: limits,
    //     totalRecords: totalRecords,
    //     totalPages: totalPages
    // };

    // if (!festivalRes) {
    //     res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
    // } else {
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully record",
          "",
          itemList
        )
      );
    // }
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
  getItemByPagination,
  store,
  update,
  details,
  delete_item,
  itemcode_details,
  DropDownList,
  storeBulk,
};

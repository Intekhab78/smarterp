const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const itemModel = db.item_master;
const userCompanyModel = db.user_company;
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const FamilyMasterModel = db.family_master;
const CompanyModel = db.company;
const LocationModel = db.location;
const { codesettingupdate } = require("../utils/handler");
const FilterSetting = db.FilterCompItemSetting;
const FamilyMappingModel = db.family_mapping;

// const { family_master: FamilyMasterModel, family_mapping: FamilyMappingModel, company: CompanyModel, location: LocationModel } = require('../models');

require("dotenv").config();
const paths = require("path");
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
  const { page, limit = 10, user_id } = req.body;

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
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await FamilyMasterModel.count();
    const festivalRes = await FamilyMasterModel.findAll({
      where: whereClause,
      include: [
        {
          model: CompanyModel,
          as: "company",
        },
        {
          model: LocationModel,
          as: "location",
        },
      ],
      order: [["id", "DESC"]],
    });
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

const filtered_list_by_key = async (req, res, next) => {
  const { page, limit = 10, user_id, website_key } = req.body;

  try {
    /* =========================
       Step 1: User company filter
    ========================== */
    let userCompanyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: { user_id },
        attributes: ["company_id"],
      });
      userCompanyIds = userCompanies.map((c) => c.company_id);
    }

    /* =========================
       Step 2: Filter settings
    ========================== */
    const filterSettings = await FilterSetting.findAll();

    const allowedMainCompanyIds = filterSettings.map((s) => s.main_company_id);

    const allowedSubCompanyIds = filterSettings
      .map((s) => s.sub_company_id)
      .filter(Boolean);

    const allowedLocationIds = filterSettings
      .map((s) => s.location_id)
      .filter(Boolean);

    /* =========================
       Step 3: Build where clause
    ========================== */
    const whereClause = {};

    if (userCompanyIds.length > 0) {
      whereClause.company_id = { [Op.in]: userCompanyIds };
    }

    if (allowedSubCompanyIds.length > 0) {
      whereClause.company_id = { [Op.in]: allowedSubCompanyIds };
    }

    if (allowedLocationIds.length > 0) {
      whereClause.location_id = { [Op.in]: allowedLocationIds };
    }

    /* =========================
       Pagination
    ========================== */
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;

    /* =========================
       Step 4: Family list
       (filter via family_mapping)
    ========================== */
    const families = await FamilyMasterModel.findAll({
      where: whereClause,
      include: [
        {
          model: CompanyModel,
          as: "company",
          ...(allowedMainCompanyIds.length > 0 && {
            where: {
              main_company_id: { [Op.in]: allowedMainCompanyIds },
            },
          }),
        },
        {
          model: LocationModel,
          as: "location",
        },
        {
          model: FamilyMappingModel,
          as: "mappings",
          required: true, // INNER JOIN
          where: { website_key },
          attributes: [],
        },
      ],
      order: [["id", "DESC"]],
      limit: limits,
      offset,
    });

    if (!families || families.length === 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "No families found!",
            "",
            []
          )
        );
    }

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully fetched families",
          "",
          families
        )
      );
  } catch (error) {
    console.error("Family list error:", error);
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

const by_id_list = async (req, res, next) => {
  const { page, limit = 10, id } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await FamilyMasterModel.count();
    const festivalRes = await FamilyMasterModel.findAll({
      where: {
        itemdeptname: id,
        status: 1,
      },
      order: [["id", "DESC"]],
    });
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
const store = async (req, res, next) => {
  const {
    itemfamcode,
    itemfamname,
    itemdeptname,
    itemfamlong,
    note1,
    note2,
    note3,
    itmfamdt1,
    itmfamdt2,
    status,
    addedby,
    company_id,
    location_id,
  } = req.body;

  try {
    if (itemfamname == "" || itemfamname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Description field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (itemfamlong == "" || itemfamlong == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Long Description field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (itemdeptname == "" || itemdeptname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Department name field is required",
            "Error",
            ""
          )
        );
      return;
    }
    let name_check = await FamilyMasterModel.count({
      where: { itemfamname: itemfamname },
    });
    if (name_check > 0) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Description already exist",
            "Error",
            ""
          )
        );
      return;
    }

    codesettingupdate("family_master");

    let item = await FamilyMasterModel.create({
      itemfamcode: itemfamcode,
      itemfamname: itemfamname,
      itemfamlong: itemfamlong,
      itemdeptname: itemdeptname,
      note1: note1,
      note2: note2,
      note3: note3,
      itmfamdt1: itmfamdt1,
      itmfamdt2: itmfamdt2,
      addedby: addedby,
      company_id: company_id,
      location_id: location_id,
      status: status,
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
const details = async (req, res, next) => {
  const { id } = req.body;

  try {
    const festivalRes = await FamilyMasterModel.findOne({
      where: {
        id: id,
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
    // itemfamcode,
    itemfamname,
    itemfamlong,
    itemdeptname,
    note1,
    note2,
    note3,
    itmfamdt1,
    itmfamdt2,
    status,
    addedby,
    company_id,
    location_id,
  } = req.body;

  console.log("id is -----------", id);

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
    if (itemfamname == "" || itemfamname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Description field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (itemfamlong == "" || itemfamlong == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Long Description field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (itemdeptname == "" || itemdeptname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Department name field is required",
            "Error",
            ""
          )
        );
      return;
    }

    const detail = await FamilyMasterModel.findOne({
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }
    if (itemfamname != detail.itemfamname) {
      let name_check = await FamilyMasterModel.count({
        where: { itemfamname: itemfamname },
      });
      if (name_check > 0) {
        res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "Description already exist",
              "Error",
              ""
            )
          );
        return;
      }
    }
    // codesettingupdate('item');
    let item = await FamilyMasterModel.update(
      {
        // itemfamcode: itemfamcode,
        itemfamname: itemfamname,
        itemfamlong: itemfamlong,
        itemdeptname: itemdeptname,
        note1: note1,
        note2: note2,
        note3: note3,
        itmfamdt1: itmfamdt1,
        itmfamdt2: itmfamdt2,
        addedby: addedby,
        company_id: company_id,
        location_id: location_id,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    );

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
const delete_item_department = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await FamilyMasterModel.destroy({
      where: {
        id: id,
      },
    });

    if (deletedCount === 0) {
      res
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

const DropDownlist = async (req, res, next) => {
  try {
    const familyList = await FamilyMasterModel.findAll({
      where: {
        status: 1,
      },
    });
    // const totalPages = Math.ceil(totalRecords / limits);
    // const pagination = {
    //     records: festivalRes,
    //     currentPage: currentPage,
    //     pageSize: limits,
    //     totalRecords: totalRecords,
    //     totalPages: totalPages
    // };

    // if (!familyList) {
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
          familyList
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
  filtered_list_by_key,
  store,
  update,
  details,
  by_id_list,
  delete_item_department,
  DropDownlist,
};

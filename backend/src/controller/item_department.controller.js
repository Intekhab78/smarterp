const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const itemModel = db.item_master;
const userCompanyModel = db.user_company;
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const ItemDepartmentModel = db.item_department;
const CompanyModel = db.company;
const LocationModel = db.location;
const DepartmentMappingModel = db.department_mapping;
const { codesettingupdate } = require("../utils/handler");
const fs = require("fs");
// const path = require("path");
const FilterSetting = db.FilterCompItemSetting;
// const { department_mapping, ItemDepartmentModel, CompanyModel, LocationModel } = require("../models");

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
    const totalRecords = await ItemDepartmentModel.count();
    const festivalRes = await ItemDepartmentModel.findAll({
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

// const { Op } = require("sequelize");

const filtered_list_by_key = async (req, res, next) => {
  const { page, limit = 10, user_id, website_key } = req.body;

  try {
    // Step 1: Optional - Get user's company IDs if user_id is provided
    let userCompanyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: { user_id },
        attributes: ["company_id"],
      });
      userCompanyIds = userCompanies.map((c) => c.company_id);
    }

    // Step 2: Filter settings - Optional, can be used to restrict companies, locations, etc.
    const filterSettings = await FilterSetting.findAll();

    let allowedMainCompanyIds = filterSettings.map((s) => s.main_company_id);
    let allowedSubCompanyIds = filterSettings
      .map((s) => s.sub_company_id)
      .filter(Boolean);
    let allowedLocationIds = filterSettings
      .map((s) => s.location_id)
      .filter(Boolean);

    // Step 3: Build where clause
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

    // Pagination setup
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;

    // Step 4: Query departments filtered by website_key via department_mapping join
    const departments = await ItemDepartmentModel.findAll({
      where: whereClause,
      include: [
        {
          model: CompanyModel,
          as: "company",
          ...(allowedMainCompanyIds.length && {
            where: { main_company_id: { [Op.in]: allowedMainCompanyIds } },
          }),
        },
        { model: LocationModel, as: "location" },
        {
          model: DepartmentMappingModel,
          as: "mappings",
          required: true, // inner join, only departments with matching mapping
          where: { website_key }, // filter by website_key exactly as in your data
          attributes: [], // hide mapping fields in output; optional
        },
      ],
      order: [["id", "DESC"]],
      limit: limits,
      offset,
    });

    if (!departments || departments.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No departments found!",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "",
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching department list:", error);
    return res.status(400).json({
      status: false,
      message: "Something went wrong!",
      data: error.message,
    });
  }
};

const filtered_list = async (req, res, next) => {
  const { page, limit = 10, user_id } = req.body;

  try {
    // Step 1: Get company IDs from user permissions (if any)
    let userCompanyIds = [];
    if (user_id) {
      const userCompanies = await userCompanyModel.findAll({
        where: { user_id },
        attributes: ["company_id"],
      });
      userCompanyIds = userCompanies.map((c) => c.company_id);
    }

    // Step 2: Fetch filter settings from filter_comp_item_settings table
    const filterSettings = await FilterSetting.findAll();

    // Extract allowed company, sub-company and location IDs from filter settings
    let allowedMainCompanyIds = filterSettings.map((s) => s.main_company_id);
    let allowedSubCompanyIds = filterSettings
      .map((s) => s.sub_company_id)
      .filter(Boolean);
    let allowedLocationIds = filterSettings
      .map((s) => s.location_id)
      .filter(Boolean);

    // Step 3: Build the where clause with all conditions combined
    const whereClause = {};

    // Apply user company permissions filter if available
    if (userCompanyIds.length > 0) {
      whereClause.company_id = { [Op.in]: userCompanyIds };
    }

    // Apply filter settings for sub company (mapped to company_id in item_department)
    if (allowedSubCompanyIds.length > 0) {
      whereClause.company_id = {
        [Op.in]: allowedSubCompanyIds,
      };
    }

    // Apply filter settings for locations
    if (allowedLocationIds.length > 0) {
      whereClause.location_id = {
        [Op.in]: allowedLocationIds,
      };
    }

    // Pagination params (you can optionally use these for limiting results)
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;

    // Count total records matching where clause including main company filter in association
    // Note: not using count here since frontend doesn't require pagination metadata
    // const totalRecords = await ItemDepartmentModel.count({ ... });

    // Fetch filtered departments with associations and main company filter
    const departments = await ItemDepartmentModel.findAll({
      where: whereClause,
      include: [
        {
          model: CompanyModel,
          as: "company",
          ...(allowedMainCompanyIds.length && {
            where: { main_company_id: { [Op.in]: allowedMainCompanyIds } },
          }),
        },
        { model: LocationModel, as: "location" },
      ],
      order: [["id", "DESC"]],
      // optionally enable pagination here if you want:
      limit: limits,
      offset,
    });

    // Send response exactly like previous controller
    if (!departments || departments.length === 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "No departments found!",
            "Error",
            ""
          )
        );
    }

    // Return only the array of records in `.data` property (no pagination object)
    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "", "", departments));
  } catch (error) {
    console.error("Error fetching department list:", error);
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

const store = async (req, res, next) => {
  const {
    itemdeptcode,
    itemdeptname,
    itemdeptlong,
    note1,
    note2,
    note3,
    itmdepdt1,
    itmdepdt2,
    status,
    addedby,
    company_id,
    location_id,
  } = req.body;

  try {
    if (itemdeptname == "" || itemdeptname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "itemdeptname  field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (itemdeptlong == "" || itemdeptlong == null) {
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
    let name_check = await ItemDepartmentModel.count({
      where: { itemdeptname: itemdeptname },
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
    codesettingupdate("item_department");

    let imageFileName = null;
    if (req.file) {
      imageFileName = req.file.filename; // Filename from multer
    }

    let item = await ItemDepartmentModel.create({
      itemdeptcode: itemdeptcode,
      itemdeptname: itemdeptname,
      itemdeptlong: itemdeptlong,
      image: imageFileName,

      note1: note1,
      note2: note2,
      note3: note3,
      itmdepdt1: itmdepdt1,
      itmdepdt2: itmdepdt2,
      addedby: addedby,
      status: status,
      company_id: company_id,
      location_id: location_id,
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
    const festivalRes = await ItemDepartmentModel.findOne({
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
  try {
    const {
      id,
      itemdeptname,
      itemdeptlong,
      note1,
      note2,
      note3,
      itmdepdt1,
      itmdepdt2,
      status,
      addedby,
      company_id,
      location_id,
    } = req.body;

    if (!id) {
      return res
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
    }

    if (!itemdeptname) {
      return res
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
    }

    if (!itemdeptlong) {
      return res
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
    }

    const detail = await ItemDepartmentModel.findOne({ where: { id } });

    if (!detail) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Record not found",
            "Error",
            ""
          )
        );
    }

    if (itemdeptname !== detail.itemdeptname) {
      const name_check = await ItemDepartmentModel.count({
        where: { itemdeptname },
      });
      if (name_check > 0) {
        return res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "Description already exists",
              "Error",
              ""
            )
          );
      }
    }

    // Check if image file is uploaded, update filename
    let imageFileName = detail.image; // Keep existing image if no new file
    if (req.file) {
      imageFileName = req.file.filename;
    }

    await ItemDepartmentModel.update(
      {
        itemdeptname,
        itemdeptlong,
        note1,
        note2,
        note3,
        itmdepdt1,
        itmdepdt2,
        addedby,
        status,
        company_id,
        location_id,
        image: imageFileName,
      },
      { where: { id } }
    );

    // Fetch updated record to send back
    const updatedDetail = await ItemDepartmentModel.findOne({ where: { id } });

    return res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully updated record",
          "",
          updatedDetail
        )
      );
  } catch (error) {
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

const delete_item_department = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await ItemDepartmentModel.destroy({
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
    const DepartmentList = await ItemDepartmentModel.findAll({
      where: {
        status: 1,
      },
    });

    // if (!DepartmentList) {
    //     res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Department not found!', 'Error', ''));
    // } else {
    res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "", "", DepartmentList));
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
/////////////this code for fetch the dpartment by comapny and location is wise
const getDepartmentsByCompanyAndLocation = async (req, res) => {
  try {
    const { company_id, location_id } = req.params;

    if (!company_id || !location_id) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "company_id and location_id are required",
            "Error",
            ""
          )
        );
    }

    const result = await ItemDepartmentModel.findAll({
      where: {
        company_id: company_id,
        location_id: location_id,
      },
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

    return res
      .status(200)
      .json(ResponseFormatter.setResponse(true, 200, "Success", "", result));
  } catch (error) {
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

module.exports = {
  list,
  filtered_list,
  filtered_list_by_key,
  store,
  update,
  details,
  delete_item_department,
  DropDownlist,
  getDepartmentsByCompanyAndLocation,
};

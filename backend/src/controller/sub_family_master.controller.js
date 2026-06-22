const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const itemModel = db.item_master;
const userCompanyModel = db.user_company;
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const SubFamilyMasterModel = db.sub_family_master;
const FamilyMasterModel = db.family_master;
const DepartmentMasterModel = db.item_department;
const CompanyModel = db.company;
const LocationModel = db.location;
const { codesettingupdate } = require("../utils/handler");

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
    const totalRecords = await SubFamilyMasterModel.count();
    const festivalRes = await SubFamilyMasterModel.findAll({
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
        // NEW
        { model: FamilyMasterModel, as: "family" },

        // NEW
        { model: DepartmentMasterModel, as: "department" },
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

const by_id_list = async (req, res, next) => {
  const { page, limit = 10, id } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await SubFamilyMasterModel.count();
    const festivalRes = await SubFamilyMasterModel.findAll({
      where: {
        itemfamcode: id,
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
    itemsfamcode,
    itemsfamname,
    itemsfamlong,
    itemdeptname,
    itemfamcode,
    note1,
    note2,
    note3,
    itmsfamdt1,
    itmsfamdt2,
    status,
    addedby,
    company_id,
    location_id,
  } = req.body;

  try {
    if (itemsfamname == "" || itemsfamname == null) {
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
    if (itemsfamlong == "" || itemsfamlong == null) {
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
    if (itemfamcode == "" || itemfamcode == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Family Name field is required",
            "Error",
            ""
          )
        );
      return;
    }
    let name_check = await SubFamilyMasterModel.count({
      where: { itemsfamname: itemsfamname },
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
    codesettingupdate("sub_family_master");

    let item = await SubFamilyMasterModel.create({
      itemsfamcode: itemsfamcode,
      itemsfamname: itemsfamname,
      itemsfamlong: itemsfamlong,
      itemdeptname: itemdeptname,
      itemfamcode: itemfamcode,
      note1: note1,
      note2: note2,
      note3: note3,
      itmsfamdt1: itmsfamdt1,
      itmsfamdt2: itmsfamdt2,
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
    const festivalRes = await SubFamilyMasterModel.findOne({
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
    // itemsfamcode,
    itemsfamname,
    itemsfamlong,
    itemdeptname,
    itemfamcode,
    note1,
    note2,
    note3,
    itmsfamdt1,
    itmsfamdt2,
    status,
    addedby,
    company_id,
    location_id,
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
    if (itemsfamname == "" || itemsfamname == null) {
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
    if (itemsfamlong == "" || itemsfamlong == null) {
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
    if (itemfamcode == "" || itemfamcode == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Family Name field is required",
            "Error",
            ""
          )
        );
      return;
    }
    const detail = await SubFamilyMasterModel.findOne({
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }
    if (itemsfamname != detail.itemsfamname) {
      let name_check = await SubFamilyMasterModel.count({
        where: { itemsfamname: itemsfamname },
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
    let item = await SubFamilyMasterModel.update(
      {
        // itemsfamcode: itemsfamcode,
        itemsfamname: itemsfamname,
        itemsfamlong: itemsfamlong,
        itemdeptname: itemdeptname,
        itemfamcode: itemfamcode,
        note1: note1,
        note2: note2,
        note3: note3,
        itmsfamdt1: itmsfamdt1,
        itmsfamdt2: itmsfamdt2,
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
const delete_sub_family = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const deletedCount = await SubFamilyMasterModel.destroy({
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
    const SubFamilyList = await SubFamilyMasterModel.findAll({
      where: {
        status: 1,
      },
    });

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
          SubFamilyList
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
  by_id_list,
  store,
  update,
  details,
  delete_sub_family,
  DropDownlist,
};

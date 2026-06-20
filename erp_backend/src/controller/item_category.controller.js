const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const itemModel = db.item_master;
const item_master_image = db.item_master_image;
const userCompanyModel = db.user_company;
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const itemCategoryModel = db.item_category;
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
    const totalRecords = await itemCategoryModel.count();
    const festivalRes = await itemCategoryModel.findAll({
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

const DropDownlist = async (req, res, next) => {
  try {
    const CategoryList = await itemCategoryModel.findAll({
      where: {
        status: 1,
      },
      order: [["id", "DESC"]],
    });

    // const pagination = {
    //     records: CategoryList,
    //     currentPage: 0,
    //     pageSize: 0,
    //     totalRecords: 0,
    //     totalPages: 0
    // };

    // if (!CategoryList) {
    //     res.status(404).json(ResponseFormatter.setResponse(false, 404, 'CategoryList not found!', 'Error', ''));
    // } else {
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully record",
          "",
          CategoryList
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

const cat_item_list = async (req, res, next) => {
  const {} = req.body;

  try {
    const festivalRes = await itemCategoryModel.findAll({
      include: [
        {
          model: itemModel,
          as: "item_master",
          include: [
            {
              model: item_master_image,
              as: "items", // This must match the alias used in associations
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
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
    itemcatcode,
    itemcatname,
    itemdesclong,
    abcgroup,
    stockmgmt,
    note1,
    note2,
    note3,
    itmcatdt1,
    itmcatdt2,
    negativestock,
    status,
    addedby,
    company_id,
    location_id,
  } = req.body;

  try {
    if (itemcatname == "" || itemcatname == null) {
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
    if (itemdesclong == "" || itemdesclong == null) {
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
    if (abcgroup == "" || abcgroup == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "ABC class field is required",
            "Error",
            ""
          )
        );
      return;
    }
    let name_check = await itemCategoryModel.count({
      where: { itemcatname: itemcatname },
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
    codesettingupdate("item_category");

    let item = await itemCategoryModel.create({
      itemcatcode: itemcatcode,
      itemcatname: itemcatname,
      itemdesclong: itemdesclong,
      abcgroup: abcgroup,
      stockmgmt: stockmgmt,
      note1: note1,
      note2: note2,
      note3: note3,
      itmcatdt1: itmcatdt1,
      itmcatdt2: itmcatdt2,
      negativestock: negativestock,
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
    const festivalRes = await itemCategoryModel.findOne({
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
    // itemcatcode,
    itemcatname,
    itemdesclong,
    abcgroup,
    stockmgmt,
    note1,
    note2,
    note3,
    itmcatdt1,
    itmcatdt2,
    negativestock,
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
    if (itemcatname == "" || itemcatname == null) {
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
    if (itemdesclong == "" || itemdesclong == null) {
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
    if (abcgroup == "" || abcgroup == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "ABC class field is required",
            "Error",
            ""
          )
        );
      return;
    }
    const detail = await itemCategoryModel.findOne({
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }
    if (itemcatname != detail.itemcatname) {
      let name_check = await itemCategoryModel.count({
        where: { itemcatname: itemcatname },
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
    let item = await itemCategoryModel.update(
      {
        // itemcatcode: itemcatcode,
        itemcatname: itemcatname,
        itemdesclong: itemdesclong,
        abcgroup: abcgroup,
        stockmgmt: stockmgmt,
        note1: note1,
        note2: note2,
        note3: note3,
        itmcatdt1: itmcatdt1,
        itmcatdt2: itmcatdt2,
        negativestock: negativestock,
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
const delete_item_category = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const festivalRes = await itemModel.findAll({
      where: {
        itemcatname: id,
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
            "You dont delete this category because this category is exist in item!",
            "Error",
            ""
          )
        );
    }
    const deletedCount = await itemCategoryModel.destroy({
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
module.exports = {
  list,
  store,
  update,
  details,
  cat_item_list,
  delete_item_category,
  DropDownlist,
};

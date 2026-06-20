const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const SalesmanInfoModel = db.salesman_info;
const UserModel = db.user_master;
const countryMastersModel = db.country_masters;
const { codesettingupdate } = require("../utils/handler");

require("dotenv").config();
const paths = require("path");
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
  const { page, salesman_code, user_id, limit = 10 } = req.body;

  try {
    // let searchQuery;
    // if (search) {
    //     searchQuery = {
    //         [Op.or]: [
    //             where(fn('LOWER', col('sku')), 'LIKE', `%${search.toLowerCase()}%`),
    //             where(fn('LOWER', col('item_code')), 'LIKE', `%${search.toLowerCase()}%`),
    //             where(fn('LOWER', col('category')), 'LIKE', `%${search.toLowerCase()}%`)
    //         ]
    //     };
    // } else {
    //     // Initialize the array to hold individual conditions
    //     let conditions = [];

    //     if (sku) {
    //         conditions.push(where(fn('LOWER', col('sku')), 'LIKE', `%${sku.toLowerCase()}%`));
    //     }

    //     if (item_code) {
    //         conditions.push(where(fn('LOWER', col('item_code')), 'LIKE', `%${item_code.toLowerCase()}%`));
    //     }

    //     if (category) {
    //         conditions.push(where(fn('LOWER', col('category')), 'LIKE', `%${category.toLowerCase()}%`));
    //     }

    //     // Combine all conditions into the search query
    //     if (conditions.length > 0) {
    //         searchQuery = { [Op.or]: conditions };
    //     }
    // }

    let searchQuery;

    // Initialize the array to hold individual conditions
    let conditions = [];

    if (salesman_code) {
      conditions.push({
        salesman_code: { [Op.eq]: salesman_code },
      });
    }
    if (user_id) {
      conditions.push({
        user_id: { [Op.eq]: user_id },
      });
    }

    // Combine all conditions into the search query
    if (conditions.length > 0) {
      searchQuery = { [Op.or]: conditions };
    }

    // console.log('searchQuery', searchQuery);

    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await SalesmanInfoModel.count();
    const festivalRes = await SalesmanInfoModel.findAll({
      //     where: searchQuery,
      attributes: ["id", "salesman_code", "status", "user_id"],
      include: [
        {
          model: UserModel,
          as: "users",
          attributes: ["firstname", "lastname", "email", "mobile"],
          include: [
            {
              model: countryMastersModel,
              as: "countrys", // The associated User model
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      where: searchQuery,
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
const sales_list = async (req, res, next) => {
  const { page, salesman_code, user_id, limit = 10 } = req.body;

  try {
    // let searchQuery;
    // if (search) {
    //     searchQuery = {
    //         [Op.or]: [
    //             where(fn('LOWER', col('sku')), 'LIKE', `%${search.toLowerCase()}%`),
    //             where(fn('LOWER', col('item_code')), 'LIKE', `%${search.toLowerCase()}%`),
    //             where(fn('LOWER', col('category')), 'LIKE', `%${search.toLowerCase()}%`)
    //         ]
    //     };
    // } else {
    //     // Initialize the array to hold individual conditions
    //     let conditions = [];

    //     if (sku) {
    //         conditions.push(where(fn('LOWER', col('sku')), 'LIKE', `%${sku.toLowerCase()}%`));
    //     }

    //     if (item_code) {
    //         conditions.push(where(fn('LOWER', col('item_code')), 'LIKE', `%${item_code.toLowerCase()}%`));
    //     }

    //     if (category) {
    //         conditions.push(where(fn('LOWER', col('category')), 'LIKE', `%${category.toLowerCase()}%`));
    //     }

    //     // Combine all conditions into the search query
    //     if (conditions.length > 0) {
    //         searchQuery = { [Op.or]: conditions };
    //     }
    // }

    // let searchQuery;

    // // Initialize the array to hold individual conditions
    // let conditions = [];

    // if (salesman_code) {
    //     conditions.push({
    //         salesman_code: { [Op.eq]: salesman_code }
    //     });
    // }
    // if (user_id) {
    //     conditions.push({
    //         user_id: { [Op.eq]: user_id }
    //     });
    // }

    // // Combine all conditions into the search query
    // if (conditions.length > 0) {
    //     searchQuery = { [Op.or]: conditions };
    // }

    // console.log('searchQuery', searchQuery);

    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await SalesmanInfoModel.count();
    const festivalRes = await SalesmanInfoModel.findAll({
      //     where: searchQuery,
      attributes: ["id", "salesman_code", "status", "user_id"],
      include: [
        {
          model: UserModel,
          as: "users",
          attributes: ["firstname", "lastname", "email", "mobile"],
          include: [
            {
              model: countryMastersModel,
              as: "country", // The associated User model
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      // where: searchQuery,
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
    email,
    password,
    firstname,
    lastname,
    mobile,
    mobileno,
    salesman_code,
    status,
    country_id,
  } = req.body;

  try {
    if (firstname == "" || firstname == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "FirstName field is required",
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
            "LastName field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (mobileno == "" || mobileno == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Mobile No field is required",
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
    if (email == "" || email == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email field is required",
            "Error",
            ""
          )
        );
      return;
    }
    let email_check = await UserModel.count({
      where: { email: email, usertype: 3 },
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

    codesettingupdate("salesman");
    let user = await UserModel.create({
      email: email,
      usertype: 3,
      firstname: firstname,
      lastname: lastname,
      // mobile: mobile,
      mobile: mobileno,
      password: "123456",
      country_id: country_id,
    });

    const salesman = await SalesmanInfoModel.create({
      user_id: user.id,
      // date_of_joining: date_of_joining,
      organisation_id: 2,
      // is_parent: is_parent,
      salesman_code: salesman_code,
      salesman_role_id: 2,
      // salesman_helper_id: salesman_helper_id,
      salesman_type_id: 1,
      // salesman_supervisor: salesman_supervisor,
      // category_id: category_id
      status: parseInt(status),
    });
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          salesman
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
const update = async (req, res, next) => {
  const {
    id,
    // email,
    // password,
    // parent_id,
    // firstname,
    // lastname,
    // mobile,
    // role_id,
    // salesman_code,
    // date_of_joining,
    // is_parent,
    // salesman_role_id,
    // salesman_helper_id,
    // salesman_type_id,
    // salesman_supervisor,
    // category_id,
    email,
    firstname,
    lastname,
    // mobile,
    mobileno,
    salesman_code,
    status,
    country_id,
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
            "FirstName field is required",
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
            "LastName field is required",
            "Error",
            ""
          )
        );
      return;
    }
    if (mobileno == "" || mobileno == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Mobile No field is required",
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
    if (email == "" || email == null) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email field is required",
            "Error",
            ""
          )
        );
      return;
    }
    const customer_find = await SalesmanInfoModel.findOne({
      //     where: searchQuery,
      attributes: ["id", "salesman_code", "user_id"],
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
            "salesman not found",
            "Error"
          )
        );
    }

    let email_check = await UserModel.count({
      where: {
        email: { [Op.eq]: email },
        id: { [Op.ne]: customer_find.user_id },
        usertype: 3,
      },
    });
    if (email_check > 0) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Email already exit",
            "Error",
            ""
          )
        );
      return;
    }

    let user = await UserModel.update(
      {
        email: email,
        usertype: 3,
        firstname: firstname,
        lastname: lastname,
        mobile: mobileno,
        country_id: country_id,
      },
      {
        where: {
          id: customer_find.user_id,
        },
      }
    );

    // codesettingupdate('salesman');

    const salesman = await SalesmanInfoModel.update(
      {
        // user_id:user.id,
        user_id: user.id,
        // date_of_joining: date_of_joining,
        organisation_id: 2,
        // is_parent: is_parent,
        salesman_code: salesman_code,
        salesman_role_id: 2,
        // salesman_helper_id: salesman_helper_id,
        salesman_type_id: 1,
        // salesman_supervisor: salesman_supervisor,
        // category_id: category_id
        status: parseInt(status),
      },
      {
        where: {
          id: id,
        },
      }
    );

    const customer_finds = await SalesmanInfoModel.findOne({
      //     where: searchQuery,
      attributes: ["id", "salesman_code", "user_id"],
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
    // codesettingupdate('salesman');
    const customer_find = await SalesmanInfoModel.findOne({
      //     where: searchQuery,
      // attributes: ['id', 'salesman_code', 'user_id'],
      include: [
        {
          model: UserModel,
          as: "users", // The associated User model
          // attributes: ['firstname', 'lastname', 'email'],
          include: [
            {
              model: countryMastersModel,
              as: "countrys", // The associated User model
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
            "salesman not found",
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
const delete_salesman = async (req, res, next) => {
  const { id } = req.body;

  try {
    // Attempt to soft delete the order
    const customer_find = await SalesmanInfoModel.findOne({
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
            "salesman not found",
            "Error"
          )
        );
    }

    const cust_del = await SalesmanInfoModel.destroy({
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
  sales_list,
  store,
  update,
  details,
  delete_salesman,
};

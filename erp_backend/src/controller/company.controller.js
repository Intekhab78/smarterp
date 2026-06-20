const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const fs = require("fs");
const path = require("path");

const CompanyModel = db.company;
const LocationModel = db.location;
const CompanyLocationModel = db.company_location;
const CompanyAddressModel = db.company_address;
const CompanyBankModel = db.company_bank;
const { codesettingupdate, codesettingGet } = require("../utils/handler");

require("dotenv").config();
const paths = require("path");
const { log } = require("console");
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
  const { page, limit = 10 } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await CompanyModel.count();
    const festivalRes = await CompanyModel.findAll({
      include: [
        {
          model: LocationModel,
          as: "location",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: CompanyBankModel,
          as: "company_bank",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
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
const com_list = async (req, res, next) => {
  const { page, limit = 10 } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await CompanyModel.count();
    const festivalRes = await CompanyModel.findAll({
      // include: [
      //     {
      //         model: CompanyLocationModel,
      //         as: 'company_location',
      //         // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
      //     },
      //     {
      //         model: CompanyBankModel,
      //         as: 'company_bank',
      //         // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
      //     },
      // ],
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

// company_list by users company id
const user_matched_com_list = async (req, res, next) => {
  const { company_id } = req.body;

  try {
    const whereClause = company_id ? { id: company_id } : {};

    const companies = await CompanyModel.findAll({
      where: whereClause,
    });

    if (!companies || companies.length === 0) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Company not found!",
            "Error",
            ""
          )
        );
    }

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Company fetched successfully",
          "",
          companies
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

const store = async (req, res, next) => {
  const {
    compdesc,
    compcode,
    clogo,
    ccountry,
    itemdesclong,
    note1,
    note2,
    note3,
    ccompany,
    ccurrency,
    clicense,
    ctaxnumber,
    cacurrency,
    itmcatdt1,
    itmcatdt2,
    status,
    addedby,

    banks,
    address,
    // locations,
    isMain,
    mainCompanyId,
  } = req.body;

  console.log("compnay enty is ---", req.body);

  try {
    let name_check = await CompanyModel.count({
      where: { compdesc: compdesc },
    });
    if (name_check > 0) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Company already exist",
            "Error",
            ""
          )
        );
      return;
    }

    let getNumber = await codesettingGet("company");
    codesettingupdate("company");

    let getNumberRand = Math.floor(100000 + Math.random() * 900000);
    const base64Data = clogo.replace(/^data:image\/\w+;base64,/, "");
    const logoFileName = `company_logo_${getNumberRand}.png`;
    const filePath = path.join(
      __dirname,
      "../../public",
      "uploads",
      "logos",
      logoFileName
    );

    // Save image to local path
    fs.writeFileSync(filePath, base64Data, "base64");

    let company = await CompanyModel.create({
      is_main_comp: isMain,
      main_company_id: mainCompanyId,
      compdesc: compdesc,
      ccountry: ccountry,
      clogo: logoFileName,
      compcode: getNumber,
      itemdesclong: itemdesclong,
      note1: note1,
      note2: note2,
      note3: note3,
      ccompany: ccompany,
      ccurrency: ccurrency,
      clicense: clicense,
      ctaxnumber: ctaxnumber,
      cacurrency: cacurrency,
      itmcatdt1: itmcatdt1,
      itmcatdt2: itmcatdt2,
      addedby: addedby,
      status: status,
    });
    for (var a = 0; a < address.length; a++) {
      let location_add = await CompanyAddressModel.create({
        company_id: company.id,
        address_name: address[a].address_name,
        address: address[a].address,
        postal_code: address[a].postal_code,
        country_id: address[a].country_id,
        city_id: address[a].city_id,
        emirates_id: address[a].emirates_id,
        contact_no: address[a].contact_no,
        email: address[a].email,
        contact_name: address[a].contact_name,
        fax_no: address[a].fax_no,
        landline_no: address[a].landline_no,
        toll_free_number: address[a].toll_free_number,
        other_number_2: address[a].other_number_2,
        other_number_3: address[a].other_number_3,
        other_email_2: address[a].other_email_2,
        other_email_3: address[a].other_email_3,
        default_address: address[a].default_address,
      });
    }
    for (var b = 0; b < banks.length; b++) {
      let company_bank = await CompanyBankModel.create({
        company_id: company.id,
        address_name: banks[b].bank_address_name,
        bank_account_number: banks[b].bank_bank_account_number,
        country_id: banks[b].bank_country_id,
        address: banks[b].bank_address,
        postal_code: banks[b].bank_postal_code,
        currency_id: banks[b].bank_currency_id,
        paying_bank: banks[b].bank_paying_bank,
        beneficiary_name: banks[b].bank_beneficiary_name,
        branch_name: banks[b].bank_branch_name,
        iban_no: banks[b].bank_iban_no,
        contact_no: banks[b].bank_contact_no,
        email: banks[b].bank_email,
        contact_name: banks[b].bank_contact_name,
        fax_no: banks[b].bank_fax_no,
        landline_no: banks[b].bank_landline_no,
        toll_free_number: banks[b].bank_toll_free_number,
        other_number_2: banks[b].bank_other_number_2,
        other_number_3: banks[b].bank_other_number_3,
        other_email_2: banks[b].bank_other_email_2,
        other_email_3: banks[b].bank_other_email_3,
        default_address: banks[b].bank_default_address,
      });
    }
    // for (var c = 0; c < locations.length; c++) {
    //     let company_bank = await CompanyLocationModel.create({
    //         company_id: company.id,
    //         branch_name: locations[c].location_branch_name,
    //         address: locations[c].location_address,
    //         currency_id: locations[c].location_currency_id,
    //     })
    // }
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          company
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
    const festivalRes = await CompanyModel.findOne({
      include: [
        {
          model: CompanyAddressModel,
          as: "company_address",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationModel,
          as: "location",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: CompanyBankModel,
          as: "company_bank",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
      ],
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
      // const invoicePdfFullPaths = festivalRes.clogo
      //   ? base_url + path.posix.join("uploads/logos", festivalRes.clogo)
      //   : null;
      // festivalRes.clogo = invoicePdfFullPaths;

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
    compdesc,
    compcode,
    ccountry,
    clogo,
    itemdesclong,
    note1,
    note2,
    note3,
    ccompany,
    ccurrency,
    clicense,
    ctaxnumber,
    cacurrency,
    itmcatdt1,
    itmcatdt2,
    status,
    addedby,
    address,
    banks,
    // locations,
  } = req.body;

  try {
    const detail = await CompanyModel.findOne({
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }
    if (compdesc != detail.compdesc) {
      let name_check = await CompanyModel.count({
        where: { compdesc: compdesc },
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
    let getNumberRand = Math.floor(100000 + Math.random() * 900000);

    const base64Data = clogo.replace(/^data:image\/\w+;base64,/, "");
    const logoFileName = `company_logo_${getNumberRand}.png`;
    const filePath = path.join(
      __dirname,
      "../../public",
      "uploads",
      "logos",
      logoFileName
    );

    // Save image to local path
    fs.writeFileSync(filePath, base64Data, "base64");

    let company = await CompanyModel.update(
      {
        compdesc: compdesc,
        ccountry: ccountry,
        compcode: compcode,
        clogo: logoFileName,
        itemdesclong: itemdesclong,
        note1: note1,
        note2: note2,
        note3: note3,
        ccompany: ccompany,
        ccurrency: ccurrency,
        clicense: clicense,
        ctaxnumber: ctaxnumber,
        cacurrency: cacurrency,
        itmcatdt1: itmcatdt1,
        itmcatdt2: itmcatdt2,
        addedby: addedby,
        status: status,
      },
      {
        where: {
          id: id,
        },
      }
    );
    const del_bank = await CompanyBankModel.destroy({
      where: {
        company_id: id,
      },
    });
    // const del_con = await CompanyLocationModel.destroy({
    //     where: {
    //         company_id: id
    //     }
    // });
    const del_add = await CompanyAddressModel.destroy({
      where: {
        company_id: id,
      },
    });

    for (var a = 0; a < address.length; a++) {
      let location_add = await CompanyAddressModel.create({
        company_id: detail.id,
        address_name: address[a].address_name,
        address: address[a].address,
        postal_code: address[a].postal_code,
        country_id: address[a].country_id,
        city_id: address[a].city_id,
        emirates_id: address[a].emirates_id,
        contact_no: address[a].contact_no,
        email: address[a].email,
        contact_name: address[a].contact_name,
        fax_no: address[a].fax_no,
        landline_no: address[a].landline_no,
        toll_free_number: address[a].toll_free_number,
        other_number_2: address[a].other_number_2,
        other_number_3: address[a].other_number_3,
        other_email_2: address[a].other_email_2,
        other_email_3: address[a].other_email_3,
        default_address: address[a].default_address,
      });
    }
    for (var b = 0; b < banks.length; b++) {
      let company_bank = await CompanyBankModel.create({
        company_id: detail.id,
        address_name: banks[b].bank_address_name,
        bank_account_number: banks[b].bank_bank_account_number,
        country_id: banks[b].bank_country_id,
        address: banks[b].bank_address,
        postal_code: banks[b].bank_postal_code,
        currency_id: banks[b].bank_currency_id,
        paying_bank: banks[b].bank_paying_bank,
        beneficiary_name: banks[b].bank_beneficiary_name,
        branch_name: banks[b].bank_branch_name,
        iban_no: banks[b].bank_iban_no,
        contact_no: banks[b].bank_contact_no,
        email: banks[b].bank_email,
        contact_name: banks[b].bank_contact_name,
        fax_no: banks[b].bank_fax_no,
        landline_no: banks[b].bank_landline_no,
        toll_free_number: banks[b].bank_toll_free_number,
        other_number_2: banks[b].bank_other_number_2,
        other_number_3: banks[b].bank_other_number_3,
        other_email_2: banks[b].bank_other_email_2,
        other_email_3: banks[b].bank_other_email_3,
        default_address: banks[b].bank_default_address,
      });
    }
    // for (var c = 0; c < locations.length; c++) {
    //     let company_bank = await CompanyLocationModel.create({
    //         company_id: detail.id,
    //         branch_name: locations[c].location_branch_name,
    //         address: locations[c].location_address,
    //         currency_id: locations[c].location_currency_id,
    //     })
    // }
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
const delete_uom = async (req, res, next) => {
  const { id } = req.body;

  try {
    const del_bank = await CompanyBankModel.destroy({
      where: {
        company_id: id,
      },
    });
    const del_con = await CompanyLocationModel.destroy({
      where: {
        company_id: id,
      },
    });
    const deletedCount = await CompanyModel.destroy({
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
module.exports = {
  list,
  store,
  update,
  details,
  delete_uom,
  com_list,
  user_matched_com_list,
};

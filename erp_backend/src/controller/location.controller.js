const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize, fn, col, where } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");

const LocationModel = db.location;
const LocationWarehouseModel = db.location_warehouse;
const LocationContactModel = db.location_contact;
const LocationBankModel = db.location_bank;
const LocationAddressModel = db.location_address;
const company = db.company;
const { codesettingupdate, codesettingGet } = require("../utils/handler");

require("dotenv").config();
const paths = require("path");
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
  const { page, limit = 10 } = req.body;

  try {
    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    const totalRecords = await LocationModel.count();
    const festivalRes = await LocationModel.findAll({
      include: [
        {
          model: company,
          as: "company",
          attributes: ["id", "compdesc"],
        },
        {
          model: LocationWarehouseModel,
          as: "location_warehouse",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationContactModel,
          as: "location_contact",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationBankModel,
          as: "location_bank",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationAddressModel,
          as: "location_address",
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
const loc_list1 = async (req, res, next) => {
  const { company_id } = req.body;

  try {
    const whereClause = company_id && company_id != 0 ? { id: compdesc } : {};

    const festivalRes = await LocationModel.findAll({
      where: whereClause,
      include: [
        {
          model: LocationWarehouseModel,
          as: "location_warehouse",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationContactModel,
          as: "location_contact",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationBankModel,
          as: "location_bank",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationAddressModel,
          as: "location_address",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
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

const loc_list = async (req, res, next) => {
  const { company_id } = req.body;

  try {
    // Fetch all locations with associated models
    const allLocations = await LocationModel.findAll({
      include: [
        {
          model: LocationWarehouseModel,
          as: "location_warehouse",
        },
        {
          model: LocationContactModel,
          as: "location_contact",
        },
        {
          model: LocationBankModel,
          as: "location_bank",
        },
        {
          model: LocationAddressModel,
          as: "location_address",
        },
      ],
      order: [["id", "DESC"]],
    });

    // Filter based on company_id by matching with compdesc (stored as string)
    const filteredLocations =
      company_id && company_id != 0
        ? allLocations.filter(
            (location) => location.compdesc === String(company_id)
          )
        : allLocations;

    if (!filteredLocations || filteredLocations.length === 0) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "No locations found!",
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
            "Successfully fetched records",
            "",
            filteredLocations
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

const com_loc_list = async (req, res, next) => {
  const { companies } = req.body;

  try {
    // Use companies directly if it exists and is an array
    const whereClause =
      companies && companies.length > 0 ? { ccompany: companies } : {};

    const festivalRes = await LocationModel.findAll({
      where: whereClause,
      include: [
        {
          model: LocationWarehouseModel,
          as: "location_warehouse",
        },
        {
          model: LocationContactModel,
          as: "location_contact",
        },
        {
          model: LocationBankModel,
          as: "location_bank",
        },
        {
          model: LocationAddressModel,
          as: "location_address",
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!festivalRes || festivalRes.length === 0) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "No records found!",
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
            "Successfully fetched records",
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
    compdesc,
    loccode,
    locname,
    note1,
    note2,
    note3,
    ccompany,
    ccurrency,
    clicense,
    ctaxnumber,
    cacurrency,
    cfinyear,
    locdesclong,
    itmcatdt1,
    itmcatdt2,
    status,
    addedby,
    address,
    banks,
    contacts,
    warehouses,
  } = req.body;

  try {
    let name_check = await LocationModel.count({ where: { locname: locname } });
    if (name_check > 0) {
      res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Name already exist",
            "Error",
            ""
          )
        );
      return;
    }
    let getNumber = await codesettingGet("location");
    codesettingupdate("location");
    let location = await LocationModel.create({
      compdesc: compdesc,
      loccode: getNumber,
      locname: locname,
      note1: note1,
      note2: note2,
      note3: note3,
      ccompany: ccompany,
      ccurrency: ccurrency,
      clicense: clicense,
      ctaxnumber: ctaxnumber,
      cacurrency: cacurrency,
      cfinyear: cfinyear,
      locdesclong: locdesclong,
      itmcatdt1: itmcatdt1,
      itmcatdt2: itmcatdt2,
      addedby: addedby,
      status: status,
    });
    for (var a = 0; a < address.length; a++) {
      let location_add = await LocationAddressModel.create({
        location_id: location.id,
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
      let location_bank = await LocationBankModel.create({
        location_id: location.id,
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
    for (var c = 0; c < contacts.length; c++) {
      let location_bank = await LocationContactModel.create({
        location_id: location.id,
        address_name: contacts[c].conatct_address_name,
        bank_account_number: contacts[c].conatct_bank_account_number,
        country_id: contacts[c].conatct_country_id,
        address: contacts[c].conatct_address,
        postal_code: contacts[c].conatct_postal_code,
        currency_id: contacts[c].conatct_currency_id,
        paying_bank: contacts[c].conatct_paying_bank,
        beneficiary_name: contacts[c].conatct_beneficiary_name,
        branch_name: contacts[c].conatct_branch_name,
        iban_no: contacts[c].conatct_iban_no,
        contact_no: contacts[c].conatct_contact_no,
        email: contacts[c].conatct_email,
        contact_name: contacts[c].conatct_contact_name,
        fax_no: contacts[c].conatct_fax_no,
        landline_no: contacts[c].conatct_landline_no,
        other_number_2: contacts[c].conatct_other_number_2,
        other_number_3: contacts[c].conatct_other_number_3,
        other_email_2: contacts[c].conatct_other_email_2,
        other_email_3: contacts[c].conatct_other_email_3,
        default_address: contacts[c].conatct_default_address,
      });
    }
    for (var w = 0; w < warehouses.length; w++) {
      let location_bank = await LocationWarehouseModel.create({
        location_id: location.id,
        warehouse_desc: warehouses[w].warehouse_desc,
        address: warehouses[w].warehouse_address,
      });
    }
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Successfully added record",
          "",
          location
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
    const festivalRes = await LocationModel.findOne({
      include: [
        {
          model: LocationWarehouseModel,
          as: "location_warehouse",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationContactModel,
          as: "location_contact",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationBankModel,
          as: "location_bank",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile'],
        },
        {
          model: LocationAddressModel,
          as: "location_address",
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
    loccode,
    locname,
    note1,
    note2,
    note3,
    ccompany,
    ccurrency,
    clicense,
    ctaxnumber,
    cacurrency,
    cfinyear,
    locdesclong,
    itmcatdt1,
    itmcatdt2,
    status,
    addedby,
    address,
    banks,
    contacts,
    warehouses,
  } = req.body;

  try {
    const detail = await LocationModel.findOne({
      where: {
        id: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }
    if (locname != detail.locname) {
      let name_check = await LocationModel.count({
        where: { locname: locname },
      });
      if (name_check > 0) {
        res
          .status(400)
          .json(
            ResponseFormatter.setResponse(
              false,
              400,
              "Name already exist",
              "Error",
              ""
            )
          );
        return;
      }
    }
    // codesettingupdate('item');
    let location = await LocationModel.update(
      {
        compdesc: compdesc,
        loccode: loccode,
        locname: locname,
        note1: note1,
        note2: note2,
        note3: note3,
        ccompany: ccompany,
        ccurrency: ccurrency,
        clicense: clicense,
        ctaxnumber: ctaxnumber,
        cacurrency: cacurrency,
        cfinyear: cfinyear,
        locdesclong: locdesclong,
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
    const del_add = await LocationAddressModel.destroy({
      where: {
        location_id: id,
      },
    });
    const del_bank = await LocationBankModel.destroy({
      where: {
        location_id: id,
      },
    });
    const del_con = await LocationContactModel.destroy({
      where: {
        location_id: id,
      },
    });
    const del_ware = await LocationWarehouseModel.destroy({
      where: {
        location_id: id,
      },
    });
    for (var a = 0; a < address.length; a++) {
      let location_add = await LocationAddressModel.create({
        location_id: detail.id,
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
      let location_bank = await LocationBankModel.create({
        location_id: detail.id,
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
    for (var c = 0; c < contacts.length; c++) {
      let location_bank = await LocationContactModel.create({
        location_id: detail.id,
        address_name: contacts[c].conatct_address_name,
        bank_account_number: contacts[c].conatct_bank_account_number,
        country_id: contacts[c].conatct_country_id,
        address: contacts[c].conatct_address,
        postal_code: contacts[c].conatct_postal_code,
        currency_id: contacts[c].conatct_currency_id,
        paying_bank: contacts[c].conatct_paying_bank,
        beneficiary_name: contacts[c].conatct_beneficiary_name,
        branch_name: contacts[c].conatct_branch_name,
        iban_no: contacts[c].conatct_iban_no,
        contact_no: contacts[c].conatct_contact_no,
        email: contacts[c].conatct_email,
        contact_name: contacts[c].conatct_contact_name,
        fax_no: contacts[c].conatct_fax_no,
        landline_no: contacts[c].conatct_landline_no,
        other_number_2: contacts[c].conatct_other_number_2,
        other_number_3: contacts[c].conatct_other_number_3,
        other_email_2: contacts[c].conatct_other_email_2,
        other_email_3: contacts[c].conatct_other_email_3,
        default_address: contacts[c].conatct_default_address,
      });
    }
    for (var w = 0; w < warehouses.length; w++) {
      let location_bank = await LocationWarehouseModel.create({
        location_id: detail.id,
        warehouse_desc: warehouses[w].warehouse_desc,
        address: warehouses[w].warehouse_address,
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
const delete_uom = async (req, res, next) => {
  const { id } = req.body;

  try {
    const del_add = await LocationAddressModel.destroy({
      where: {
        location_id: id,
      },
    });
    const del_bank = await LocationBankModel.destroy({
      where: {
        location_id: id,
      },
    });
    const del_con = await LocationContactModel.destroy({
      where: {
        location_id: id,
      },
    });
    const del_ware = await LocationWarehouseModel.destroy({
      where: {
        location_id: id,
      },
    });
    const deletedCount = await LocationModel.destroy({
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
  loc_list,
  com_loc_list,
};

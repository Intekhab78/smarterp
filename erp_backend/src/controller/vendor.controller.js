const { Op } = require("sequelize");
const db = require("../models");
const VendorModel = db.vendor_master; // assuming you have a Vendor model
const UserModel = db.user_master;
const ResponseFormatter = require("../utils/ResponseFormatter");
const { codesettingupdate } = require("../utils/handler");
const fs = require("fs");
const path = require("path");

// CREATE VENDOR
const createVendor = async (req, res) => {
  try {
    const vendorData = req.body;

    // Validation
    if (!vendorData.vendor_code || !vendorData.firstname || !vendorData.email) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Required fields missing",
            "Error",
            ""
          )
        );
    }

    // Check for duplicate vendor code
    const exists = await VendorModel.count({
      where: { vendor_code: vendorData.vendor_code },
    });
    if (exists > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Vendor code already exists",
            "Error",
            ""
          )
        );
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.trade_license_upload) {
        vendorData.trade_license_upload =
          req.files.trade_license_upload[0].filename;
      }
      if (req.files.tax_certificate) {
        vendorData.tax_certificate = req.files.tax_certificate[0].filename;
      }
    }

    // codesettingupdate("vendor");
    codesettingupdate("supplier");

    const vendor = await VendorModel.create(vendorData);
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Vendor created successfully",
          "",
          vendor
        )
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

// LIST VENDORS
const listVendors = async (req, res) => {
  try {
    const { page = 1, limit = 10, name, vendor_code } = req.body;
    const offset = (page - 1) * limit;

    let conditions = {};
    if (name) conditions.firstname = { [Op.like]: `%${name}%` };
    if (vendor_code) conditions.vendor_code = { [Op.like]: `%${vendor_code}%` };

    const totalRecords = await VendorModel.count({ where: conditions });
    const vendors = await VendorModel.findAll({
      where: conditions,
      order: [["id", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json(
      ResponseFormatter.setResponse(
        true,
        200,
        "Vendors fetched successfully",
        "",
        {
          records: vendors,
          currentPage: parseInt(page),
          pageSize: parseInt(limit),
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
        }
      )
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

// VIEW SINGLE VENDOR
const viewVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await VendorModel.findByPk(id);

    if (!vendor) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Vendor not found",
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
          "Vendor fetched successfully",
          "",
          vendor
        )
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

// UPDATE VENDOR
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorData = req.body;

    // Handle file uploads
    if (req.files) {
      if (req.files.trade_license_upload) {
        vendorData.trade_license_upload =
          req.files.trade_license_upload[0].filename;
      }
      if (req.files.tax_certificate) {
        vendorData.tax_certificate = req.files.tax_certificate[0].filename;
      }
    }

    const vendor = await VendorModel.findByPk(id);
    if (!vendor) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Vendor not found",
            "Error",
            ""
          )
        );
    }

    await vendor.update(vendorData);

    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Vendor updated successfully",
          "",
          vendor
        )
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

// DELETE VENDOR
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await VendorModel.findByPk(id);
    if (!vendor) {
      return res
        .status(404)
        .json(
          ResponseFormatter.setResponse(
            false,
            404,
            "Vendor not found",
            "Error",
            ""
          )
        );
    }

    // Optional: delete uploaded files
    if (vendor.trade_license_upload) {
      fs.unlinkSync(
        path.join(__dirname, "../uploads/", vendor.trade_license_upload)
      );
    }
    if (vendor.tax_certificate) {
      fs.unlinkSync(
        path.join(__dirname, "../uploads/", vendor.tax_certificate)
      );
    }

    await vendor.destroy();
    res
      .status(200)
      .json(
        ResponseFormatter.setResponse(
          true,
          200,
          "Vendor deleted successfully",
          "",
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
          "Something went wrong",
          "Error",
          error.message
        )
      );
  }
};

module.exports = {
  createVendor,
  listVendors,
  viewVendor,
  updateVendor,
  deleteVendor,
};

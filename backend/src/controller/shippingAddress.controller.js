const db = require("../models");
const ShippingAddress = db.shipping_address;
const Customer = db.customer_master;

//---------------------------------------
// CREATE SHIPPING ADDRESS
//---------------------------------------
exports.createAddress = async (req, res) => {
  try {
    const {
      customer_id,
      customer_code,
      full_name,
      phone_number,
      alternate_phone_number,
      pincode,
      address_line1,
      address_line2,
      city,
      state,
      country,
      address_type,
      is_default,
      latitude,
      longitude,
    } = req.body;

    const newAddress = await ShippingAddress.create({
      customer_id,
      customer_code,
      full_name,
      phone_number,
      alternate_phone_number,
      pincode,
      address_line1,
      address_line2,
      city,
      state,
      country,
      address_type,
      is_default,
      latitude,
      longitude,
    });

    return res.status(201).json({
      status: true,
      message: "Shipping address created successfully",
      data: newAddress,
    });
  } catch (error) {
    console.log("ERROR CREATE SHIPPING ADDRESS:", error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

//---------------------------------------
// LIST ALL SHIPPING ADDRESSES OF A CUSTOMER
//---------------------------------------
exports.listAddresses = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const list = await ShippingAddress.findAll({
      where: { customer_id, status: "Active" },
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Address list fetched",
      data: list,
    });
  } catch (error) {
    console.log("ERROR LIST SHIPPING ADDRESS:", error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

//---------------------------------------
// GET DETAILS OF ONE ADDRESS
//---------------------------------------
exports.addressDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await ShippingAddress.findOne({
      where: { id, status: "Active" },
    });

    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Shipping address fetched",
      data: address,
    });
  } catch (error) {
    console.log("ERROR DETAILS SHIPPING ADDRESS:", error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

//---------------------------------------
// UPDATE SHIPPING ADDRESS
//---------------------------------------
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    let check = await ShippingAddress.findOne({ where: { id } });
    if (!check) {
      return res.status(404).json({
        status: false,
        message: "Shipping address not found",
      });
    }

    await ShippingAddress.update(req.body, { where: { id } });

    const updatedData = await ShippingAddress.findOne({ where: { id } });

    return res.status(200).json({
      status: true,
      message: "Address updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.log("ERROR UPDATE SHIPPING ADDRESS:", error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

//---------------------------------------
// DELETE (INACTIVE) SHIPPING ADDRESS
//---------------------------------------
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await ShippingAddress.findOne({ where: { id } });
    if (!check) {
      return res.status(404).json({
        status: false,
        message: "Shipping address not found",
      });
    }

    await ShippingAddress.update({ status: "Inactive" }, { where: { id } });

    return res.status(200).json({
      status: true,
      message: "Address has been deleted successfully.",
    });
  } catch (error) {
    console.log("ERROR DELETE SHIPPING ADDRESS:", error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

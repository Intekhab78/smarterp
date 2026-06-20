const { collection_details, invoice, register_tbl_hdr } = require("../models");

const list = async (req, res) => {
  try {
    const data = await collection_details.findAll({
      include: [
        {
          model: register_tbl_hdr,
          as: "registerHeader", // 👈 includes full register_tbl_hdr object
          attributes: ["id", "status", "date", "time", "currency"], // add more if needed
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      status: true,
      message: "Collection details fetched successfully",
      data,
    });
  } catch (error) {
    console.error("List Error:", error);
    res.status(500).json({
      status: false,
      message: "Something went wrong while fetching collection details",
      error: error.message,
    });
  }
};

module.exports = {
  list,
};

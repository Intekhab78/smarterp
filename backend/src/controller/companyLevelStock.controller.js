// controllers/companyLevelStock.controller.js

const { company_level_stock, company, item_master } = require("../models");

const getCompanyLevelStockList = async (req, res) => {
  try {
    const { company_id } = req.query; // optional filter

    const whereClause = {};
    if (company_id) {
      whereClause.company_id = company_id;
    }

    const stockList = await company_level_stock.findAll({
      where: whereClause,
      include: [
        {
          model: company,
          as: "company",
          attributes: ["id", "compdesc"], // ✅ matches your model
        },
        {
          model: item_master,
          as: "item",
          attributes: ["uuid", "item_name", "itemupc"],
        },
      ],

      order: [["total_stock", "DESC"]],
    });

    res.json({
      status: true,
      message: "Company-level stock list fetched successfully.",
      data: stockList,
    });
  } catch (error) {
    console.error("Error fetching company-level stock list:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error while fetching stock list.",
    });
  }
};

module.exports = { getCompanyLevelStockList };

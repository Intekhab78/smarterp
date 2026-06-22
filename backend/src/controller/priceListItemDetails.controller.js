// ---------------- CREATE BULK ----------------
// const db = require("../models");
// const { Op } = require("sequelize");
// const PriceListItemDetails = db.priceListItemDetails;
// const ItemLocationMaster = db.item_location_master;

// priceListItemDetails.controller.js

const db = require("../models");
const { Op } = require("sequelize");

const PriceListItemDetails = db.priceListItemDetails;
const ItemLocationMaster = db.item_location_master; // ✅ FIXED

/**
 * ----------------------------------------
 * CREATE BULK (FIXED)
 * ----------------------------------------
 */

exports.createBulk = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { price_list_code, excelData } = req.body;

    if (!price_list_code) {
      return res.status(400).json({
        status: false,
        message: "Price List Code is required",
      });
    }

    if (!excelData || excelData.length < 2) {
      return res.status(400).json({
        status: false,
        message: "Excel data is missing or empty",
      });
    }

    // remove header row
    const rows = excelData.slice(1);
    const itemsToInsert = [];

    console.log("rows -------->", rows);

    for (const row of rows) {
      /**
       * Excel mapping (FINAL)
       * 0 → item_upc
       * 1 → item_name
       * 2 → comp
       * 3 → loc
       * 4 → itemcost
       * 5 → itemlanprice
       * 6 → itemprice
       * 7 → list_price
       */

      const itemUpc = row[0];

      if (!itemUpc) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message: "item_upc is missing in Excel",
        });
      }

      // 🔥 Resolve item_id ONLY from DB
      const item = await ItemLocationMaster.findOne({
        where: {
          // item_code: itemUpc,
          itemupc: itemUpc,
          deleted_at: null,
        },
      });

      if (!item) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message: `Item not found in item_location_master for item_upc ${itemUpc}`,
        });
      }

      itemsToInsert.push({
        price_list_code,
        item_id: item.id, // ✅ from DB only
        item_upc: itemUpc,
        item_name: row[1] || item.item_name,

        comp: row[2] || null,
        loc: row[3] || null,

        itemcost: row[4] || 0,
        itemlanprice: row[5] || 0,
        itemprice: row[6] || 0,
        list_price: row[7] || 0,

        status: "active",
      });
    }

    // ----------------------------------------
    // DUPLICATE CHECK
    // ----------------------------------------
    const existing = await PriceListItemDetails.findAll({
      where: {
        price_list_code,
        item_id: {
          [Op.in]: itemsToInsert.map((i) => i.item_id),
        },
        deleted_at: null,
      },
    });

    if (existing.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: false,
        message: "Duplicate items found for this Price List",
        duplicates: existing.map((e) => ({
          item_id: e.item_id,
          item_name: e.item_name,
          item_upc: e.item_upc,
        })),
      });
    }

    // ----------------------------------------
    // BULK INSERT
    // ----------------------------------------
    const saved = await PriceListItemDetails.bulkCreate(itemsToInsert, {
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      status: true,
      message: "Bulk items inserted successfully",
      data: saved,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.createBulk1 = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { price_list_code, excelData } = req.body;
    if (!price_list_code) {
      return res.status(400).json({
        status: false,
        message: "Price List Code is required",
      });
    }

    if (!excelData || excelData.length < 2) {
      return res.status(400).json({
        status: false,
        message: "Excel data is missing or empty",
      });
    }

    // Remove header row
    const rows = excelData.slice(1);

    const itemsToInsert = [];
    console.log("rows is -----------", rows);

    for (const row of rows) {
      /**
       * Excel mapping (IMPORTANT)
       * 0 → IGNORE (never item_id)
       * 1 → item_code / UPC
       * 2 → item_name (optional, DB is source of truth)
       * 3 → comp
       * 4 → loc
       * 5 → itemcost
       * 6 → itemlanprice
       * 7 → itemprice
       * 8 → list_price
       */

      const itemCode = row[0];

      if (!itemCode) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message: "item_code (UPC) is missing in Excel",
        });
      }

      // 🔥 Resolve REAL item_id from item_location_master
      const item = await ItemLocationMaster.findOne({
        where: {
          item_code: itemCode,
          deleted_at: null,
        },
      });

      if (!item) {
        await transaction.rollback();
        return res.status(400).json({
          status: false,
          message: `Item not found in item_location_master for item_code ${itemCode}`,
        });
      }

      itemsToInsert.push({
        price_list_code,
        item_id: item.id, // ✅ ONLY SOURCE OF item_id
        item_upc: itemCode,
        item_name: item.item_name,
        comp: row[3] || null,
        loc: row[4] || null,
        itemcost: row[5] || 0,
        itemlanprice: row[6] || 0,
        itemprice: row[7] || 0,
        list_price: row[8] || 0,
        status: "active",
      });
    }

    // ----------------------------------------
    // DUPLICATE CHECK (STRICT)
    // ----------------------------------------
    const existing = await PriceListItemDetails.findAll({
      where: {
        price_list_code,
        item_id: {
          [Op.in]: itemsToInsert.map((i) => i.item_id),
        },
        deleted_at: null,
      },
    });

    if (existing.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: false,
        message: "Duplicate items found for this Price List",
        duplicates: existing.map((e) => ({
          item_id: e.item_id,
          item_name: e.item_name,
          item_upc: e.item_upc,
        })),
      });
    }

    // ----------------------------------------
    // BULK INSERT
    // ----------------------------------------
    const saved = await PriceListItemDetails.bulkCreate(itemsToInsert, {
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      status: true,
      message: "Bulk items inserted successfully",
      data: saved,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * ----------------------------------------
 * CREATE SINGLE
 * ----------------------------------------
 */
exports.create = async (req, res) => {
  try {
    const { item_code, price_list_code } = req.body;

    if (!item_code || !price_list_code) {
      return res.status(400).json({
        status: false,
        message: "item_code and price_list_code are required",
      });
    }

    const item = await ItemLocationMaster.findOne({
      where: { item_code, deleted_at: null },
    });

    if (!item) {
      return res.status(400).json({
        status: false,
        message: "Item not found in item_location_master",
      });
    }

    const data = await PriceListItemDetails.create({
      ...req.body,
      item_id: item.id,
      item_name: item.item_name,
      item_upc: item_code,
      status: "active",
    });

    return res.status(201).json({
      status: true,
      message: "Item added to price list",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * ----------------------------------------
 * LIST
 * ----------------------------------------
 */
exports.list = async (req, res) => {
  try {
    const items = await PriceListItemDetails.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * ----------------------------------------
 * DETAILS
 * ----------------------------------------
 */
exports.details = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await PriceListItemDetails.findByPk(id);

    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * ----------------------------------------
 * UPDATE (by id)
 * ----------------------------------------
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await PriceListItemDetails.findByPk(id);

    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }

    await item.update(req.body);

    return res.status(200).json({
      status: true,
      message: "Price list item updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/**
 * ----------------------------------------
 * DELETE (soft delete)
 * ----------------------------------------
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await PriceListItemDetails.findByPk(id);

    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Record not found",
      });
    }

    await item.update({ status: "inactive" });
    await item.destroy(); // soft delete

    return res.status(200).json({
      status: true,
      message: "Item marked inactive and deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// exports.createBulk = async (req, res) => {
//   try {
//     const { price_list_code, excelData } = req.body;

//     if (!price_list_code) {
//       return res.status(400).json({
//         status: false,
//         message: "Price List Code is required",
//       });
//     }

//     if (!excelData || excelData.length === 0) {
//       return res.status(400).json({
//         status: false,
//         message: "Excel data is missing",
//       });
//     }

//     // Extract header + rows
//     const rows = excelData.slice(1);

//     // Convert rows → objects
//     const itemsToInsert = rows.map((row) => ({
//       price_list_code,
//       item_id: row[0],
//       item_upc: row[1],
//       item_name: row[2],
//       comp: row[3],
//       loc: row[4],
//       itemcost: row[5],
//       itemlanprice: row[6],
//       itemprice: row[7],
//       list_price: row[8],
//       status: "active",
//     }));

//     // ----------------------------------------
//     // ⭐ DUPLICATE CHECK LOGIC
//     // ----------------------------------------
//     const itemIds = itemsToInsert.map((i) => i.item_id).filter(Boolean);
//     const itemUpcs = itemsToInsert.map((i) => i.item_upc).filter(Boolean);

//     const existing = await PriceListItemDetails.findAll({
//       where: {
//         price_list_code,
//         [Op.or]: [
//           { item_id: { [Op.in]: itemIds } },
//           { item_upc: { [Op.in]: itemUpcs } },
//         ],
//       },
//     });
//     console.log("exting item is ------------", existing);

//     if (existing.length > 0) {
//       const duplicates = existing.map((d) => ({
//         item_id: d.item_id,
//         item_upc: d.item_upc,
//         item_name: d.item_name, // ⭐ Added
//       }));

//       return res.status(400).json({
//         status: false,
//         message: "Duplicate items found for this Price List",
//         duplicates,
//       });
//     }

//     // ----------------------------------------
//     // ⭐ BULK INSERT
//     // ----------------------------------------
//     const saved = await PriceListItemDetails.bulkCreate(itemsToInsert);

//     return res.status(201).json({
//       status: true,
//       message: "Bulk items inserted successfully",
//       data: saved,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// // ---------------- CREATE ----------------
// exports.create = async (req, res) => {
//   try {
//     const data = await PriceListItemDetails.create(req.body);
//     return res.status(201).json({
//       status: true,
//       message: "Item added to price list",
//       data,
//     });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// // ---------------- LIST ----------------
// exports.list = async (req, res) => {
//   try {
//     const items = await PriceListItemDetails.findAll({
//       order: [["id", "DESC"]],
//     });

//     return res.status(200).json({ status: true, data: items });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// // ---------------- DETAILS ----------------
// exports.details = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const item = await PriceListItemDetails.findOne({
//       where: { id },
//     });

//     if (!item) {
//       return res
//         .status(404)
//         .json({ status: false, message: "Record not found" });
//     }

//     return res.status(200).json({ status: true, data: item });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// // ---------------- UPDATE ----------------
// exports.update1 = async (req, res) => {
//   console.log("log is ------", req.body);

//   try {
//     const { item_id } = req.params;

//     const result = await PriceListItemDetails.update(req.body, {
//       where: { item_id },
//     });

//     if (result[0] === 0) {
//       return res.status(404).json({ status: false, message: "Update failed" });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Price list item updated",
//     });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const item = await PriceListItemDetails.findByPk(id);
//     if (!item) {
//       return res.status(404).json({
//         status: false,
//         message: "Record not found",
//       });
//     }

//     await item.update({
//       list_price: req.body.list_price,
//     });

//     return res.status(200).json({
//       status: true,
//       message: "List price updated successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

// // ---------------- DELETE (status = inactive + soft delete) ----------------
// exports.delete = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const item = await PriceListItemDetails.findOne({ where: { id } });

//     if (!item) {
//       return res
//         .status(404)
//         .json({ status: false, message: "Record not found" });
//     }

//     // Update status
//     await item.update({ status: "inactive" });

//     // Soft delete
//     await item.destroy();

//     return res.status(200).json({
//       status: true,
//       message: "Item marked inactive and deleted (soft delete)",
//     });
//   } catch (error) {
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

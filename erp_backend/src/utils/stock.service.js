const { Op, fn, col } = require("sequelize");
const db = require("../models");

const BatchModel = db.batch;
const itemModel = db.item_master;
const itemLocationModel = db.item_location_master;

// ==========================================
// Recalculate & Sync Stock From Batches
// ==========================================
const syncStockFromBatches = async ({
  item_ids = [],
  company_id,
  location_id,
  transaction,
}) => {
  if (!Array.isArray(item_ids) || item_ids.length === 0) {
    throw new Error("item_ids must be non-empty array");
  }

  // =============================
  // 1️⃣ Location-wise stock
  // =============================
  const locationStocks = await BatchModel.findAll({
    attributes: [
      "item_id",
      [fn("SUM", col("current_in_stock")), "total_stock"],
    ],
    where: {
      item_id: { [Op.in]: item_ids },
      company: company_id,
      location: location_id,
    },
    group: ["item_id"],
    raw: true,
    transaction,
  });

  const locationStockMap = {};
  item_ids.forEach((id) => (locationStockMap[id] = 0));

  locationStocks.forEach((row) => {
    locationStockMap[row.item_id] = parseFloat(row.total_stock || 0);
  });

  // Update item_location_master
  for (const itemId of item_ids) {
    await itemLocationModel.update(
      {
        stock: locationStockMap[itemId],
        remaining_stock: locationStockMap[itemId],
        updated_at: new Date(),
      },
      {
        where: {
          item_id: itemId,
          company_id,
          location_id,
        },
        transaction,
      },
    );
  }

  // =============================
  // 2️⃣ Master stock (all locations)
  // =============================
  const masterStocks = await BatchModel.findAll({
    attributes: [
      "item_id",
      [fn("SUM", col("current_in_stock")), "total_stock"],
    ],
    where: {
      item_id: { [Op.in]: item_ids },
      company: company_id,
    },
    group: ["item_id"],
    raw: true,
    transaction,
  });

  const masterStockMap = {};
  item_ids.forEach((id) => (masterStockMap[id] = 0));

  masterStocks.forEach((row) => {
    masterStockMap[row.item_id] = parseFloat(row.total_stock || 0);
  });

  // Update item_master
  for (const itemId of item_ids) {
    await itemModel.update(
      {
        stock: masterStockMap[itemId],
        updated_at: new Date(),
      },
      {
        where: { id: itemId },
        transaction,
      },
    );
  }

  return {
    locationStockMap,
    masterStockMap,
  };
};

module.exports = {
  syncStockFromBatches,
};

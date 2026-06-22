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

  // ======================================
  // 1️⃣ LOCATION LEVEL STOCK (From Batches)
  // ======================================
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

  for (const itemId of item_ids) {
    const locationRow = await itemLocationModel.findOne({
      where: {
        id: itemId, // frontend sends location row id
        company_id,
        location_id,
      },
      transaction,
    });

    if (!locationRow) continue;

    const distributed = parseFloat(locationRow.distributed_stock || 0);
    const remaining = locationStockMap[itemId];
    const totalStock = distributed + remaining;

    await itemLocationModel.update(
      {
        stock: totalStock,
        remaining_stock: remaining,
        updated_at: new Date(),
      },
      {
        where: {
          id: itemId,
          company_id,
          location_id,
        },
        transaction,
      },
    );
  }

  // ======================================
  // 2️⃣ MASTER LEVEL STOCK (All Locations)
  // ======================================
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

  for (const itemId of item_ids) {
    const masterRow = await itemModel.findOne({
      where: { id: itemId },
      transaction,
    });

    if (!masterRow) continue;

    const distributed = parseFloat(masterRow.distributed_stock || 0);
    const remaining = masterStockMap[itemId];
    const totalStock = distributed + remaining;

    await itemModel.update(
      {
        stock: totalStock,
        remaining_stock: remaining,
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

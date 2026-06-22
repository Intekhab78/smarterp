const db = require("../models");
const StockDistribution = db.stock_distribution;
const ItemMaster = db.item_master;

const storeDistribution = async (req, res) => {
  try {
    const { itemId, distributedStock, companyId } = req.body;
    const createdRecords = [];

    let totalDistributedQty = 0;

    for (const dist of distributedStock) {
      const { locationId, locationQty, warehouses } = dist;

      if (locationQty && locationQty > 0) {
        const record = await StockDistribution.create({
          item_id: itemId,
          location_id: locationId,
          warehouse_id: null,
          company_id: companyId,
          qty: locationQty,
          distributed_by: req.user?.id || null,
          distribution_date: new Date(),
        });
        createdRecords.push(record);
        totalDistributedQty += locationQty;
      }

      for (const wh of warehouses) {
        const record = await StockDistribution.create({
          item_id: itemId,
          location_id: locationId,
          warehouse_id: wh.warehouseId,
          company_id: companyId,
          qty: wh.qty,
          distributed_by: req.user?.id || null,
          distribution_date: new Date(),
        });
        createdRecords.push(record);
        totalDistributedQty += wh.qty;
      }
    }

    // 🔁 Update the distributed_stock and remaining_stock in item_master
    const item = await ItemMaster.findOne({
      where: {
        id: itemId,
        company_id: companyId,
      },
    });

    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Item not found for the given company",
      });
    }

    const newDistributed = (item.distributed_stock || 0) + totalDistributedQty;
    const newRemaining = (item.stock || 0) - newDistributed;

    await item.update({
      distributed_stock: newDistributed,
      remaining_stock: newRemaining,
    });

    return res.status(201).json({
      status: true,
      message: "Stock distributed successfully",
      data: createdRecords,
    });
  } catch (error) {
    console.error("Error in stock distribution:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  storeDistribution,
};

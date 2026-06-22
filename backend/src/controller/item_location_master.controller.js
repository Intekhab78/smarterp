// controller
const { log } = require("console");
const db = require("../models");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { print, getPrinters } = require("pdf-to-printer");

const sequelize = db.sequelize; // <-- ADD THIS
const ItemMaster = db.item_master;
const ItemLoc = db.item_location_master;
const CompanyStock = db.company_level_stock;
const StockMovement = db.stock_movement;
const { Op } = db.Sequelize;
const ResponseFormatter = require("../utils/ResponseFormatter");
const item_master_image = db.item_master_image;
const OrderModel = db.order;
const userCompanyModel = db.user_company;
const OrderDetailModel = db.order_details;
const itemMajorCategoryModel = db.item_category;
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const productModel = db.product_master;
const itemColorModel = db.item_color;
const itemSizeModel = db.size_master;
const itemDepartmentModel = db.item_department;
const familyModel = db.family_master;
const subFamilyModel = db.sub_family_master;
const brandModel = db.brand;
const TaxMasterModel = db.tax_master;
const UserModel = db.user_master;
const CustomerInfo = db.customer_info;
const CompanyModel = db.company;
const LocationModel = db.location;
const Batches = db.batch;
const priceListItemDetails = db.priceListItemDetails;
const priceListMaster = db.priceListMaster;
const FilterSetting = db.FilterCompItemSetting;
const PriceListApplySettings = db.pr_apply_settings;
const PriceListItemDetails = db.price_list_item_details;
const PrApplySettings = db.pr_apply_settings;
const vendor_master = db.vendor_master;
const itemModel = db.item_master;

const bwipjs = require("bwip-js");
const base_url = process.env.BASE_URL;
const path = require("path");

const {
  getVisibilityRules,
  buildRuleMap,
  isItemAllowed,
} = require("../utils/item_visibility_rules");

const cloneItemMasterForLocation = (itemMaster, overrides) => {
  const data = itemMaster.toJSON();

  delete data.id;
  delete data.uuid;
  delete data.created_at;
  delete data.updated_at;
  delete data.deleted_at;

  delete data.company_id;
  delete data.location_id;

  return {
    ...data,
    ...overrides,
  };
};

const storeItemWithLocation = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      price,
      batch_no,
      uom,
      tax,
      stock = 0,
      partNumber,
      barcode,
      rate,
      itemcatname,
      itemdesc,
      itemdesclong,
      itemdesc3,
      itemdesc4,
      itemupc,
      itemref,
      stylecode,
      colorname,
      sizename,
      departname,
      familyname,
      subfamliy,
      brandname,
      hsncode,
      itemcost = 0,
      itemprice = 0,
      itemlanprice = 0,
      minstklvl,
      maxstklvl,
      itmstkmgmt,
      itmuom,
      itmwweight,
      itmwpurunit,
      itmwsalesunit,
      itmtax1code,
      itmtax2code,
      itmtax3code,
      itmcostingmet,
      suppliername,
      note1,
      note2,
      note3,
      itmdt1,
      itmdt2,
      itmexpiry,
      addedby,
      company_id,
      location_id,
      user_comp_id,
      user_loc_id,
      item_description,
      status,
    } = req.body;

    /* -----------------------------
       NORMALIZE FKs
    ----------------------------- */
    const normalizeFk = (v) => (v && Number(v) > 0 ? Number(v) : null);

    const safeColorName = normalizeFk(colorname);
    const safeSizeName = normalizeFk(sizename);
    const safeDepartName = normalizeFk(departname);
    const safeFamilyName = normalizeFk(familyname);
    const safeSubFamily = normalizeFk(subfamliy);
    const safeBrandName = normalizeFk(brandname);

    /* -----------------------------
       AUTO UPC
    ----------------------------- */
    const UPC_PREFIX = "299";
    const UPC_START = "2990000000001";

    let finalItemUPC = itemupc;

    if (!finalItemUPC) {
      const [result] = await db.sequelize.query(
        `
        SELECT MAX(itemupc) AS maxUpc
        FROM items
        WHERE itemupc LIKE :prefix
        FOR UPDATE
        `,
        {
          replacements: { prefix: `${UPC_PREFIX}%` },
          transaction: t,
          type: db.sequelize.QueryTypes.SELECT,
        },
      );

      finalItemUPC = result?.maxUpc
        ? String(BigInt(result.maxUpc) + 1n)
        : UPC_START;
    }

    /* -----------------------------
       DUPLICATE CHECK
    ----------------------------- */
    const exists = await itemModel.count({
      where: {
        itemdesc,
        sizename: safeSizeName,
        ...(safeColorName ? { colorname: safeColorName } : {}),
      },
      transaction: t,
    });

    if (exists > 0) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Item already exists",
      });
    }

    /* -----------------------------
       BARCODE IMAGE
    ----------------------------- */
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: finalItemUPC,
      scale: 3,
      height: 10,
      includetext: true,
    });

    const fileName = `barcode_${finalItemUPC}.jpeg`;
    fs.writeFileSync(
      path.join(__dirname, "../../public/uploads/items", fileName),
      barcodeBuffer,
    );

    const imageFileName = req.file ? req.file.filename : null;

    /* ======================================================
       1️⃣ ITEM MASTER
    ====================================================== */
    const itemMaster = await itemModel.create(
      {
        item_code: finalItemUPC,
        item_barcode: finalItemUPC,
        batch_no,
        item_name: itemdesc,
        item_barcode_img: fileName,
        item_vat_percentage: price,
        item_tax: tax ?? 0,
        stock,
        remaining_stock: stock,
        partNumber,
        barcode,
        rate,
        itemcatname,
        itemdesc,
        itemdesclong,
        itemdesc3,
        itemdesc4,
        itemupc: finalItemUPC,
        itemref,
        stylecode,
        colorname: safeColorName,
        sizename: safeSizeName,
        departname: safeDepartName,
        familyname: safeFamilyName,
        subfamliy: safeSubFamily,
        brandname: safeBrandName,
        hsncode,
        itemcost,
        itemprice,
        itemlanprice,
        minstklvl,
        maxstklvl,
        itmstkmgmt,
        itmuom,
        itmwweight,
        itmwpurunit,
        itmwsalesunit,
        itmtax1code,
        itmtax2code,
        itmtax3code,
        itmcostingmet,
        suppliername,
        note1,
        note2,
        note3,
        itmdt1,
        itmdt2,
        itmexpiry,
        addedby,
        company_id,
        location_id,
        item_image: imageFileName,
        item_description,
        status,
      },
      { transaction: t },
    );

    /* ======================================================
       2️⃣ ITEM LOCATION
    ====================================================== */
    const itemLocation = await ItemLoc.create(
      cloneItemMasterForLocation(itemMaster, {
        item_id: itemMaster.uuid,
        company_id: Number(user_comp_id),
        location_id: Number(user_loc_id),
        stock,
        opening_stock: stock,
        remaining_stock: stock,
        distributed_stock: 0,
        itemcost,
        itemlanprice,
        itemprice,
      }),
      { transaction: t },
    );

    /* ======================================================
       3️⃣ OPENING STOCK → BATCH + MOVEMENT + PRICE
    ====================================================== */
    if (Number(stock) > 0) {
      const now = new Date();
      const transactionNo = `OPEN-${Date.now()}`;

      const batchNo = `OPEN${now
        .getFullYear()
        .toString()
        .slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate(),
      ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
        now.getMinutes(),
      ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}${
        itemLocation.id
      }`;

      // const landedCost =
      //   itemlanprice && itemlanprice > 0 ? itemlanprice : itemprice;

      // 🔹 Batch
      const createdBatch = await Batches.create(
        {
          item_id: itemLocation.id,
          batch_number: batchNo,
          grn_number: transactionNo,
          manufacturing_date: null,
          expiry_date: itmexpiry || null,
          qty: stock,
          current_in_stock: stock,
          itemcost,
          itemlanprice: itemcost,
          item_price: itemprice,
          location: user_loc_id,
          company: user_comp_id,
          status: 1,
        },
        { transaction: t },
      );

      // 🔹 Stock Movement
      let uomData = null;
      if (itemLocation.itmuom) {
        uomData = await itemUomModel.findOne({
          where: { id: itemLocation.itmuom },
          transaction: t,
        });
      }

      await StockMovement.create(
        {
          item_id: itemLocation.id,
          qty: stock,
          transaction_type: "Opening Stock",
          transaction_no: transactionNo,
          batch: createdBatch.batch_number, // ✅ correct
          type: "IN",
          loc_id: user_loc_id,
          comp_id: user_comp_id,
          date: new Date(),
          stock_desc: `Opening stock for ${itemdesc}`,
          uom_id: itemLocation.itmuom,
          uom_name: uomData ? uomData.name : null,
          itemupc: finalItemUPC,
          supplier_name: suppliername,
          qty_on_hand_previous: 0,
          qty_on_hand_new: stock,
          loc_type: "Opening Stock",
        },
        { transaction: t },
      );

      // 🔹 Item Price (per batch)
      await itemMainPriceModel.create(
        {
          item_id: itemLocation.id,
          batch_number: batchNo,
          item_upc: finalItemUPC,
          item_uom_id: itemLocation.itmuom || null,
          uom_type: uomData ? uomData.name : null,
          stock_keeping_unit: stock,
          purchase_order_price: itemcost,
          itemcost,
          itemlanprice: itemcost,
          item_price: itemprice,
          sell_enable: 1,
          return_enable: 1,
          location: user_loc_id,
          company: user_comp_id,
          grn_no: transactionNo,
          status: 1,
        },
        { transaction: t },
      );
    }

    await t.commit();

    return res.status(201).json({
      status: true,
      message: "Item stored successfully",
      itemMaster,
      itemLocation,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

async function generateBarcode(text) {
  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128", // Barcode type
      text: text, // Text to encode
      scale: 3, // 3x scaling
      height: 10, // Bar height, in millimeters
      // includetext: true, // Show human-readable text
      includetext: false, // ❌ don't show human-readable text

      textxalign: "center", // Align text
    });
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (err) {
    console.error("Barcode generation failed:", err);
    return null;
  }
}

// Helper to clean strings (remove extra spaces)
const cleanString = (val) => {
  if (typeof val !== "string") return val;
  return val.replace(/\s+/g, " ").trim();
};

const updateStockFromExcel = async (req, res) => {
  const { items, company_id, location_id } = req.body;
  if (!company_id || !location_id) {
    return res
      .status(400)
      .json({ status: false, message: "Company and Location are required." });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid or empty data format" });
  }

  let createdCount = 0;
  let updatedCount = 0; // (kept for future use if you allow updates)
  let skippedCount = 0;
  const errorItems = [];
  const duplicateItems = [];
  const touchedItemUUIDs = new Set();

  const t = await db.sequelize.transaction();
  try {
    // Generate one transaction number for this whole upload batch
    const transactionNo = `OPEN-${Date.now()}`;

    // Process each incoming row
    for (const row of items) {
      try {
        const stockValue = row.Stock ?? 0;
        const priceValue = row.Price ?? 0;
        let landedValue = row.Landed_Price ?? 0;
        const costValue = row.Cost_Price ?? 0;
        // If landed price missing or zero → replace with cost price
        if (!landedValue || landedValue === 0) {
          landedValue = costValue;
        }
        function cleanString(str) {
          if (!str) return "";
          return String(str)
            .replace(/\u00A0/g, " ") // NBSP
            .replace(/\u200B/g, "") // Zero-width
            .replace(/\s+/g, " ") // multiple → single
            .trim();
        }

        // ✅ Clean only item name & UPC
        const itemName = cleanString(row["Item Name"]);
        const itemUPC = cleanString(row["itemupc"] ?? null);
        if (!itemName) {
          errorItems.push("(Unnamed Item)");
          continue;
        }

        // const foundItem = await ItemMaster.findOne({
        //   where: sequelize.where(
        //     sequelize.fn(
        //       "REPLACE",
        //       sequelize.fn(
        //         "REPLACE",
        //         sequelize.fn(
        //           "REPLACE",
        //           sequelize.fn("TRIM", sequelize.col("item_name")),
        //           "\u00A0",
        //           " "
        //         ),
        //         "\u200B",
        //         ""
        //       ),
        //       "  ",
        //       " "
        //     ),
        //     cleanString(itemName)
        //   ),
        //   transaction: t,
        // });

        const foundItem = await ItemMaster.findOne({
          where: {
            itemupc: itemUPC,
          },
          transaction: t,
        });

        if (!foundItem) {
          errorItems.push(itemName);
          continue;
        }

        const itemUUID = foundItem.uuid; // <-- use uuid everywhere as FK
        if (!itemUUID) {
          errorItems.push(`${itemName} (missing uuid)`);
          continue;
        }

        const colorName = cleanString(foundItem.colorname);
        const sizeName = cleanString(foundItem.sizename);
        if (!colorName || !sizeName) {
          errorItems.push(`${itemName} (Color/Size missing in item_master)`);
          continue;
        }
        // Duplicate check within same company + location + item
        const exists = await ItemLoc.findOne({
          // where: { item_id: itemUUID, company_id, location_id },
          where: {
            // item_id: itemUUID,
            company_id,
            location_id,
            itemupc: itemUPC,
            // colorname: cleanString(row.Color), // 👈 exact column name
            // sizename: cleanString(row.Size), // 👈 exact column name
          },
          transaction: t,
        });
        if (exists) {
          duplicateItems.push(`${itemName} (UPC ${itemUPC} already exists)`);
          continue;
        }
        // Copy ALL fields from item_master into item_location_master
        const fromMaster = foundItem.toJSON();

        // Clean fields that should NOT be copied directly or will be overridden
        delete fromMaster.id;
        delete fromMaster.uuid; // let item_location_master generate its own uuid
        delete fromMaster.created_at;
        delete fromMaster.updated_at;
        delete fromMaster.deleted_at;
        // ensure these are set from context / excel (override after spread):
        delete fromMaster.company_id;
        delete fromMaster.location_id;
        delete fromMaster.stock;
        delete fromMaster.remaining_stock;
        delete fromMaster.distributed_stock;
        delete fromMaster.itemcost;
        delete fromMaster.itemlanprice;
        delete fromMaster.itemprice;

        // Build row for item_location_master
        const newRecordData = {
          ...fromMaster, // copy “whole” item_master record (matching columns will persist)
          item_id: itemUUID, // FK to item_master.uuid
          itemupc: itemUPC, // ✅ VERY IMPORTANT
          company_id,
          location_id,
          stock: stockValue,
          remaining_stock: stockValue, // start remaining == stock
          opening_stock: stockValue, // start remaining == stock
          distributed_stock: 0,
          itemcost: costValue,
          itemlanprice: landedValue,
          itemprice: priceValue,
        };

        // await ItemLoc.create(newRecordData, { transaction: t });
        const newItemLoc = await ItemLoc.create(newRecordData, {
          transaction: t,
        });

        createdCount++;
        touchedItemUUIDs.add(itemUUID);
        // update batches

        // ✅ INSERT THIS CODE BELOW
        const now = new Date();
        const batchNo = `OPEN${now.getFullYear().toString().slice(-2)}${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
          now.getHours(),
        ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
          now.getSeconds(),
        ).padStart(2, "0")}${newItemLoc.id}`;

        const perItemLandedCost =
          landedValue && landedValue > 0 ? landedValue : priceValue;

        await Batches.create(
          {
            // item_id: itemUUID,
            item_id: newItemLoc.id, // store item_location_master.id instead of item_master.uuid
            batch_number: batchNo,
            grn_number: transactionNo, // or OPENINGSTOCK number
            batch_mcu: null,
            manufacturing_date: null,
            expiry_date: null,
            qty: stockValue,
            current_in_stock: stockValue,
            itemcost: costValue,
            itemlanprice: perItemLandedCost,
            location: location_id,
            company: company_id,
            status: 1,
          },
          { transaction: t },
        );

        // Insert into stock_movement table
        // Fetch UOM details
        let uomData = null;
        if (newItemLoc.itmuom) {
          uomData = await itemUomModel.findOne({
            where: { id: newItemLoc.itmuom },
            transaction: t,
          });
        }

        // Insert into stock_movement table
        await StockMovement.create(
          {
            // ⚠️ if you really want UPC here, swap itemUUID with itemUPC
            item_id: newItemLoc.id, // ✅ now it’s the actual row’s id
            // item_id: itemUPC || itemUUID,

            qty: stockValue,
            transaction_type: "Opening Stock",
            transaction_no: transactionNo,
            type: "IN",
            from_location: null,
            //  to_location: location_id,
            loc_id: location_id,

            comp_id: company_id,
            date: new Date(),
            stock_desc: `Opening stock upload for ${itemName}`,

            uom_id: newItemLoc.itmuom,
            uom_name: uomData ? uomData.name : null,
            itemupc: newItemLoc.itemupc,
            supplier_name: newItemLoc.suppliername,
            qty_on_hand_previous: 0,
            qty_on_hand_new: stockValue,
            loc_type: "Opening Stock",
          },
          { transaction: t },
        );

        // ✅ Insert into Item Price Master Table
        await itemMainPriceModel.create({
          item_id: newItemLoc.id,
          batch_number: batchNo,
          item_upc: newItemLoc.itemupc,
          item_uom_id: newItemLoc.itmuom || null,
          uom_type: uomData ? uomData.name : null,
          stock_keeping_unit: stockValue,
          purchase_order_price: landedValue,
          itemcost: costValue,
          itemlanprice: perItemLandedCost,
          item_price: priceValue,
          sell_enable: 1,
          return_enable: 1,
          location: location_id,
          company: company_id,
          grn_no: transactionNo,
          status: 1,
        });
      } catch (innerErr) {
        console.error(`Failed to process ${row["Item Name"]}`, innerErr);
        errorItems.push(row["Item Name"] || "(Unnamed Item)");
      }
    }

    // If any duplicates, rollback and return error (per your rule)
    if (duplicateItems.length > 0) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Item already exists.",
        duplicateItems,
      });
    }

    // If any not found in item_master, rollback (your current behavior)
    if (errorItems.length > 0) {
      await t.rollback();
      return res.status(400).json({
        status: false,
        message: "Some items do not exist in item_master.",
        missingItems: errorItems,
      });
    }

    // Recalculate totals per item UUID for this company and write to:
    // 1) item_master.stock (sum of all locations for the company)
    // 2) company_level_stock (upsert)
    for (const itemUUID of touchedItemUUIDs) {
      const totalStock = await ItemLoc.sum("stock", {
        where: { company_id, item_id: itemUUID },
        transaction: t,
      });

      // Update item_master for this item
      await ItemMaster.update(
        { stock: totalStock },
        { where: { uuid: itemUUID }, transaction: t },
      );

      // Upsert into company_level_stock
      // Prefer a UNIQUE composite index on (company_id, item_id) to make upsert deterministic.
      // If you don't have it, the code below falls back to findOne+create/update.
      const existingCLS = await CompanyStock.findOne({
        where: { company_id, item_id: itemUUID },
        transaction: t,
      });

      if (existingCLS) {
        await existingCLS.update(
          { total_stock: totalStock, calculated_at: new Date() },
          { transaction: t },
        );
      } else {
        await CompanyStock.create(
          {
            company_id,
            item_id: itemUUID,
            total_stock: totalStock,
            calculated_at: new Date(),
          },
          { transaction: t },
        );
      }
    }

    await t.commit();
    return res.json({
      status: true,
      message:
        "Stock & Price update completed, item data copied, company totals updated.",
      created: createdCount,
      updated: updatedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error("Error updating stock & price:", error);
    await t.rollback();
    return res.status(500).json({
      status: false,
      message: "Internal server error while updating stock & price.",
    });
  }
};

// ======================
// Get Item Location List
// ======================

// getItemLocationList
//this code is related to the pr_applied old name is getItemByPrCompLoc
const getItemLocationList = async (req, res) => {
  try {
    const { company_id, location_id, search, limit = 20, page = 1 } = req.query;
    // const { company_id, location_id, search, limit = 20, page = 1 } = req.query;

    const filters = {};
    if (company_id) filters.company_id = company_id;
    if (location_id) filters.location_id = location_id;

    const searchFilter = search
      ? { item_name: { [Op.like]: `%${search}%` } }
      : {};

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows, count } = await ItemLoc.findAndCountAll({
      where: { ...filters, ...searchFilter },
      // limit: parseInt(limit),
      // offset,
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          attributes: ["id", "taxname", "taxcal", "taxpor1"],
        },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: [
            "batch_number",
            "itemcost",
            "item_price",
            "itemlanprice",
            "item_id",
            "item_upc",
          ],
        },
        {
          model: Batches,
          as: "item_batch",
          attributes: [
            "batch_number",
            "qty",
            "current_in_stock",
            "expiry_date",
            "company",
            "location",
            "created_at",
          ],
        },
        {
          model: itemUomModel, // ✅ include UOM table
          as: "item_uom",
          attributes: ["id", "uomcode", "uomname", "symbol"],
        },
        {
          model: item_master_image,
          as: "images", // <-- correct alias matching association
          // ...
        },
        {
          model: brandModel, // ✅ include UOM table
          as: "brand",
          attributes: ["id", "brandcode", "brandname"],
        },
        {
          model: itemColorModel, // add this
          as: "item_color", // alias defined in association
          attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"], // select the fields you need
        },
        {
          model: itemSizeModel, // add this
          as: "size_master", // alias defined in association
          attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          include: [
            {
              model: priceListMaster,
              as: "priceList",
            },
          ],
        },
      ],
    });

    // Nest batch with its price data
    const dataWithBatches = rows.map((item) => {
      const itemJson = item.toJSON();
      const brandmaster = itemJson.brandmaster;

      itemJson.batches = itemJson.item_batch.map((batch) => {
        const priceData = itemJson.item_main_prices.find(
          (price) => price.batch_number === batch.batch_number,
        );

        return {
          ...batch,
          price_data: priceData
            ? {
                itemcost: priceData.itemcost,
                itemprice: priceData.item_price,
                itemlanprice: priceData.itemlanprice,
              }
            : null,
        };
      });

      // Remove redundant top-level item_main_prices and item_batch
      delete itemJson.item_main_prices;
      delete itemJson.item_batch;
      // Re-attach brandmaster before returning
      itemJson.brandmaster = brandmaster;
      return itemJson;
    });

    // / Fetch ALL PR APPLY SETTINGS
    const prSettings = await PrApplySettings.findAll({
      attributes: ["pr_code", "sub_company_id", "location_id"],
    });
    // Attach barcode + PR APPLY STATUS
    const dataWithBarcode = await Promise.all(
      dataWithBatches.map(async (item) => {
        const barcodeValue = item.itemupc || item.item_code;
        item.barcode = await generateBarcode(barcodeValue);

        // Check if this item's company & location match PR apply table
        const prMatch = prSettings.find(
          (pr) =>
            pr.sub_company_id == item.company_id &&
            pr.location_id == item.location_id,
        );

        item.pr_applied = prMatch
          ? {
              pr_code: prMatch.pr_code,
              company_id: prMatch.sub_company_id,
              location_id: prMatch.location_id,
            }
          : null;

        return item;
      }),
    );

    // return res.json({
    //   status: true,
    //   message: "Item Location list fetched successfully.",
    //   total: count,
    //   // page: parseInt(page),
    //   // limit: parseInt(limit),
    //   data: dataWithBarcode,
    // });

    return res.status(200).json({
      error: {
        code: "",
        message: "",
        additional_info: "",
      },
      status: true,
      message: "Item Location list fetched successfully.",
      data: dataWithBarcode,
    });
  } catch (error) {
    console.error("Error fetching item location list:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item location list.",
    });
  }
};

// filter on the baiss of the remaninng stock>0,price>0 and image

const getFilteredItemList = async (req, res) => {
  try {
    const {
      company_id,
      location_id,
      search,
      department, // <-- new
      limit = 20,
      page = 1,
    } = req.query;

    // Base filters: price > 0, stock > 0, image exists
    const filters = {
      itemprice: { [Op.gt]: 0 },
      remaining_stock: { [Op.gt]: 0 },
      item_image: { [Op.ne]: null },
    };

    if (company_id) filters.company_id = company_id;
    if (location_id) filters.location_id = location_id;

    // if (search) {
    //   filters.item_name = { [Op.like]: `%${search}%` };
    // }

    if (search) {
      filters[Op.or] = [
        { item_name: { [Op.like]: `%${search}%` } },
        { itemupc: { [Op.like]: `%${search}%` } },
      ];
    }
    if (department) {
      filters.departname = department;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows, count } = await ItemLoc.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset,
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          attributes: ["id", "taxname", "taxcal", "taxpor1"],
        },
        {
          model: itemUomModel,
          as: "item_uom",
          attributes: ["id", "uomcode", "uomname", "symbol"],
        },
        {
          model: brandModel,
          as: "brand",
          attributes: ["id", "brandcode", "brandname"],
        },
        {
          model: itemColorModel,
          as: "item_color",
          attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"],
        },
        {
          model: itemSizeModel,
          as: "size_master",
          attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          include: [
            {
              model: priceListMaster,
              as: "priceList",
            },
          ],
        },
      ],
    });

    // Since you don't have separate batches or prices tables, no need to map batches/prices here

    // Fetch ALL PR APPLY SETTINGS
    const prSettings = await PrApplySettings.findAll({
      attributes: ["pr_code", "sub_company_id", "location_id"],
    });

    // Attach barcode + PR APPLY STATUS
    const dataWithBarcode = await Promise.all(
      rows.map(async (item) => {
        const itemJson = item.toJSON();

        const barcodeValue =
          itemJson.itemupc || itemJson.item_code || itemJson.item_barcode;
        itemJson.barcode = await generateBarcode(barcodeValue);

        // Check if this item's company & location match PR apply table
        const prMatch = prSettings.find(
          (pr) =>
            pr.sub_company_id == itemJson.company_id &&
            pr.location_id == itemJson.location_id,
        );

        itemJson.pr_applied = prMatch
          ? {
              pr_code: prMatch.pr_code,
              company_id: prMatch.sub_company_id,
              location_id: prMatch.location_id,
            }
          : null;

        return itemJson;
      }),
    );

    return res.status(200).json({
      error: { code: "", message: "", additional_info: "" },
      status: true,
      message: "Item Location list fetched successfully.",
      data: dataWithBarcode,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching item location list:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item location list.",
    });
  }
};
// details of the one items of the remaninng stock>0,price>0 and image

const getItemDetailsById = async (req, res) => {
  try {
    const { item_id } = req.params;

    if (!item_id) {
      return res.status(400).json({
        status: false,
        message: "item_id is required",
      });
    }

    // Base filters
    const filters = {
      id: item_id,
      itemprice: { [Op.gt]: 0 },
      remaining_stock: { [Op.gt]: 0 },
      item_image: { [Op.ne]: null },
    };

    const item = await ItemLoc.findOne({
      where: filters,
      include: [
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          attributes: ["id", "taxname", "taxcal", "taxpor1"],
        },
        {
          model: itemUomModel,
          as: "item_uom",
          attributes: ["id", "uomcode", "uomname", "symbol"],
        },
        {
          model: brandModel,
          as: "brand",
          attributes: ["id", "brandcode", "brandname"],
        },
        {
          model: itemColorModel,
          as: "item_color",
          attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"],
        },
        {
          model: itemSizeModel,
          as: "size_master",
          attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          include: [
            {
              model: priceListMaster,
              as: "priceList",
            },
          ],
        },
      ],
    });

    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Item not found",
      });
    }

    const itemJson = item.toJSON();

    // Generate barcode
    const barcodeValue =
      itemJson.itemupc || itemJson.item_code || itemJson.item_barcode;
    itemJson.barcode = await generateBarcode(barcodeValue);

    // Fetch PR APPLY SETTINGS
    const prSettings = await PrApplySettings.findAll({
      attributes: ["pr_code", "sub_company_id", "location_id"],
    });

    const prMatch = prSettings.find(
      (pr) =>
        pr.sub_company_id == itemJson.company_id &&
        pr.location_id == itemJson.location_id,
    );

    itemJson.pr_applied = prMatch
      ? {
          pr_code: prMatch.pr_code,
          company_id: prMatch.sub_company_id,
          location_id: prMatch.location_id,
        }
      : null;

    return res.status(200).json({
      error: { code: "", message: "", additional_info: "" },
      status: true,
      message: "Item details fetched successfully.",
      data: itemJson,
    });
  } catch (error) {
    console.error("Error fetching item details:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item details.",
    });
  }
};

const getItemByPagination = async (req, res) => {
  try {
    const { company_id, location_id, search, limit = 20, page = 1 } = req.query;
    // const { company_id, location_id, search, limit = 20, page = 1 } = req.query;

    const filters = {};
    if (company_id) filters.company_id = company_id;
    if (location_id) filters.location_id = location_id;

    // const searchFilter = search
    //   ? { item_name: { [Op.like]: `%${search}%` } }
    //   : {};

    const searchFilter = search
      ? {
          [Op.or]: [
            { item_name: { [Op.like]: `%${search}%` } },
            { item_code: { [Op.like]: `%${search}%` } },
            { itemupc: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // const pageNumber = parseInt(page);
    let pageNumber = parseInt(page);

    const pageSize = parseInt(limit);

    if (search) {
      pageNumber = 1; // 🔥 reset page on search
    }
    // const offset = (parseInt(page) - 1) * parseInt(limit);
    const offset = (pageNumber - 1) * pageSize;

    const { rows, count } = await ItemLoc.findAndCountAll({
      where: { ...filters, ...searchFilter },
      // limit: parseInt(limit),
      // offset,
      limit: pageSize, // ✅ ENABLE
      offset,
      distinct: true, // ✅ FIX COUNT
      // subQuery: false, // ✅ FIX LIMIT WITH INCLUDE
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          attributes: ["id", "taxname", "taxcal", "taxpor1"],
          required: false,
        },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: [
            "batch_number",
            "itemcost",
            "item_price",
            "itemlanprice",
            "item_id",
            "item_upc",
          ],
          required: false,
        },
        {
          model: Batches,
          as: "item_batch",
          attributes: [
            "batch_number",
            "qty",
            "current_in_stock",
            "expiry_date",
            "company",
            "location",
            "created_at",
          ],
          required: false,
        },
        {
          model: itemUomModel, // ✅ include UOM table
          as: "item_uom",
          attributes: ["id", "uomcode", "uomname", "symbol"],
          required: false,
        },

        {
          model: item_master_image,
          as: "images", // <-- correct alias matching association
          // ...
        },
        {
          model: brandModel, // ✅ include UOM table
          as: "brand",
          attributes: ["id", "brandcode", "brandname"],
        },
        {
          model: itemColorModel, // add this
          as: "item_color", // alias defined in association
          attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"], // select the fields you need
        },

        {
          model: itemSizeModel, // add this
          as: "size_master", // alias defined in association
          attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
          required: false,
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          required: false,
          include: [
            {
              model: priceListMaster,
              as: "priceList",
              required: false,
            },
          ],
        },
      ],
    });

    // Nest batch with its price data
    const dataWithBatches = rows.map((item) => {
      const itemJson = item.toJSON();

      itemJson.batches = itemJson.item_batch.map((batch) => {
        const priceData = itemJson.item_main_prices.find(
          (price) => price.batch_number === batch.batch_number,
        );

        return {
          ...batch,
          price_data: priceData
            ? {
                itemcost: priceData.itemcost,
                itemprice: priceData.item_price,
                itemlanprice: priceData.itemlanprice,
              }
            : null,
        };
      });

      // Remove redundant top-level item_main_prices and item_batch
      delete itemJson.item_main_prices;
      delete itemJson.item_batch;

      return itemJson;
    });

    // / Fetch ALL PR APPLY SETTINGS
    // const prSettings = await PrApplySettings.findAll({
    //   attributes: ["pr_code", "sub_company_id", "location_id"],
    // });
    const prSettings = await PrApplySettings.findAll({
      attributes: ["pr_code", "sub_company_id", "location_id"],
      raw: true,
    });

    const prMap = new Map(
      prSettings.map((pr) => [`${pr.sub_company_id}_${pr.location_id}`, pr]),
    );

    // Attach barcode + PR APPLY STATUS
    const dataWithBarcode = await Promise.all(
      dataWithBatches.map(async (item) => {
        const barcodeValue = item.itemupc || item.item_code;
        item.barcode = await generateBarcode(barcodeValue);
        const key = `${item.company_id}_${item.location_id}`;
        const prMatch = prMap.get(key);

        item.pr_applied = prMatch
          ? {
              pr_code: prMatch.pr_code,
              company_id: prMatch.sub_company_id,
              location_id: prMatch.location_id,
            }
          : null;

        return item;
      }),
    );

    return res.status(200).json({
      error: {
        code: "",
        message: "",
        additional_info: "",
      },
      status: true,
      message: "Item Location list fetched successfully.",
      data: dataWithBarcode,
      pagination: {
        totalRecords: count,
        currentPage: pageNumber,
        totalPages: Math.ceil(count / pageSize),
        limit: pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching item location list:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item location list.",
    });
  }
};

const getItemByPagination5 = async (req, res) => {
  try {
    const {
      company_id,
      location_id,
      search,
      limit = 20,
      page = 1,
      brandname,
      sizename,
      colorname,
      departname,
      familyname,
      subfamliy,
    } = req.query;
    // const { company_id, location_id, search, limit = 20, page = 1 } = req.query;

    const parseArray = (value) => {
      if (!value) return null;
      if (Array.isArray(value)) return value;
      return value.split(",").map((v) => v.trim());
    };

    const filters = {};
    if (company_id) filters.company_id = company_id;
    if (location_id) filters.location_id = location_id;

    // const searchFilter = search
    //   ? { item_name: { [Op.like]: `%${search}%` } }
    //   : {};

    const searchFilter = search
      ? {
          [Op.or]: [
            { item_name: { [Op.like]: `%${search}%` } },
            { item_code: { [Op.like]: `%${search}%` } },
            { itemupc: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const advancedFilters = {};

    // 🔹 Single-value filters
    if (departname) advancedFilters.departname = departname;
    if (familyname) advancedFilters.familyname = familyname;
    if (subfamliy) advancedFilters.subfamliy = subfamliy;

    // 🔹 Multi-value filters (checkbox)
    const brandArr = parseArray(brandname);
    if (brandArr?.length) {
      advancedFilters.brandname = { [Op.in]: brandArr };
    }

    const sizeArr = parseArray(sizename);
    if (sizeArr?.length) {
      advancedFilters.sizename = { [Op.in]: sizeArr };
    }

    const colorArr = parseArray(colorname);
    if (colorArr?.length) {
      advancedFilters.colorname = { [Op.in]: colorArr };
    }

    // const pageNumber = parseInt(page);
    let pageNumber = parseInt(page);

    const pageSize = parseInt(limit);

    if (
      search ||
      brandname ||
      sizename ||
      colorname ||
      departname ||
      familyname ||
      subfamliy
    ) {
      pageNumber = 1;
    }

    // const offset = (parseInt(page) - 1) * parseInt(limit);
    const offset = (pageNumber - 1) * pageSize;

    const { rows, count } = await ItemLoc.findAndCountAll({
      // where: { ...filters, ...searchFilter },
      where: {
        ...filters,
        ...searchFilter,
        ...advancedFilters,
      },

      // limit: parseInt(limit),
      // offset,
      limit: pageSize, // ✅ ENABLE
      offset,
      distinct: true, // ✅ FIX COUNT
      // subQuery: false, // ✅ FIX LIMIT WITH INCLUDE
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          attributes: ["id", "taxname", "taxcal", "taxpor1"],
          required: false,
        },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: [
            "batch_number",
            "itemcost",
            "item_price",
            "itemlanprice",
            "item_id",
            "item_upc",
          ],
          required: false,
        },
        {
          model: Batches,
          as: "item_batch",
          attributes: [
            "batch_number",
            "qty",
            "current_in_stock",
            "expiry_date",
            "company",
            "location",
            "created_at",
          ],
          required: false,
        },
        {
          model: itemUomModel, // ✅ include UOM table
          as: "item_uom",
          attributes: ["id", "uomcode", "uomname", "symbol"],
          required: false,
        },

        {
          model: item_master_image,
          as: "images", // <-- correct alias matching association
          // ...
        },
        {
          model: brandModel, // ✅ include UOM table
          as: "brand",
          attributes: ["id", "brandcode", "brandname"],
        },
        {
          model: itemColorModel, // add this
          as: "item_color", // alias defined in association
          attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"], // select the fields you need
        },

        {
          model: itemSizeModel, // add this
          as: "size_master", // alias defined in association
          attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
          required: false,
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          required: false,
          include: [
            {
              model: priceListMaster,
              as: "priceList",
              required: false,
            },
          ],
        },
      ],
    });

    // Nest batch with its price data
    const dataWithBatches = rows.map((item) => {
      const itemJson = item.toJSON();

      itemJson.batches = itemJson.item_batch.map((batch) => {
        const priceData = itemJson.item_main_prices.find(
          (price) => price.batch_number === batch.batch_number,
        );

        return {
          ...batch,
          price_data: priceData
            ? {
                itemcost: priceData.itemcost,
                itemprice: priceData.item_price,
                itemlanprice: priceData.itemlanprice,
              }
            : null,
        };
      });

      // Remove redundant top-level item_main_prices and item_batch
      delete itemJson.item_main_prices;
      delete itemJson.item_batch;

      return itemJson;
    });

    // / Fetch ALL PR APPLY SETTINGS
    // const prSettings = await PrApplySettings.findAll({
    //   attributes: ["pr_code", "sub_company_id", "location_id"],
    // });
    const prSettings = await PrApplySettings.findAll({
      attributes: ["pr_code", "sub_company_id", "location_id"],
      raw: true,
    });

    const prMap = new Map(
      prSettings.map((pr) => [`${pr.sub_company_id}_${pr.location_id}`, pr]),
    );
    // Attach barcode + PR APPLY STATUS
    const dataWithBarcode = await Promise.all(
      dataWithBatches.map(async (item) => {
        const barcodeValue = item.itemupc || item.item_code;
        item.barcode = await generateBarcode(barcodeValue);

        // Check if this item's company & location match PR apply table
        // const prMatch = prSettings.find(
        //   (pr) =>
        //     pr.sub_company_id == item.company_id &&
        //     pr.location_id == item.location_id
        // );
        const key = `${item.company_id}_${item.location_id}`;
        const prMatch = prMap.get(key);

        item.pr_applied = prMatch
          ? {
              pr_code: prMatch.pr_code,
              company_id: prMatch.sub_company_id,
              location_id: prMatch.location_id,
            }
          : null;

        return item;
      }),
    );

    return res.status(200).json({
      error: {
        code: "",
        message: "",
        additional_info: "",
      },
      status: true,
      message: "Item Location list fetched successfully.",
      data: dataWithBarcode,
      pagination: {
        totalRecords: count,
        currentPage: pageNumber,
        totalPages: Math.ceil(count / pageSize),
        limit: pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching item location list:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item location list.",
    });
  }
};

const getItemByVisibility = async (req, res) => {
  try {
    const { company_id, location_id, search, limit = 20, page = 1 } = req.query;

    // Fetch rules first
    const rules = await getVisibilityRules({
      organisation_id: 1,
      company_id,
      location_id,
    });
    const ruleMap = buildRuleMap(rules);

    // Build filters
    const filters = {};
    if (company_id) filters.company_id = company_id;
    if (location_id) filters.location_id = location_id;
    if (search) filters.item_name = { [Op.like]: `%${search}%` };

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const offset = (pageNumber - 1) * pageSize;

    // Build include with conditional where clauses based on rules
    const includes = [
      {
        model: TaxMasterModel,
        as: "tax_master_1",
        attributes: ["id", "taxname", "taxcal", "taxpor1"],
        required: false,
      },
      {
        model: itemMainPriceModel,
        as: "item_main_prices",
        attributes: [
          "batch_number",
          "itemcost",
          "item_price",
          "itemlanprice",
          "item_id",
          "item_upc",
        ],
        required: !ruleMap[`${company_id}_${location_id}_item_price`], // required if null not allowed
        where: !ruleMap[`${company_id}_${location_id}_item_price`]
          ? { item_price: { [Op.gt]: 0 } }
          : undefined,
      },
      {
        model: Batches,
        as: "item_batch",
        attributes: [
          "batch_number",
          "qty",
          "current_in_stock",
          "expiry_date",
          "company",
          "location",
          "created_at",
        ],
        required: !ruleMap[`${company_id}_${location_id}_current_in_stock`], // required if null not allowed
        where: !ruleMap[`${company_id}_${location_id}_current_in_stock`]
          ? { current_in_stock: { [Op.gte]: 1 } }
          : undefined,
      },
      {
        model: item_master_image,
        as: "images",
        required: !ruleMap[`${company_id}_${location_id}_images`], // required if null not allowed
      },
      {
        model: itemUomModel,
        as: "item_uom",
        attributes: ["id", "uomcode", "uomname", "symbol"],
        required: false,
      },
      {
        model: brandModel,
        as: "brand",
        attributes: ["id", "brandcode", "brandname"],
        required: false,
      },
      {
        model: itemColorModel,
        as: "item_color",
        attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"],
        required: false,
      },
      {
        model: itemSizeModel,
        as: "size_master",
        attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
        required: false,
      },
      {
        model: priceListItemDetails,
        as: "price_list_items",
        required: false,
        include: [
          {
            model: priceListMaster,
            as: "priceList",
            required: false,
          },
        ],
      },
    ];

    // Now fetch data with correct filters
    const { rows, count } = await ItemLoc.findAndCountAll({
      where: filters,
      include: includes,
      limit: pageSize,
      offset,
      distinct: true,
      order: [["updated_at", "DESC"]],
    });

    // Map batches + price data as before
    const dataWithBatches = rows.map((item) => {
      const itemJson = item.toJSON();

      itemJson.batches = itemJson.item_batch.map((batch) => {
        const priceData = itemJson.item_main_prices.find(
          (price) => price.batch_number === batch.batch_number,
        );

        return {
          ...batch,
          price_data: priceData
            ? {
                itemcost: priceData.itemcost,
                itemprice: priceData.item_price,
                itemlanprice: priceData.itemlanprice,
              }
            : null,
        };
      });

      delete itemJson.item_main_prices;
      delete itemJson.item_batch;

      return itemJson;
    });

    return res.status(200).json({
      status: true,
      message: "Item Location list fetched successfully.",
      data: dataWithBatches,
      pagination: {
        totalRecords: count,
        currentPage: pageNumber,
        totalPages: Math.ceil(count / pageSize),
        limit: pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching item location list:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item location list.",
    });
  }
};

// getItemLocationList
// below code is my original getItemLocationList
const getItemByCompLoc = async (req, res) => {
  try {
    const { company_id, location_id, search, limit = 20, page = 1 } = req.query;

    // -------------------------
    // Ecommerce Filter Settings
    // -------------------------
    const filterSettings = await FilterSetting.findAll();

    let allowedCompanyIds = [];
    let allowedSubCompanyIds = [];
    let allowedLocationIds = [];

    if (filterSettings.length > 0) {
      allowedCompanyIds = filterSettings.map((s) => s.main_company_id);
      allowedSubCompanyIds = filterSettings
        .map((s) => s.sub_company_id)
        .filter(Boolean);
      allowedLocationIds = filterSettings
        .map((s) => s.location_id)
        .filter(Boolean);
    }

    const filters = {};

    if (company_id) filters.company_id = company_id;
    if (location_id) filters.location_id = location_id;

    // 🟢 Apply ecommerce filter settings
    filters.company_id = { [Op.in]: allowedCompanyIds };

    if (allowedSubCompanyIds.length > 0) {
      filters.company_id = { [Op.in]: allowedSubCompanyIds };
    }

    if (allowedLocationIds.length > 0) {
      filters.location_id = { [Op.in]: allowedLocationIds };
    }

    // const filters = {};
    // if (company_id) filters.company_id = company_id;
    // if (location_id) filters.location_id = location_id;

    const searchFilter = search
      ? { item_name: { [Op.like]: `%${search}%` } }
      : {};

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows, count } = await ItemLoc.findAndCountAll({
      where: { ...filters, ...searchFilter },
      // limit: parseInt(limit),
      // offset,
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          attributes: ["id", "taxname", "taxcal", "taxpor1"],
        },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: [
            "batch_number",
            "itemcost",
            "item_price",
            "itemlanprice",
            "item_id",
            "item_upc",
          ],
        },
        {
          model: Batches,
          as: "item_batch",
          attributes: [
            "batch_number",
            "qty",
            "current_in_stock",
            "expiry_date",
            "company",
            "location",
            "created_at",
          ],
        },
        {
          model: itemUomModel, // ✅ include UOM table
          as: "item_uom",
          attributes: ["id", "uomcode", "uomname", "symbol"],
        },
        {
          model: item_master_image,
          as: "images", // <-- correct alias matching association
          // ...
        },

        {
          model: itemColorModel, // add this
          as: "item_color", // alias defined in association
          attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"], // select the fields you need
        },
        {
          model: itemSizeModel, // add this
          as: "size_master", // alias defined in association
          attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
        },
        {
          model: brandModel, // ✅ include UOM table
          as: "brand",
          attributes: ["id", "brandcode", "brandname"],
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          include: [
            {
              model: priceListMaster,
              as: "priceList",
            },
          ],
        },
      ],
    });

    // Nest batch with its price data
    const dataWithBatches = rows.map((item) => {
      const itemJson = item.toJSON();

      itemJson.batches = itemJson.item_batch.map((batch) => {
        const priceData = itemJson.item_main_prices.find(
          (price) => price.batch_number === batch.batch_number,
        );

        return {
          ...batch,
          price_data: priceData
            ? {
                itemcost: priceData.itemcost,
                itemprice: priceData.item_price,
                itemlanprice: priceData.itemlanprice,
              }
            : null,
        };
      });

      // Remove redundant top-level item_main_prices and item_batch
      delete itemJson.item_main_prices;
      delete itemJson.item_batch;

      return itemJson;
    });

    // Attach barcode
    const dataWithBarcode = await Promise.all(
      dataWithBatches.map(async (item) => {
        const barcodeValue = item.itemupc || item.item_code;
        item.barcode = await generateBarcode(barcodeValue);
        return item;
      }),
    );

    return res.json({
      status: true,
      message: "Item Location list fetched successfully.",
      total: count,
      // page: parseInt(page),
      // limit: parseInt(limit),
      data: dataWithBarcode,
    });
  } catch (error) {
    console.error("Error fetching item location list:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item location list.",
    });
  }
};

const details = async (req, res, next) => {
  const { uuid, itemupc } = req.body;
  try {
    const festivalRes = await ItemLoc.findOne({
      include: [
        // {
        //   model: item_master_image,
        //   as: "item_master_image",
        // },
        {
          model: itemMajorCategoryModel,
          as: "itemcategory",
          attributes: ["itemcatname"],
        },
        {
          model: itemColorModel,
          as: "item_color",
          //attributes: ['name'],
        },
        {
          model: itemSizeModel,
          as: "size_master",
          //attributes: ['name'],
        },
        {
          model: itemDepartmentModel,
          as: "item_department",
          //attributes: ['name'],
        },
        {
          model: familyModel,
          as: "family_master",
          //attributes: ['name'],
        },
        {
          model: item_master_image,
          as: "images", // <-- correct alias matching association
          // ...
        },
        {
          model: subFamilyModel,
          as: "sub_family_master",
          //attributes: ['name'],
        },
        {
          model: brandModel,
          as: "brand",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_2",
          //attributes: ['name'],
        },
        {
          model: TaxMasterModel,
          as: "tax_master_3",
          //attributes: ['name'],
        },
        {
          model: CustomerInfo,
          as: "customer_info",
          // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile', 'country_id'],
          include: [
            {
              model: UserModel,
              as: "users",
              // attributes: ['customer_code', 'user_id', 'customer_address_1', 'customer_address_2'], // Example //attributes
            },
          ],
        },

        {
          model: vendor_master,
          as: "vendor",
          //attributes: ['name'],
        },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: ["id", "item_id", "item_uom_id", "item_price"],
          include: [
            {
              model: itemUomModel,
              as: "item_uom",
              attributes: ["id", "code", "name"],
            },
          ],
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          include: [
            {
              model: priceListMaster,
              as: "priceList",
            },
          ],
        },
      ],
      // where: {
      //   // id: id,
      //   uuid,
      // },
      where: {
        [Op.or]: [uuid ? { uuid } : null, itemupc ? { itemupc } : null].filter(
          Boolean,
        ),
      },
    });

    if (!festivalRes) {
      res
        .status(404)
        .json(
          ResponseFormatter.setResponse(false, 404, "Not found!", "Error", ""),
        );
    } else {
      // Handle barcode image URL as before
      if (festivalRes.item_barcode_img && festivalRes.item_barcode_img !== "") {
        let new_url =
          base_url +
          path.posix.join("uploads/items", festivalRes.item_barcode_img);
        festivalRes.item_barcode_img = new_url;
      } else {
        festivalRes.item_barcode_img = "";
      }

      // Keep item_image as filename only
      if (festivalRes.item_image && festivalRes.item_image !== "") {
        festivalRes.item_image = festivalRes.item_image; // filename only
      } else {
        festivalRes.item_image = "";
      }

      res
        .status(200)
        .json(
          ResponseFormatter.setResponse(
            true,
            200,
            "Successfully show record",
            "",
            festivalRes,
          ),
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
          error.message,
        ),
      );
  }
};

const detailsItemLocation = async (req, res) => {
  const { uuid } = req.body;

  try {
    const itemLocation = await ItemLoc.findOne({
      where: { uuid },
    });

    if (!itemLocation) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Item Location not found",
        error: "Not Found",
      });
    }

    const itemJson = itemLocation.toJSON();
    const barcodeValue = itemJson.itemupc || itemJson.item_code;
    itemJson.barcode = await generateBarcode(barcodeValue);

    return res.status(200).json({
      status: true, // 👈 instead of 1
      code: 200,
      message: "Successfully fetched item location details",
      data: itemJson, // ✅ return the object with barcode
    });
  } catch (error) {
    console.error("Error in detailsItemLocation:", error);
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const update = async (req, res, next) => {
  const {
    id,
    price,
    code,
    name,
    uom,
    tax,
    stock,
    partNumber,
    barcode,
    rate,
    itemcatname,
    itemdesc,
    itemdesclong,
    itemdesc3,
    itemdesc4,
    itemupc,
    itemref,
    stylecode,
    colorname,
    sizename,
    departname,
    familyname,
    subfamliy,
    brandname,
    hsncode,
    itemcost,
    itemprice,
    itemlanprice,
    minstklvl,
    maxstklvl,
    itmstkmgmt,
    itmuom,
    itmwweight,
    itmwpurunit,
    itmwsalesunit,
    itmtax1code,
    itmtax2code,
    itmtax3code,
    itmcostingmet,
    suppliername,
    note1,
    note2,
    note3,
    itmdt1,
    itmdt2,
    itmexpiry,
    addedby,
    company_id,
    location_id,
    status,
    // item_major_category_id,
    // item_group_id,
    // brand_id,
    // is_product_catalog,
    // is_promotional,
    // item_code,
    // erp_code,
    // item_name,
    item_description,
    // item_barcode,
    // item_weight,
    // item_shelf_life,
    // volume,
    // lower_unit_uom_id,
    // is_tax_apply,
    // lower_unit_item_upc,
    // lower_unit_item_price,
    // lower_unit_purchase_order_price,
    // item_vat_percentage,
    // stock_keeping_unit,
    // unit_item_max_price,
    // item_excise,
    // new_lunch,
    // is_variant,
    // start_date,
    // end_date,
    // supervisor_category_id,
    // current_stage,
    // current_stage_comment,
    // status,
    // lob_id,
    // is_coupon,
    // is_promo_allocation,
    // coupon_id,
    // item_main_price
  } = req.body;
  try {
    const detail = await ItemLoc.findOne({
      where: {
        uuid: id,
      },
    });

    if (!detail) {
      return res
        .status(404)
        .json(ResponseFormatter.setResponse(false, 404, "not found", "Error"));
    }

    let imageFileName = detail.item_image; // default to old image

    if (req.file) {
      imageFileName = req.file.filename;
    }

    // check duplicate combination
    const duplicateCheck = await ItemLoc.count({
      where: {
        itemdesc: itemdesc,
        colorname: colorname,
        sizename: sizename,
        company_id: company_id,
        location_id: location_id,
        // ignore current record while updating
        id: { [Op.ne]: detail.id },
      },
    });

    if (duplicateCheck > 0) {
      return res
        .status(400)
        .json(
          ResponseFormatter.setResponse(
            false,
            400,
            "Same item with this color and size already exists",
            "Error",
            "",
          ),
        );
    }

    // if (itemdesc != detail.itemdesc) {
    //   let name_check = await ItemLoc.count({ where: { itemdesc: itemdesc } });
    //   if (name_check > 0) {
    //     res
    //       .status(400)
    //       .json(
    //         ResponseFormatter.setResponse(
    //           false,
    //           400,
    //           "Name already exist",
    //           "Error",
    //           ""
    //         )
    //       );
    //     return;
    //   }
    // }

    let item = await ItemLoc.update(
      {
        item_code: code,
        // item_name: name,
        item_image: imageFileName,
        item_name: itemdesc,
        item_vat_percentage: price,
        item_tax: tax,
        stock: stock,
        // item_image: newStr,
        partNumber: partNumber,
        barcode: barcode,
        rate: rate,
        itemcatname: itemcatname,
        itemdesc: itemdesc,
        itemdesclong: itemdesclong,
        itemdesc3: itemdesc3,
        itemdesc4: itemdesc4,
        itemupc: itemupc,
        itemref: itemref,
        stylecode: stylecode,
        colorname: colorname,
        sizename: sizename,
        departname: departname,
        familyname: familyname,
        subfamliy: subfamliy,
        brandname: brandname,
        hsncode: hsncode,
        itemcost: itemcost,
        itemprice: itemprice,
        itemlanprice: itemlanprice,
        minstklvl: minstklvl,
        maxstklvl: maxstklvl,
        itmstkmgmt: itmstkmgmt,
        itmuom: itmuom,
        itmwweight: itmwweight,
        itmwpurunit: itmwpurunit,
        itmwsalesunit: itmwsalesunit,
        itmtax1code: itmtax1code,
        itmtax2code: null,
        itmtax3code: null,
        itmcostingmet: itmcostingmet,
        suppliername: suppliername,
        note1: note1,
        note2: note2,
        note3: note3,
        itmdt1: itmdt1,
        itmdt2: itmdt2,
        itmexpiry: itmexpiry,
        addedby: 1,
        // addedby: addedby,
        company_id: company_id,
        location_id: location_id,
        status: status,
        // item_major_category_id: item_major_category_id,
        // item_group_id: item_group_id,
        // brand_id: brand_id,
        // is_product_catalog: is_product_catalog ? 1 : 0,
        // is_promotional: is_promotional ? 1 : 0,
        // item_code: item_code,
        // erp_code: erp_code,
        // item_name: item_name,
        item_description: item_description,
        // item_barcode: item_barcode,
        // item_weight: item_weight,
        // item_shelf_life: item_shelf_life,
        // volume: volume,
        // lower_unit_uom_id: lower_unit_uom_id,
        // is_tax_apply: is_tax_apply,
        // lower_unit_item_upc: lower_unit_item_upc,
        // lower_unit_item_price: lower_unit_item_price,
        // lower_unit_purchase_order_price: lower_unit_purchase_order_price,
        // item_vat_percentage: item_vat_percentage,
        // stock_keeping_unit: stock_keeping_unit ? 1 : 0,
        // unit_item_max_price: unit_item_max_price ? unit_item_max_price : 0,
        // // secondary_stock_keeping_unit : secondary_stock_keeping_unit ? 1 : 0,
        // item_excise: item_excise,

        // new_lunch: new_lunch ? 1 : 0,
        // is_variant: is_variant ? 1 : 0,
        // start_date: start_date,
        // end_date: end_date,
        // supervisor_category_id: supervisor_category_id ,

        // current_stage: current_stage,
        // current_stage_comment: current_stage_comment,
        // status: status,
        // // lob_id :  (!empty(lob_id)) ? lob_id : null,
        // lob_id: lob_id,

        // is_coupon: is_coupon,
        // is_promo_allocation: is_promo_allocation,
        // coupon_id: coupon_id,
      },
      {
        where: {
          // id: id,
          uuid: id, // ✅ Match based on UUID
        },
      },
    );

    if (itmuom != "") {
      const deletedCount = await itemMainPriceModel.destroy({
        where: {
          item_id: id,
        },
      });
      let item_main_prices = await itemMainPriceModel.create({
        //save Main Price
        item_id: id,
        // item_uom_id: uom,
        item_uom_id: itmuom,
        // item_upc: item_main_price[i].item_upc,
        // item_price: item_main_price[i].item_price,
        // purchase_order_price: item_main_price[i].purchase_order_price,
        // stock_keeping_unit: item_main_price[i].stock_keeping_unit ? 1 : 0,
        // status: item_main_price[i].status,
        // item_main_max_price: item_main_price[i].item_main_max_price ? 1 : 0,
        // uom_barcode: item_main_price[i].uom_barcode,
        // uom_cost: item_main_price[i].uom_cost,
        // sell_enable: item_main_price[i].sell_enable ? item_main_price[i].sell_enable : 0,
        // return_enable: item_main_price[i].return_enable ? item_main_price[i].return_enable : 0,
        // uom_type: uom_type,
        // uom_type
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
          detail,
        ),
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
          error.message,
        ),
      );
  }
};

////////////////////////////for charity///////////////////////////////////
const getCharityItemList = async (req, res) => {
  try {
    const { location_id, search, limit = 20, page = 1 } = req.query;

    // READ COMPANY FROM URL PARAM
    const { comp_id } = req.params;

    const filters = {};

    // Always filter by company from URL param
    filters.company_id = comp_id;

    if (location_id) filters.location_id = location_id;

    const searchFilter = search
      ? { item_name: { [Op.like]: `%${search}%` } }
      : {};

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows, count } = await ItemLoc.findAndCountAll({
      where: { ...filters, ...searchFilter },
      limit: parseInt(limit),
      offset,
      order: [["updated_at", "DESC"]],
      include: [
        {
          model: TaxMasterModel,
          as: "tax_master_1",
          attributes: ["id", "taxname", "taxcal", "taxpor1"],
        },
        {
          model: itemMainPriceModel,
          as: "item_main_prices",
          attributes: [
            "batch_number",
            "itemcost",
            "item_price",
            "itemlanprice",
            "item_id",
            "item_upc",
          ],
        },
        {
          model: Batches,
          as: "item_batch",
          attributes: [
            "batch_number",
            "qty",
            "current_in_stock",
            "expiry_date",
            "company",
            "location",
            "created_at",
          ],
        },
        {
          model: itemUomModel,
          as: "item_uom",
          attributes: ["id", "uomcode", "uomname", "symbol"],
        },
        {
          model: itemColorModel,
          as: "item_color",
          attributes: ["id", "itemcolcode", "itemcolname", "itemcoldesclong"],
        },
        {
          model: itemSizeModel,
          as: "size_master",
          attributes: ["id", "itemsizecode", "itemsizename", "itemsizelong"],
        },
        {
          model: priceListItemDetails,
          as: "price_list_items",
          include: [
            {
              model: priceListMaster,
              as: "priceList",
            },
          ],
        },
      ],
    });

    const dataWithBatches = rows.map((item) => {
      const itemJson = item.toJSON();

      itemJson.batches = itemJson.item_batch.map((batch) => {
        const priceData = itemJson.item_main_prices.find(
          (price) => price.batch_number === batch.batch_number,
        );

        return {
          ...batch,
          price_data: priceData
            ? {
                itemcost: priceData.itemcost,
                itemprice: priceData.item_price,
                itemlanprice: priceData.itemlanprice,
              }
            : null,
        };
      });

      delete itemJson.item_main_prices;
      delete itemJson.item_batch;

      return itemJson;
    });

    const dataWithBarcode = await Promise.all(
      dataWithBatches.map(async (item) => {
        const barcodeValue = item.itemupc || item.item_code;
        item.barcode = await generateBarcode(barcodeValue);
        return item;
      }),
    );

    return res.json({
      status: true,
      message: "Charity Item list fetched successfully.",
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: dataWithBarcode,
    });
  } catch (error) {
    console.error("Error fetching charity item list:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while fetching item location list.",
    });
  }
};

const printBarcode1 = async (req, res, next) => {
  try {
    const {
      item_name = "Demo Item",
      price = "99.00",
      itemupc = "123456789012",
    } = req.body;

    const PRINTER_NAME =
      "SNBC TVSE LP 46 NEO BPLE Printer Drivers by Seagull Scientific";

    // 🔹 BPLE / EPL style command
    const printData = `
N
q400
Q200,24
A50,20,0,4,1,1,N,"${item_name}"
A50,70,0,3,1,1,N,"Price: ₹${price}"
B50,120,0,1,2,2,50,N,"${itemupc}"
P1
`;

    printer.printDirect({
      data: printData,
      printer: PRINTER_NAME,
      type: "RAW",
      success: function () {
        return res.json({
          success: true,
          message: "Barcode printed successfully",
        });
      },
      error: function (err) {
        console.error("🖨️ Print error:", err);
        return res.status(500).json({
          success: false,
          message: "Windows printer error",
        });
      },
    });
  } catch (error) {
    console.error("🖨️ Controller error:", error);
    next(error);
  }
};

(async () => {
  try {
    const printers = await getPrinters();
    console.log(printers);
  } catch (error) {
    console.warn("⚠️ Could not list printers at startup:", error.message);
  }
})();

// mm → PDF points
const mm = (v) => v * 2.83465;

const printBarcode3 = async (req, res) => {
  try {
    const {
      item_name,
      itemupc,
      itemprice,
      remaining_stock,
      tax_master_1,
      size_master,
    } = req.body;

    const filePath = path.join(process.cwd(), "public", "barcode", "label.pdf");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // 🔹 Generate CODE128 barcode
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: itemupc,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });

    // 🔹 2 inch x 1 inch label
    const doc = new PDFDocument({
      size: [mm(50.8), mm(25.4)],
      margin: mm(2),
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ===== PRODUCT NAME =====
    // doc.font("Helvetica-Bold").fontSize(7).text(item_name, {
    //   align: "center",
    //   lineGap: 0,
    // });

    // // ===== PRICE =====
    // doc.moveDown(0.1).font("Helvetica").fontSize(6).text(itemprice, {
    //   align: "center",
    // });

    // // ===== BARCODE =====
    // doc.moveDown(0.2);
    // doc.image(barcodeBuffer, {
    //   width: mm(46),
    //   align: "center",
    // });

    for (let i = 0; i < 2; i++) {
      if (i > 0) doc.addPage();

      // PRODUCT NAME
      doc.font("Helvetica-Bold").fontSize(7).text(item_name, {
        align: "center",
      });

      // PRICE
      doc.moveDown(0.1).font("Helvetica").fontSize(6).text(itemprice, {
        align: "center",
      });
      // BARCODE
      doc.moveDown(0.2);
      doc.image(barcodeBuffer, {
        width: mm(46),
        align: "center",
      });
    }

    doc.end();

    // ✅ wait until PDF fully written
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // ✅ silent print
    await print(filePath, {
      printer: "SNBC TVSE LP 46 NEO BPLE Printer Drivers by Seagull Scientific",
      silent: true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("PRINT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Barcode printing failed",
    });
  }
};

// mm → PDF points

const printBarcode = async (req, res) => {
  try {
    const {
      item_name,
      itemupc,
      itemprice,
      remaining_stock,
      tax_master_1,
      size_master,
    } = req.body;

    const filePath = path.join(process.cwd(), "public", "barcode", "label.pdf");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // 🔹 Generate CODE128 barcode
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: itemupc,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });

    // 🔹 2 inch x 1 inch label
    const doc = new PDFDocument({
      size: [mm(50.8), mm(25.4)],

      margin: mm(2),
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ===== PRODUCT NAME =====
    doc.font("Helvetica-Bold").fontSize(7).text(item_name, {
      align: "center",
      lineGap: 0,
    });

    // ===== PRICE =====
    doc.moveDown(0.1).font("Helvetica").fontSize(6).text(itemprice, {
      align: "center",
    });

    // ===== BARCODE =====
    doc.moveDown(0.2);
    doc.image(barcodeBuffer, {
      width: mm(46),
      align: "center",
    });

    // for (let i = 0; i < 2; i++) {
    //   if (i > 0) doc.addPage();

    //   // PRODUCT NAME
    //   doc.font("Helvetica-Bold").fontSize(7).text(item_name, {
    //     align: "center",
    //   });

    //   // PRICE
    //   doc.moveDown(0.1).font("Helvetica").fontSize(6).text(itemprice, {
    //     align: "center",
    //   });
    //   // BARCODE
    //   doc.moveDown(0.2);
    //   doc.image(barcodeBuffer, {
    //     width: mm(46),
    //     align: "center",
    //   });
    // }

    doc.end();

    // ✅ wait until PDF fully written
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // ✅ silent print
    await print(filePath, {
      printer: "SNBC TVSE LP 46 NEO BPLE",
      silent: true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("PRINT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Barcode printing failed",
    });
  }
};

module.exports = {
  updateStockFromExcel,
  getItemLocationList,
  getFilteredItemList,
  getItemDetailsById,
  getItemByPagination,
  getItemByPagination5,
  getItemByVisibility,
  getItemByCompLoc,
  detailsItemLocation,
  details,
  update,
  ///////////////////charity
  getCharityItemList,
  storeItemWithLocation,
  printBarcode,
};

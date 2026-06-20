const { item_master_image } = require("../models");
const fs = require("fs");
const path = require("path");
exports.createItemImages = async (req, res) => {
  try {
    const { item_image_id } = req.body;

    if (!item_image_id) {
      return res.status(400).json({
        status: false,
        message: "item_image_id is required",
      });
    }

    if (!req.files?.main_image) {
      return res.status(400).json({
        status: false,
        message: "Main image is required",
      });
    }

    const payload = {
      item_image_id,
      main_image: req.files.main_image[0].filename,
      left_image: req.files?.left_image?.[0]?.filename || null,
      right_image: req.files?.right_image?.[0]?.filename || null,
      front_image: req.files?.front_image?.[0]?.filename || null,
      back_image: req.files?.back_image?.[0]?.filename || null,
    };

    const created = await item_master_image.create(payload);

    return res.status(201).json({
      status: true,
      message: "Item images created successfully",
      data: created,
    });
  } catch (error) {
    console.error("Create Image Error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create images",
    });
  }
};

exports.updateItemImages = async (req, res) => {
  try {
    const { item_image_id } = req.body;

    if (!item_image_id) {
      return res.status(400).json({
        status: false,
        message: "item_image_id is required",
      });
    }

    const existing = await item_master_image.findOne({
      where: { item_image_id },
    });

    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "Image record not found",
      });
    }

    const removeImages =
      req.body.remove_images || req.body["remove_images[]"] || [];

    const payload = {};

    // new uploads
    if (req.files?.main_image)
      payload.main_image = req.files.main_image[0].filename;
    if (req.files?.left_image)
      payload.left_image = req.files.left_image[0].filename;
    if (req.files?.right_image)
      payload.right_image = req.files.right_image[0].filename;
    if (req.files?.front_image)
      payload.front_image = req.files.front_image[0].filename;
    if (req.files?.back_image)
      payload.back_image = req.files.back_image[0].filename;

    const isRemovingMain = removeImages.includes("main_image");
    const isUploadingNewMain = !!payload.main_image;

    // ❌ BLOCK: remove main image without replacement
    if (isRemovingMain && !isUploadingNewMain) {
      return res.status(400).json({
        status: false,
        message: "Main image is required",
      });
    }

    // delete optional images ONLY (never main_image)
    for (const key of removeImages) {
      if (key === "main_image") continue; // 🔑 IMPORTANT

      if (existing[key]) {
        const filePath = path.join(
          __dirname,
          "../uploads/itemsImage",
          existing[key],
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        payload[key] = null;
      }
    }

    // replace main image → delete old file
    if (payload.main_image && existing.main_image) {
      const oldPath = path.join(
        __dirname,
        "../uploads/itemsImage",
        existing.main_image,
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // 🔐 FINAL GUARANTEE (last line of defense)
    const finalMainImage = payload.main_image || existing.main_image;

    if (!finalMainImage) {
      return res.status(400).json({
        status: false,
        message: "Main image is required",
      });
    }

    await existing.update(payload);

    return res.status(200).json({
      status: true,
      message: "Item images updated successfully",
      data: existing,
    });
  } catch (error) {
    console.error("Update Image Error:", error);

    // Sequelize validation error (already handled above)
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: false,
        message: error.errors[0].message,
      });
    }

    return res.status(500).json({
      status: false,
      message: "Unexpected server error",
    });
  }
};

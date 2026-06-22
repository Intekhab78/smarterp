"use strict";

// const { VideoAdvertiesment } = require("../models");
const { VideoAdvertiesment } = require("../models");

/**
 * CREATE VIDEO ADVERTISEMENT
 */
exports.createVideoAdvertiesment = async (req, res) => {
  try {
    const {
      company_id,
      store_id,
      location_id,
      title,
      duration_seconds,
      start_date,
      end_date,
      status,
      is_loop,
      priority,
      created_by,
      remarks,
    } = req.body;

    // ✅ validations
    // if (!company_id || !store_id || !location_id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "company_id, store_id and location_id are required",
    //   });
    // }
    if (!company_id || !location_id) {
      return res.status(400).json({
        success: false,
        message: "company_id and location_id are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const videoPath = `public/adds/${req.file.filename}`;

    const videoType = req.file.mimetype.split("/")[1]; // mp4, webm

    const ad = await VideoAdvertiesment.create({
      company_id,
      store_id,
      location_id,
      title,
      video_path: videoPath, // ✅ REAL PATH
      video_type: videoType, // ✅ mp4
      duration_seconds,
      start_date,
      end_date,
      status: status || "active",
      is_loop: is_loop || 1,
      priority: priority || 1,
      created_by,
      remarks,
    });

    return res.status(201).json({
      success: true,
      message: "Video advertisement created successfully",
      data: ad,
    });
  } catch (error) {
    console.error("Create Video Advertiesment Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllAds = async (req, res) => {
  try {
    // const { store_id } = req.params;

    const ads = await VideoAdvertiesment.findAll({
      //   where: { store_id },
      order: [["priority", "ASC"]],
      //   include: [
      //     {
      //       model: Store,
      //       attributes: ["name"],
      //     },
      //   ],
    });

    return res.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error("Get Ads By Store Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch advertisements",
    });
  }
};

/**
 * GET ALL ADS BY STORE
 */
exports.getAdsByStore = async (req, res) => {
  try {
    const { store_id } = req.params;

    const ads = await VideoAdvertiesment.findAll({
      where: { store_id },
      order: [["priority", "ASC"]],
    });

    return res.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error("Get Ads By Store Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch advertisements",
    });
  }
};

/**
 * GET ACTIVE ADS BY LOCATION (FOR PLAYER/TV)
 */
exports.getActiveAdsByLocation = async (req, res) => {
  try {
    const { location_id } = req.params;

    const ads = await VideoAdvertiesment.findAll({
      where: {
        location_id,
        status: "active",
      },
      order: [["priority", "ASC"]],
    });

    return res.json({
      success: true,
      data: ads,
    });
  } catch (error) {
    console.error("Get Active Ads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch active advertisements",
    });
  }
};

/**
 * UPDATE VIDEO ADVERTISEMENT
 */
exports.updateVideoAdvertiesment = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await VideoAdvertiesment.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Video advertisement not found",
      });
    }

    return res.json({
      success: true,
      message: "Video advertisement updated successfully",
    });
  } catch (error) {
    console.error("Update Video Advertiesment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/**
 * UPDATE AD STATUS (PAUSE / RESUME)
 */
exports.updateAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    await VideoAdvertiesment.update({ status }, { where: { id } });

    return res.json({
      success: true,
      message: "Advertisement status updated",
    });
  } catch (error) {
    console.error("Update Ad Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update status",
    });
  }
};

/**
 * DELETE (SOFT DELETE)
 */
exports.deleteVideoAdvertiesment = async (req, res) => {
  try {
    const { id } = req.params;

    await VideoAdvertiesment.destroy({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Video advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Delete Video Advertiesment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

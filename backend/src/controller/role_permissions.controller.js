"use strict";

const { role_permissions } = require("../models");

/**
 * Get permissions by role_id
 */
exports.getPermissionsByRole = async (req, res) => {
  try {
    const { role_id } = req.params;

    const permissions = await role_permissions.findAll({
      where: { role_id },
      attributes: ["route_key", "status"], // ✅ INCLUDE STATUS
    });

    return res.status(200).json({
      success: true,
      permissions,
    });
  } catch (error) {
    console.error("Permission Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch permissions",
    });
  }
};

exports.upsertPermissions = async (req, res) => {
  try {
    const { role_id, permissions } = req.body;

    if (!role_id || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "role_id and permissions array are required",
      });
    }

    // Fetch existing permissions for the role
    const existingPermissions = await role_permissions.findAll({
      where: { role_id },
    });

    // Map existing by route_key for quick lookup
    const existingMap = {};
    existingPermissions.forEach((perm) => {
      existingMap[perm.route_key] = perm;
    });

    // Process each permission from request
    for (const perm of permissions) {
      const { route_key, status } = perm;
      if (!route_key || !["active", "inactive"].includes(status)) continue;

      if (existingMap[route_key]) {
        // Update if status changed
        if (existingMap[route_key].status !== status) {
          await role_permissions.update(
            { status },
            { where: { id: existingMap[route_key].id } }
          );
        }
      } else {
        // Create new permission
        await role_permissions.create({
          role_id,
          route_key,
          status,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Permissions upserted successfully",
    });
  } catch (error) {
    console.error("Upsert Permissions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to upsert permissions",
    });
  }
};

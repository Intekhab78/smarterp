const { Op, Sequelize } = require('sequelize')
const express = require('express');
const ResponseFormatter = require('../utils/ResponseFormatter')

const db = require('../models')

const userModel = db.users
const roleModel = db.roles
const permissionModel = db.permissions


const Insert = async (req, res, next) => {
    const { name, description, permissions } = req.body; // Destructure relevant fields from request body

    try {
        let name_check = await roleModel.count({ where: {name: name } });
        if (name_check > 0) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Name already exist', 'Error', ''));
            return;
        }
        const role = await roleModel.create({ name, description });

        if (permissions && Array.isArray(permissions)) {
            await Promise.all(permissions.map(async perm => {  
                const createdPermission = await createPermission(perm);
                await role.addPermission(createdPermission.id); 
                // console.log(createdPermission); 
                // role.permissions.push(createdPermission.id); // Assuming permissions are stored as references in Role model
            }));
        }

        await role.save();
        res.status(200).json({
            success: true,
            message: 'Successfully added record',
            data: role
        });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to create role.',
            error: error.message
        });
    }
};
const createPermission = async (perm) => {
    try {
        const { path, title, type, icon, parent_id, is_view, is_create, is_delete, is_edit } = perm;

        // Create permission
        const permission = await permissionModel.create({
            path,
            guard_name: 'web',
            title,
            type,
            icon,
            parent_id,
            is_view,
            is_create,
            is_delete,
            is_edit
        });

        return permission; // Return created permission document
    } catch (error) {
        console.error('Error creating permission:', error);
        throw error; // Throw error to be caught by caller function (Insert)
    }
};

const getroleById = async (req, res, next) => {
    const { id } = req.body

    try {
        const UserDetail = await roleModel.findByPk(id, {
            include: {
                model: permissionModel,
                as: 'permissions', // This should match the alias defined in roles.js for permissions association
                through: {
                    attributes: [] // To exclude join table attributes from results
                }
            }
        });
        if (!UserDetail) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, "user not exist", 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', UserDetail));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, '', 'Error', error.message));
    }
}
const Update = async (req, res, next) => {
    const { id,name, description, permissions } = req.body;

    try {
        // Find the role by ID
        const role = await roleModel.findByPk(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
                data: null,
            });
        }

        // Check if a new name is provided and it's not already taken
        if (name && name !== role.name) {
            const nameExists = await roleModel.findOne({ where: { name } });
            if (nameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Role name already exists',
                    data: null,
                });
            }
        }

        // Update the role's basic details
        await role.update({ name, description });

        // Handle permissions if provided
        if (Array.isArray(permissions)) {
            // Retrieve current permissions
            const currentPermissions = await role.getPermissions();

            // Find permissions to add, update, or remove
            const newPermissions = [];
            const permissionsToRemove = [];
            const currentPermissionsMap = new Map();

            currentPermissions.forEach((perm) => {
                currentPermissionsMap.set(perm.id, perm);
            });

            // Process each permission in the new permissions list
            for (const perm of permissions) {
                if (perm.id && currentPermissionsMap.has(perm.id)) {
                    // Update existing permission
                    const existingPermission = currentPermissionsMap.get(perm.id);
                    await existingPermission.update(perm);
                    currentPermissionsMap.delete(perm.id);
                } else {
                    // Add new permission
                    newPermissions.push(await createPermission(perm));
                }
            }

            // Remaining permissions in the map are those to remove
            permissionsToRemove.push(...currentPermissionsMap.values());

            // Remove old permissions
            await role.removePermissions(permissionsToRemove.map((perm) => perm.id));

            // Add new permissions to the role
            await role.addPermissions(newPermissions.map((perm) => perm.id));
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully updated record',
            data: role,
        });
    } catch (error) {
        console.error('Error updating role:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update role.',
            error: error.message,
        });
    }
};

const delete_role = async (req, res, next) => {
    const { id } = req.body

    try {
        
        const UserDetail = await roleModel.findByPk(id, {
            include: {
                model: permissionModel,
                as: 'permissions', // This should match the alias defined in roles.js for permissions association
                through: {
                    attributes: [] // To exclude join table attributes from results
                }
            }
        });
        if (!UserDetail) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, "user not exist", 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully deleted record', '', UserDetail));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, '', 'Error', error.message));
    }
}

const list = async (req, res, next) => {
    const { } = req.query;
    try {
        const rolesWithPermissions = await roleModel.findAll({
            include: {
              model: permissionModel,
              as: 'permissions', // This should match the alias defined in roles.js for permissions association
              through: {
                attributes: [] // To exclude join table attributes from results
              }
            }
          });
        if (!rolesWithPermissions) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'user not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', rolesWithPermissions));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
module.exports = {
    Insert,
    Update,
    list,
    getroleById,
    delete_role
}
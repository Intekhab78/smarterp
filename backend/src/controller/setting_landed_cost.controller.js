const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const itemModel = db.item_master;
const LocationModel = db.location;
const CurrencyModel = db.currency;
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const SettingLandedCostModel = db.setting_landed_cost;
const {codesettingupdate} = require('../utils/handler');

require('dotenv').config();
const paths = require('path');
const base_url = process.env.BASE_URL;



const list = async (req, res, next) => {
    const { page, limit = 10 } = req.body;

    try {
        
        const currentPage = page ? parseInt(page) : 1;
        const limits = parseInt(limit);
        const offset = (currentPage - 1) * limits;
        const totalRecords = await SettingLandedCostModel.count();
        const festivalRes = await SettingLandedCostModel.findAll(
            {
                include: [
                    {
                        model: itemModel,
                        as: 'item_master',
                    },
                    {
                        model: LocationModel,
                        as: 'location',
                        
                    },
                    {
                        model: CurrencyModel,
                        as: 'currency',
                    },
                ],
                order: [['id', 'DESC']],
            }
        );
        const totalPages = Math.ceil(totalRecords / limits);
        const pagination = {
            records: festivalRes,
            currentPage: currentPage,
            pageSize: limits,
            totalRecords: totalRecords,
            totalPages: totalPages
        };

        if (!festivalRes) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', festivalRes));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const store = async (req, res, next) => {
    const {
        barcode,
        sno,
        supname,
        whlongdesc,
        locdesc,
        whnegstock,
        ccurrency,
        fixed_cost,
        status,
        addedby,
    } = req.body;

    try {
        if (barcode == "" ||barcode == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Barcode field is required', 'Error', ''));
            return;
        }
        if (whlongdesc == "" ||whlongdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Site field is required', 'Error', ''));
            return;
        }
        if (locdesc == "" ||locdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Site Description field is required', 'Error', ''));
            return;
        }
        if (whnegstock == "" ||whnegstock == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Landed Cost field is required', 'Error', ''));
            return;
        }
        codesettingupdate('brand');
        let item = await SettingLandedCostModel.create({
            barcode: barcode,
            sno: sno,
            supname: supname,
            whlongdesc: whlongdesc,
            locdesc: locdesc,
            whnegstock: whnegstock,
            ccurrency: ccurrency,
            fixed_cost: fixed_cost,
            addedby: addedby,
            status: status,
        })
         
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully added record', '', item));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const details = async (req, res, next) => {
    const { id } = req.body;

    try {
       
        const festivalRes = await SettingLandedCostModel.findOne(
            {
                include: [
                    {
                        model: itemModel,
                        as: 'item_master',
                    },
                    {
                        model: LocationModel,
                        as: 'location',
                        
                    },
                    {
                        model: CurrencyModel,
                        as: 'currency',
                    },
                ],
                where: {
                    id: id
                }
            },
        );

        if (!festivalRes) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully show record', '', festivalRes));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const update = async (req, res, next) => {
    const {
        id,
        barcode,
        sno,
        supname,
        whlongdesc,
        locdesc,
        whnegstock,
        ccurrency,
        fixed_cost,
        status,
        addedby,
    } = req.body;

    try {
        if (id == "" ||id == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'id field is required', 'Error', ''));
            return;
        }
        if (barcode == "" ||barcode == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Barcode field is required', 'Error', ''));
            return;
        }
        if (whlongdesc == "" ||whlongdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Site field is required', 'Error', ''));
            return;
        }
        if (locdesc == "" ||locdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Site Description field is required', 'Error', ''));
            return;
        }
        if (whnegstock == "" ||whnegstock == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Landed Cost field is required', 'Error', ''));
            return;
        }
        const detail = await SettingLandedCostModel.findOne({
            where: {
                id: id
            }
        });

        if (!detail) {
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found', 'Error'));
        }
        // codesettingupdate('item');
        let item = await SettingLandedCostModel.update({
            barcode: barcode,
            sno: sno,
            supname: supname,
            whlongdesc: whlongdesc,
            locdesc: locdesc,
            whnegstock: whnegstock,
            ccurrency: ccurrency,
            fixed_cost: fixed_cost,
            addedby: addedby,
            status: status,
        },
        {
            where: {
                id: id
            }
    })
         
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully updated record', '', detail));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const delete_uom = async (req, res, next) => {
    const { id } = req.body;

    try {
        // Attempt to soft delete the order
        const deletedCount = await SettingLandedCostModel.destroy({
            where: {
                id: id
            }
        });

        if (deletedCount === 0) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully deleted record', '', { deletedCount }));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
};
module.exports = {

    list,
    store,
    update,
    details,
    delete_uom

};

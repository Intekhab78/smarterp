const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const userCompanyModel = db.user_company
const WarehouseMasterModel = db.warehouse_master;
const CompanyModel = db.company;
const LocationModel = db.location;
const {codesettingupdate,codesettingGet} = require('../utils/handler');

require('dotenv').config();
const paths = require('path');
const base_url = process.env.BASE_URL;



const list = async (req, res, next) => {
    const { page, limit = 10,user_id } = req.body;

    try {
        let companyIds = [];
        if (user_id) {
            const userCompanies = await userCompanyModel.findAll({
                where: {
                    user_id: user_id
                },
                attributes: ['company_id'], // Only fetch the 'company_id' field
            });
            
            companyIds = userCompanies.map(company => company.company_id);
            
        }
        const whereClause = {
           
            ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
        };
        const currentPage = page ? parseInt(page) : 1;
        const limits = parseInt(limit);
        const offset = (currentPage - 1) * limits;
        const totalRecords = await WarehouseMasterModel.count();
        const festivalRes = await WarehouseMasterModel.findAll(
            {
                where: whereClause,
                include: [
                    {
                        model: CompanyModel,
                        as: 'company',
                    },
                    {
                        model: LocationModel,
                        as: 'location',
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
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', pagination));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const ware_list = async (req, res, next) => {
    const { page, limit = 10 } = req.body;

    try {
        
        const currentPage = page ? parseInt(page) : 1;
        const limits = parseInt(limit);
        const offset = (currentPage - 1) * limits;
        const totalRecords = await WarehouseMasterModel.count();
        const festivalRes = await WarehouseMasterModel.findAll(
            {
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
        whcode,
        whdesc,
        whlongdesc,
        note1,
        note2,
        note3,
        locdesc,
        whnegstock,
        itmcatdt1,
        itmcatdt2,
        status,
        addedby,
        company_id,
        location_id,
    } = req.body;

    try {
        if (whdesc == "" ||whdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description field is required', 'Error', ''));
            return;
        }
        if (whlongdesc == "" ||whlongdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        if (locdesc == "" ||locdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Location field is required', 'Error', ''));
            return;
        }
        let name_check = await WarehouseMasterModel.count({ where: { whdesc: whdesc} });
        if (name_check > 0) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
            return;
        }
        let getNumber = await codesettingGet('warehouse');
        codesettingupdate('warehouse');
        let item = await WarehouseMasterModel.create({
            whcode: getNumber,
            whdesc: whdesc,
            whlongdesc: whlongdesc,
            note1: note1,
            note2: note2,
            note3: note3,
            locdesc: locdesc,
            whnegstock: whnegstock,
            itmcatdt1: itmcatdt1,
            itmcatdt2: itmcatdt2,
            addedby: addedby,
            status: status,
            company_id: company_id,
            location_id: location_id,
        })
         
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully added record', '', item));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const details = async (req, res, next) => {
    const { id } = req.body;

    try {
       
        const festivalRes = await WarehouseMasterModel.findOne(
            {
                where: {
                    id: id
                }
            },
        );

        if (!festivalRes) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', festivalRes));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const update = async (req, res, next) => {
    const {
        id,
        // whcode,
        whdesc,
        whlongdesc,
        note1,
        note2,
        note3,
        locdesc,
        whnegstock,
        itmcatdt1,
        itmcatdt2,
        status,
        addedby,
        company_id,
        location_id,
    } = req.body;

    try {
        if (id == "" ||id == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'id field is required', 'Error', ''));
            return;
        }
        if (whdesc == "" ||whdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description field is required', 'Error', ''));
            return;
        }
        if (whlongdesc == "" ||whlongdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        if (locdesc == "" ||locdesc == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Location field is required', 'Error', ''));
            return;
        }
        const detail = await WarehouseMasterModel.findOne({
            where: {
                id: id
            }
        });

        if (!detail) {
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found', 'Error'));
        }
        if (whdesc != detail.whdesc) {
            let name_check = await WarehouseMasterModel.count({ where: { whdesc: whdesc} });
            if (name_check > 0) {
                res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
                return;
            }
        }
        // codesettingupdate('item');
        let item = await WarehouseMasterModel.update({
            // whcode: whcode,
            whdesc: whdesc,
            whlongdesc: whlongdesc,
            note1: note1,
            note2: note2,
            note3: note3,
            locdesc: locdesc,
            whnegstock: whnegstock,
            itmcatdt1: itmcatdt1,
            itmcatdt2: itmcatdt2,
            addedby: addedby,
            status: status,
            company_id: company_id,
            location_id: location_id
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
        const deletedCount = await WarehouseMasterModel.destroy({
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
    delete_uom,
    ware_list

};

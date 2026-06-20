const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const itemModel = db.item_master;
const userCompanyModel = db.user_company
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const taxMasterModel = db.tax_master;
const CompanyModel = db.company;
const LocationModel = db.location;
const {codesettingupdate} = require('../utils/handler');

require('dotenv').config();
const paths = require('path');
const base_url = process.env.BASE_URL;



const list = async (req, res, next) => {
    const { page, limit = 10 ,user_id} = req.body;

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
        const totalRecords = await taxMasterModel.count();
        const festivalRes = await taxMasterModel.findAll(
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
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', festivalRes));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const store = async (req, res, next) => {
    const {
        taxcode,
        taxname,
        taxlong,
        taxcal,
        taxpor1,
        taxpor1desc,
        taxpor2,
        taxpor2desc,
        taxpor3,
        taxpor3desc,
        taxvalidfrm,
        taxvalidto,
        note1,
        note2,
        note3,
        itmtaxdt1,
        itmtaxdt2,
        taxlegis,
        status,
        addedby,
    } = req.body;

    try {
        if (taxname == "" ||taxname == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description field is required', 'Error', ''));
            return;
        }
        if (taxlong == "" ||taxlong == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        if (taxcal == "" ||taxcal == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Tax Calculation field is required', 'Error', ''));
            return;
        }
        if (taxlegis == "" ||taxlegis == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Legislation field is required', 'Error', ''));
            return;
        }
        if (taxvalidfrm == "" ||taxvalidfrm == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Valid From field is required', 'Error', ''));
            return;
        }
        let name_check = await taxMasterModel.count({ where: { taxname: taxname} });
            if (name_check > 0) {
                res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
                return;
            }
        codesettingupdate('tax_master');
        
        let item = await taxMasterModel.create({
            taxcode: taxcode,
            taxname: taxname,
            taxlong: taxlong,
            taxcal: taxcal,
            taxpor1: taxpor1,
            taxpor1desc:taxpor1desc,
            taxpor2:taxpor2,
            taxpor2desc:taxpor2desc,
            taxpor3:taxpor3,
            taxpor3desc:taxpor3desc,
            taxvalidfrm:taxvalidfrm,
            taxvalidto:taxvalidto,
            note1: note1,
            note2: note2,
            note3: note3,
            itmtaxdt1: itmtaxdt1,
            itmtaxdt2: itmtaxdt2,
            taxlegis: taxlegis,
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
       
        const festivalRes = await taxMasterModel.findOne(
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
        // taxcode,
        taxname,
        taxlong,
        taxcal,
        taxpor1,
        taxpor1desc,
        taxpor2,
        taxpor2desc,
        taxpor3,
        taxpor3desc,
        taxvalidfrm,
        taxvalidto,
        note1,
        note2,
        note3,
        itmtaxdt1,
        itmtaxdt2,
        taxlegis,
        status,
        addedby,
    } = req.body;

    try {
        if (id == "" ||id == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'id field is required', 'Error', ''));
            return;
        }
        if (taxname == "" ||taxname == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description field is required', 'Error', ''));
            return;
        }
        if (taxlong == "" ||taxlong == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        if (taxcal == "" ||taxcal == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Tax Calculation field is required', 'Error', ''));
            return;
        }
        if (taxlegis == "" ||taxlegis == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Legislation field is required', 'Error', ''));
            return;
        }
        if (taxvalidfrm == "" ||taxvalidfrm == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Valid From field is required', 'Error', ''));
            return;
        }
        const detail = await taxMasterModel.findOne({
            where: {
                id: id
            }
        });

        if (!detail) {
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found', 'Error'));
        }
        if (taxname != detail.taxname) {
            let name_check = await taxMasterModel.count({ where: { taxname: taxname} });
            if (name_check > 0) {
                res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
                return;
            }
        }
        // codesettingupdate('item');
        let item = await taxMasterModel.update({
            // taxcode: taxcode,
            taxname: taxname,
            taxlong: taxlong,
            taxcal: taxcal,
            taxpor1: taxpor1,
            taxpor1desc:taxpor1desc,
            taxpor2:taxpor2,
            taxpor2desc:taxpor2desc,
            taxpor3:taxpor3,
            taxpor3desc:taxpor3desc,
            taxvalidfrm:taxvalidfrm,
            taxvalidto:taxvalidto,
            note1: note1,
            note2: note2,
            note3: note3,
            itmtaxdt1: itmtaxdt1,
            itmtaxdt2: itmtaxdt2,
            taxlegis: taxlegis,
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
const delete_tax = async (req, res, next) => {
    const { id } = req.body;

    try {
        // Attempt to soft delete the order
        const deletedCount = await taxMasterModel.destroy({
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

const DropDownList = async (req, res, next) => {

    try {

        const taxList = await taxMasterModel.findAll(
            {
                where:{
                    status: 1,
                }
            }
        );

        // if (!festivalRes) {
        //     res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        // } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', taxList));
        // }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

module.exports = {

    list,
    store,
    update,
    details,
    delete_tax,
    DropDownList

};

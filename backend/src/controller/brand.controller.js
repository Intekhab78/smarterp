const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const itemModel = db.item_master;
const userCompanyModel = db.user_company
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const BrandModel = db.brand;
const CompanyModel = db.company;
const LocationModel = db.location;
const { codesettingupdate } = require('../utils/handler');

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
        const currentPage = page ? parseInt(page) : 1;
        const limits = parseInt(limit);
        const offset = (currentPage - 1) * limits;
        const totalRecords = await BrandModel.count();
        const whereClause = {
           
            ...(companyIds.length > 0 && { company_id: { [Op.in]: companyIds } }),
        };
        const festivalRes = await BrandModel.findAll(
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
        brandcode,
        brandname,
        brandlong,
        note1,
        note2,
        note3,
        itmsbranddt1,
        itmsbranddt2,
        status,
        addedby,
        company_id,
        location_id,
    } = req.body;

    try {
        if (brandname == "" ||brandname == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description  field is required', 'Error', ''));
            return;
        }
        if (brandlong == "" ||brandlong == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        let name_check = await BrandModel.count({ where: { brandname: brandname } });
        if (name_check > 0) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
            return;
        }
        codesettingupdate('brand');
        let item = await BrandModel.create({
            brandcode: brandcode,
            brandname: brandname,
            brandlong: brandlong,
            note1: note1,
            note2: note2,
            note3: note3,
            itmsbranddt1: itmsbranddt1,
            itmsbranddt2: itmsbranddt2,
            addedby: addedby,
            company_id:company_id,
            location_id:location_id,
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

        const festivalRes = await BrandModel.findOne(
            {
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
        // brandcode,
        brandname,
        brandlong,
        note1,
        note2,
        note3,
        itmsbranddt1,
        itmsbranddt2,
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
        if (brandname == "" ||brandname == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description  field is required', 'Error', ''));
            return;
        }
        if (brandlong == "" ||brandlong == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        const detail = await BrandModel.findOne({
            where: {
                id: id
            }
        });

        if (!detail) {
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found', 'Error'));
        }
        if (brandname != detail.brandname) {
            let name_check = await BrandModel.count({ where: { brandname: brandname } });
            if (name_check > 0) {
                res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
                return;
            }
        }
        // codesettingupdate('item');
        let item = await BrandModel.update({
            // brandcode: brandcode,
            brandname: brandname,
            brandlong: brandlong,
            note1: note1,
            note2: note2,
            note3: note3,
            itmsbranddt1: itmsbranddt1,
            itmsbranddt2: itmsbranddt2,
            addedby: addedby,
            company_id:company_id,
            location_id:location_id,
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
        const deletedCount = await BrandModel.destroy({
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

const DropDownlist = async (req, res, next) => {
    try {

        const BrandList = await BrandModel.findAll(
            {
                where: {
                    status: 1,
                }
            }
        );


        // if (!festivalRes) {
        //     res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        // } else {
        res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', BrandList));
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
    delete_uom,
    DropDownlist

};

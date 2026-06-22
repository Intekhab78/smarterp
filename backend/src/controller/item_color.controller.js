const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const itemModel = db.item_master;
const userCompanyModel = db.user_company
const itemMajorCategoryModel = db.item_major_category;
const itemMainPriceModel = db.item_main_price;
const ItemColorModel = db.item_color;
const CompanyModel = db.company;
const LocationModel = db.location;
const {codesettingupdate} = require('../utils/handler');

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
        const totalRecords = await ItemColorModel.count();
        const festivalRes = await ItemColorModel.findAll(
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
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', festivalRes));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const store = async (req, res, next) => {
    const {
        itemcolcode,
        itemcolname,
        itemcoldesclong,
        note1,
        note2,
        note3,
        itmcoldt1,
        itmcoldt2,
        status,
        addedby,
        company_id,
        location_id,
    } = req.body;

    try {
        if (itemcolname == "" ||itemcolname == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description field is required', 'Error', ''));
            return;
        }
        if (itemcoldesclong == "" ||itemcoldesclong == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        let name_check = await ItemColorModel.count({ where: { itemcolname: itemcolname} });
        if (name_check > 0) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
            return;
        }
        codesettingupdate('item_color');
        let item = await ItemColorModel.create({
            itemcolcode: itemcolcode,
            itemcolname: itemcolname,
            itemcoldesclong: itemcoldesclong,
            note1: note1,
            note2: note2,
            note3: note3,
            itmcoldt1: itmcoldt1,
            itmcoldt2: itmcoldt2,
            addedby: addedby,
            status: status,
            company_id:company_id,
            location_id:location_id
        })
         
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully added record', '', item));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const details = async (req, res, next) => {
    const { id } = req.body;

    try {
       
        const festivalRes = await ItemColorModel.findOne(
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
        // itemcolcode,
        itemcolname,
        itemcoldesclong,
        note1,
        note2,
        note3,
        itmcoldt1,
        itmcoldt2,
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
        if (itemcolname == "" ||itemcolname == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description field is required', 'Error', ''));
            return;
        }
        if (itemcoldesclong == "" ||itemcoldesclong == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Long Description field is required', 'Error', ''));
            return;
        }
        const detail = await ItemColorModel.findOne({
            where: {
                id: id
            }
        });

        if (!detail) {
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found', 'Error'));
        }
        if (itemcolname != detail.itemcolname) {
            let name_check = await ItemColorModel.count({ where: { itemcolname: itemcolname} });
            if (name_check > 0) {
                res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Description already exist', 'Error', ''));
                return;
            }
        }
        // codesettingupdate('item');
        let item = await ItemColorModel.update({
            // itemcolcode: itemcolcode,
            itemcolname: itemcolname,
            itemcoldesclong: itemcoldesclong,
            note1: note1,
            note2: note2,
            note3: note3,
            itmcoldt1: itmcoldt1,
            itmcoldt2: itmcoldt2,
            addedby: addedby,
            status: status,
            company_id:company_id,
            location_id:location_id
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
const delete_item_color = async (req, res, next) => {
    const { id } = req.body;

    try {
        // Attempt to soft delete the order
        const deletedCount = await ItemColorModel.destroy({
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
        const colorList = await ItemColorModel.findAll(
            {
                where:{
                    status: 1,
                }
            }
        );
        // if (!festivalRes) {
        //     res.status(404).json(ResponseFormatter.setResponse(false, 404, 'color not found!', 'Error', ''));
        // } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', colorList));
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
    delete_item_color,
    DropDownList

};

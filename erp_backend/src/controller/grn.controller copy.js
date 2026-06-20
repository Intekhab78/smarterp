const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const GrnModel = db.grn;
const GrnDetailModel = db.grn_details;
const UserModel = db.user_master;
const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;

require('dotenv').config();
const paths = require('path');
const base_url = process.env.BASE_URL;



const list = async (req, res, next) => {
    const { page,name,customer_code, limit = 10 } = req.body;

    try {
        // let searchQuery;
        
        //     // Initialize the array to hold individual conditions
        //     let conditions = [];

        //     if (customer_code) {
        //         conditions.push({
        //             customer_code: { [Op.eq]: customer_code }
        //         });
        //     }
        //     if (name) {
        //         conditions.push({
        //             [Op.or]: [
        //                 { '$users.firstname$': { [Op.iLike]: `%${name}%` } },
        //                 { '$users.lastname$': { [Op.iLike]: `%${name}%` } }
        //             ]
        //         });
        //     }

        //     // Combine all conditions into the search query
        //     if (conditions.length > 0) {
        //         searchQuery = { [Op.or]: conditions };
        //     }
        




        // console.log('searchQuery', searchQuery);

        const currentPage = page ? parseInt(page) : 1;
        const limits = parseInt(limit);
        const offset = (currentPage - 1) * limits;
        const totalRecords = await GrnModel.count();
        const festivalRes = await GrnModel.findAll(
            {
                //     where: searchQuery,
                // attributes: ['id','customer_code','customer_id'],
                include: [
                    {
                        model: UserModel,
                        as: 'salesman' , 
                        attributes: ['firstname','lastname','email'],
                        include: [
                            {
                                model: SalesmanInfo,
                                as: 'salesmanInfo',
                                attributes: ['salesman_code'] // Example attributes
                            }
                        ]
                        
                    }
                ],
                order: [['id', 'DESC']],
                limit: limits,
                offset: offset
            }
        );

        // console.log("Base URL:", process.env.BASE_URL);
        const totalPages = Math.ceil(totalRecords / limits);
        const pagination = {
            records: festivalRes,
            currentPage: currentPage,
            pageSize: limits,
            totalRecords: totalRecords,
            totalPages: totalPages
        };

        if (!festivalRes) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'GRN not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', pagination));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const store = async (req, res, next) => {
    const {
        salesman_id,
        route_id,
        trip_id,
        credit_note_id,
        is_damaged,
        grn_number,
        grn_remark,
        approval_status,
        items,
     } = req.body;

    try {

        const date = new Date();

        let Order = await GrnModel.create({
            salesman_id:salesman_id,
            route_id:route_id,
            trip_id:trip_id,
            source_warehouse:0,
            destination_warehouse:0,
            grn_date:date,
            is_damaged:is_damaged,
            grn_number:grn_number,
            grn_remark:grn_remark,
            approval_status:approval_status    
        })


        for(var i = 0; i < items.length; i++){
            let OrderDetail = await GrnDetailModel.create({
                good_receipt_note_id:Order.id,
                item_id: items[i].item_id,
                item_uom_id: 0,
                qty: items[i].quantity,
                reason: items[i].reason,
                order_status: 'Pending',       
            })
        }

        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully Add GRN', '', Order));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
module.exports = {
    list,
    store
};

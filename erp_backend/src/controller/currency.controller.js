require('dotenv').config();
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const { currency ,currency_details} = require('../models');
const CustomerInfoModel = db.customer_info;
const InvoiceModel = db.invoice;
const OrderModel = db.order;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');
const GrnModel = db.grn;
const { codesettingupdate } = require('../utils/handler');

const paths = require('path');
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {

    try {
        const payment_typeList = await currency.findAll({
            order: [['id', 'DESC']],
        });



        if (!payment_typeList) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'currency category not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', payment_typeList));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}


const store = async (req, res, next) => {
    const {
        name,
        curcode,
        curdes,
        curldes,
        isocode,
        symbol,
        format,
        decimals,
        rounding,
        // frmdt,
        // todt,
        // curdess,
        // currate,
        note1,
        note2,
        note3,
        itmcatdt1,
        itmcatdt2,
        addedby,
        status,
        currency_del
    } = req.body;

    try {
        let name_check = await currency.count({ where: { compdesc: compdesc} });
        if (name_check > 0) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Name already exist', 'Error', ''));
            return;
        }
        // console.log('images', );
        codesettingupdate('currency');
        let currencys = await currency.create({
            name: name,
            curcode:curcode,
            curdes:curdes,
            curldes:curldes,
            isocode:isocode,
            symbol:symbol,
            format:format,
            decimals:decimals,
            rounding:rounding,
            // frmdt:frmdt,
            // todt:todt,
            // curdess:curdess,
            // currate:currate,
            note1:note1,
            note2:note2,
            note3:note3,
            itmcatdt1:itmcatdt1,
            itmcatdt2:itmcatdt2,
            addedby:addedby,
            status:status,
        })

        for (var a = 0; a < currency_del.length; a++) {
            let location_add = await currency_details.create({
                currency_id: currencys.id,
                frmdt:currency_del[a].frmdt,
                todt:currency_del[a].todt,
                curdess:currency_del[a].curdess,
                currate:currency_del[a].currate,
            })
        }


        if (!currencys) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully added record', '', currencys));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const list_details = async (req, res, next) => {

    const { id } = req.body;
    try {

        let currencys = await currency.findOne(
            {
                include: [
                    {
                        model: currency_details,
                        as: 'currency_details',
                    },
                ],
                where: {
                    id: id
                },
            }
        )

        if (!currencys) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully show record', '', currencys));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const list_delete = async (req, res, next) => {

    const { id } = req.body;
    try {

        const deletedCount = await currency.destroy({
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
}

const update = async (req, res, next) => {
    const {
        id,
        name,
        // curcode,
        curdes,
        curldes,
        isocode,
        symbol,
        format,
        decimals,
        rounding,
        // frmdt,
        // todt,
        // curdess,
        // currate,
        note1,
        note2,
        note3,
        itmcatdt1,
        itmcatdt2,
        addedby,
        status,
        currency_del
    } = req.body;
    try {

        let currency_old = await currency.findOne(
            {
                where: {
                    id: id
                },
            }
        )
        if (name != currency_old.name) {
            let name_check = await currency.count({ where: { name: name} });
            if (name_check > 0) {
                res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Name already exist', 'Error', ''));
                return;
            }
        }
        let currencys = await currency.update({
            name: name,
            // curcode:curcode,
            curdes:curdes,
            curldes:curldes,
            isocode:isocode,
            symbol:symbol,
            format:format,
            decimals:decimals,
            rounding:rounding,
            // frmdt:frmdt,
            // todt:todt,
            // curdess:curdess,
            // currate:currate,
            note1:note1,
            note2:note2,
            note3:note3,
            itmcatdt1:itmcatdt1,
            itmcatdt2:itmcatdt2,
            addedby:addedby,
            status:status,
        }, {
            where: {
                id: id
            }
        })


        const deletedCount = await currency_details.destroy({
            where: {
                currency_id: id
            }
        });


        for (var a = 0; a < currency_del.length; a++) {
            let location_add = await currency_details.create({
                currency_id: id,
                frmdt:currency_del[a].frmdt,
                todt:currency_del[a].todt,
                curdess:currency_del[a].curdess,
                currate:currency_del[a].currate,
            })
        }
        if (!currencys) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully updated record', '', currencys));
        }
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const list_by_type = async (req, res, next) => {
    const {
        id,
        type,
    } = req.body;
    try {
        let festivalRes;
        if(type == "Payable"){
            festivalRes = await GrnModel.findAll(
                {
                    attributes: ['id','grn_number','grand_total'],
                    
                    where: {
                        payment_status:'pending'
                    },
                    order: [['id', 'DESC']],
                    // limit: limits,
                    // offset: offset
                }
            );
            for(var i = 0; i < festivalRes.length; i++){
                festivalRes[i]=festivalRes[i].toJSON()
                const grn_number = festivalRes[i].grn_number;
                        festivalRes[i].transaction_no=grn_number
            }
        }else if(type == "Receivable"){
            festivalRes = await InvoiceModel.findAll(
                {
                    where: {
                        payment_status:'pending'
                    },
                    attributes: ['id','invoice_number','grand_total'],
                    
                    order: [['id', 'ASC']],
                    // limit: limits,
                    // offset: offset
                }
            );
            for(var i = 0; i < festivalRes.length; i++){
                festivalRes[i]=festivalRes[i].toJSON()
                const trans = festivalRes[i].invoice_number;
                        festivalRes[i].transaction_no=trans
                }
        }else{
            festivalRes = await OrderModel.findAll(
                {
                    attributes: ['id','order_number','grand_total'],
                    where: { type: "sales order",status: 'Close',payment_status:'pending' },
                    order: [['id', 'DESC']],
                    // limit: limits,
                    // offset: offset
                }
            );
            for(var i = 0; i < festivalRes.length; i++){
                festivalRes[i]=festivalRes[i].toJSON()
                const trans = festivalRes[i].order_number;
                        festivalRes[i].transaction_no=trans
                }
        }

        if (!festivalRes) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', festivalRes));
        }
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

module.exports = {
    list,
    store,
    list_details,
    list_delete,
    list_by_type,
    update,
};

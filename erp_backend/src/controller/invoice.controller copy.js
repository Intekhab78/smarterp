const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where, FLOAT } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const InvoiceModel = db.invoice;
const OrderModel = db.order;
const InventoryMovementModel = db.inventory_movement;
const InvoiceDetailModel = db.invoice_details;
const OrderDetailModel = db.order_details;
const UserModel = db.user_master;
const BatchModel = db.batch;
const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_master;
const paymentTermsModel = db.payment_terms;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Readable } = require('stream');
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const countryMastersModel = db.country_masters;

const {codesettingupdate, codesettingGet} = require('../utils/handler');

// require('dotenv').config();
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
        const totalRecords = await InvoiceModel.count();
        const festivalRes = await InvoiceModel.findAll(
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
                        
                    },
                    {
                        model: UserModel,
                        as: 'customer',
                        attributes: ['firstname', 'lastname', 'email'],
                        include: [
                            {
                                model: CustomerInfo,
                                as: 'customerInfo',
                                attributes: ['customer_code'] // Example attributes
                            }
                        ]
                    },
                    {
                        model: InvoiceDetailModel,
                        as: 'invoice_details',
                        // attributes: ['firstname', 'lastname', 'email'],
                    },
                ],
                order: [['id', 'DESC']],
                // limit: limits,
                // offset: offset
            }
        );
        for(var i = 0; i < festivalRes.length; i++){
        const invoicePdfFullPaths = festivalRes[i].invoice_pdf
                ? base_url + path.posix.join('uploads/invoices', festivalRes[i].invoice_pdf)
                : null;
                festivalRes[i].invoice_pdf=invoicePdfFullPaths
        }
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
            res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', pagination));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const store = async (req, res, next) => {
    const {
        id,
        customer_id,
        customer_lob,
        salesman_id,
        customer_lpo,
        order_number,
        delivery_date,
        payment_terms,
        due_date,
        discount,
        net,
        excise,
        vat,
        total,
        status,
        order_type,
        taxable_total,
        cgst_amount,
        sgst_amount,
        igst_amount,
        items,
     } = req.body;

    try {
        // for(var i = 0; i < items.length; i++){
        //     let orderQty = items[i].quantity;
        //     // console.log(orderQty);
        //     let usedEntries = []; 
        //     let batch=await BatchModel.findAll({
        //         where: {
        //             item_id: items[i].item_id 
        //         },
        //         order: [['expiry_date', 'ASC']],
                
        //     });
        //     let totalAvailableQty = batch.reduce((sum, currentBatch) => sum + parseFloat(currentBatch.qty), 0);
        //     // console.log(`Total available quantity for item ${items[i].item_id}: ${totalAvailableQty.toFixed(2)}`);

        //     if (totalAvailableQty < orderQty) {
        //         // console.log('Not enough quantity available to fulfill the order.');
        //         res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Not enough quantity available to fulfill the order!', 'Error', ''));
        //         return;
        //     }
        // }

        let getinvoiceNumber = await codesettingGet('invoice');
        codesettingupdate('invoice');


        let Invoice = await InvoiceModel.create({
            order_id: id,
            customer_id:customer_id,
            customer_lob:customer_lob,
            salesman_id:salesman_id,
            customer_lpo:customer_lpo,
            payment_term_id:payment_terms,
            invoice_date:delivery_date,
            // invoice_number:new_invoice_number,
            invoice_number:getinvoiceNumber,
            invoice_due_date:due_date,
            total_discount_amount:discount,
            total_net:net,
            total_vat:vat,
            total_excise:excise,
            grand_total:total,
            taxable_total:taxable_total,
            cgst_amount:cgst_amount,
            sgst_amount:sgst_amount,
            igst_amount:igst_amount,
            status:status,
            order_type:order_type,
        })

        const detail = await OrderModel.findOne({
            include: [    
                {
                    model: OrderDetailModel,
                    as: 'order_details',
                    // attributes: ['firstname', 'lastname', 'email'],
                },
            ],
            where: {
                id: id
            }
        });

        let allQuantitiesMatch = true;
        for(var i = 0; i < items.length; i++){
            let is_free =0;
            if(items[i].skim == "Free"){
                is_free = 1;
            }

            let item_stoke=await itemModel.findOne({
                where: {
                    id: items[i].item_id
                }
            });
            // if(item_stoke.itmstkmgmt =='Managed'){

            // }
            let expiry_delivery_date = item_stoke.exp_date;      
            let receiving_site =item_stoke.batch_no;                 
            let hsn_code = item_stoke.short_code;
            // console.log(detail);
            if(detail.type == 'purchase order'){
                expiry_delivery_date = items[i].expiry_delivery_date;
                receiving_site=items[i].receiving_site;
                hsn_code=items[i].hsn_code;
            }
            // let InvoiceDetail = await InvoiceDetailModel.create({
            //     invoice_id:Invoice.id,
            //     item_id: items[i].item_id,
            //     item_uom_id:items[i].uom,
            //     item_uom_id: 0,
            //     discount_id: 0,
            //     is_free :is_free,
            //     is_item_poi : 0,
            //     promotion_id : 0,
            //     item_qty: items[i].quantity,
            //     ship_quantity: items[i].ship_quantity,
            //     item_weight: 0,
            //     total_pallet: 0,
            //     total_pallet_volume: 0,
            //     item_price:  items[i].price,
            //     item_gross : items[i].price,
            //     item_discount_amount : items[i].discount,
            //     item_net : items[i].net,
            //     item_vat: items[i].vat,
            //     item_excise: items[i].excise,
            //     item_grand_total : items[i].total,
            //     ptr_di :items[i].ptr_di,
            //     taxa_ble :items[i].taxa_ble,
            //     cgst :items[i].cgst,
            //     cgst_amount :items[i].sgst,
            //     sgst :items[i].sgst,
            //     sgst_amount :items[i].sgst_amount,
            //     igst :items[i].igst,
            //     igst_amount :items[i].igst_amount,
            //     itemtype : detail.type != 'sales order' ? items[i].itemtype : '',      
            //     landed_cost_per_unit : detail.type != 'sales order' ? items[i].landed_cost_per_unit : '',       
            //     // expiry_delivery_date : detail.type != 'sales order' ? items[i].expiry_delivery_date : '',       
            //     expiry_delivery_date : expiry_delivery_date,       
            //     receiving_site : receiving_site,       
            //     // receiving_site : detail.type != 'sales order' ? items[i].receiving_site : '',       
            //     purchase_cost_per_unit : detail.type != 'sales order' ? items[i].purchase_cost_per_unit : '',       
            //     hsn_code : hsn_code,
            //     // hsn_code : detail.type != 'sales order' ? items[i].hsn_code : '',
            //     rate: items[i].price
            // });

            
            let orderQty = items[i].quantity;
            console.log(orderQty); // Set the desired quantity to order
            let usedEntries = []; 
            let batch=await BatchModel.findAll({
                where: {
                    item_id: items[i].item_id 
                },
                order: [['expiry_date', 'ASC']],
                
            });
            // for(var b = 0; b < batch.length; b++){
            //     expiry_date = batch[b].expiry_date;
            //     console.log(expiry_date);
            // }
            
            for (let b = 0; b < batch.length; b++) {
                let currentBatch = batch[b];
                let availableQty = currentBatch.qty; 
                // console.log(availableQty);
                
                // if (availableQty > 0) {
                    
                    let qtyToTake = Math.min(availableQty, orderQty);

                    orderQty -= qtyToTake;
                    currentBatch.qty -= qtyToTake; 

                    final_qty= parseFloat(availableQty) - parseFloat(qtyToTake) ;
                    
                    usedEntries.push({
                        id:currentBatch.id,
                        batch_number:currentBatch.batch_number,
                        expiry_date: currentBatch.expiry_date,
                        qty: qtyToTake,
                        final_qty:final_qty
                    });
                    // console.log(`Taken ${qtyToTake} from batch with expiry date ${currentBatch.expiry_date}`);
                    if (orderQty === 0) {
                        break;
                    }
                // }
            }
            for (let entry of usedEntries) {
                
                let InvoiceDetail = await InvoiceDetailModel.create({
                    invoice_id:Invoice.id,
                    item_id: items[i].item_id,
                    item_uom_id:items[i].uom,
                    size: items[i].size,
                    color: items[i].color,
                    item_uom_id: 0,
                    discount_id: 0,
                    is_free :is_free,
                    is_item_poi : 0,
                    promotion_id : 0,
                    item_qty: entry.qty,
                    ship_quantity: items[i].ship_quantity,
                    item_weight: 0,
                    total_pallet: 0,
                    total_pallet_volume: 0,
                    item_price:  items[i].price,
                    item_gross : items[i].price,
                    item_discount_amount : items[i].discount,
                    item_net : items[i].net,
                    item_vat: items[i].vat,
                    item_excise: items[i].excise,
                    item_grand_total : items[i].total,
                    ptr_di :items[i].ptr_di,
                    taxa_ble :items[i].taxa_ble,
                    discounttype :items[i].discounttype,
                    cgst :items[i].cgst,
                    cgst_amount :items[i].sgst,
                    sgst :items[i].sgst,
                    sgst_amount :items[i].sgst_amount,
                    igst :items[i].igst,
                    igst_amount :items[i].igst_amount,
                    itemtype : detail.type != 'sales order' ? items[i].itemtype : '',      
                    landed_cost_per_unit : detail.type != 'sales order' ? items[i].landed_cost_per_unit : '',       
                    // expiry_delivery_date : detail.type != 'sales order' ? items[i].expiry_delivery_date : '',       
                    expiry_delivery_date : entry.expiry_date,       
                    receiving_site : entry.batch_number,       
                    // receiving_site : detail.type != 'sales order' ? items[i].receiving_site : '',       
                    purchase_cost_per_unit : detail.type != 'sales order' ? items[i].purchase_cost_per_unit : '',       
                    hsn_code : hsn_code,
                    // hsn_code : detail.type != 'sales order' ? items[i].hsn_code : '',
                    rate: items[i].price
                });
                if(detail.type == 'sales order'){
                    if(item_stoke.stock != 0 || item_stoke.stock >= InvoiceDetail.item_qty){
                        let stoke_final = parseInt(item_stoke.stock) - parseInt(InvoiceDetail.item_qty); 
                        await itemModel.update({ stock: stoke_final }, { where: { id: items[i].item_id } });

                        let inventory = await InventoryMovementModel.create({
                            item_id: items[i].item_id,
                            tranno: id,
                            trantype: 'Sales',
                            trandate: delivery_date,
                            tranqty: items[i].quantity,
                            trancstock: stoke_final,
                        })  
                    }
                }
                let orderDetail = detail.order_details.find(detail => detail.item_id === items[i].item_id);
            if (orderDetail && orderDetail.item_qty !== InvoiceDetail.item_qty) {
                allQuantitiesMatch = false;
            }
            await BatchModel.update(
                { qty: entry.final_qty }, 
                {
                    where: {
                        id:entry.id,
                        
                    }
                }
            );
            }
            console.log('Used Entries:', usedEntries);
            // console.log('Remaining Batches:', batch);
            // else{
            //     // if(item_stoke.stock != 0 || item_stoke.stock >= InvoiceDetail.item_qty){
            //         let stoke_final = parseInt(item_stoke.stock) + parseInt(InvoiceDetail.item_qty); 
            //         await itemModel.update({ stock: stoke_final }, { where: { id: items[i].item_id } });

            //         let inventory = await InventoryMovementModel.create({
            //             item_id: items[i].item_id,
            //             tranno: id,
            //             trantype: 'Purchase',
            //             trandate: delivery_date,
            //             tranqty: items[i].quantity,
            //             trancstock: stoke_final,
                        
            //         })
            //     // }
            // }
            
            

            // let orderDetail = detail.order_details.find(detail => detail.item_id === items[i].item_id);
            // // If the quantities don't match, set the flag to false
            // if (orderDetail && orderDetail.item_qty !== InvoiceDetail.item_qty) {
            //     allQuantitiesMatch = false;
            // }
        }
        if (allQuantitiesMatch) {
            let upd = await OrderModel.update({ status: 'Close' }, { where: { id: id } });
        }
        // const details = await InvoiceModel.findOne({
        //     include: [
        //         {
        //             model: UserModel,
        //             as: 'salesman',
        //             attributes: ['firstname', 'lastname', 'email'],
        //             include: [
        //                 {
        //                     model: SalesmanInfo,
        //                     as: 'salesmanInfo',
        //                     attributes: ['salesman_code'] // Example attributes
        //                 }
        //             ]

        //         },
        //         {
        //             model: UserModel,
        //             as: 'customer',
        //             attributes: ['firstname', 'lastname', 'email'],
        //             include: [
        //                 {
        //                     model: CustomerInfo,
        //                     as: 'customerInfo',
        //                     attributes: ['customer_code'] // Example attributes
        //                 }
        //             ]
        //         },
        //         {
        //             model: InvoiceDetailModel,
        //             as: 'invoice_details',
        //             include: [
        //                 {
        //                     model: itemModel,
        //                     as: 'itemModel',
        //                 },
        //             ]
        //             // attributes: ['firstname', 'lastname', 'email'],
        //         },
        //         {
        //             model: paymentTermsModel,
        //             as: 'payment_terms',
        //             attributes: ['id', 'name'],
        //         }
        //     ],
        //     where: {
        //         id: Invoice.id
        //     }
        // });
        // const pdfFileName = createInvoicePDF(details);
        // // console.log(pdfFileName);
        // await InvoiceModel.update({ invoice_pdf: pdfFileName }, { where: { id: Invoice.id } });
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully Invoice Create', '', Invoice));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const details = async (req, res, next) => {
    const { id } = req.body;

    try {
        const detail = await InvoiceModel.findOne({
            include: [
                {
                    model: UserModel,
                    as: 'salesman' , 
                    attributes: ['firstname','lastname','email','mobile'],
                    include: [
                        {
                            model: SalesmanInfo,
                            as: 'salesmanInfo',
                            attributes: ['salesman_code'] // Example attributes
                        }
                    ]
                    
                },
                {
                    model: UserModel,
                    as: 'customer',
                    attributes: ['firstname', 'lastname', 'email','mobile',  'country_id', 'custax1'],
                    include: [
                        {
                            model: CustomerInfo,
                            as: 'customerInfo',
                            attributes: ['customer_code','customer_address_1','customer_address_2','msme_no','fssai_no','state_code'], // Example attributes
                        },
                        {
                            model: countryMastersModel,
                            as: 'country',    // The associated User model
                            attributes: ['id', 'name'],
                        }
                        
                    ]
                },
                {
                    model: InvoiceDetailModel,
                    as: 'invoice_details',
                    include: [
                        {
                            model: itemModel,
                            as: 'itemModel',
                            include: [{
                                model: itemMainPriceModel,
                                as: 'item_main_prices',
                                attributes: ['id','item_id','item_uom_id','item_price'],
                                include: [
                                    {
                                        model: itemUomModel,
                                        as: 'item_uom',
                                        attributes: ['id','code','name'],
                                    }
                                ]
                            }],
                        },
                        
                    ]
                    // attributes: ['firstname', 'lastname', 'email'],
                },
                {
                    model: paymentTermsModel,
                    as: 'payment_terms',
                    attributes: ['id','name'],
                }
            ],
            where: {
                id: id
            }
        });

        if (!detail) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found!', 'Error', ''));
        } else {
            // const invoicePdfFullPath = detail.invoice_pdf
            //     ? base_url + path.posix.join('uploads/invoices', detail.invoice_pdf)
            //     : null;

            // // Add the full path to the detail object
            // const responseDetail = {
            //     ...detail.toJSON(), // Convert Sequelize instance to a plain object
            //     invoice_pdf: invoicePdfFullPath
            // };
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Order retrive successfully!', '',detail ));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
// const UpdateInvoice = async (req, res, next) => {
//     const {
//         id,
//         // customer_id,
//         customer_lob,
//         // salesman_id,
//         customer_lpo,
//         // order_number,
//         delivery_date,
//         payment_terms,
//         due_date,
//         discount,
//         net,
//         excise,
//         vat,
//         total,
//         status,
//         order_type,
//         items,
//      } = req.body;

//     try {
//         const detail = await InvoiceModel.findOne({
//             include: [
//                 {
//                     model: InvoiceDetailModel,
//                     as: 'invoice_details',
//                     // attributes: ['firstname', 'lastname', 'email'],
//                 },
//             ],
//             where: {
//                 id: id
//             }
//         });
//         codesettingupdate('order');
//         let Order = await InvoiceModel.update({
//             where: {
//                 id: id
//             },
//             // customer_id:customer_id,
//             customer_lob:customer_lob,
//             // salesman_id:salesman_id,
//             customer_lpo:customer_lpo,
//             // order_number:order_number,
//             delivery_date:delivery_date,
//             payment_terms:payment_terms,
//             due_date:due_date,
//             total_discount_amount:discount,
//             total_net:net,
//             total_vat:vat,
//             total_excise:excise,
//             grand_total:total,
//             status:status,
//             order_type:order_type,
//         })


//         for(var i = 0; i < items.length; i++){
//             let OrderDetail = await InvoiceDetailModel.create({
//                 order_id:Order.id,
//                 item_id: items[i].item_id,
//                 item_uom_id: 0,
//                 discount_id: 0,
//                 is_free : 0,
//                 is_item_poi : 0,
//                 promotion_id : 0,
//                 item_qty: items[i].quantity,
//                 item_weight: 0,
//                 total_pallet: 0,
//                 total_pallet_volume: 0,
//                 item_price: 0,
//                 item_gross : items[i].price,
//                 item_discount_amount : items[i].discount,
//                 item_net : items[i].net,
//                 item_vat: items[i].vat,
//                 item_excise: items[i].excise,
//                 item_grand_total : items[i].total,
//                 delivered_qty : 0,
//                 open_qty :0,
//                 order_status: 'Pending',       
//             })
//         }

//         res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully Add Order', '', Order));
//     } catch (error) {
//         res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
//     }
// }
const UpdateInvoice = async (req, res, next) => {
    const {
        id,
        customer_lob,
        customer_lpo,
        delivery_date,
        payment_terms,
        due_date,
        discount,
        net,
        excise,
        vat,
        total,
        status,
        order_type,
        items,
    } = req.body;

    try {
        // Find the existing order and its details
        const detail = await InvoiceModel.findOne({
            include: [
                {
                    model: InvoiceDetailModel,
                    as: 'invoice_details',
                },
            ],
            where: {
                id: id
            }
        });

        if (!detail) {
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Order not found', 'Error'));
        }

        // Update the order details
        await InvoiceModel.update({
            customer_lob: customer_lob,
            customer_lpo: customer_lpo,
            delivery_date: delivery_date,
            payment_term_id:payment_terms,
            due_date: due_date,
            total_discount_amount: discount,
            total_net: net,
            total_vat: vat,
            total_excise: excise,
            grand_total: total,
            status: status,
            order_type: order_type,
        }, {
            where: {
                id: id
            }
        });

        // Process each item in the order
        for (let i = 0; i < items.length; i++) {
            const existingItem = detail.invoice_details.find(orderDetail => orderDetail.item_id === items[i].item_id && items[i].invoice_details_id == orderDetail.id);
            let item_stoke=await itemModel.findOne({
                where: {
                    id: items[i].item_id
                }
            });
            let expiry_delivery_date = item_stoke.exp_date;      
            let receiving_site =item_stoke.batch_no;                 
            let hsn_code = item_stoke.short_code;

            if(detail.type == 'purchase order'){
                expiry_delivery_date = items[i].expiry_delivery_date;
                receiving_site=items[i].receiving_site;
                hsn_code=items[i].hsn_code;
            }
            if (existingItem) {
                // If the item already exists, update the quantity and other details
                await InvoiceDetailModel.update({
                    item_qty:  parseFloat(existingItem.item_qty),
                    item_uom_id:items[i].uom,
                    ship_quantity:  parseFloat(existingItem.ship_quantity),
                    item_gross: items[i].price,
                    item_price: items[i].price,
                    item_discount_amount: items[i].discount,
                    item_net: items[i].net,
                    item_vat: items[i].vat,
                    item_excise: items[i].excise,
                    item_grand_total: items[i].total,
                    taxa_ble :items[i].taxa_ble,
                    discounttype :items[i].discounttype,
                    rate: items[i].rate,
                    expiry_delivery_date : expiry_delivery_date,
                    receiving_site : receiving_site,
                    hsn_code : hsn_code,
                }, {
                    where: {
                        id: existingItem.id
                    }
                });
            } else {
                // If the item does not exist, create a new order detail
                await InvoiceDetailModel.create({
                    order_id: id,
                    item_uom_id:items[i].uom,
                    item_id: items[i].item_id,
                    size: items[i].size,
                    color: items[i].color,
                    item_uom_id: 0,
                    discount_id: 0,
                    is_free: 0,
                    is_item_poi: 0,
                    promotion_id: 0,
                    item_qty: items[i].quantity,
                    ship_quantity: items[i].ship_quantity,
                    item_weight: 0,
                    total_pallet: 0,
                    total_pallet_volume: 0,
                    item_price: items[i].price,
                    item_gross: items[i].price,
                    discounttype: items[i].discounttype,
                    item_discount_amount: items[i].discount,
                    item_net: items[i].net,
                    item_vat: items[i].vat,
                    item_excise: items[i].excise,
                    item_grand_total: items[i].total,
                    rate: items[i].rate,
                    expiry_delivery_date : expiry_delivery_date,
                    receiving_site : receiving_site,
                    hsn_code : hsn_code,
                });
            }
        }

        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully updated Order', '', detail));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const delete_invoice = async (req, res, next) => {
    const { id } = req.body;

    try {
        // Attempt to soft delete the order
        const deletedCount = await InvoiceModel.destroy({
            where: {
                id: id
            }
        });

        if (deletedCount === 0) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Order deleted successfully (soft delete)!', '', { deletedCount }));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
};
// function createInvoicePDF(invoiceData) {
//     // Validate invoiceData
//     if (!invoiceData || !invoiceData.invoice_details) {
//         throw new Error('Invalid invoice data');
//     }

//     const fileName = `invoice_${crypto.randomBytes(4).toString('hex')}.pdf`;
//     const filePath = path.join(__dirname, '../../public/uploads/invoices', fileName);
//     const doc = new PDFDocument({ margin: 50 });

//     doc.pipe(fs.createWriteStream(filePath));

//     // Header
//     doc.fontSize(25).text('Valansa Lifescience', { align: 'center' });
//     doc.moveDown(1.5);

//     // Invoice details (on the same row)
//     const invoiceNumber = `Invoice Number: ${invoiceData.invoice_number || 'N/A'}`;
//     const invoiceDate = `Date: ${invoiceData.invoice_date || 'N/A'}`;
//     doc.fontSize(12).text(invoiceNumber, { align: 'left' })
//        .text(invoiceDate, { align: 'right' });
//     doc.moveDown(2);

//     // Customer and Salesman details (on the same row)
//     const customer = `Customer: ${invoiceData.customer || 'N/A'}`;
//     const salesman = `Salesman: ${invoiceData.salesman || 'N/A'}`;
//     doc.fontSize(12).text(customer, { align: 'left' })
//        .text(salesman, { align: 'right' });
//     doc.moveDown(1.5);

//     // Table Headers
//     const tableTop = doc.y;
//     const itemHeader = [
//         { text: 'ITEM CODE', width: 80 },
//         { text: 'ITEM NAME', width: 100 },
//         { text: 'UOM', width: 50, align: 'center' },
//         { text: 'Quantity', width: 60, align: 'center' },
//         { text: 'Price', width: 60, align: 'center' },
//         { text: 'Excise', width: 60, align: 'center' },
//         { text: 'Discount', width: 60, align: 'center' },
//         { text: 'Net', width: 60, align: 'center' },
//         { text: 'VAT', width: 60, align: 'center' },
//         { text: 'Total', width: 60, align: 'center' }
//     ];

//     // itemHeader.forEach(header => {
//     //     doc.fontSize(10).text(header.text, doc.x, tableTop, { width: header.width, align: header.align || 'left' });
//     //     doc.moveUp();
//     //     doc.translate(header.width);
//     // });
//     // doc.moveDown();

//     // // Table content
//     // invoiceData.invoice_details.forEach(item => {
//     //     const itemRow = [
//     //         { text: item.itemModel ? item.itemModel.item_code || 'N/A' : 'N/A', width: 80 },
//     //         { text: item.itemModel ? item.itemModel.item_name || 'N/A' : 'N/A', width: 100 },
//     //         { text: 'UOM', width: 50, align: 'center' },
//     //         { text: item.item_qty ? item.item_qty.toString() : '0', width: 60, align: 'center' },
//     //         { text: item.item_price ? item.item_price.toString() : '0', width: 60, align: 'center' },
//     //         { text: item.item_excise ? item.item_excise.toString() : '0', width: 60, align: 'center' },
//     //         { text: item.item_discount_amount ? item.item_discount_amount.toString() : '0', width: 60, align: 'center' },
//     //         { text: item.item_net ? item.item_net.toString() : '0', width: 60, align: 'center' },
//     //         { text: item.item_vat ? item.item_vat.toString() : '0', width: 60, align: 'center' },
//     //         { text: item.item_grand_total ? item.item_grand_total.toString() : '0', width: 60, align: 'center' }
//     //     ];

//     //     itemRow.forEach(col => {
//     //         doc.fontSize(10).text(col.text, doc.x, doc.y, { width: col.width, align: col.align || 'left' });
//     //         doc.moveUp();
//     //         doc.translate(col.width);
//     //     });
//     //     doc.moveDown();
//     // });

//     // // Add totals
//     // doc.moveDown(2);
//     // doc.fontSize(12).text(`Discount: ${invoiceData.total_discount_amount || '0'}`, { align: 'right' });
//     // doc.text(`Net Total: ${invoiceData.total_net || '0'}`, { align: 'right' });
//     // doc.text(`Excise: ${invoiceData.total_excise || '0'}`, { align: 'right' });
//     // doc.text(`VAT: ${invoiceData.total_vat || '0'}`, { align: 'right' });
//     // doc.text(`Grand Total: ${invoiceData.grand_total || '0'}`, { align: 'right' });

//     // Finalize PDF and return the file name
//     doc.end();
//     return fileName;
// }



function createInvoicePDF(invoiceData) {
    // Validate invoiceData
    if (!invoiceData || !invoiceData.invoice_details) {
        throw new Error('Invalid invoice data');
    }

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    let pdfBuffer;

    // Collect the PDF data in buffers
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        pdfBuffer = Buffer.concat(buffers);
    });

    // Header
    doc.fontSize(25).text('Valansa Lifescience', { align: 'center' });
    doc.moveDown(1.5);

    // Invoice details (on the same row)
    const invoiceNumber = `Invoice Number: ${invoiceData.invoice_number || 'N/A'}`;
    const invoiceDate = `Date: ${invoiceData.invoice_date || 'N/A'}`;
    doc.fontSize(12).text(invoiceNumber, { align: 'left' })
        .text(invoiceDate, { align: 'right' });
    doc.moveDown(2);

    // Customer and Salesman details (on the same row)
    const customer = `Customer: ${invoiceData.customer || 'N/A'}`;
    const salesman = `Salesman: ${invoiceData.salesman || 'N/A'}`;
    doc.fontSize(12).text(customer, { align: 'left' })
        .text(salesman, { align: 'right' });
    doc.moveDown(1.5);

    // (Optional) Add the table headers, content, and totals here

    // Finalize PDF
    doc.end();

    // Wait for the PDF to be fully generated
    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            // Convert the buffer to a base64 string and create a data URL
            const base64 = pdfBuffer.toString('base64');
            const dataUrl = `data:application/pdf;base64,${base64}`;
            resolve(dataUrl);
        });

        doc.on('error', reject);
    });

    
}

// Usage example

const html_re = async (req, res, next) => {
    const {
        id,
     } = req.body;

    try {
        const invoice_data =await InvoiceModel.findOne({
            include: [
                {
                    model: UserModel,
                    as: 'salesman',
                    attributes: ['firstname', 'lastname', 'email'],
                    include: [
                        {
                            model: SalesmanInfo,
                            as: 'salesmanInfo',
                            attributes: ['salesman_code'] // Example attributes
                        }
                    ]

                },
                {
                    model: UserModel,
                    as: 'customer',
                    attributes: ['firstname', 'lastname', 'email'],
                    include: [
                        {
                            model: CustomerInfo,
                            as: 'customerInfo',
                            attributes: ['customer_code'] // Example attributes
                        }
                    ]
                },
                {
                    model: InvoiceDetailModel,
                    as: 'invoice_details',
                    include: [
                        {
                            model: itemModel,
                            as: 'itemModel',
                        },
                    ]
                    // attributes: ['firstname', 'lastname', 'email'],
                },
                {
                    model: paymentTermsModel,
                    as: 'payment_terms',
                    attributes: ['id', 'name'],
                }
            ],
            where: {
                id: id
            }
        });
        let invoiceDetailsRows = '';
        invoice_data.invoice_details.forEach((detail, index) => {
            invoiceDetailsRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${detail.itemModel.item_name}</td>
                    <td>${detail.item_qty}</td>
                    <td>${detail.item_price}</td>
                    <td>${detail.item_discount_amount}</td>
                    <td>${detail.item_net}</td>
                    <td>${detail.item_vat}</td>
                    <td>${detail.item_excise}</td>
                    <td>${detail.item_grand_total}</td>
                </tr>
            `;
        });
        let invoiceRows = '';
        invoiceRows += `
                <td colspan="12">
                    <strong>Total:</strong> ₹${invoice_data.grand_total}<br>
                    <!-- <strong>CGST:</strong> ₹103.73<br>
                    <strong>SGST:</strong> ₹103.73<br> -->
                    <strong>Net Amount:</strong> ₹${invoice_data.total_net}<br>
                </td>
                    
            `;
        let date = '';
        
        let cur_date = new Date();

let formatted_date = `${cur_date.getDate()}/${cur_date.getMonth() + 1}/${cur_date.getFullYear()}`;

        date += `
                Date: ${formatted_date}
                    
            `;
        const details = `
      <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px !important;
            padding: 0  !important;
            box-sizing: border-box  !important;
            font-size: '2px !important';
            width:"100%";
        }
    </style>
</head>

<body>
    <table style="font-size:10px;">
        <tr class="header">
            <td style="width: 33.33%;">
                <strong>MEDISPAN PHARMACEUTICAL</strong><br>
                K-113, OKHLA, NEW DELHI-25<br>
                Tel No.: 9971768821<br>
                MSME NO: 08-0047457<br>
                GST No.: 07ABWFM5189R1ZV<br>
                FASSAI No.: 13323010000214<br>
                E-mail: medisppharmaceutical@gmail.com<br>
            </td>
            <td style="width: 33.33%; text-align: center;">
                <strong>AHMED GASTRO-LIVER & DENTAL CLINIC</strong><br>
                A-2/4, RAFI COMPLEX, NEAR OKHLA METRO STATION<br>
                ABUL FAZAL EBC-1, JAMIA NAGAR, OKHLA, NEW DELHI<br>
                Tel No.: 9319188872<br>
            </td>
            <td style="width: 33.33%; text-align: right;">
                <strong>Invoice No.: ${invoice_data.invoice_number}</strong><br>
                Invoice Date: ${invoice_data.invoice_date}<br>
            </td>
        </tr>
    </table>

    <table>
        <tr class="heading">
            <th>Sr.</th>
            <th>Item Name</th>
            <th>QTY</th>
            <th>Price</th>
            <!-- <th>Amount</th> -->
            <th>Discount Amount</th>
            <th>Net</th>
            <th>Vat</th>
            <th>Excise</th>
            <th>Grand Total</th>
        </tr>
         ${invoiceDetailsRows}
    </table>

    <table>
        <tr class="footer">
            <td colspan="4">
                <strong>Bank Details</strong><br>
                Bank Name: STATE BANK OF INDIA<br>
                Account No.: 4266379126<br>
                IFSC Code: SBIN0011483<br>
            </td>

            ${invoiceRows}


        </tr>
        <tr class="footer">
            <td colspan="16" style="text-align: left;">
                Received by:<br>

               ${date}


            </td>
        </tr>
    </table>
</body>

</html`
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully Invoice Create', '', details));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const invoice_insert = async (req, res, next) => {
    const {
        // id,
        customer_id,
        salesman_id,
        bank_name,
        type,
        subtotal,
        discountAmount,
        total,
        discountType,
        selectedItems,
     } = req.body;

    try {
        
        let getinvoiceNumber = await codesettingGet('invoice');
        codesettingupdate('invoice');

        let Invoice = await InvoiceModel.create({
            customer_id:customer_id,
            salesman_id:salesman_id,
            total_discounttype:discountType,
            total_discount_amount:discountAmount,
            bank_name:bank_name,
            type:type,
            total_net:subtotal,
            grand_total:total,
        })
        for (var i = 0; i < selectedItems.length; i++) {
            let is_free = 0;
            if (selectedItems[i].skim == "Free") {
                is_free = 1;
            }
            let OrderDetail = await InvoiceDetailModel.create({
                invoice_id: Invoice.id,
                item_id: selectedItems[i].id,
                item_qty: selectedItems[i].qty,
                item_price: selectedItems[i].price,
                
                item_grand_total: selectedItems[i].finalTotalItem,
                discounttype: selectedItems[i].discountTypeItem,
                item_discount_amount: selectedItems[i].discountValueItem,
                item_salesman_id: selectedItems[i].salesman_item_id,
            })
        }
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully Invoice Create', '', Invoice));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
// const invoice_insert = async (req, res, next) => {
//     const {
//         // id,
//         customer_id,
//         salesman_id,
//         bank_name,
//         total_discounttype,
//         total_discount_amount,
//         final_net,
//         // discount,
//         net,
//         excise,
//         vat,
//         total,
//         type,
//         items,
//      } = req.body;

//     try {
        

//         let getinvoiceNumber = await codesettingGet('invoice');
//         codesettingupdate('invoice');


//         let Invoice = await InvoiceModel.create({
//             // order_id: id,
//             customer_id:customer_id,
//             salesman_id:salesman_id,
//             total_discounttype:total_discounttype,
//             total_discount_amount:total_discount_amount,
//             bank_name:bank_name,
//             type:type,
//             total_net:final_net,
//             // discount:discount,
//             total_net:net,
//             total_excise:excise,
//             total_vat:vat,
//             grand_total:total,
//         })

//         // const detail = await OrderModel.findOne({
//         //     include: [    
//         //         {
//         //             model: OrderDetailModel,
//         //             as: 'order_details',
//         //             // attributes: ['firstname', 'lastname', 'email'],
//         //         },
//         //     ],
//         //     where: {
//         //         id: id
//         //     }
//         // });

//         for (var i = 0; i < items.length; i++) {
//             let is_free = 0;
//             if (items[i].skim == "Free") {
//                 is_free = 1;
//             }

//             // let item_stoke=await itemModel.findOne({
//             //     where: {
//             //         id: items[i].item_id
//             //     }
//             // });

//             let OrderDetail = await InvoiceDetailModel.create({
//                 invoice_id: Invoice.id,
//                 item_id: items[i].item_id,
//                 item_salesman_id: items[i].item_salesman_id,
//                 size: items[i].size,
//                 color: items[i].color,
//                 item_uom_id: items[i].uom,
//                 discount_id: 0,
//                 is_free: is_free,
//                 is_item_poi: 0,
//                 promotion_id: 0,
//                 item_qty: items[i].quantity,
//                 item_weight: 0,
//                 total_pallet: 0,
//                 total_pallet_volume: 0,
//                 item_price: items[i].price,
//                 item_gross: items[i].price,
//                 item_discount_amount: items[i].discount,
//                 item_net: items[i].net,
//                 item_vat: items[i].vat,
//                 item_excise: items[i].excise,
//                 item_grand_total: items[i].total,
//                 delivered_qty: 0,
//                 open_qty: 0,
//                 order_status: 'Pending',
//                 ptr_di: items[i].ptr_di,
//                 taxa_ble: items[i].taxa_ble,
//                 cgst: items[i].cgst,
//                 cgst_amount: items[i].sgst,
//                 sgst: items[i].sgst,
//                 sgst_amount: items[i].sgst_amount,
//                 igst: items[i].igst,
//                 igst_amount: items[i].igst_amount,
//                 discounttype: items[i].discounttype,
//                 // expiry_delivery_date : item_stoke.exp_date,
//                 // receiving_site : item_stoke.batch_no,
//                 // hsn_code : item_stoke.short_code,
//             })
//         }
//         res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully Invoice Create', '', Invoice));
//     } catch (error) {
//         res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
//     }
// }
module.exports = {

    list,
    store,
    UpdateInvoice,
    details,
    delete_invoice,
    html_re,
    invoice_insert
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where, FLOAT } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const OrderModel = db.order;
const OrderDetailModel = db.order_details;
const InvoiceDetailModel = db.invoice_details;
const UserModel = db.user_master;
const CustomerInfo = db.customer_info;
const SalesmanInfo = db.salesman_info;
const itemModel = db.item_master;
const invoiceModel = db.invoice;
const paymentTermsModel = db.payment_terms;
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const countryMastersModel = db.country_masters;
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const { codesettingupdate } = require('../utils/handler');

require('dotenv').config();
const paths = require('path');
const base_url = process.env.BASE_URL;



const list = async (req, res, next) => {
    const { page, name, customer_id, startDate, export_type, endDate, orderType, export_file, limit = 10, ReportType } = req.body;

    // try {
    let searchQuery = [];

    // Initialize the array to hold individual conditions
    let conditions = [];

    if (customer_id) {
        conditions.push({
            customer_id: { [Op.eq]: customer_id }
        });
    }

    if (ReportType == 'invoice') {

    } else {
        if (orderType) {
            conditions.push({
                type: { [Op.eq]: orderType }
            });
        }
    }

    let endDates = new Date(new Date(endDate).setHours(23, 59, 59, 999));
    if (ReportType == 'invoice') {
        if (startDate != "" && endDate != "") {
            conditions.push({
                invoice_date: {
                    [Op.between]: [startDate, endDates]
                }
            });
        }
    } else {
        if (startDate != "" && endDate != "") {
            conditions.push({
                order_date: {
                    [Op.between]: [startDate, endDates]
                }
            });
        }
    }


    if (conditions.length > 0) {
        searchQuery = { [Op.and]: conditions };
    }


    const currentPage = page ? parseInt(page) : 1;
    const limits = parseInt(limit);
    const offset = (currentPage - 1) * limits;
    let totalRecords = 0;
    if (ReportType == 'invoice') {
        totalRecords = await OrderModel.count();
    } else {
        totalRecords = await invoiceModel.count();
    }

    let reportRes = []
    if (ReportType == 'invoice') {
        reportRes = await InvoiceDetailModel.findAll({
            include: [
                {
                    model: invoiceModel,
                    where: searchQuery,
                    as: 'invoiceModel', // Assuming 'order' is the alias for OrderModel
                    attributes: ['id', 'invoice_number', 'invoice_date', 'customer_id'], // Include minimal attributes from the OrderModel if needed
                    include: [
                        {
                            model: UserModel,
                            as: 'salesman',
                            attributes: ['firstname', 'lastname', 'email', 'id'],
                            include: [
                                {
                                    model: SalesmanInfo,
                                    as: 'salesmanInfo',
                                    attributes: ['salesman_code', 'user_id']
                                }
                            ]
                        },
                        {
                            model: UserModel,
                            as: 'customer',
                            attributes: ['firstname', 'lastname', 'email', 'id'],
                            include: [
                                {
                                    model: CustomerInfo,
                                    as: 'customerInfo',
                                    attributes: ['customer_code', 'user_id']
                                }
                            ]
                        },
                        {
                            model: OrderModel,
                            as: 'orderModel',
                            attributes: ['order_number', 'order_type', 'type'],
                            where: orderType ? { type: { [Op.eq]: orderType } } : null
                        },
                    ]
                },
                {
                    model: itemModel,
                    as: 'itemModel',
                },
            ],

            order: [['id', 'DESC']],
        });
    } else {
        reportRes = await OrderDetailModel.findAll({
            include: [
                {
                    model: OrderModel,
                    where: searchQuery,
                    as: 'orderModel', // Assuming 'order' is the alias for OrderModel
                    attributes: ['id', 'order_number', 'type', 'order_date', 'customer_id'], // Include minimal attributes from the OrderModel if needed
                    include: [
                        {
                            model: UserModel,
                            as: 'salesman',
                            attributes: ['firstname', 'lastname', 'email', 'id'],
                            include: [
                                {
                                    model: SalesmanInfo,
                                    as: 'salesmanInfo',
                                    attributes: ['salesman_code', 'user_id']
                                }
                            ]
                        },
                        {
                            model: UserModel,
                            as: 'customer',
                            attributes: ['firstname', 'lastname', 'email', 'id'],
                            include: [
                                {
                                    model: CustomerInfo,
                                    as: 'customerInfo',
                                    attributes: ['customer_code', 'user_id']
                                }
                            ]
                        },
                        {
                            model: invoiceModel,
                            as: 'invoice',
                            attributes: ['invoice_number'],
                            required: false
                        },
                    ]
                },
                {
                    model: itemModel,
                    as: 'itemModel',
                    // attributes: ['firstname', 'lastname', 'email', 'id'],
                    // include: [
                    //     {
                    //         model: CustomerInfo,
                    //         as: 'customerInfo',
                    //         attributes: ['customer_code', 'user_id']
                    //     }
                    // ]
                },
            ],

            order: [['id', 'DESC']],
        });
    }

    if (!reportRes) {
        res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
    }
    // console.log("Base URL:", process.env.BASE_URL);
    const totalPages = Math.ceil(totalRecords / limits);

    const pagination = {
        records: reportRes,
        currentPage: currentPage,
        pageSize: limits,
        totalRecords: totalRecords,
        totalPages: totalPages
    };


    if (export_file == 1) {
        const data = [
            [
                'Date',
                'Order Number',
                'Order Type',
                'Customer Name',
                'Salesman Name',
                'Invoice Number',
                'Product Description',
                'HSN code',
                'Batch No',
                'Expiry Date',
                'Sales Qty',
                'Qty Desc',
                'Rate',
                'Item Net',
                'PTR',
                'Gross Amount',
            ],
        ];
        let format; // Change to 'csv' or 'pdf' as needed
        let file_url;
        if (ReportType == 'invoice') {

            reportRes.forEach(order => {
                const row = [
                    // order.invoiceModel.invoice_date,                 // Adjust these to your actual data structure
                    // order.invoiceModel.orderModel.order_number,
                    // order.invoiceModel.orderModel.type,
                    // order.invoiceModel.customer.customerInfo.customer_code + '-' + order.invoiceModel.customer.firstname,
                    // order.invoiceModel.salesman.salesmanInfo.salesman_code + '-' + order.invoiceModel.salesman.firstname + ' ' + order.invoiceModel.salesman.lastname,
                    // order.invoiceModel.invoice_number,
                    // order.itemModel.item_name,
                    // order.hsn_code,
                    // order.receiving_site,
                    // order.expiry_delivery_date,
                    // order.is_free == 1 ? "0.00" : order.item_qty,
                    // order.is_free == 1 ? order.item_qty : order.item_discount_amount,
                    // order.item_price,
                    // order.item_net,
                    // order.itemModel.rate,
                    // order.item_grand_total,

                    order.invoiceModel?.invoice_date || "N/A", // Fallback to "N/A" if null or undefined
                    order.invoiceModel?.orderModel?.order_number || "N/A",
                    order.invoiceModel?.orderModel?.type || "N/A",
                    (order.invoiceModel?.customer?.customerInfo?.customer_code || "N/A") + '-' + (order.invoiceModel?.customer?.firstname || "N/A"),
                    (order.invoiceModel?.salesman?.salesmanInfo?.salesman_code || "N/A") + '-' +
                    (order.invoiceModel?.salesman?.firstname || "N/A") + ' ' + (order.invoiceModel?.salesman?.lastname || "N/A"),
                    order.invoiceModel?.invoice_number || "N/A",
                    order.itemModel?.item_name || "N/A",
                    order.hsn_code || "N/A",
                    order.receiving_site || "N/A",
                    order.expiry_delivery_date || "N/A",
                    order.is_free == 1 ? "0.00" : (order.item_qty || "N/A"),
                    order.is_free == 1 ? (order.item_qty || "N/A") : (order.item_discount_amount || "N/A"),
                    order.item_price || "0.00",
                    order.item_net || "0.00",
                    order.itemModel?.rate || "0.00",
                    order.item_grand_total || "0.00"

                ];
                data.push(row);
            });
            format = export_type; // Change to 'csv' or 'pdf' as needed
            file_url = exportData(res, format, data, ReportType);
        } else {
            reportRes.forEach(order => {
                const row = [
                    // order.orderModel.order_date,
                    // order.orderModel.order_number,
                    // order.orderModel.type,
                    // order.orderModel.customer.customerInfo.customer_code + '-' + order.orderModel.customer.firstname,
                    // order.orderModel.salesman.salesmanInfo.salesman_code + '-' + order.orderModel.salesman.firstname + ' ' + order.orderModel.salesman.lastname,
                    // order.orderModel.invoice ? order.orderModel.invoice.invoice_number : 0,
                    // order.itemModel.item_name,
                    // order.hsn_code,
                    // order.receiving_site,
                    // order.expiry_delivery_date,
                    // order.is_free == 1 ? "0.00" : order.item_qty,
                    // order.is_free == 1 ? order.item_qty : order.item_discount_amount,
                    // order.item_price,
                    // order.item_net,
                    // order.itemModel.rate,
                    // order.item_grand_total,

                    order?.orderModel?.order_date || "N/A", // Fallback if null or undefined
                    order?.orderModel?.order_number || "N/A",
                    order?.orderModel?.type || "N/A",
                    (order?.orderModel?.customer?.customerInfo?.customer_code || "N/A") + '-' + (order?.orderModel?.customer?.firstname || "N/A"),
                    (order?.orderModel?.salesman?.salesmanInfo?.salesman_code || "N/A") + '-' +
                    (order?.orderModel?.salesman?.firstname || "N/A") + ' ' + (order?.orderModel?.salesman?.lastname || "N/A"),
                    order?.orderModel?.invoice?.invoice_number || 0, // Default to 0 if invoice is not present
                    order?.itemModel?.item_name || "N/A",
                    order?.hsn_code || "N/A",
                    order?.receiving_site || "N/A",
                    order?.expiry_delivery_date || "N/A",
                    order?.is_free == 1 ? "0.00" : (order?.item_qty || "0.00"), // Default quantity to "0.00"
                    order?.is_free == 1 ? (order?.item_qty || "N/A") : (order?.item_discount_amount || "N/A"),
                    order?.item_price || "0.00",
                    order?.item_net || "0.00",
                    order?.itemModel?.rate || "0.00",
                    order?.item_grand_total || "0.00"
                ];
                data.push(row);
            });
            format = export_type; // Change to 'csv' or 'pdf' as needed
            file_url = exportData(res, format, data, ReportType);
        }

        // const format = 'xlsx'; // Change to 'csv' or 'pdf' as needed
        // const format = export_type; // Change to 'csv' or 'pdf' as needed
        // const file_url = exportData(res, format, data,'');
        // console.log(file_url);
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', file_url));
    } else {
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', pagination));
    }


    // } catch (error) {
    //     res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    // }
}



function exportData(res, format, data, report_type) {
    const fileName = generateRandomFilename(format, report_type);
    const filePath = path.join(__dirname, '..', '..', 'public', 'files', fileName); // Adjust the path as needed

    switch (format) {
        case 'xlsx':
            // Create a workbook and a worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Write to file
            XLSX.writeFile(workbook, filePath);

            // Return the file URL
            const final_file_url_ex = base_url + 'files/' + fileName
            return final_file_url_ex; // Adjust the path as needed

        case 'csv':
            // Convert to CSV format
            const csvData = data.map(row => row.join(',')).join('\n');

            // Write to file
            fs.writeFileSync(filePath, csvData);

            // Return the file URL
            const final_file_url_csv = base_url + 'files/' + fileName
            return final_file_url_csv;  // Adjust the path as needed

        case 'pdf':
            // Create a PDF document
            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(filePath);

            // Add data to the PDF
            data.forEach(row => {
                doc.text(row.join(' | ')); // Customize as needed
            });
            doc.pipe(writeStream);
            doc.end();
            writeStream.on('finish', () => {
                const final_file_url_pdf = base_url + 'files/' + fileName
                return final_file_url_pdf; // Adjust the path as needed
            });

            break;

        default:
            return res.status(400).json({ message: 'Invalid format' });
    }
}
function generateRandomFilename(extension, report_type) {
    const timestamp = Date.now(); // Get current timestamp
    const randomSuffix = Math.floor(Math.random() * 10000); // Generate a random number
    return `${report_type}_report_${timestamp}_${randomSuffix}.${extension}`; // Unique filename
}
// Example usage



module.exports = {

    list
};

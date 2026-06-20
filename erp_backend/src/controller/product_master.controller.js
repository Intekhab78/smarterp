const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const productModel = db.product_master;
const itemMajorCategoryModel = db.item_major_category;
const itemColorModel = db.item_color;
const itemSizeModel = db.size_master;
const itemDepartmentModel = db.item_department;
const familyModel = db.family_master;
const subFamilyModel = db.sub_family_master;
const brandModel = db.brand;
const TaxMasterModel = db.tax_master;
const UserModel = db.user_master;
const CustomerInfo = db.customer_info;
const itemMainPriceModel = db.item_main_price;
const itemUomModel = db.item_uom;
const countryMastersModel = db.country_masters;
const { codesettingupdate } = require('../utils/handler');

require('dotenv').config();
const paths = require('path');
const base_url = process.env.BASE_URL;



const list = async (req, res, next) => {
    const { page, limit = 10 } = req.body;

    try {
        // let searchQuery;
        // if (search) {
        //     searchQuery = {
        //         [Op.or]: [
        //             where(fn('LOWER', col('sku')), 'LIKE', `%${search.toLowerCase()}%`),
        //             where(fn('LOWER', col('item_code')), 'LIKE', `%${search.toLowerCase()}%`),
        //             where(fn('LOWER', col('category')), 'LIKE', `%${search.toLowerCase()}%`)
        //         ]
        //     };
        // } else {
        //     // Initialize the array to hold individual conditions
        //     let conditions = [];

        //     if (sku) {
        //         conditions.push(where(fn('LOWER', col('sku')), 'LIKE', `%${sku.toLowerCase()}%`));
        //     }

        //     if (item_code) {
        //         conditions.push(where(fn('LOWER', col('item_code')), 'LIKE', `%${item_code.toLowerCase()}%`));
        //     }

        //     if (category) {
        //         conditions.push(where(fn('LOWER', col('category')), 'LIKE', `%${category.toLowerCase()}%`));
        //     }

        //     // Combine all conditions into the search query
        //     if (conditions.length > 0) {
        //         searchQuery = { [Op.or]: conditions };
        //     }
        // }

        // console.log('searchQuery', searchQuery);

        const currentPage = page ? parseInt(page) : 1;
        const limits = parseInt(limit);
        const offset = (currentPage - 1) * limits;
        const totalRecords = await productModel.count();
        const festivalRes = await productModel.findAll(
            {
                include: [
                    {
                        model: itemMajorCategoryModel,
                        as: 'itemcategory',
                        //attributes: ['name'],
                    },
                    {
                        model: itemColorModel,
                        as: 'item_color',
                        //attributes: ['name'],
                    },
                    {
                        model: itemSizeModel,
                        as: 'size_master',
                        //attributes: ['name'],
                    },
                    {
                        model: itemDepartmentModel,
                        as: 'item_department',
                        //attributes: ['name'],
                    },
                    {
                        model: familyModel,
                        as: 'family_master',
                        //attributes: ['name'],
                    },
                    {
                        model: subFamilyModel,
                        as: 'sub_family_master',
                        //attributes: ['name'],
                    },
                    {
                        model: brandModel,
                        as: 'brand',
                        //attributes: ['name'],
                    },
                    {
                        model: TaxMasterModel,
                        as: 'tax_master_1',
                        //attributes: ['name'],
                    },
                    {
                        model: TaxMasterModel,
                        as: 'tax_master_2',
                        //attributes: ['name'],
                    },
                    {
                        model: TaxMasterModel,
                        as: 'tax_master_3',
                        //attributes: ['name'],
                    },
                    {
                        model: CustomerInfo,
                        as: 'customer_info',
                        // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile', 'country_id'],
                        include: [
                            {
                                model: UserModel,
                                as: 'users',
                                // attributes: ['customer_code', 'user_id', 'customer_address_1', 'customer_address_2'], // Example //attributes
    
                            }
                        ]
                    },
                    {
                        model: itemMainPriceModel,
                        as: 'item_main_prices',
                        attributes: ['id', 'item_id', 'item_uom_id', 'item_price'],
                        include: [
                            {
                                model: itemUomModel,
                                as: 'item_uom',
                                attributes: ['id', 'code', 'name'],
                            }
                        ]
                    },

                ],
                order: [['id', 'DESC']],
            },
        );

        // console.log("Base URL:", process.env.BASE_URL);
        // if (festivalRes.length > 0) {
        //     for (const item of festivalRes) {
        //         if (item.barcode && (item.barcode !== "")) {
        //             let new_url = base_url + item.barcode.replace(/^.*?([A-Za-z]:[\/\\])/g, '');
        //             let final_url = new_url.replace(/\\/g, "/");
        //             item.barcode = final_url.replace("file-read-mysql/public/", "");
        //         }
        //     }
        // }
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
        itemcatname,
        itemdesc,
        itemdesclong,
        itemdesc3,
        itemdesc4,
        itemupc,
        itemref,
        stylecode,
        colorname,
        sizename,
        departname,
        familyname,
        subfamliy,
        brandname,
        hsncode,
        itemcost,
        itemprice,
        itemlanprice,
        minstklvl,
        maxstklvl,
        itmstkmgmt,
        itmuom,
        itmwweight,
        itmwpurunit,
        itmwsalesunit,
        itmtax1code,
        itmtax2code,
        itmtax3code,
        itmcostingmet,
        suppliername,
        note1,
        note2,
        note3,
        itmdt1,
        itmdt2,
        itmexpiry,
        addedby,
        status,
    } = req.body;

    // try {
        codesettingupdate('item');
        // const newStr = req.file.path.replace('public/', '');
        let item = await productModel.create({
            itemcatname:itemcatname,
            itemdesc:itemdesc,
            itemdesclong:itemdesclong,
            itemdesc3:itemdesc3,
            itemdesc4:itemdesc4,
            itemupc:itemupc,
            itemref:itemref,
            stylecode:stylecode,
            colorname:colorname,
            sizename:sizename,
            departname:departname,
            familyname:familyname,
            subfamliy:subfamliy,
            brandname:brandname,
            hsncode:hsncode,
            itemcost:itemcost,
            itemprice:itemprice,
            itemlanprice:itemlanprice,
            minstklvl:minstklvl,
            maxstklvl:maxstklvl,
            itmstkmgmt:itmstkmgmt,
            itmuom:itmuom,
            itmwweight:itmwweight,
            itmwpurunit:itmwpurunit,
            itmwsalesunit:itmwsalesunit,
            itmtax1code:itmtax1code,
            itmtax2code:itmtax2code,
            itmtax3code:itmtax3code,
            itmcostingmet:itmcostingmet,
            suppliername:suppliername,
            note1:note1,
            note2:note2,
            note3:note3,
            itmdt1:itmdt1,
            itmdt2:itmdt2,
            itmexpiry:itmexpiry,
            addedby:addedby,
            status: status,
        })

        
                let item_main_prices = await itemMainPriceModel.create({
                    //save Main Price
                    item_id: item.id,
                    item_uom_id: itmuom,
                    // item_upc: item_main_price[i].item_upc,
                    // item_price: item_main_price[i].item_price,
                    // purchase_order_price: item_main_price[i].purchase_order_price,
                    // stock_keeping_unit: item_main_price[i].stock_keeping_unit ? 1 : 0,
                    // status: item_main_price[i].status,
                    // item_main_max_price: item_main_price[i].item_main_max_price ? 1 : 0,
                    // uom_barcode: item_main_price[i].uom_barcode,
                    // uom_cost: item_main_price[i].uom_cost,
                    // sell_enable: item_main_price[i].sell_enable ? item_main_price[i].sell_enable : 0,
                    // return_enable: item_main_price[i].return_enable ? item_main_price[i].return_enable : 0,
                    // uom_type: uom_type,
                    // uom_type
                });
         
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully Add Item', '', item));
    // } catch (error) {
    //     res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    // }
}
const details = async (req, res, next) => {
    const { id } = req.body;

    try {
       
        const festivalRes = await productModel.findOne(
            {
                include: [
                    {
                        model: itemMajorCategoryModel,
                        as: 'itemcategory',
                        attributes: ['name'],
                    },
                    {
                        model: itemColorModel,
                        as: 'item_color',
                        //attributes: ['name'],
                    },
                    {
                        model: itemSizeModel,
                        as: 'size_master',
                        //attributes: ['name'],
                    },
                    {
                        model: itemDepartmentModel,
                        as: 'item_department',
                        //attributes: ['name'],
                    },
                    {
                        model: familyModel,
                        as: 'family_master',
                        //attributes: ['name'],
                    },
                    {
                        model: subFamilyModel,
                        as: 'sub_family_master',
                        //attributes: ['name'],
                    },
                    {
                        model: brandModel,
                        as: 'brand',
                        //attributes: ['name'],
                    },
                    {
                        model: TaxMasterModel,
                        as: 'tax_master_1',
                        //attributes: ['name'],
                    },
                    {
                        model: TaxMasterModel,
                        as: 'tax_master_2',
                        //attributes: ['name'],
                    },
                    {
                        model: TaxMasterModel,
                        as: 'tax_master_3',
                        //attributes: ['name'],
                    },
                    {
                        model: CustomerInfo,
                        as: 'customer_info',
                        // attributes: ['firstname', 'lastname', 'email', 'id', 'mobile', 'country_id'],
                        include: [
                            {
                                model: UserModel,
                                as: 'users',
                                // attributes: ['customer_code', 'user_id', 'customer_address_1', 'customer_address_2'], // Example //attributes
    
                            }
                        ]
                    },
                    {
                        model: itemMainPriceModel,
                        as: 'item_main_prices',
                        attributes: ['id', 'item_id', 'item_uom_id', 'item_price'],
                        include: [
                            {
                                model: itemUomModel,
                                as: 'item_uom',
                                attributes: ['id', 'code', 'name'],
                            }
                        ]
                    },

                ],
                where: {
                    id: id
                }
            },
        );

        // console.log("Base URL:", process.env.BASE_URL);
        
        // if (festivalRes.barcode && (festivalRes.barcode !== "")) {
        //     let new_url = base_url + festivalRes.barcode.replace(/^.*?([A-Za-z]:[\/\\])/g, '');
        //     let final_url = new_url.replace(/\\/g, "/");
        //     festivalRes.barcode = final_url.replace("file-read-mysql/public/", "");
        // }

        if (!festivalRes) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        } else {
            festivalRes.item_image =base_url + festivalRes.item_image;
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', festivalRes));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const update = async (req, res, next) => {
    const {
        id,
        itemcatname,
        itemdesc,
        itemdesclong,
        itemdesc3,
        itemdesc4,
        itemupc,
        itemref,
        stylecode,
        colorname,
        sizename,
        departname,
        familyname,
        subfamliy,
        brandname,
        hsncode,
        itemcost,
        itemprice,
        itemlanprice,
        minstklvl,
        maxstklvl,
        itmstkmgmt,
        itmuom,
        itmwweight,
        itmwpurunit,
        itmwsalesunit,
        itmtax1code,
        itmtax2code,
        itmtax3code,
        itmcostingmet,
        suppliername,
        note1,
        note2,
        note3,
        itmdt1,
        itmdt2,
        itmexpiry,
        addedby,
        status,
    } = req.body;

    try {
        const detail = await productModel.findOne({
            where: {
                id: id
            }
        });

        if (!detail) {
            return res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found', 'Error'));
        }
        // codesettingupdate('item');
        // let newStr;
        // if(req.file){
        //     newStr = req.file.path.replace('public/', '');
        // }else{
        //     newStr = detail.item_image
        // }
        
        let item = await productModel.update({

            itemcatname:itemcatname,
            itemdesc:itemdesc,
            itemdesclong:itemdesclong,
            itemdesc3:itemdesc3,
            itemdesc4:itemdesc4,
            itemupc:itemupc,
            itemref:itemref,
            stylecode:stylecode,
            colorname:colorname,
            sizename:sizename,
            departname:departname,
            familyname:familyname,
            subfamliy:subfamliy,
            brandname:brandname,
            hsncode:hsncode,
            itemcost:itemcost,
            itemprice:itemprice,
            itemlanprice:itemlanprice,
            minstklvl:minstklvl,
            maxstklvl:maxstklvl,
            itmstkmgmt:itmstkmgmt,
            itmuom:itmuom,
            itmwweight:itmwweight,
            itmwpurunit:itmwpurunit,
            itmwsalesunit:itmwsalesunit,
            itmtax1code:itmtax1code,
            itmtax2code:itmtax2code,
            itmtax3code:itmtax3code,
            itmcostingmet:itmcostingmet,
            suppliername:suppliername,
            note1:note1,
            note2:note2,
            note3:note3,
            itmdt1:itmdt1,
            itmdt2:itmdt2,
            itmexpiry:itmexpiry,
            addedby:addedby,
            status: status,
        },
        {
            where: {
                id: id
            }
    })

        if (itmuom !="") {
            const deletedCount = await itemMainPriceModel.destroy({
                where: {
                    item_id: id
                }
            });
            let item_main_prices = await itemMainPriceModel.create({
                //save Main Price
                item_id:id,
                item_uom_id: itmuom,
                // item_upc: item_main_price[i].item_upc,
                // item_price: item_main_price[i].item_price,
                // purchase_order_price: item_main_price[i].purchase_order_price,
                // stock_keeping_unit: item_main_price[i].stock_keeping_unit ? 1 : 0,
                // status: item_main_price[i].status,
                // item_main_max_price: item_main_price[i].item_main_max_price ? 1 : 0,
                // uom_barcode: item_main_price[i].uom_barcode,
                // uom_cost: item_main_price[i].uom_cost,
                // sell_enable: item_main_price[i].sell_enable ? item_main_price[i].sell_enable : 0,
                // return_enable: item_main_price[i].return_enable ? item_main_price[i].return_enable : 0,
                // uom_type: uom_type,
                // uom_type
            });
        }
         
        res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully update item', '', detail));
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const delete_item = async (req, res, next) => {
    const { id } = req.body;

    try {
        // Attempt to soft delete the order
        const deletedCount = await productModel.destroy({
            where: {
                id: id
            }
        });

        if (deletedCount === 0) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Item deleted successfully (soft delete)!', '', { deletedCount }));
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
    delete_item

};

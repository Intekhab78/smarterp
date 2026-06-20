require('dotenv').config();
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const { state,country_masters } = require('../models');

const { codesettingupdate } = require('../utils/handler');

const paths = require('path');
const base_url = process.env.BASE_URL;

const list = async (req, res, next) => {
    const {
        country_id
    } = req.body;
    try {

        let payment_typeList
        if (country_id == '') {
            payment_typeList = await state.findAll({
                include: [
                    {
                        model: country_masters,
                        as: 'country',
                    },
                ],
                order: [['id', 'DESC']],
            });
        } else {
            payment_typeList = await state.findAll({
                include: [
                    {
                        model: country_masters,
                        as: 'country',
                    },
                ],
                where: {
                    country_id: country_id
                },
                order: [['id', 'DESC']],
            });
        }

        if (!payment_typeList) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'state category not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully record', '', payment_typeList));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const store = async (req, res, next) => {
    const {
        country_id,
        name,
    } = req.body;

    try {

        if (country_id == "" ||country_id == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'country id field is required', 'Error', ''));
            return;
        }
        if (name == "" ||name == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'name field is required', 'Error', ''));
            return;
        }
        let name_check = await state.count({ where: { name: name,country_id:country_id} });
        if (name_check > 0) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Name already exist', 'Error', ''));
            return;
        }
        // console.log('images', );
        let states = await state.create({
            country_id: country_id,
            name: name,
        })




        if (!states) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully added record', '', states));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}

const list_details = async (req, res, next) => {

    const { id } = req.body;
    try {

        let states = await state.findOne(
            {
                where: {
                    id: id
                },
            }
        )

        if (!states) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully show record', '', states));
        }

    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
}
const list_delete = async (req, res, next) => {

    const { id } = req.body;
    try {

        const deletedCount = await state.destroy({
            where: {
                id: id
            }
        });

        if (deletedCount === 0) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'state not found!', 'Error', ''));
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
        country_id,
    } = req.body;
    try {
        if (id == "" ||id == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'id field is required', 'Error', ''));
            return;
        }
        if (country_id == "" ||country_id == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'country id field is required', 'Error', ''));
            return;
        }
        if (name == "" ||name == null ) {
            res.status(400).json(ResponseFormatter.setResponse(false, 400, 'name field is required', 'Error', ''));
            return;
        }
        const detail = await state.findOne(
            {
                where: {
                    id: id
                },
            }
        )

        if (!detail) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } 
        if (name != detail.name) {
            let name_check = await state.count({ where: { name: name,country_id:country_id} });
            if (name_check > 0) {
                res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Name already exist', 'Error', ''));
                return;
            }
        }
        // console.log('images', );
        let states = await state.update({
            name: name,
            country_id: country_id
        }, {
            where: {
                id: id
            }
        })

        if (!states) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, 'Something went wrong!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, 'Successfully updated record', '', states));
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
    update,
};

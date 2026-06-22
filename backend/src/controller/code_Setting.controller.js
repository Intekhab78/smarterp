const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, Sequelize, fn, col, where } = require('sequelize');
const ResponseFormatter = require('../utils/ResponseFormatter');
const db = require('../models');
const CodeSettingModel = db.code_setting;
const UserModel = db.user_master;

require('dotenv').config();
const paths = require('path');
const base_url = process.env.BASE_URL;

const getNextComingCode2 = async (req, res) => {
    const { function_for } = req.body;

    let variable = function_for;

    let nextComingNumber = {
        number_is: null,
        prefix_is: null
    };

    try {
        const codeSettingCount = await CodeSettingModel.count();

        if (codeSettingCount > 0) {
            const codeSetting = await CodeSettingModel.findOne(); // Assuming CodeSetting has only one record

            if (codeSetting['is_final_update_' + variable] == 1) {
                nextComingNumber.number_is = codeSetting['next_coming_number_' + variable];
                nextComingNumber.prefix_is = codeSetting['prefix_code_' + variable];
            }
        }
        if (!nextComingNumber) {
            res.status(404).json(ResponseFormatter.setResponse(false, 404, ' not found!', 'Error', ''));
        } else {
            res.status(200).json(ResponseFormatter.setResponse(true, 200, '', '', nextComingNumber));
        }
    } catch (error) {
        res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', error.message));
    }
};

module.exports = {

    getNextComingCode2,

};

const { body, param } = require("express-validator");

const listFestival = []

const qrcodeFestival = [
    // body('user_id').trim().notEmpty().withMessage('Please enter User Id!'),
    //    body('festival_id').trim().notEmpty().withMessage('Please enter festival_id!'),
    // body('scane_respone_variable').trim().notEmpty().withMessage('Please enter Scan Response!'),
]


const memberFestivalList = [
    // body('member_id').trim().notEmpty().withMessage('Please enter Member Id!'),
]

const festival_delete = [
    // body('festival_id').trim().notEmpty().withMessage('Please enter  Id!'),
]

const festival_status_change = [
    // body('festival_id').trim().notEmpty().withMessage('Please enter  Id!'),
]

const festivalDetails = [
    // body('festival_id').trim().notEmpty().withMessage('Please enter  Id!'),
]

const memberFestivalCreate = [
    // body('user_id').trim().notEmpty().withMessage('Please enter Member Id!'),
    // body('email').trim().notEmpty().withMessage('Please enter Email'),
    // body('phone_number').trim().notEmpty().withMessage('Please enter Phone Number!'),
    // body('festival_name').trim().notEmpty().withMessage('Please enter  Name!'),
    // body('festival_position').trim().notEmpty().withMessage('Please enter  Position!'),
    // body('festival_count').trim().notEmpty().withMessage('Please enter  Count!'),
    // body('start_date').trim().notEmpty().withMessage('Please enter Start Date!'),
    // body('end_date').trim().notEmpty().withMessage('Please enter End Date!'),
]


module.exports = { listFestival, qrcodeFestival, memberFestivalList, memberFestivalCreate, festival_delete, festival_status_change, festivalDetails }
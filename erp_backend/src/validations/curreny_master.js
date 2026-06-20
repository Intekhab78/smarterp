const { body, param }  = require("express-validator");

const createCurrency = [
    // body('currency_name').trim().notEmpty().withMessage('Please enter currency name!'),
    // body('currency_code').trim().notEmpty().withMessage('Please enter currency code!').isLength({min: 3, max: 3}).withMessage('Please enter valid currency code!'),
    // body('currency_format').trim().notEmpty().withMessage('Please enter currency format!'),
]

const updateCurrency = [
    // param('id').trim().notEmpty().withMessage('Invalid currency id!'),
    // body('currency_name').trim().notEmpty().withMessage('Please enter currency name!'),
    // body('currency_code').trim().notEmpty().withMessage('Please enter currency code!').isLength({min: 3, max: 3}).withMessage('Please enter valid currency code!'),
    // body('currency_format').trim().notEmpty().withMessage('Please enter currency format!'),
]

const deleteCurrency = [
    param('id').trim().notEmpty().withMessage('Invalid currency id!')
]

module.exports = {
    createCurrency,
    updateCurrency,
    deleteCurrency
}
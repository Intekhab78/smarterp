const { body, param }  = require("express-validator");

const createCard = [
    // body('card_number').trim().notEmpty().withMessage('Please enter card number!').isNumeric().withMessage('Please enter valid card number!'),
    // body('expiry_month').trim().notEmpty().withMessage('Please enter expiry month!').isNumeric().isLength({min: 2, max: 2}).withMessage('Please enter valid expiry month!'),
    // body('expiry_year').trim().notEmpty().withMessage('Please enter expiry year!').isNumeric().isLength({min: 4, max: 4}).withMessage('Please enter valid expiry year!'),
    // body('cvv').trim().notEmpty().withMessage('Please enter cvv!').isNumeric().isLength({min: 3, max: 3}).withMessage('Please enter valid cvv!'),
    
]

const updateCard = [
    // param('id').trim().notEmpty().withMessage('Invalid currency id!'),
    // body('card_number').trim().notEmpty().withMessage('Please enter card number!').isNumeric().withMessage('Please enter valid card number!'),
    // body('expiry_month').trim().notEmpty().withMessage('Please enter expiry month!').isNumeric().isLength({min: 2, max: 2}).withMessage('Please enter valid expiry month!'),
    // body('expiry_year').trim().notEmpty().withMessage('Please enter expiry year!').isNumeric().isLength({min: 4, max: 4}).withMessage('Please enter valid expiry year!'),
    // body('cvv').trim().notEmpty().withMessage('Please enter cvv!').isNumeric().isLength({min: 3, max: 3}).withMessage('Please enter valid cvv!'),
]

const deleteCard = [
    param('id').trim().notEmpty().isNumeric().withMessage('Invalid card id!')
]

module.exports = {
    createCard,
    updateCard,
    deleteCard
}
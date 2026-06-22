const { body, param } = require("express-validator");

const cmsPage = [
    // body('page_id').trim().notEmpty().withMessage('Please enter Page Id!'),
    // body('language_id').trim().notEmpty().withMessage('Please enter Language Id!'),
]


// const calculation_price = [
//     body('price').trim().notEmpty().withMessage('Please enter Price!'),
// ]

module.exports = { cmsPage }
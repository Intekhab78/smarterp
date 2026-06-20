 const { body, param } = require("express-validator");

const addProduct = [
    // body('service_id').trim().notEmpty().withMessage('Please enter Service Id!'),
    // body('product_name').trim().notEmpty().withMessage('Please enter Product Name!'),
]

const listProduct = [
    // body('service_id').trim().notEmpty().withMessage('Please enter Service Id!'),
]

const editProduct = [
    // body('id').trim().notEmpty().withMessage('Please enter Id!'),
    // body('product_name').trim().notEmpty().withMessage('Please enter Product Name!'),
]

const deleteProduct = [
    // body('id').trim().notEmpty().withMessage('Please enter Id!'),
]

module.exports = { addProduct,listProduct,editProduct,deleteProduct }
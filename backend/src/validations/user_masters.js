const { body, param, check } = require("express-validator");

const { translate_message } = require("../utils/handler");

const register = [
  // body('fullname').trim().notEmpty().withMessage('Please enter name!'),
  // body('role').trim().notEmpty().withMessage('Please enter role!'),
  //body('role').trim().notEmpty().withMessage('Please enter role!'),
  // body('register_type').trim().notEmpty().withMessage('Please enter register type!'),
  // body('email').trim().notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!'),
  // body('password').trim().notEmpty().withMessage('Please enter password!').isLength({ min: 8 }).withMessage('Password must be atleaset 8 character long!'),
  // body('phonecode').trim().notEmpty().withMessage('Please enter phonecode!'),
  // body('phone').trim().notEmpty().withMessage('Please enter phone!'),
  // body('language_id').trim().notEmpty().withMessage('Please enter language!'),
  // body('device_token').trim().notEmpty().withMessage('Please enter device token!'),
  // body('device_type').trim().notEmpty().withMessage('Please enter device type!'),
  // body('first_name').trim(),
  // body('last_name').trim(),
  // body('birth_date').trim(),
  // body('currency_id').trim(),
  // body('gender').trim(),
];

// const login = [
//     // .isLength({ min: 8 })
//     body('email').trim().notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!'),
//     body('password').trim().notEmpty().withMessage('Please enter password!').withMessage('Password must be atleaset 8 character long!'),
// ]

// this login validation is use for when i chnage email or id login

// const login = [
//   body("email")
//     .trim()
//     .notEmpty()
//     .withMessage("Please enter email or ID!")
//     .custom((value) => {
//       const isEmail = /\S+@\S+\.\S+/.test(value); // basic email regex
//       const isNumericId = /^\d+$/.test(value); // numeric only
//       return isEmail || isNumericId;
//     })
//     .withMessage("Please enter a valid email or numeric ID!"),

//   body("password").trim().notEmpty().withMessage("Please enter password!"),
// ];

const login = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter email, ID, or name!"),

  body("password").trim().notEmpty().withMessage("Please enter password!"),
];

const update = [
  // body('first_name').trim().notEmpty().withMessage('Please enter name!'),
  // body('people_name').trim(),
  // body('email').trim().notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!'),
  // body('birth_date').trim().isDate().withMessage('Please enter valid birthdate!'),
  // body('gender').trim().isIn(['male', 'female']).withMessage('Please select gender!'),
  // body('language_id').trim(),
  // body('currency_id').trim(),
  // body('phonecode').trim(),
  // body('phone').trim().isNumeric().withMessage('Please enter valid phone number!'),
  // body('photo').trim(),
  // body('user_location').trim(),
  // body('about').trim(),
  // body('fav_countries').trim(),
  // body('fav_categories').trim(),
  // body('receive_notification').trim(),
];

const forgotPassword = [
  // body('email').trim().notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!'),
];

const restPassword = [
  // param('token').trim().notEmpty().withMessage('Invalid reset passwors link!'),
  // body('password').trim().notEmpty().withMessage('Please enter password!').isLength({ min: 8 }).withMessage('Password must be atleaset 8 character long!'),
];

const changePassword = [
  // body('old_password').trim().notEmpty().withMessage('Please enter old password!'),
  // body('new_password').trim().notEmpty().withMessage('Please enter new password!').isLength({ min: 8 }).withMessage('Password must be atleaset 8 character long!'),
];

const sendOtp = [
  // body('phonecode').trim(),
  // body('mobileno').trim().isNumeric().withMessage('Please enter valid phone number!'),
];

const WebsendOtp = [
  // body('phonecode').trim(),
  // body('mobileno').trim().isNumeric().withMessage('Please enter valid phone number!'),
  // body('email').trim().notEmpty().withMessage('Please enter email address!').isEmail().withMessage('Please enter valid email address!'),
];

const verifyOtp = [
  // body('phonecode').trim(),
  // body('mobileno').trim().isNumeric().withMessage('Please enter valid phone number!'),
  // body('otpcode').trim().notEmpty().withMessage('Please enter otp!').isLength({ min: 4, max: 4 }).withMessage('Please enter valid otp!'),
];

module.exports = {
  register,
  login,
  update,
  forgotPassword,
  restPassword,
  sendOtp,
  verifyOtp,
  changePassword,
  WebsendOtp,
};

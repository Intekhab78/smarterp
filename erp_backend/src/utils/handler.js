const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, Sequelize } = require("sequelize");
const ResponseFormatter = require("../utils/ResponseFormatter");
const db = require("../models");
const userModel = db.user_master;
const standUserModel = db.standUser;
const CodeSettingModel = db.code_setting;
// const languagevariablesModel = db.language_variables

const UserCheckStatus = async (userId, standId, type) => {
  try {
    let CustomerUser = userModel.findOne({
      where: {
        id: userId,
        deleted_at: null,
      },
    });
    return CustomerUser;
  } catch (error) {
    return false;
  }
};

const translate_message = async (message_id, language_id) => {
  // if (language_id == 1) {
  // console.log('language_id->'+language_id)
  // let languageValue = languagevariablesModel.findOne({
  //     where: {
  //         unique_id: message_id,
  //         languageid: language_id
  //     }
  // })

  return "";
};

const notificationSent = async (tokencode, notification_title, content) => {
  let user = await userModel.findOne({
    where: {
      tokencode: tokencode,
      deleted_at: null,
    },
  });

  if (!user) {
    // res.status(400).json(ResponseFormatter.setResponse(false, 400, 'User not found', 'Error', ''));
    return false;
  } else {
    var FCM = require("fcm-node");
    var serverKey =
      "AAAAXU3Qge8:APA91bEB70fLA-X99y1jXowrZ0bf0iYzha80xkbIobqsk3dvTbtQgaeu4d-TXhwOOrbKPL8ARLCL7TsHPti7AiEfFr8AYpEaPAoCbFSfsbFf5jP705ItqQlxIHJzygSxbAIS-L0ipLlB"; //put your server key here
    var fcm = new FCM(serverKey);

    var message = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: tokencode,
      collapse_key: "TEST_KEY",

      notification: {
        title: notification_title,
        body: content,
      },

      // data: {  //you can send only notification or only data(or include both)
      //     my_key: 'my value',
      //     my_another_key: 'my another value'
      // }
    };

    fcm.send(message, function (err, response) {
      if (err) {
        return err;
        // res.status(400).json(ResponseFormatter.setResponse(false, 400, 'Something went wrong!', 'Error', err));
      } else {
        // console.log("Successfully sent with response: ", response);
        // res.status(200).json(ResponseFormatter.setResponse(true, 200, 'successfully', '', response));
        return JSON.parse(response);
      }
    });
  }
};

const codesettingupdate = async (type) => {
  try {
    const getCode = await CodeSettingModel.findOne();

    const numberKey = `next_coming_number_${type}`;
    const prefixKey = `prefix_code_${type}`;

    // Retrieve the values using dynamic keys
    const nextComingNumber = getCode[numberKey];
    const prefixCode = getCode[prefixKey];

    // Split the number and increment
    let getoldNumber = nextComingNumber.split(prefixCode);
    let numner_rang = parseInt(getoldNumber[1]) + 1;
    let nexnumber = prefixCode + "" + numner_rang;

    // console.log('nexnumber', nexnumber);

    // Update the database with the new number
    const Store = await CodeSettingModel.update(
      {
        [numberKey]: nexnumber,
      },
      {
        where: {
          id: 4,
        },
      }
    );

    // if(name == 'order'){
    //     let getoldNumber = getCode.`next_coming_number_${type}`.split(getCode.prefix_code_order);
    //     let numner_rang = parseInt(getoldNumber[1])+1;
    //     let nexnumber = getCode.prefix_code_order+''+numner_rang;
    //     console.log('nexnumber', nexnumber)
    //     const Store = await CodeSettingModel.update({
    //         next_coming_number_order: nexnumber
    //     }, {
    //         where: {
    //             id: 4
    //         }
    //     })
    // }else if(name == 'invoice'){
    //     let getoldNumber = getCode.next_coming_number_invoice.split(getCode.prefix_code_invoice);
    //     let numner_rang = parseInt(getoldNumber[1])+1;
    //     let nexnumber = getCode.prefix_code_invoice+''+numner_rang
    //     const Store = await CodeSettingModel.update({
    //         next_coming_number_invoice: nexnumber
    //     }, {
    //         where: {
    //             id: 4
    //         }
    //     })
    // }else if(name == 'customer'){
    //     let getoldNumber = getCode.next_coming_number_customer.split(getCode.prefix_code_customer);
    //     let numner_rang = parseInt(getoldNumber[1])+1;
    //     let nexnumber = getCode.prefix_code_customer+''+numner_rang
    //     const Store = await CodeSettingModel.update({
    //         next_coming_number_customer: nexnumber
    //     }, {
    //         where: {
    //             id: 4
    //         }
    //     })
    // }else if(name == 'salesman'){
    //     let getoldNumber = getCode.next_coming_number_salesman.split(getCode.prefix_code_salesman);
    //     let numner_rang = parseInt(getoldNumber[1])+1;
    //     let nexnumber = getCode.prefix_code_salesman+''+numner_rang
    //     const Store = await CodeSettingModel.update({
    //         next_coming_number_salesman: nexnumber
    //     }, {
    //         where: {
    //             id: 4
    //         }
    //     })
    // }else if(name == 'item'){
    //     let getoldNumber = getCode.next_coming_number_item.split(getCode.prefix_code_item);
    //     let numner_rang = parseInt(getoldNumber[1])+1;
    //     let nexnumber = getCode.prefix_code_item+''+numner_rang
    //     const Store = await CodeSettingModel.update({
    //         next_coming_number_item: nexnumber
    //     }, {
    //         where: {
    //             id: 4
    //         }
    //     })
    // }
    return true;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};

const codesettingGet = async (type) => {
  try {
    const getCode = await CodeSettingModel.findOne();
    const numberKey = `next_coming_number_${type}`;
    const nextComingNumber = getCode[numberKey];

    return nextComingNumber;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};
module.exports = {
  UserCheckStatus,
  translate_message,
  notificationSent,
  codesettingupdate,
  codesettingGet,
};

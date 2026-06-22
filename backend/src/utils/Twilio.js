const twilio = require("twilio");

const sendMessage = async (mobileNo, message) => {
    //mobileNo, message, process.env.TWILLIO_SID,  process.env.TWILLIO_AUTH_TOKEN
    //process.env.TWILIO_FROM_NO
    // console.log(process.env.TWILIO_SID, " -->", process.env.TWILIO_AUTH_TOKEN);

    const client = new twilio('AC9deb70214f8e36fea01366d875fecf2c', '738da883871f6b7a36eb383128a06e70');

    const messageres = await client.messages
    .create({
        body: message,
        to: mobileNo, // Text this number
        from: '+12056064060', // From a valid Twilio number
    }).then((res) => {
        console.log(('suuccess', res));
    }).catch((erorr) => {
        console.log("error", erorr);
    })
    
    return messageres;
}

module.exports = {
    sendMessage
}
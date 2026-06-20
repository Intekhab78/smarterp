const twilio = require("twilio");

const sendMessage = async (mobileNo, message) => {
    //mobileNo, message, process.env.TWILLIO_SID,  process.env.TWILLIO_AUTH_TOKEN
    //process.env.TWILIO_FROM_NO
    // console.log(process.env.TWILIO_SID, " -->", process.env.TWILIO_AUTH_TOKEN);

    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

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
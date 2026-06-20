const crypto = require("crypto");

exports.generateChecksum = (payload, saltKey, saltIndex) => {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const stringToHash = base64Payload + "/pg/v1/pay" + saltKey;

  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");

  const checksum = `${sha256}###${saltIndex}`;

  return { base64Payload, checksum };
};

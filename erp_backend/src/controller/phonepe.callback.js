exports.phonepeCallback = async (req, res) => {
  try {
    console.log("📩 PhonePe Callback:", req.body);

    /*
      req.body will contain:
      - merchantTransactionId
      - transactionId
      - amount
      - state (COMPLETED / FAILED)
    */

    // 👉 Update DB payment status here

    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("ERROR");
  }
};

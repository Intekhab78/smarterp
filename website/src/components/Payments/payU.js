import axios from "axios";
import constantApi from "../../constantApi";

/**
 * Initiates PayU payment by creating hash & redirecting
 */

export const startPayUPayment = async ({
  amount,
  firstname,
  email,
  phone,
  txnid,
  source,
  onFailure,
}) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      `${constantApi.baseUrl}/payment/generate-hash`,
      {
        amount,
        firstname,
        email,
        phone,
        txnid,
        source,
      },
      {
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // send token in header
        },
      }
    );

    const payuData = res.data;
    const form = document.createElement("form");
    form.method = "POST";
    form.action = payuData.action;

    Object.keys(payuData).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = payuData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  } catch (err) {
    console.error("PayU init error:", err);
    onFailure?.(err);
  }
};

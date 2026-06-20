import axios from "axios";
import { loadRazorpayScript } from "./loadRazorpay";
import constantApi from "../../constantApi";

const RazorpayPayment = () => {
  const handlePayment = async () => {
    // 1️⃣ Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // 2️⃣ Create Order (Backend)
      const orderRes = await axios.post(
        `${constantApi.baseUrl}/razorpay/create-order`,
        {
          amount: 200, // ₹500
        }
      );

      const { order } = orderRes.data;

      // 3️⃣ Razorpay Checkout Options
      const options = {
        key: "rzp_test_S2x1411zhNSZzX", // 🔴 PUBLIC KEY ONLY
        amount: order.amount,
        currency: order.currency,
        name: "JTS Technologies",
        description: "Test Payment",
        order_id: order.id,

        handler: async function (response) {
          // 4️⃣ Verify Payment (Backend)
          const verifyRes = await axios.post(
            `${constantApi.baseUrl}/razorpay/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.success) {
            alert("Payment Successful 🎉");
          } else {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#0f172a",
        },
      };

      // 5️⃣ Open Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
    >
      Pay ₹200
    </button>
  );
};

export default RazorpayPayment;

import { useEffect, useState } from "react";
import { useCart } from "../CartContext/CartContext";
import { useAuth } from "../CartContext/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Swal from "sweetalert2";
import constantApi from "../constantApi";
import { startPayUPayment } from "../components/Payments/payU";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;

  // 🔒 Protect page
  useEffect(() => {
    if (!user) navigate("/cart");
    if (!cart || cart.length === 0) navigate("/cart");
  }, [user, cart]);

  // Fetch ONE shipping address
  useEffect(() => {
    const fetchAddress = async () => {
      const res = await api.get(`/shipping_address/list/${user.id}`, {
        withCredentials: true,
      });

      if (res.data?.status && res.data.data.length) {
        setAddress(res.data.data.find((a) => a.is_default) || res.data.data[0]);
      }
    };
    fetchAddress();
  }, [user]);

  const subtotal = cart.reduce(
    (t, i) => t + i.itemPriceWithTax * i.quantity,
    0,
  );

  const handlePayNow = async () => {
    if (!address) {
      Swal.fire("Error", "Shipping address not found", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Create pending order
      const payload = {
        customer_id: user.id,
        customer_code: user.customer_code,

        order_type: "online",
        website: "islamicbookzone",
        transaction_type: "Payment",

        payment_terms: "payu", // 🔥 REQUIRED
        payment_method: "payu",

        total: subtotal,
        net: subtotal,
        taxable_total: subtotal,

        company_id: cart[0]?.company_id || null,
        location_id: cart[0]?.location_id || null,

        shipping_address: address,

        items: cart.map((i) => ({
          item_id: i.id,
          quantity: i.quantity,
          price: i.itemPriceWithTax,
        })),
      };

      const res = await api.post(
        "/order/ecommerce/pending/create",
        { payload },
        { withCredentials: true },
      );

      startPayUPayment({
        amount: Math.round(subtotal),
        firstname: user.first_name,
        email: user.email,
        phone: user.phone,
        txnid: res.data.txnid,
      });
    } catch (err) {
      Swal.fire("Error", "Payment failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SHIPPING */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          {address ? (
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{address.full_name}</p>
              <p>{address.address_line1}</p>
              <p>
                {address.city}, {address.state}
              </p>
              <p>
                {address.country} - {address.pincode}
              </p>
              <p>{address.phone_number}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading...</p>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-xl p-4 shadow lg:col-span-1">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-3 max-h-[400px] overflow-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={`${imageBaseUrl}${item.image}`}
                  className="w-14 h-14 rounded border"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  ₹{item.itemPriceWithTax * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold mb-2">Payment</h3>

          <div className="border rounded p-3 text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked readOnly />
              Pay Online (PayU)
            </label>
          </div>

          <div className="flex justify-between text-sm font-semibold mb-3">
            <span>Total</span>
            <span>₹{Math.round(subtotal)}</span>
          </div>

          <button
            onClick={handlePayNow}
            disabled={isLoading}
            className="w-full py-2 !bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

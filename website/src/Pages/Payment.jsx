import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../CartContext/CartContext";
import constantApi from "../constantApi";
import { useNavigate, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* ---------------- GUEST / LOGIN ---------------- */
  const isGuest = state?.isGuest === true;
  const guest = state?.guest || JSON.parse(localStorage.getItem("guestInfo"));

  const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
const normalizeCartItem = (item) => {
  const productId = Number(item.product_id ?? item.id);

  if (!productId || isNaN(productId)) {
    console.error("❌ Invalid product_id:", item);
    return null;
  }

  return {
    product_id: productId,
    quantity: Number(item.quantity ?? item.qty ?? 1),
    price: Number(item.price ?? 0),
    name: item.name ?? "",
    image: item.image ?? "",
    brand: item.brand ?? "",
    color: item.color ?? "",
    size: item.size ?? "",
  };
};
 /* ---------------- CART ---------------- */
  const { cart: contextCart, removeFromCart } = useCart();

  const rawCart =
  contextCart.length > 0
    ? contextCart
    : JSON.parse(localStorage.getItem("guestCart")) || [];

const cart = rawCart
  .map(normalizeCartItem)
  .filter(Boolean);

  /* ---------------- STATE ---------------- */
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("paypal");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [billing, setBilling] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "Australia",
    address: "",
    city: "",
    zip: "",
  });
  


  /* ---------------- PREFILL BILLING ---------------- */
useEffect(() => {
  if (guest) {
    const [first, ...lastArr] = (guest.full_name || "").split(" ");

    setBilling(prev => ({
      ...prev,
      first_name: first || "",
      last_name: lastArr.join(" "),
      email: guest.email || "",
      phone: guest.phone_number || "",

      // 🔑 IMPORTANT
      address: guest.address_line_1 || guest.address || "",
      city: guest.city || guest.town || "",
      zip: guest.postal_code || guest.zip || "",

      country: guest.country || "Australia",
    }));
  } 
  else if (customerDetails) {
    setBilling(prev => ({
      ...prev,
      first_name: customerDetails.first_name || "",
      last_name: customerDetails.last_name || "",
      email: customerDetails.email || "",
      phone: customerDetails.phone || "",
      address: customerDetails.address_line_1 || "",
      city: customerDetails.city || "",
      zip: customerDetails.postal_code || "",
      country: customerDetails.country || "",
    }));
  }
}, [guest, customerDetails]);


  /* ---------------- REDIRECT IF CART EMPTY ---------------- */
  useEffect(() => {
  if (Array.isArray(rawCart) && rawCart.length === 0) {
    navigate("/cart");
  }
}, []);


  /* ---------------- TOTAL ---------------- */
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || item.qty || 1),
    0
  );

  const shippingCost = shipping === "express" ? 10 : 6.95;
  const grandTotal = subtotal + shippingCost;

  /* ---------------- INPUT ---------------- */
  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  /* ---------------- PLACE ORDER ---------------- */
 const placeOrder = async () => {
  const requiredFields = ["first_name", "email", "phone", "address", "city", "zip"];
  const newErrors = {};

  // 1️⃣ Validate billing info
  requiredFields.forEach((field) => {
    if (!billing[field]) newErrors[field] = true;
  });

  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    Swal.fire("Missing Info", "Please fill all required fields", "warning");
    return;
  }

  // 2️⃣ Validate cart
  if (!cart.length) {
    Swal.fire("Cart Empty", "Add items before checkout", "error");
    return;
  }

  setLoading(true);

  try {
    // 3️⃣ Determine customer_id
 const customer_id =
  isGuest
    ? Number(guest?.customer_id)
    : Number(customerDetails?.customer_id);

if (!customer_id || isNaN(customer_id)) {
  Swal.fire(
    "Error",
    "Customer information missing. Please restart checkout.",
    "error"
  );
  setLoading(false);
  return;
}


    // 4️⃣ Prepare backend billing info
    const backendBilling = {
      first_name: billing.first_name,
      last_name: billing.last_name,
      email: billing.email,
      phone_number: billing.phone,
      address_line_1: billing.address,
      city: billing.city,
      state: "", // optional
      postal_code: billing.zip,
      country: billing.country,
    };
const addressPayload = {
  full_name: `${billing.first_name} ${billing.last_name}`,
  phone_number: billing.phone,
  address_line1: billing.address,
  address_line2: "",
  city: billing.city,
  state: "",
  country: billing.country,
  pincode: billing.zip,
};

    // 5️⃣ Normalize cart items for backend
 const backendCart = cart
  .filter(item => item.product_id && item.quantity > 0)
  .map(item => {
    const net = item.price * item.quantity;
    return {
      item_id: item.product_id,
      uom: 1,
      quantity: item.quantity,
      price: item.price,
      discount: 0,
      net,
      excise: 0,
      vat: 0,
      total: net,
      taxable: 0,
      order_status: "Pending",
      brand: item.brand || null,
      color: item.color || null,
      size: item.size || null,
      item_image: item.image || "",
    };
  });


    if (!backendCart.length) {
      Swal.fire("Error", "Cart contains invalid items", "error");
      setLoading(false);
      return;
    }

const payload = {
  customer_id,
  customer_code: customerDetails?.customer_code || "",
  customer_lpo: "",

  discount: 0,
  net: subtotal,
  vat: 0,
  taxable_total: subtotal,
  total: subtotal,

  order_type: "online",
  website: "islamicbookzone",
  transaction_id: "123456",
  transaction_type: "Payment",

  payment_terms: payment,
  payment_details: {
    method: payment,
    amount: subtotal,
    currency: "INR",
    status: payment === "COD" ? "PENDING" : "PAID",
  },

  shipping_address: addressPayload,
  billing_address: addressPayload,
  any_comment: "",

  items: backendCart,
};

console.log("items:", backendCart);
console.log("FINAL ORDER PAYLOAD:", payload);
   // 7️⃣ Send order to backend
    const res = await axios.post(`${constantApi.baseUrl}/order/ecommerce/order-add`, payload);

    if (res.data.status) {
      Swal.fire("Success", "Order placed successfully", "success");

      // Clear cart
if (!isGuest) {
  cart.forEach((item) => removeFromCart(item.product_id));
}

localStorage.removeItem("guestCart");
localStorage.removeItem("guestInfo");


      // Redirect based on payment method
      if (payment === "paypal" && res.data.paypal_url) {
        window.location.href = res.data.paypal_url;
      } else {
        navigate("/order_success", { state: { orderId: res.data.order_id } });
      }
    } else {
      Swal.fire("Error", res.data.message || "Order failed", "error");
    }
  } catch (err) {
    console.error("Order Error:", err.response?.data || err.message);
    Swal.fire("Server Error", err.response?.data?.message || "Something went wrong", "error");
  } finally {
    setLoading(false);
  }
};


  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
<div className="border-b bg-white">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    
    {/* Left: Checkout */}
    <h1 className="text-xl font-semibold tracking-wide text-gray-900">
      Checkout
    </h1>

    {/* Right: Login */}
    <div className="text-sm text-gray-600">
      <a
        href="/login"
        className="font-medium !text-gray-950 hover:text-blue-700 !underline !hover:underline transition"
      >
        Login
      </a>
      <span className="mx-1">or</span>
      <span className="text-gray-500">continue as guest</span>
    </div>

  </div>
</div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-4">

        {/* BILLING */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold mb-1">BILLING ADDRESS</h2>
          <p className="text-xs text-red-500 mb-4">* Required Field</p>

        <div className="grid grid-cols-2 gap-3 text-xs">
  <input
    name="first_name"
    value={billing.first_name}
    onChange={handleChange}
    className={`field ${errors.first_name && "error"}`}
    placeholder="First Name*"
  />
  <input
    name="last_name"
    value={billing.last_name}
    onChange={handleChange}
    className={`field ${errors.last_name && "error"}`}
    placeholder="Last Name*"
  />
  <input
    name="email"
    value={billing.email}
    onChange={handleChange}
    className={`field col-span-2 ${errors.email && "error"}`}
    placeholder="Email Address*"
  />
  <input
    name="phone"
    value={billing.phone}
    onChange={handleChange}
    className={`field col-span-2 ${errors.phone && "error"}`}
    placeholder="Telephone*"
  />
<input
    name="country"
    value={billing.country}
    onChange={handleChange}
    className={`field col-span-2 ${errors.address && "error"}`}
    placeholder="country*"
  />
  <input
    name="address"
    value={billing.address}
    onChange={handleChange}
    className={`field col-span-2 ${errors.address && "error"}`}
    placeholder="Address*"
  />
  <input
    name="city"
    value={billing.city}
    onChange={handleChange}
    className={`field ${errors.city && "error"}`}
    placeholder="Town/Suburb*"
  />
  <input
    name="zip"
    value={billing.zip}
    onChange={handleChange}
    className={`field ${errors.zip && "error"}`}
    placeholder="Zip/Postal Code*"
  />
</div>
          <div className="shadow-sm border border-gray-200 rounded-lg p-4 mt-2 bg-white hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Shipping Address
            </h2>
            <label className="flex items-center cursor-pointer gap-3">
              
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-gray-700 font-medium">Same As Shipping Address</span>
            </label>
          </div>
        </div>

        {/* SHIPPING + PAYMENT */}
        <div className="bg-white p-5 rounded-lg shadow-sm text-xs">
          <h2 className="text-sm font-semibold mb-4">SELECT SHIPPING METHOD</h2>

          {["standard", "express"].map((type) => (
            <label
              key={type}
              className={`flex gap-2 p-3 rounded border cursor-pointer mb-2 ${shipping === type
                ? "!border-green-500 bg-green-50"
                : "!border-gray-200"
                }`}
            >
              <input
                type="radio"
                checked={shipping === type}
                onChange={() => setShipping(type)}
              />
              {type === "standard"
                ? "Standard Shipping Rs 6.95"
                : "Express Shipping Rs 10.00"}
            </label>
          ))}

          <h2 className="text-sm font-semibold mt-6 mb-3">PAYMENT</h2>

          {["card", "paypal"].map((type) => (
            <label
              key={type}
              className={`flex gap-2 p-3 rounded border cursor-pointer mb-2 ${payment === type
                ? "!border-green-500 bg-green-50"
                : "!border-gray-200"
                }`}
            >
              <input
                type="radio"
                checked={payment === type}
                onChange={() => setPayment(type)}
              />
              {type === "card" ? "Credit Card" : "PayPal Express Checkout"}
            </label>
          ))}

          {payment === "paypal" && (
            <div className="mt-3 border !border-green-500 !text-green-600 p-3 text-xs text-center rounded">
              You will be redirected to PayPal.
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <div className="sticky top-6 h-fit">
          <div className="!border-[6px] !border-green-500 p-6 text-xs bg-white  shadow-lg">
            <h2 className="text-sm font-semibold mb-5">REVIEW ORDER</h2>

            <div className="max-h-[220px] overflow-y-auto">
              {cart.map((item) => (
                <div
key={item.product_id}
                  className="grid grid-cols-[60px_1fr_auto] gap-3 mb-4"
                >
                  <img
                    src={`${constantApi.imageUrl.replace(/\/$/, "")}/itemsImage/${item.image || ""}`}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                    className="w-14 h-14 rounded border object-cover"
                    alt={item.name}
                  />

                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500">
                      {item.brand} {item.color} {item.size}
                    </p>
                  </div>

                  <div className="text-right">
                    <p>QTY {item.quantity}</p>
                    <p className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>


            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-semibold text-sm pt-2">
                <span>Grand Total</span>
                <span>{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className={`w-full mt-6 py-3 text-sm font-semibold rounded ${loading
                ? "!bg-gray-400 cursor-not-allowed"
                : "!bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              {loading ? "PROCESSING..." : "PROCESS ORDER"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .field {
          width: 100%;
          border: 1px solid #e5e5e5;
          padding: 11px;
          font-size: 12px;
          background: #fafafa;
          border-radius: 6px;
        }
        .field:focus {
          outline: none;
          border-color: #22c55e;
          background: #fff;
        }
        .error {
          border-color: #ef4444 !important;
        }
      `}</style>
    </div>
  );
}

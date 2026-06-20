// CartWithPayments.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../CartContext/CartContext";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import constantApi from "../constantApi";
import LocationPickerMap from "../components/LocationPickerMap";
import ShippingAddressList from "./ShippingAddressList";
import { loadRazorpayScript } from "../components/Payments/loadRazorpay";
import { startPayUPayment } from "../components/Payments/payU";
import api from "../api";
import { useAuth } from "../CartContext/AuthContext";

const isValidValue = (val) => {
  if (val === null || val === undefined) return false;

  const clean = String(val)
    .replace(/<[^>]*>/g, "")   // remove html tags
    .replace(/&nbsp;/gi, "")  // remove html spaces
    .trim()
    .toLowerCase();

  // ❌ invalid values
  if (
    clean === "" ||
    clean === "null" ||
    clean === "none" ||
    clean === "undefined" ||
    clean === "nan" ||
    Number(clean) === 0       // ✅ catches "0", "0.0", "0.00", 0
  ) {
    return false;
  }

  return true;
};


function CartWithPayments() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { loading, logout, user } = useAuth();

  // ✅ Extract company & location from cart
  const company_id = cart?.[0]?.company_id || null;
  const location_id = cart?.[0]?.location_id || null;
  const [onlinePaymentInfo, setOnlinePaymentInfo] = useState(null);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [showNewAddressPopup, setShowNewAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone_number: "",
    alternate_phone_number: "",
    pincode: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    address_type: "Home",
    is_default: true,
  });
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const customerDetails = JSON.parse(localStorage.getItem("customerDetails"));
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("payu");

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // Selected shipping address

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;
  // Fill billing form from customerDetails
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        country: user.country || "",
        address: user.address || "",
        city: user.city || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, []); // <-- Empty dependency

  const handleSaveNewAddress = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please login to create a shipping address.",
        confirmButtonText: "Login",
      }).then(() => navigate("/login"));
      return;
    }

    // Basic validation
    const requiredFields = [
      "full_name",
      "phone_number",
      "address_line1",
      "city",
      "state",
      "country",
      "pincode",
    ];

    for (let field of requiredFields) {
      if (!newAddress[field]) {
        Swal.fire(
          "Validation Error",
          `Please fill ${field.replace("_", " ")}.`,
          "warning",
        );
        return;
      }
    }

    try {
      // Construct final payload
      const finalData = {
        customer_id: user.id, // ✅ correct
        customer_code: user.customer_code,
        full_name: newAddress.full_name,
        phone_number: newAddress.phone_number,
        alternate_phone_number: newAddress.alternate_phone_number,
        pincode: newAddress.pincode,
        address_line1: newAddress.address_line1,
        address_line2: newAddress.address_line2,
        city: newAddress.city,
        state: newAddress.state,
        country: newAddress.country,
        address_type: newAddress.address_type,
        is_default: newAddress.is_default,
        email: user.email,
      };
      // API call using constantApi.baseUrl
      const response = await axios.post(
        `${constantApi.baseUrl}/shipping_address/create`,
        finalData,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // }
      );

      if (response.data.status) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Address created successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        // Update address list
        setAddresses((prev) => [...prev, response.data.data]);
        setSelectedId(response.data.data.id);

        // Reset form
        setNewAddress({
          full_name: "",
          phone_number: "",
          alternate_phone_number: "",
          pincode: "",
          address_line1: "",
          address_line2: "",
          city: "",
          state: "",
          country: "",
          address_type: "Home",
          is_default: true,
        });
        setShowNewAddressPopup(false);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to create address",
          "error",
        );
      }
    } catch (error) {
      console.error("Create address error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Internal server error",
        "error",
      );
    }
  };

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (!user?.id) return;

        const res = await axios.get(
          `${constantApi.baseUrl}/shipping_address/list/${user.id}`,
        );

        if (res.data.status) {
          setAddresses(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.itemPriceWithTax || item.itemPriceWithTax || 0) *
      Number(item.quantity || item.qty || 0),
    0,
  );
  const clearCartLocally = () => {
    const ids = cart.map((i) => i.id);
    ids.forEach((id) => removeFromCart(id));
  };

  const [billingAddress, setBillingAddress] = useState({
    full_name: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  useEffect(() => {
    if (!sameAsShipping) return;

    const selectedAddress = addresses.find((a) => a.id === selectedId);

    if (selectedAddress) {
      setBillingAddress({
        full_name: selectedAddress.full_name,
        phone_number: selectedAddress.phone_number,
        address_line1: selectedAddress.address_line1,
        address_line2: selectedAddress.address_line2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        pincode: selectedAddress.pincode,
      });
    }
  }, [selectedId, sameAsShipping, addresses]);

  const buildOrderPayload = (razorpayInfo = null, payuInfo = null) => {
    // const customer = JSON.parse(localStorage.getItem("customerDetails"));
    const selectedAddress = addresses.find((a) => a.id === selectedId);

    // Calculate subtotal using itemPriceWithTax
    const subtotal = cart.reduce((total, item) => {
      const qty = Number(item.quantity || item.qty || 1);
      const itemPriceWithTax = Number(item.itemPriceWithTax || 0);
      return total + itemPriceWithTax * qty;
    }, 0);

    return {
      customer_id: user.id,
      customer_code: user.customer_code,
      customer_lpo: "",
      discount: 0,
      net: subtotal, // sum of all base prices or total? Depends on backend
      vat: 0, // optional
      taxable_total: subtotal,
      total: subtotal,
      company_id,
      location_id,
      order_type: "online",
      website: "islamicbookzone",
      transaction_type: "Payment",
      payment_terms: selectedPayment,
      payment_details: {
        method: selectedPayment,
        amount: subtotal,
        currency: "INR",
        status: selectedPayment === "cod" ? "PENDING" : "PAID",
        // ✅ Razorpay specific data
        razorpay:
          selectedPayment === "razorpay" && razorpayInfo
            ? {
              razorpay_order_id: razorpayInfo.razorpay_order_id,
              razorpay_payment_id: razorpayInfo.razorpay_payment_id,
              razorpay_signature: razorpayInfo.razorpay_signature,
              receipt: razorpayInfo.receipt,
              verified_at: razorpayInfo.verified_at,
            }
            : null,

        payu:
          selectedPayment === "payu" && payuInfo
            ? {
              mihpayid: payuInfo.mihpayid,
              mode: payuInfo.mode,
              status: payuInfo.status,
              unmappedstatus: payuInfo.unmappedstatus,
              key: payuInfo.key,
              txnid: payuInfo.txnid,
              amount: payuInfo.amount,
              cardCategory: payuInfo.cardCategory,
              discount: payuInfo.discount,
              net_amount_debit: payuInfo.net_amount_debit,
              addedon: payuInfo.addedon,
              productinfo: payuInfo.productinfo,
              firstname: payuInfo.firstname,
              email: payuInfo.email,
              phone: payuInfo.phone,
              hash: payuInfo.hash,
              field1: payuInfo.field1,
              field2: payuInfo.field2,
              field3: payuInfo.field3,
              field4: payuInfo.field4,
              field5: payuInfo.field5,
              field6: payuInfo.field6,
              field7: payuInfo.field7,
              field8: payuInfo.field8,
              field9: payuInfo.field9,
              payment_source: payuInfo.payment_source,
              PG_TYPE: payuInfo.PG_TYPE,
              bank_ref_num: payuInfo.bank_ref_num,
              bankcode: payuInfo.bankcode,
              error: payuInfo.error,
              error_Message: payuInfo.error_Message,
              cardnum: payuInfo.cardnum,
            }
            : null,
      },

      shipping_address: selectedAddress,
      billing_address: sameAsShipping ? billingAddress : formData,
      any_comment: "",

      items: cart.map((item) => {
        const qty = Number(item.quantity || item.qty || 1);
        const price = Number(item.itemprice || item.price || 0);
        const itemPriceWithTax = Number(item.itemPriceWithTax || 0);

        // Tax calculation (optional)
        const taxAmount = itemPriceWithTax - price;
        const totalTax = taxAmount > 0 ? taxAmount * qty : 0;

        return {
          item_id: item.id,
          uom: item.item_uom_id || 1,
          quantity: qty,
          price: price,
          itemPriceWithTax: itemPriceWithTax,
          discount: 0,
          net: price * qty,
          excise: 0,
          vat: Number(totalTax).toFixed(2),
          total: itemPriceWithTax * qty, // total including tax
          order_status: "Pending",
          taxa_ble: Number(totalTax).toFixed,
          discounttype: "none",
          expiry_delivery_date: item.expiry || null,
          receiving_site: item.receiving_site || null,
          batch_number: item.batch_number || null,
          hsn_code: item.hsn_code || null,
          brand: item.brand || null,
          color: item.color || null,
          size: item.size || null,
          item_image: item.item_image || "",
        };
      }),
    };
  };
  const submitOrderToBackend = async (razorpayInfo = null, payuInfo = null) => {
    // const token = localStorage.getItem("token");
    // 1️⃣ Cart check
    if (!cart || cart.length === 0) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        customClass: { popup: "mini-toast" },
        html: `
        <div class="toast-box error-toast">
          <div class="toast-icon">⚠️</div>
          <div class="toast-content">
            <div class="toast-title">Cart Empty</div>
            <div class="toast-sub">Add items before placing order</div>
          </div>
        </div>
      `,
      });
      return;
    }
    // 2️⃣ LOGIN / GUEST CHECK
    if (!user) {
      const result = await Swal.fire({
        html: `
      <div class="flex items-center gap-4 px-4 py-2">
        <div
          class="relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl text-white"
          style="
            background: linear-gradient(135deg, #6366f1, #3b82f6);
            box-shadow: 0 8px 20px rgba(99,102,241,0.35);
          ">
          🛒
        </div>
        <div class="text-left">
          <p class="text-sm font-semibold text-gray-900 leading-tight">
            Almost there
          </p>
          <p class="text-xs text-gray-500 leading-snug mt-0.5">
            Login for faster checkout <span class="text-gray-400">or</span> continue as guest
          </p>
        </div>
      </div>
    `,
        width: 380,
        padding: "0.55rem 0.4rem",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Guest",
        buttonsStyling: false,
        backdrop: "rgba(0,0,0,0.35)",
        customClass: {
          popup: "rounded-xl shadow-2xl border border-gray-100",
          actions: "mt-3 flex justify-end gap-2 px-4 pb-2",
          confirmButton:
            "text-sm px-4 py-2 rounded-full font-medium text-white transition-all duration-200 hover:scale-105",
          cancelButton:
            "text-sm px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50",
        },
        didOpen: () => {
          const confirmBtn = Swal.getConfirmButton();
          const cancelBtn = Swal.getCancelButton();

          if (confirmBtn) {
            confirmBtn.style.setProperty("background", "#4f46e5", "important");
            confirmBtn.style.setProperty("color", "#ffffff", "important");
            confirmBtn.style.setProperty("border", "none", "important");
          }

          if (cancelBtn) {
            cancelBtn.style.setProperty("background", "#ffffff", "important");
            cancelBtn.style.setProperty("color", "#4b5563", "important"); // text-gray-700
            cancelBtn.style.setProperty(
              "border",
              "1px solid #d1d5db",
              "important",
            ); // border-gray-300
          }
        },
      });

      // LOGIN
      if (result.isConfirmed) {
        navigate("/login?redirect=/cart");
        return;
      }

      // GUEST
      if (result.dismiss === Swal.DismissReason.cancel) {
        if (!token && selectedPayment !== "cod") {
          Swal.fire({
            icon: "warning",
            title: "Login Required",
            text: "Please login to use online payment",
          });
          navigate("/login?redirect=/cart");
          return;
        }

        if (!localStorage.getItem("guest_id")) {
          localStorage.setItem("guest_id", "GUEST-" + Date.now());
        }
        navigate("/guest-checkout");
        return;
      }
    }

    if (!selectedPayment) {
      Swal.fire("Error", "Please select payment method", "warning");
      return;
    }
    // 5️⃣ Build & save order
    const payload = buildOrderPayload(razorpayInfo, payuInfo);
    localStorage.setItem("pendingOrder", JSON.stringify(payload));

    if (!payload) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        customClass: { popup: "mini-toast" },
        html: `
        <div class="toast-box error-toast">
          <div class="toast-icon">❌</div>
          <div class="toast-content">
            <div class="toast-title">Error</div>
            <div class="toast-sub">Order data missing</div>
          </div>
        </div>
      `,
      });
      return;
    }

    // 6️⃣ Submit order
    try {
      const response = await api.post(
        "/order/ecommerce/order-add",
        payload,
        { withCredentials: true }, // 🔥 REQUIRED
      );
      localStorage.setItem("SuccessOrder", JSON.stringify(response.data));
      if (response.data.status) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1800,
          customClass: { popup: "mini-toast" },
          html: `
          <div class="toast-box success-toast">
            <div class="toast-icon">✔️</div>
            <div class="toast-content">
              <div class="toast-title">Order created successfully</div>
            </div>
          </div>
        `,
        });

        clearCartLocally();
        // navigate("/order_success");
        navigate("/payment_processing", { replace: true });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.error("Order Create Error:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        customClass: { popup: "mini-toast" },
        html: `
        <div class="toast-box error-toast">
          <div class="toast-icon">❌</div>
          <div class="toast-content">
            <div class="toast-title">Error</div>
            <div class="toast-sub">Internal Server Error</div>
          </div>
        </div>
      `,
      });
    }
  };

  const startRazorpayPayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      Swal.fire("Error", "Razorpay SDK failed to load", "error");
      return;
    }

    // 1️⃣ Create Razorpay order
    const orderRes = await axios.post(
      `${constantApi.baseUrl}/razorpay/create-order`,
      { amount: Math.round(subtotal) },
    );

    const { order } = orderRes.data;

    // Save Razorpay order info
    setOnlinePaymentInfo({
      razorpay_order_id: order.id,
      receipt: order.receipt,
      amount: order.amount,
      currency: order.currency,
    });

    const options = {
      key: "rzp_test_S2x1411zhNSZzX",
      amount: order.amount,
      currency: order.currency,
      name: "IslamicBookZone",
      description: "Order Payment",
      order_id: order.id,

      handler: async (response) => {
        const razorpayInfo = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          receipt: order.receipt,
          verified_at: new Date().toISOString(),
        };

        const verifyRes = await axios.post(
          `${constantApi.baseUrl}/razorpay/verify-payment`,
          razorpayInfo,
        );

        if (verifyRes.data.success) {
          submitOrderToBackend(razorpayInfo); // ✅ PASS DATA
        } else {
          Swal.fire("Error", "Payment verification failed", "error");
        }
      },

      prefill: {
        name: user?.first_name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },

      theme: { color: "#4f46e5" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayNow = async () => {
    if (isLoading) return; // prevent double click
    // if (!user) {
    //   navigate("/login", { replace: true });
    //   return;
    // }

    // 2️⃣ LOGIN / GUEST CHECK
    if (!user) {
      const result = await Swal.fire({
        html: `
      <div class="flex items-center gap-4 px-4 py-2">
        <div
          class="relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl text-white"
          style="
            background: linear-gradient(135deg, #6366f1, #3b82f6);
            box-shadow: 0 8px 20px rgba(99,102,241,0.35);
          ">
          🛒
        </div>
        <div class="text-left">
          <p class="text-sm font-semibold text-gray-900 leading-tight">
            Almost there
          </p>
          <p class="text-xs text-gray-500 leading-snug mt-0.5">
            Login for faster checkout <span class="text-gray-400">or</span> continue as guest
          </p>
        </div>
      </div>
    `,
        width: 380,
        padding: "0.55rem 0.4rem",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Guest",
        buttonsStyling: false,
        backdrop: "rgba(0,0,0,0.35)",
        customClass: {
          popup: "rounded-xl shadow-2xl border border-gray-100",
          actions: "mt-3 flex justify-end gap-2 px-4 pb-2",
          confirmButton:
            "text-sm px-4 py-2 rounded-full font-medium text-white transition-all duration-200 hover:scale-105",
          cancelButton:
            "text-sm px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium transition-all duration-200 hover:bg-gray-50",
        },
        didOpen: () => {
          const confirmBtn = Swal.getConfirmButton();
          const cancelBtn = Swal.getCancelButton();

          if (confirmBtn) {
            confirmBtn.style.setProperty("background", "#4f46e5", "important");
            confirmBtn.style.setProperty("color", "#ffffff", "important");
            confirmBtn.style.setProperty("border", "none", "important");
          }

          if (cancelBtn) {
            cancelBtn.style.setProperty("background", "#ffffff", "important");
            cancelBtn.style.setProperty("color", "#4b5563", "important");
            cancelBtn.style.setProperty(
              "border",
              "1px solid #d1d5db",
              "important",
            );
          }
        },
      });

      // LOGIN FLOW
      if (result.isConfirmed) {
        navigate("/login?redirect=/cart");
        return;
      }

      // GUEST FLOW
      if (result.dismiss === Swal.DismissReason.cancel) {
        if (!user && selectedPayment !== "payu") {
          Swal.fire({
            icon: "warning",
            title: "Login Required",
            text: "Please login to use online payment",
          });
          navigate("/login?redirect=/cart");
          return;
        }

        // ✅ No localStorage
        navigate("/guest-checkout");
        return;
      }
    }

    if (!selectedId) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        padding: 0,
        customClass: { popup: "mini-toast" },
        html: `
        <div class="toast-box">
          <div class="toast-icon">ℹ️</div>
          <div class="toast-content">
            <div class="toast-title">Select Address</div>
            <div class="toast-sub">Please choose a shipping address</div>
          </div>
        </div>
      `,
      });
      return;
    }

    try {
      setIsLoading(true);

      if (selectedPayment === "cod") {
        await submitOrderToBackend();
        return;
      }

      if (selectedPayment === "razorpay") {
        await startRazorpayPayment();
        return;
      }

      if (selectedPayment === "payu") {
        const payload = buildOrderPayload(null, null);

        const res = await api.post(
          "/order/ecommerce/pending/create",
          { payload },
          { withCredentials: true },
        );

        const txnid = res.data.txnid;
        localStorage.setItem("payu_flow", "cart");

        startPayUPayment({
          amount: Math.round(subtotal),
          firstname: user.first_name,
          email: user.email,
          phone: user.phone,
          txnid,
          source: "cart",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  //----------------------------------------------------------------------------------------------
  // ---------------- GET USER LOCATION ----------------
  const getUserLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (err) => reject(err.message),
        );
      }
    });

  // ---------------- REVERSE GEOCODE ----------------
  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      );
      const data = await res.json();
      return data.address;
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return null;
    }
  };

  const getPrimaryButtonText = () => {
    if (isLoading) return "Processing...";
    if (selectedPayment === "cod") return "Place Order";
    return "Pay Now";
  };

  // ---------------- FILL FORM USING LOCATION ----------------
  const fillFormWithLocation = async () => {
    try {
      const { latitude, longitude } = await getUserLocation();
      setLat(latitude);
      setLng(longitude);
      const address = await getAddressFromCoordinates(latitude, longitude);

      if (address) {
        setNewAddress((prev) => ({
          ...prev,
          address_line1: address.road || "",
          address_line2: address.neighbourhood || "",
          city: address.city || address.town || address.village || "",
          state: address.state || "",
          country: address.country || "",
          pincode: address.postcode || "",
        }));
      }
    } catch (err) {
      console.error("Could not fetch location:", err);
    }
  };

  const handleLocationChange = async (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);

    const address = await getAddressFromCoordinates(newLat, newLng);
    if (address) {
      setNewAddress((prev) => ({
        ...prev,
        address_line1: address.road || "",
        address_line2: address.neighbourhood || "",
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        country: address.country || "",
        pincode: address.postcode || "",
      }));
    }
  };

  return (
    <>
      <div
        className="flex flex-col lg:flex-row gap-4 
             min-h-screen p-2 sm:p-4"
      >
        {/* LEFT - Billing Details + Shipping Addresses */}
        {user && (
          <div className="w-full lg:flex-[1.6]">
            <ShippingAddressList
              addresses={addresses}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAddNew={() => setShowNewAddressPopup(true)}
              open={showNewAddressPopup}
              onClose={() => setShowNewAddressPopup(false)}
              onSave={handleSaveNewAddress}
              newAddress={newAddress}
              onChange={handleNewAddressChange}
              lat={lat}
              lng={lng}
              handleLocationChange={handleLocationChange}
              fillFormWithLocation={fillFormWithLocation}
            />
          </div>
        )}

        {/* CENTER - Order Summary */}
        <div className="w-full lg:flex-[2.5] flex flex-col h-full">
          <h4
            className="text-gray-900 text-lg sm:text-xl mb-3 sm:mb-4 
                     font-semibold tracking-wide border-b pb-2"
          >
            Order Summary
          </h4>

          {/* Cart Items (Scrollable) */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {!cart || cart.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-4">
                Your cart is empty!
              </p>
            ) : (
              <div className="w-full border rounded-xl overflow-hidden divide-y">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center 
                             sm:justify-between gap-3 
                             py-3 px-3 hover:bg-gray-50 transition"
                  >
                    {/* LEFT */}
                    <div className="flex items-start sm:items-center gap-3">
                      <img
                        src={`${imageBaseUrl}${(item.image || "").replace(
                          /^\/+/,
                          "",
                        )}`}
                        alt={item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 
                                 object-cover rounded-lg 
                                 border shadow-sm"
                      />

                      <div className="flex-1">
                        <p className="text-gray-900 text-sm font-medium">
                          {item.name}
                        </p>

                        {/* OPTIONAL DETAILS */}
                        <div className="text-xs text-gray-600 space-y-0.5">

                          {/* ✅ Description Long */}
                          {isValidValue(item.itemdesclong) && (
                            <p>{item.itemdesclong}</p>
                          )}

                          {/* ✅ Description 3 */}
                          {isValidValue(item.itemdesc3) && (
                            <p>{item.itemdesc3}</p>
                          )}

                          {/* Brand */}
                          {isValidValue(item.brand) &&
                            item.brand.trim().toLowerCase() !== "local" && (
                              <p>Brand: {item.brand}</p>
                            )}

                          {/* Color */}
                          {isValidValue(item.color) && <p>Color: {item.color}</p>}

                          {/* Size */}
                          {isValidValue(item.size) && <p>Size: {item.size}</p>}

                        </div>



                        {/* QUANTITY */}
                        <div className="pt-2">
                          <div
                            className="inline-flex items-center bg-gray-50 
                                     border border-gray-200 
                                     rounded-full px-1"
                          >
                            <button
                              onClick={() => updateQuantity(item.id, "dec")}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center 
                                       justify-center rounded-full 
                                       text-gray-600 
                                       hover:bg-pink-50 
                                       hover:text-pink-600
                                       disabled:opacity-40 
                                       disabled:cursor-not-allowed 
                                       font-semibold transition"
                            >
                              −
                            </button>

                            <span
                              className="w-7 text-center text-sm 
                                       text-gray-800 select-none"
                            >
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => updateQuantity(item.id, "inc")}
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 flex items-center 
                                       justify-center rounded-full 
                                       text-gray-600 
                                       hover:bg-pink-50 
                                       hover:text-pink-600
                                       disabled:opacity-40 
                                       disabled:cursor-not-allowed 
                                       font-semibold transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div
                      className="flex items-center justify-between 
                               sm:justify-end gap-3"
                    >
                      <p className="text-gray-900 font-semibold text-sm">
                        ₹{Math.round(item.itemPriceWithTax * item.quantity)}
                      </p>

                      <MdDeleteOutline
                        onClick={() => removeFromCart(item.id)}
                        className="cursor-pointer text-red-500 
                                 hover:text-red-700 text-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtotal + Total */}
          <div
            className="mt-4 space-y-2 bg-gray-50 
                     p-3 sm:p-4 rounded-xl border"
          >
            {/* SUBTOTAL */}
            <div
              className="flex justify-between text-gray-700 
                       text-xs sm:text-sm font-semibold"
            >
              <p>Subtotal</p>
              <p>₹{Math.round(subtotal)}</p>
            </div>

            {/* SHIPPING */}
            {/* <div
              className="flex justify-between text-gray-700 
                       text-xs sm:text-sm"
            >
              <p>Shipping</p>
              <p className="font-semibold text-green-600">Free</p>
            </div> */}

            {/* TOTAL */}
            <div
              className="flex justify-between text-gray-900 
                       font-semibold text-base sm:text-lg 
                       pt-2 border-t"
            >
              <p>Total</p>
              <p>₹{Math.round(subtotal)}</p>
            </div>
          </div>
        </div>

        {/* RIGHT - PAYMENT */}
        <div className="w-full lg:flex-[1] max-w-none lg:max-w-[380px]">
          <div
            className="!bg-white rounded-2xl 
                     shadow-xl p-4 sm:p-5 
                     relative w-full"
          >
            {/* Gradient Header */}
            <div
              className="absolute top-0 left-0 
                       w-full h-1 rounded-t-2xl
                       bg-gradient-to-r 
                       !from-blue-500 
                       !via-blue-600 
                       to-indigo-500"
            />

            {/* Payment Option */}
            <div className="space-y-2 sm:space-y-3 mt-1">
              <label
                className="flex items-center gap-2 
                         text-sm sm:text-base"
              >
                <input
                  type="radio"
                  name="payment"
                  value="payu"
                  checked={selectedPayment === "payu"}
                  onChange={() => setSelectedPayment("payu")}
                />
                Pay Online
              </label>
            </div>

            {/* Buttons */}
            <div
              className="flex flex-col sm:flex-row 
                       gap-2 mt-4"
            >
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isLoading}
                className={`flex-1 py-2.5 sm:py-2 
                          rounded-xl 
                          text-xs sm:text-sm 
                          font-medium transition-all
                          !bg-gradient-to-r 
                          !from-blue-500 
                          !to-indigo-500 
                          !text-white
                          ${isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:opacity-95"
                  }`}
              >
                {isLoading && (
                  <span
                    className="mr-2 inline-block h-3 w-3 
                             animate-spin rounded-full 
                             border-2 border-white 
                             border-t-transparent"
                  />
                )}
                {getPrimaryButtonText()} • ₹{Math.round(subtotal)}
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex-1 py-2.5 sm:py-2 
                         !bg-gray-100 rounded-xl 
                         text-xs sm:text-sm 
                         font-medium hover:bg-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartWithPayments;

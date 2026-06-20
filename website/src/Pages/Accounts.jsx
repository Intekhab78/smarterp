import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";
import ShippingAddresses from "../components/ShippingAddress";
import Swal from "sweetalert2";
import { useCart } from "../CartContext/CartContext";
import { CheckCircle, Clock, Truck, Package, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import ProfileSection from "../components/ProfileSection";
import OrdersSection from "../components/OrdersSection";
import PasswordModal from "../components/UpdatePasswordSection";
import { useAuth } from "../CartContext/AuthContext";

function Accounts() {
  const { addToCart } = useCart();
  const { loading, logout, user } = useAuth();
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("cart"); // optional
    navigate("/login", { replace: true });
  };

  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loginCustomer, setLoginCustomer] = useState();
  const [addresses, setAddresses] = useState([]);
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("accountActiveSection") || "profile";
  });
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    localStorage.setItem("accountActiveSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveSection(location.state.activeTab);
      localStorage.setItem("accountActiveSection", location.state.activeTab);
    }
  }, [location.state]);

  // ---------------- LOAD CUSTOMER DATA ----------------
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    fetchShippingAddresses(user.id);
    fetchCustomerDetails(user.id);
  }, [user, loading]);

  // ---------------- FETCH API FUNCTIONS ----------------
  const fetchShippingAddresses = async (customerId) => {
    console.log("id is ------------", customerId);

    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/shipping_address/list/${customerId}`,
      );
      setAddresses(res.data.status ? res.data.data : []);
      console.log("res for fetchShippingAddresses", res);
    } catch (err) {
      console.error("Error loading addresses:", err);
      setAddresses([]);
    }
  };
  // const [customer, setCustomer] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const fetchCustomerDetails = async (customerId) => {
    try {
      const res = await axios.get(`${constantApi.baseUrl}/customer/list`, {});
      if (res.data?.success && res.data?.customers?.length > 0) {
        const currentCustomer = res.data.customers.find(
          (c) => c.id === customerId,
        );
        setCustomer(currentCustomer || null);
      } else {
        console.error("Unexpected API response:", res.data);
        setCustomer(null);
      }
    } catch (err) {
      console.error("Error fetching customer details:", err);
      setCustomer(null);
    } finally {
      setLoadingCustomer(false);
    }
  };
  // console.log("customer---------", customer?.customer_code);
  // ---------------- FETCH CUSTOMER ORDERS ----------------
  const fetchCustomerOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/order/ecommerce_orders/by-customer`,

        {
          customer_id: user?.customer_code,
          company_id: 21,
          location_id: 20,
          // page: 1,
          // pageSize: 1000,
        },
      );
      console.log("filteredOrders--------------", res.data);

      if (res.data && res.data) {
        setCustomerOrders(res.data?.data.orders);
      } else {
        setCustomerOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrdersError("No Orders");
      setCustomerOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };
  useEffect(() => {
    if (!customer?.customer_code) return;

    fetchCustomerOrders();
  }, [customer?.customer_code]);

  // ---------------- PASSWORD UPDATE ----------------
  // State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loadings, setLoading] = useState(false);
  // const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([{}]);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    const fetchStatusList = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/order-status/list`,
          { params: { company_id: 21 } },
        );

        if (res?.data?.success) {
          setStatusList(res.data.data || []);
        }
        console.log("order statuse list", res.data);
      } catch (err) {
        console.error("Failed to load order status list", err);
      }
    };

    fetchStatusList();
  }, []);

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/customer/customer_pass_update`,
        {
          loginId: customer.email,
          password: newPassword,
        },
      );
      const data = response.data ?? {};
      const statusOk =
        data.success === true ||
        data.success === "true" ||
        data.status === true ||
        data.status === "true";

      const fallbackOk =
        (response.status === 200 || response.status === 201) &&
        typeof data.message === "string" &&
        /success|updated|changed/i.test(data.message);

      if (statusOk || fallbackOk) {
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);

        await Swal.fire({
          icon: "success",
          text: "Your password has been changed successfully.",
          toast: true, // 🔹 enable toast mode
          position: "top-end", // 🔹 top-right corner
          showConfirmButton: false,
          timer: 1000, // 🔹 auto close after 2 seconds
          timerProgressBar: true, // 🔹 optional: shows a progress bar
        });

        return;
      }

      setMessage(data.message || data.error || "Failed to update password");
    } catch (error) {
      console.error("Password update error:", error);
      const serverMsg =
        error?.response?.data?.message || error?.response?.data?.error;
      setMessage(serverMsg || "Something went wrong while updating password");
    } finally {
      setLoading(false);
    }
  };
  const BounceLoader = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/70 backdrop-blur-sm z-50">
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    );
  };
  const getBestDiscount = (priceItems) => {
    if (!Array.isArray(priceItems) || priceItems.length === 0) return null;
    const today = new Date();

    const validItems = priceItems.filter((item) => {
      if (!item || item.status !== "active") return false;

      const itemStart = item.start_date ? new Date(item.start_date) : null;
      const itemEnd = item.end_date ? new Date(item.end_date) : null;

      const plStart = item.priceList?.start_date
        ? new Date(item.priceList.start_date)
        : null;

      const plEnd = item.priceList?.end_date
        ? new Date(item.priceList.end_date)
        : null;

      const start = itemStart || plStart;
      const end = itemEnd || plEnd;

      if (start && today < start) return false;
      if (end && today > end) return false;

      if (!item.list_price) return false;

      return true;
    });
    if (validItems.length === 0) return null;
    const best = validItems.reduce((prev, curr) => {
      const prevPrice = parseFloat(prev.list_price || Infinity);
      const currPrice = parseFloat(curr.list_price || Infinity);
      return currPrice < prevPrice ? curr : prev;
    });

    const parsed = parseFloat(best.list_price);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const handleAddToCart = (item) => {
    let price = parseFloat(item?.item_price || item?.price || 0);
    let tax = parseFloat(item?.tax_master_1?.taxcal) || 0;
    let basePrice = price + (price * tax) / 100;
    const discount = getBestDiscount(item?.price_list_items || []);
    const priceToAdd = discount && discount < basePrice ? discount : basePrice;
    // Flatten item details
    const productForCart = {
      id: item.id,
      item_name: item.itemLocationModel?.item_name || item.name,
      item_image:
        item.itemLocationModel?.item_image || item.image || "placeholder.png",
      item_qty: item.item_qty || item.quantity || 1,
      itemprice: priceToAdd,
      color: item.color || null,
      size: item.size || null,
    };
    addToCart(productForCart);
    console.log("Reorder item:", item);
    Swal.fire({
      html: `
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" 
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" 
                  d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
           <p class="text-white font-bold text-base">Added to Cart 🛒</p>
        <p class="text-white/80 text-xs mt-1"> </p>
        </div>
      </div>
    `,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: true,
      background: "rgba(0, 0, 0, 0.75)",
      color: "#fff",
      width: "320px",
      padding: "12px 16px",
      customClass: {
        popup:
          "rounded-xl shadow-2xl backdrop-blur-md animate__animated animate__slideInRight",
      },
    });
  };

  const startEditProfile = () => {
    setProfileForm({
      id: customer.id,
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      // alternate_phone: customer.alternate_phone || "",
      dob: customer.dob || "",
      gender: customer.gender || "",
      billing_address: customer.billing_address || "",
      city: customer.city || "",
      state: customer.state || "",
      country: customer.country || "",
      zipcode: customer.zipcode || "",
    });

    setIsEditing(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // new 1
  // const underlineInput =
  //   "w-full bg-transparent outline-none  text-sm leading-5";
  const underlineInput = {
    width: "auto",
    display: "inline-block",
    minWidth: "220px",
    border: "none",
    borderBottom: "1px solid #9ca3af", // gray underline
    outline: "none",
    background: "transparent",
    padding: "0px 0px",
    fontSize: "14px",
    borderRadius: "0",
    boxShadow: "none",
    font: "normal",
  };

  const updateProfile = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/customer/update`,
        profileForm,
      );

      if (res.data?.status === true) {
        setCustomer(res.data.data);
        localStorage.setItem("customerDetails", JSON.stringify(res.data.data));

        Swal.fire({
          icon: "success",
          text: "Profile updated successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
        });

        setIsEditing(false);
      }
    } catch {
      Swal.fire({
        icon: "error",
        text: "Something went wrong",
      });
    }
  };
  const cancelEditProfile = () => {
    setIsEditing(false);
    setProfileForm({
      id: customer.id,
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      dob: customer.dob || "",
      gender: customer.gender || "",
      billing_address: customer.billing_address || "",
      city: customer.city || "",
      state: customer.state || "",
      country: customer.country || "",
      zipcode: customer.zipcode || "",
    });
  };

  if (loadingCustomer) return <BounceLoader />;
  return (
    <>
      {/* Breadcrumb */}
      <div className="container py-2 sm:py-4 flex items-center gap-2 text-xs sm:text-sm">
        <a
          href="/"
          className="text-primary flex items-center gap-1 hover:text-indigo-600 transition"
        >
          <i className="fa-solid fa-house"></i>
          Home
        </a>
        <span className="text-gray-400">
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </span>
        <p className="text-gray-600 font-medium">Account</p>
      </div>

      <div className="container grid grid-cols-1 sm:grid-cols-12! items-start gap-3 sm:gap-1 lg:gap-6 pt-3 p-0 sm:pt-4 pb-10 lg:pb-16 overflow-x-hidden">
        {/* LEFT SIDEBAR */}
        <div className="col-span-5 sm:col-span-4 md:col-span-3 space-y-4 sm:space-y-6">
          {/* Profile Card */}
          <div className="px-3 sm:px-4 py-3 sm:py-4 shadow-lg flex items-center gap-3 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-xl border border-indigo-100">
            <img
              src="../assets/images/avatar.png"
              alt="profile"
              className="rounded-full w-11 h-11 sm:w-14 sm:h-14 border-2 border-indigo-300 p-1 object-cover shrink-0"
            />
            <div className="leading-tight min-w-0">
              <p className="text-gray-500 text-[11px] sm:text-sm">Welcome,</p>
              <h4 className="text-gray-800 font-semibold text-sm sm:text-base truncate">
                {customer.first_name} {customer.last_name}
              </h4>
            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="bg-gray-100 shadow-lg rounded-xl flex items-center justify-between md:block px-3 py-2 sm:p-5 md:divide-y divide-gray-200 text-gray-700 text-sm">
            {/* Manage Account */}
            <div className="contents md:block md:py-2">
              <p className="text-indigo-600 font-semibold  mb-1 sm:mb-2 text-sm hidden md:block">
                Manage Account
              </p>

              <button
                onClick={() => setActiveSection("profile")}
                className={`w-auto md:w-full flex items-center md:justify-start gap-3 px-3 py-2 rounded-lg transition ${activeSection === "profile"
                  ? "!bg-indigo-100 !text-indigo-600 font-semibold"
                  : "!hover:bg-indigo-50"
                  }`}
              >
                <i className="fa-regular fa-user text-indigo-500"></i>
                <span className="hidden md:block">Profile</span>
              </button>

              <button
                onClick={() => setActiveSection("address")}
                className={`w-auto md:w-full flex items-center  md:justify-start gap-3 px-3 py-2 rounded-lg transition ${activeSection === "address"
                  ? "!bg-indigo-100 !text-indigo-600 font-semibold"
                  : "!hover:bg-indigo-50"
                  }`}
              >
                <i className="fa-solid fa-location-dot text-indigo-500"></i>
                <span className="hidden md:block">Manage Addresses</span>
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className={`w-auto md:w-full flex items-center md:justify-start gap-3 px-3 py-2 rounded-lg transition ${activeSection === "changePassword"
                  ? "!bg-indigo-100 !text-indigo-600 font-semibold"
                  : "!hover:bg-indigo-50"
                  }`}
              >
                <i className="fa-solid fa-key text-indigo-500"></i>
                <span className="hidden md:block">Change Password</span>
              </button>
            </div>

            {/* Orders */}
            <div className="contents md:block md:py-2">
              <button
                onClick={() => setActiveSection("orders")}
                className={`w-auto md:w-full flex items-center  md:justify-start gap-3 px-3 py-2 rounded-lg transition ${activeSection === "orders"
                  ? "!bg-indigo-100 !text-indigo-600 font-semibold"
                  : "!hover:bg-indigo-50"
                  }`}
              >
                <i className="fa-solid fa-box-archive text-indigo-500"></i>
                <span className="hidden md:block">My Orders</span>
              </button>
            </div>

            {/* Payments */}
            {/* <div className="py-2">
              <button
                onClick={() => setActiveSection("payments")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  activeSection === "payments"
                    ? "!bg-indigo-100 !text-indigo-600 font-semibold"
                    : "!hover:bg-indigo-50"
                }`}
              >
                <i className="fa-regular fa-credit-card text-indigo-500"></i>
                <span>Payment Methods</span>
              </button>
            </div> */}

            {/* Logout */}
            <div className="contents md:block md:py-2">
              <button
                onClick={handleLogout}
                className="w-auto md:w-full flex items-center  md:justify-start gap-3 px-3 py-2 rounded-lg !text-red-600 !hover:bg-red-50 transition font-medium"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span className="hidden md:block">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="col-span-7 sm:col-span-8 md:col-span-9 space-y-4 sm:space-y-6">
          {activeSection === "profile" && (
            <ProfileSection
              customer={customer}
              loadingCustomer={loadingCustomer}
              isEditing={isEditing}
              isLoading={isLoading}
              profileForm={profileForm}
              underlineInput={underlineInput}
              cancelEditProfile={cancelEditProfile}
              startEditProfile={startEditProfile}
              updateProfile={updateProfile}
              handleProfileChange={handleProfileChange}
              BounceLoader={BounceLoader}
            />
          )}

          {activeSection === "address" && (
            <ShippingAddresses
              embedded={true}
              addresses={addresses}
              refreshAddresses={() =>
                fetchShippingAddresses(customer.id || customer.customer_id)
              }
            />
          )}

          {activeSection === "orders" && (
            <OrdersSection
              customerOrders={customerOrders}
              ordersLoading={ordersLoading}
              ordersError={ordersError}
              handleAddToCart={handleAddToCart}
              imageBaseUrl={imageBaseUrl}
              statusList={statusList}
              BounceLoader={BounceLoader}
            />
          )}

          {activeSection === "payments" && (
            <div className="shadow rounded bg-white px-3 sm:px-4 pt-4 sm:pt-6 pb-6 sm:pb-8 hover:shadow-lg transition">
              <h3 className="font-medium text-gray-800 text-sm sm:text-lg mb-3 sm:mb-4">
                Payment Methods
              </h3>

              {paymentMethods.length === 0 ? (
                <p className="text-gray-700 font-medium">
                  No payment methods found
                </p>
              ) : (
                paymentMethods.map((pay, i) => (
                  <div
                    key={i}
                    className="mb-3 sm:mb-4 border p-3 sm:p-4 rounded bg-gray-50"
                  >
                    <p className="font-medium text-gray-800">
                      {pay.card_type || pay.method}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {pay.card_number || pay.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <PasswordModal
        show={showPasswordModal}
        customerEmail={customer?.email}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        loading={loadings}
        message={message}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        onClose={() => setShowPasswordModal(false)}
        onUpdate={handlePasswordUpdate}
      />
    </>
  );
}
export default Accounts;

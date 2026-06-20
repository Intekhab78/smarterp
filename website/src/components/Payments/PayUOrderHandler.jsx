import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart as clearReduxCart } from "../../redux/cartSlice";
import { useCart } from "../../CartContext/CartContext";
import api from "../../api";

const PayUOrderHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSubmitted = useRef(false);
  const { clearCart } = useCart();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("Processing your payment...");

  const normalizePayUInfo = (payuInfo) => ({
    mihpayid: payuInfo?.mihpayid || null,
    mode: payuInfo?.mode || null,
    status: payuInfo?.status || null,
    unmappedstatus: payuInfo?.unmappedstatus || null,
    key: payuInfo?.key || null,
    txnid: payuInfo?.txnid || null,
    amount: payuInfo?.amount || null,
    cardCategory: payuInfo?.cardCategory || null,
    discount: payuInfo?.discount || null,
    net_amount_debit: payuInfo?.net_amount_debit || null,
    addedon: payuInfo?.addedon || null,
    productinfo: payuInfo?.productinfo || null,
    firstname: payuInfo?.firstname || null,
    email: payuInfo?.email || null,
    phone: payuInfo?.phone || null,
    hash: payuInfo?.hash || null,
    field1: payuInfo?.field1 || null,
    field2: payuInfo?.field2 || null,
    field3: payuInfo?.field3 || null,
    field4: payuInfo?.field4 || null,
    field5: payuInfo?.field5 || null,
    field6: payuInfo?.field6 || null,
    field7: payuInfo?.field7 || null,
    field8: payuInfo?.field8 || null,
    field9: payuInfo?.field9 || null,
    payment_source: payuInfo?.payment_source || null,
    PG_TYPE: payuInfo?.PG_TYPE || null,
    bank_ref_num: payuInfo?.bank_ref_num || null,
    bankcode: payuInfo?.bankcode || null,
    error: payuInfo?.error || null,
    error_Message: payuInfo?.error_Message || null,
    cardnum: payuInfo?.cardnum || null,
  });

  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const storageFlow = String(localStorage.getItem("payu_flow") || "")
      .trim()
      .toLowerCase();
    if (storageFlow === "pos" && location.pathname === "/payu-processing") {
      navigate(`/payu-processing-pos${location.search}`, { replace: true });
      return;
    }

    const sourceParam = String(
      new URLSearchParams(location.search).get("source") || "",
    )
      .trim()
      .toLowerCase();
    const flow = storageFlow === "pos" ? "pos" : sourceParam || storageFlow;
    const fallbackRoute = flow === "pos" ? "/scan" : "/cart";

    const queryParams = new URLSearchParams(location.search);
    const txnid = queryParams.get("txnid");

    if (!txnid) {
      localStorage.removeItem("payu_flow");
      navigate(fallbackRoute);
      return;
    }

    const processOrder = async () => {
      try {
        const pendingRes = await api.get(`/order/ecommerce/pending/${txnid}`);
        if (!pendingRes.data.success) {
          setMessage("Order data not found. Redirecting...");
          localStorage.removeItem("payu_flow");
          return setTimeout(() => navigate(fallbackRoute), 2500);
        }
        const pendingOrder = pendingRes.data.data.payload;
        const isPOSOrder =
          flow === "pos" ||
          String(pendingOrder?.order_type || "").toLowerCase() === "pos" ||
          String(pendingOrder?.website || "").toLowerCase() === "pos";
        const errorRoute = isPOSOrder ? "/scan" : fallbackRoute;
        /* ----------------------------------
           2️⃣ Fetch PayU payment details
        -----------------------------------*/
        const payuRes = await api.get(`/payment/payu-details/${txnid}`);
        if (!payuRes.data.success) {
          setMessage("Payment info not found. Redirecting...");
          localStorage.removeItem("payu_flow");
          return setTimeout(() => navigate(errorRoute), 2500);
        }
        const payuInfo = normalizePayUInfo(payuRes.data.data);
        /* ----------------------------------
           3️⃣ Merge PayU info into order
        -----------------------------------*/
        const payloadWithPayu = {
          ...pendingOrder,
          payment_details: {
            ...pendingOrder.payment_details,
            status: "PAID",
            payu: payuInfo,
          },
        };

        /* ----------------------------------
           4️⃣ Create FINAL order
        -----------------------------------*/
        const orderRes = await api.post(
          "/order/ecommerce/order-add",
          payloadWithPayu,
        );

        if (!orderRes.data.status) {
          setMessage("Failed to create order. Redirecting...");
          localStorage.removeItem("payu_flow");
          return setTimeout(() => navigate(errorRoute), 2500);
        }

        /* ----------------------------------
           5️⃣ Success cleanup
        -----------------------------------*/
        localStorage.setItem("SuccessOrder", JSON.stringify(orderRes.data));
        if (isPOSOrder) {
          dispatch(clearReduxCart());
        }
        clearCart();
        // navigate(`/accounts`, {
        //   state: { activeTab: "orders" },
        // });

        Swal.fire({
          icon: "success",
          title: "Order Successful!",
          text: "Thank you for your purchase.",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        }).then(() => {
          localStorage.removeItem("payu_flow");
          if (isPOSOrder) {
            navigate("/thermal-invoice", { replace: true });
          } else {
            navigate("/payment_processing", { replace: true });
          }
        });
      } catch (error) {
        console.error("PayU order handler error:", error);
        setMessage("Something went wrong. Redirecting...");
        localStorage.removeItem("payu_flow");
        setTimeout(() => navigate(fallbackRoute), 2500);
      }
    };

    processOrder();
  }, [location.search, navigate, clearCart, dispatch]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default PayUOrderHandler;

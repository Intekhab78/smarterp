// OrderDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Truck, FileDown, ArrowLeft, X } from "lucide-react"; // Add icons
import axios from "axios";
import constantApi from "../constantApi";

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- Fetch order ----------------
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");

      try {
        if (location.state?.order) {
          setOrderData(location.state.order);
        }

        // else {
        //   const res = await axios.post(
        //     `${constantApi.baseUrl}/order/ecommerce_orders/details`,
        //     { order_id: orderId }
        //   );
        //   console.log("orderdetails=======//////////////////", res.data?.status);

        //   if (res.data?.status && res.data?.data) {
        //     console.log("=====orderdetails=======######################", res.data?.status);

        //     setOrderData(res.data.data);
        //   } else {
        //     setError("Order not found");
        //   }
        // }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // }, []);
  }, [orderId, location.state]);

  console.log("orders data is -------------", orderData);

  // ---------------- Normalize order ----------------
  // ---------------- Normalize order ----------------
  const order1 = useMemo(() => {
    if (!orderData) return null;

    const normalizeStatus = (status = "") =>
      status.toString().toLowerCase().trim();

    // ✅ ORDER-level cancel
    const isOrderCancelled =
      normalizeStatus(orderData.status) === "cancelled" ||
      normalizeStatus(orderData.status) === "canceled";

    const items = (orderData.order_details || []).map((item) => {
      const qty = Number(item.item_qty || 1);
      const total = Number(item.item_grand_total || 0);
      const unitPrice = qty > 0 ? total / qty : total;

      // ✅ ITEM-level cancel (order cancel overrides)
      const isItemCancelled =
        normalizeStatus(item.order_status) === "cancelled" ||
        isOrderCancelled;

      return {
        item_id: item.id,
        name: item.itemLocationModel?.item_name || "Item",
        qty,
        total,
        unitPrice,
        isCancelled: isItemCancelled, // 👈 IMPORTANT
        image: item.itemLocationModel?.item_image
          ? `${imageBaseUrl}${item.itemLocationModel.item_image}`
          : "/placeholder-item.png",
      };
    });

    const total_amount = items.reduce((sum, it) => sum + it.total, 0);

    const paymentType = orderData.payment_type || "";
    const paymentStatus =
      paymentType.toLowerCase() === "cod" ? "Pending" : "Paid";

    return {
      ...orderData,
      items,
      isOrderCancelled, // 👈 RETURN IT
      total_amount,
      payment_status: paymentStatus,
      customer_name: `${orderData.customer_details?.first_name || ""} ${orderData.customer_details?.last_name || ""
        }`.trim(),
      phone: orderData.customer_details?.phone || "",
      address: orderData.customer_details?.address || "",
      date: orderData.order_date,
    };
  }, [orderData, imageBaseUrl]);
  const order = useMemo(() => {
    if (!orderData) return null;

    const normalizeStatus = (status = "") =>
      status.toString().toLowerCase().trim();

    const isOrderCancelled =
      normalizeStatus(orderData.status) === "cancelled" ||
      normalizeStatus(orderData.status) === "canceled";

    const items = (orderData.order_details || []).map((item) => {
      const qty = Number(item.item_qty || 1);
      const total = Number(item.item_grand_total || 0);
      const unitPrice = qty > 0 ? total / qty : total;

      const isItemCancelled =
        normalizeStatus(item.order_status) === "cancelled" ||
        isOrderCancelled;

      return {
        item_id: item.id,
        name: item.itemLocationModel?.item_name || "Item",
        qty,
        total,
        unitPrice,
        isCancelled: isItemCancelled,
        image: item.itemLocationModel?.item_image
          ? `${imageBaseUrl}${item.itemLocationModel.item_image}`
          : "/placeholder-item.png",
      };
    });

    const total_amount = items
      .filter((it) => !it.isCancelled) // exclude cancelled items from total
      .reduce((sum, it) => sum + it.total, 0);

    const paymentType = orderData.payment_type || "";
    const paymentStatus =
      paymentType.toLowerCase() === "cod" ? "Pending" : "Paid";

    return {
      ...orderData,
      items,
      isOrderCancelled,
      total_amount,
      payment_status: paymentStatus,
      customer_name: `${orderData.customer_details?.first_name || ""} ${orderData.customer_details?.last_name || ""}`.trim(),
      phone: orderData.customer_details?.phone || "",
      address: orderData.customer_details?.address || "",
      date: orderData.order_date,
    };
  }, [orderData, imageBaseUrl]);

  // ---------------- Loading ----------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  // ---------------- Error ----------------
  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto p-5 text-center">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "No matching order found."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ---------------- Render ----------------
  return (

    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Back + Close Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Back Button - Left */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white gap-1 px-3 py-1 !bg-gray-600 rounded hover:bg-gray-300 transition"
        >
          <ArrowLeft size={16} />

        </button>

        {/* Close Button - Right */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-white px-3 py-1 !bg-red-600 rounded hover:bg-gray-300 transition"
        >
          <X size={16} />

        </button>
      </div>

      {/* The rest of your content */}
      <div className="bg-white rounded-xl shadow-md p-5 border">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {!order.isOrderCancelled && (
              <>
                <button
                  onClick={() =>
                    navigate("/delivery-tracking", { state: { order } })
                  }
                  className="flex items-center gap-2 px-4 py-2 !bg-green-600 !text-white rounded-lg"
                >
                  <Truck size={18} /> Track
                </button>

                {order.invoice?.invoice_number && (
                  <button
                    onClick={() =>
                      navigate(
                        `/invoice?invoice_number=${order.invoice.invoice_number}`
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 !bg-blue-600 !text-white rounded-lg"
                  >
                    <FileDown size={18} /> Invoice
                  </button>
                )}
              </>
            )}
          </div>

        </div>

        {/* CUSTOMER + PAYMENT + INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">

          {/* CUSTOMER */}
          <div>
            <h3 className="text-gray-500 text-sm font-semibold">Customer</h3>

            <p className="font-medium mt-1">
              {order?.customer_details
                ? `${order.customer_details.first_name} ${order.customer_details.last_name}`
                : ""}
            </p>

            <p className="text-gray-600 text-sm">
              {order?.customer_details?.phone || ""}
            </p>

            <p className="text-gray-600 text-sm">
              {order?.customer_details
                ? `${order.customer_details.billing_address}, 
           ${order.customer_details.city}, 
           ${order.customer_details.state} - ${order.customer_details.zipcode}`
                : "Address not available"}
            </p>
          </div>

          {/* PAYMENT */}
          <div>
            <h3 className="text-gray-500 text-sm font-semibold">Payment</h3>

            <span
              className={`inline-block mt-1 px-3 py-1 text-sm rounded-full ${order?.payment_type === "cod"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
                }`}
            >
              {order?.payment_type?.toUpperCase() || ""}
            </span>
          </div>

          {/* ORDER INFO */}
          <div>
            <h3 className="text-gray-500 text-sm font-semibold">Order Info</h3>

            <p className="font-medium mt-1">
              Order No: {order?.order_number || ""}
            </p>

            <p className="text-gray-600 text-sm">
              Date: {order?.order_date || ""}
            </p>

            <p className="text-gray-700 font-medium text-lg mt-1">
              ₹{Math.round(Number(order?.grand_total || 0))}
            </p>
          </div>

        </div>

        {/* ITEMS LIST */}
        <div className="pt-4 border-t">
          <h2 className="text-lg font-medium mb-3">Items</h2>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-2 p-3 rounded-lg border
        ${item.isCancelled ? "bg-gray-50" : "bg-white"}
        `}
              >

                {/* ✅ TOP RIGHT CANCELLED BADGE */}
                {item.isCancelled && (
                  <span
                    className="
              absolute top-2 right-2
              px-2 py-[2px] text-xs rounded-full
              bg-red-600 text-white shadow
            "
                  >
                    Cancelled
                  </span>
                )}

                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded border"
                  />

                  <div>
                    <p className="text-black text-xs">{item.name}</p>
                    <p className="text-black text-xs">Qty: {item.qty}</p>
                  </div>
                </div>

                {/* RIGHT SIDE PRICE */}
                <div
                  className={`text-left sm:text-right text-sm relative
  ${item.isCancelled ? "pt-8 sm:pt-7" : ""}
  `}
                >

                  <p className="text-gray-500 text-xs">
                    ₹{Math.round(item.unitPrice)}
                  </p>
                  <p className="font-semibold">
                    Total: ₹{Math.round(item.total)}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="flex justify-end mt-5">
            <div className="bg-gray-100 p-4 w-full sm:w-64 rounded-lg border">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Total</span>
                <span>₹{Math.round(Number(order.total_amount || 0))}</span>
              </div>

              <div className="flex justify-between text-lg font-medium mt-3">
                <span>Grand Total</span>
                <span>₹{Math.round(Number(order.total_amount || 0))}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;

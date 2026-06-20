// OrderTrackingPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  X,
  CheckCircle,
  Clock,
  PauseCircle,
  Truck,
  Package,
  ChevronRight,
  MapPin,
  Phone,
  XCircle
} from "lucide-react";

import axios from "axios";
import constantApi from "../constantApi";
/* Normalize backend status → UI key */
const normalizeStatus = (status = "") =>
  status.toLowerCase().trim().replace(/\s+/g, "_");

/* Helper to format dates */
const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return iso;
  }
};

/* UI steps and icons (we'll use auto-progress index to mark done/active) */
// const UI_STEPS = [
//   { key: "order_placed", label: "Order Placed", icon: Package },
//   { key: "order_confirmed", label: "Order Confirmed", icon: Package },
//   { key: "ready_to_ship", label: "Ready to Ship", icon: Clock },
//   { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
//   { key: "delivered", label: "Delivered", icon: CheckCircle },
// ];
const ICON_MAP = {
  "order placed": Package,
  "order confirmed": Package,
  "ready to ship": Clock,
  "out for delivery": Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  hold: PauseCircle,
};

export default function OrderTrackingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;

  // original state & loading/error
  const [orderData, setOrderData] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [error, setError] = useState("");
  const [statusList, setStatusList] = useState([]);

  // Fetch order if not passed in state
  useEffect(() => {
    if (!orderData && orderId) {
      const fetchOrder = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await axios.post(
            `${constantApi.baseUrl}/order/ecommerce_orders/details`,
            { order_id: orderId }
          );

          if (res.data?.status && res.data?.data) {
            setOrderData(res.data.data);
          } else {
            setError("Order not found");
          }
        } catch (err) {
          console.error("Error fetching order:", err);
          setError("Failed to fetch order");
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [orderId, orderData]);
  useEffect(() => {
    const fetchStatusList = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/order-status/list`,
          { params: { company_id: 21 } }
        );

        console.log("✅ Order Status API Full Response:", res.data);

        if (res?.data?.success) {
          console.log("✅ Status List Array:", res.data.data);
          setStatusList(res.data.data || []);
        } else {
          console.warn("⚠️ API returned success = false");
        }
      } catch (err) {
        console.error("❌ Failed to load order status list:", err);
      }
    };

    fetchStatusList();
  }, []);

  // Normalize incoming order data so UI uses consistent keys
  const order = useMemo(() => {
    if (!orderData) return null;

    const customer = orderData.customer_details || {};

    const items = (orderData.order_details || []).map((item) => {
      const qty = Number(item.item_qty || 1);
      const total = Number(item.item_grand_total || item.grand_total || 0);
      const unitPrice = qty > 0 ? total / qty : total;

      return {
        id: item.id,
        name: item.item_name || item.itemLocationModel?.item_name || "Item",
        qty,
        total,
        unitPrice,
        image: item.itemLocationModel?.item_image
          ? `${imageBaseUrl}${item.itemLocationModel.item_image.replace(/^\/+/, "")}`
          : "/placeholder-item.png",
      };
    });

    const total_amount = Number(orderData.grand_total || items.reduce((sum, it) => sum + it.total, 0));

    return {
      order_number: orderData.order_number,
      order_date: orderData.order_date,
      current_order_status: Number(orderData.current_order_status || 1), // ✅ Add this
      customer_name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
      phone: customer.phone || "",
      address: `${customer.billing_address || ""}, ${customer.city || ""}, ${customer.state || ""}, ${customer.zipcode || ""}`,
      country: customer.country,
      items,
      total_amount: Number(total_amount.toFixed(2)),
      eta: null,
    };
  }, [orderData, imageBaseUrl]);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder(); // immediate fetch

    let interval;

    const fetchOrder = async () => {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/order/ecommerce_orders/details`,
          { order_id: orderId }
        );
        if (res.data?.status && res.data?.data) {
          setOrderData(res.data.data);

          // Stop polling if delivered
          if (res.data.data.status?.toLowerCase() === "delivered") {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder();
    interval = setInterval(fetchOrder, 10000);

    return () => clearInterval(interval);
  }, [orderId]);
  useEffect(() => {
    if (order?.items?.length) {
      setSelectedItem(order.items[0]);
    }
  }, [order]);

  const trackingSteps = useMemo(() => {
    if (!statusList.length || !order?.current_order_status) return [];

    const normalize = (str) =>
      String(str || "").toLowerCase().trim().replace(/[_\s]+/g, " ");

    /* 🔥 detect current status */
    const currentStatusObj =
      statusList.find((s) => Number(s.id) === Number(order.current_order_status)) ||
      statusList.find((s) => Number(s.status_order) === Number(order.current_order_status));

    const currentStatusName = normalize(currentStatusObj?.status_name);

    const isHold = currentStatusName === "hold";
    const isCancelled =
      currentStatusName === "cancelled" || currentStatusName === "canceled";

    /* ✅ base flow WITHOUT cancelled */
    const NORMAL_FLOW = [
      "order placed",
      "order confirmed",
      "ready to ship",
      "out for delivery",
      "delivered",
    ];

    /* ❌ cancelled flow */
    const CANCEL_FLOW = [
      "order placed",
      "order confirmed",
      "cancelled",
    ];

    const FLOW = isCancelled ? CANCEL_FLOW : NORMAL_FLOW;

    /* ✅ build steps */
    let steps = statusList
      .filter((s) => FLOW.includes(normalize(s.status_name)))
      .slice()
      .sort((a, b) => Number(a.status_order) - Number(b.status_order))
      .map((s) => ({
        key: normalize(s.status_name).replace(/\s/g, "_"),
        label: s.status_name,
        normalized: normalize(s.status_name),
      }));

    /* ✅ insert HOLD only when active */
    if (isHold) {
      const holdStep = {
        key: "hold",
        label: "Hold",
        normalized: "hold",
        isHold: true,
      };

      const insertAfter = steps.findIndex(
        (s) => s.normalized === "order confirmed"
      );

      if (insertAfter >= 0) steps.splice(insertAfter + 1, 0, holdStep);
      else steps.push(holdStep);
    }

    /* ✅ active index */
    const activeIndex = steps.findIndex(
      (s) => s.normalized === currentStatusName
    );

    return steps.map((s, idx) => ({
      ...s,
      isHold: s.normalized === "hold",
      isCancelled: isCancelled && idx === activeIndex,
      isCompleted: !isCancelled && idx < activeIndex,
      isActive: idx === activeIndex,
    }));
  }, [statusList, order?.current_order_status]);

  // Auto-progress (keeps your previous behavior: increments every 2s until last step)
  // const progress = useMemo(() => {
  //   if (!order?.current_order_status) return 0;

  //   // current_order_status comes as 1,2,3,4,5 → map to 0-based index
  //   const index = order.current_order_status - 1;

  //   // Make sure it doesn't exceed UI_STEPS
  //   return Math.min(Math.max(index, 0), UI_STEPS.length - 1);
  // }, [order?.current_order_status]);

  // UI helpers
  // const completedCount = Math.min(progress + 1, UI_STEPS.length);
  // const progressPercent = (progress / (UI_STEPS.length - 1)) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-5 font-sans text-gray-700">
      <div className="max-w-6xl mx-auto flex justify-between items-center pb-2.5 ">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white gap-1 px-3 py-1 !bg-gray-600 rounded hover:bg-gray-300 transition"
        >
          <ArrowLeft size={16} />

        </button>

        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-white gap-1 px-3 py-1 !bg-red-600 rounded hover:bg-gray-300 transition"
        >
          <X size={16} />

        </button>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Back + Close Buttons */}

        {/* Top / Full-width Order Summary */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <img
                src={selectedItem?.image || "/placeholder-item.png"}
                alt={selectedItem?.name || "Item"}
                className="w-20 h-20 rounded-lg object-cover border"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {selectedItem?.name || "Order"}
                    </h2>
                    {/* <p className="text-sm text-gray-500">
                      Qty: {selectedItem?.qty || 1} • ₹{selectedItem?.price}
                    </p> */}
                    <p className="text-sm text-gray-500">
                      Qty: {selectedItem?.qty || 1} • ₹{Math.round(selectedItem?.unitPrice || 0)}
                    </p>


                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">ORDER ID</p>
                    <p className="font-medium">#{order.order_number}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>
                    <div className="text-xs text-gray-500">Ordered on</div>
                    <div className="font-medium">
                      {formatDate(order.order_date)}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">
                      Estimated Delivery
                    </div>
                    <div className="font-medium">{formatDate(order.eta)}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Current Status</div>
                    {/* <div className="font-medium text-green-600 capitalize">
    {order.current_stage} {order.approval_status && `• ${order.approval_status}`}
  </div> */}
                    <div className="font-medium text-green-600">
                      {/* Status: {order.approval_status} */}
                    </div>

                    <div className="font-medium text-green-600 capitalize">
                      {trackingSteps.find(s => s.isCancelled)?.label ||
                        trackingSteps.find(s => s.isActive)?.label ||
                        trackingSteps.at(-1)?.label ||
                        "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline (main column) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow space-y-4">
            <h3 className="text-lg font-semibold">Tracking Progress</h3>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Steps column */}
              <div className="w-full md:w-3/4">
                <div className="relative">
                  {/* Desktop vertical timeline */}
                  <div className="hidden md:block absolute left-10 top-6 bottom-6 w-[3px] bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-[3px] rounded-full
                   bg-gradient-to-b from-green-400 via-green-500 to-green-600
                   shadow-[0_0_12px_rgba(34,197,94,0.6)]
                   transition-all duration-700"
                      style={{
                        height: `${trackingSteps.length
                          ? ((trackingSteps.filter(s => s.isCompleted).length + 1) / trackingSteps.length) * 100
                          : 0
                          }%`,
                      }}
                    />
                  </div>

                  <ul className="space-y-4 md:space-y-5">
                    {trackingSteps.map((step) => {
                      const Icon =
                        ICON_MAP[step.normalized] ||
                        (step.isHold ? PauseCircle : Truck);

                      return (
                        <li
                          key={step.key}
                          className="flex items-start md:items-center gap-4 transition-all duration-300 hover:translate-x-1"
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center
            ${step.isHold
                                  ? "bg-yellow-400 text-white"
                                  : step.isCompleted
                                    ? "bg-green-600 text-white shadow-lg"
                                    : step.isActive
                                      ? "bg-yellow-400 text-white animate-pulse ring-4 ring-yellow-200"
                                      : "bg-gray-100 text-gray-400"}
          `}
                            >
                              <Icon size={16} />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{step.label}</div>

                            <div className="mt-1">
                              {step.isHold && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                  On Hold
                                </span>
                              )}

                              {step.isCompleted && !step.isHold && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  Completed
                                </span>
                              )}

                              {step.isActive && !step.isHold && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                  In Progress
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}


                  </ul>
                </div>

                {/* Mobile horizontal progress */}
                <div className="mt-6 md:hidden">
                  <div className="relative">
                    <div className="h-1 bg-gray-200 rounded-full" />
                    <div
                      className="absolute top-0 h-1 rounded-full
                   bg-gradient-to-r from-green-400 to-green-600
                   transition-all duration-700"
                      style={{
                        width: `${trackingSteps.length
                          ? (trackingSteps.filter(s => s.isCompleted).length / (trackingSteps.length - 1)) * 100
                          : 0
                          }%`
                      }}
                    />
                    <div
                      className="absolute -top-4 transition-all duration-700"
                      style={{
                        left: `${trackingSteps.length
                          ? (trackingSteps.filter(s => s.isCompleted).length / (trackingSteps.length - 1)) * 100
                          : 0
                          }%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <Truck className="text-blue-600 w-6 h-6 drop-shadow" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right summary for timeline */}
              <div className="w-full md:w-1/4">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <div className="text-sm text-gray-500">Progress</div>
                  <div className="font-semibold text-gray-800 text-xl mt-1">
                    {trackingSteps.filter(s => s.isCompleted).length} / {trackingSteps.length}
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <div>
                      Estimated:{" "}
                      <span className="font-medium">
                        {formatDate(order.eta)}
                      </span>
                    </div>
                    <div className="mt-2">
                      Tracking ID:{" "}
                      <span className="font-mono text-sm">
                        {order.order_uid || orderId}
                      </span>

                    </div>
                  </div>

                  <button
                    // onClick={() => navigate(`/order_details/${orderId || order.order_number}`)}
                    onClick={() => navigate("/")}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm hover:shadow"
                  >
                    <ChevronRight size={16} />
                    {/* View Order Details */}
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery details + Items */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow">
              <div className="flex items-start gap-3">
                <MapPin size={20} />
                <div>
                  <div className="text-xs text-gray-500">Delivery Address</div>
                  <div className="font-medium text-gray-800">
                    {order.customer_name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {order.address}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                <div>{order.phone}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Order Items</div>
                  <div className="font-medium">
                    {order.items?.length} item(s)
                  </div>
                </div>
                {/* <div className="text-sm text-gray-500">Total: ₹{(order.items || []).reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)}</div> */}
                <div className="text-sm text-gray-500">
                  Total: ₹
                  {Math.round(
                    (order.items || []).reduce((s, it) => s + it.total, 0)
                  )}
                </div>


              </div>

              <div className="mt-3 space-y-3">
                {order.items?.map((it) => (
                  <div
                    key={it.id}
                    onClick={() => setSelectedItem(it)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border
      ${selectedItem?.id === it.id
                        ? "!border-green-500 bg-green-50"
                        : "!border-transparent hover:bg-gray-50"
                      }
    `}
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">
                        {it.name}
                      </div>
                      {/* <div className="text-xs text-gray-500">
                        Qty: {it.qty} • ₹{it.price}
                      </div> */}
                      <div className="text-xs text-gray-500">
                        Qty: {it.qty} • ₹{Math.round(it.unitPrice)}
                      </div>


                    </div>
                  </div>
                ))}

                {order.items && order.items.length > 3 && (
                  <button
                    onClick={() =>
                      navigate(`/order/${orderId || order.order_uid}`)
                    }
                    className="w-full text-sm text-indigo-600 mt-2"
                  >
                    View all items
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

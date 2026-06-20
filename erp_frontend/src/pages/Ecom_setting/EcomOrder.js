import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { axios_post } from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import CollectionList from "./CollectionList";
import OrderCancellationDetails from "./OrderCancellationDetails";
import axios from "axios";
import constantApi from "constantApi";
import TrackingDetailsPopup from "./TrackingDetailsPopup"; // Adjust path as needed
import Loader from "../../utils/Loader"; // adjust path if needed
import ShippingAddressPopup from "./ShippingAddressPopup";

export default function EcomOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL = Total Orders
  const [statusList, setStatusList] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);

  const navigate = useNavigate();

  // Filters
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchOrderNo, setSearchOrderNo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showTrackingPopup, setShowTrackingPopup] = useState(false);
  const [currentOrderForTracking, setCurrentOrderForTracking] = useState(null);

  const statusMap = {
    Created: "Pending",
    Close: "Processing",
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    "Order Placed": "bg-indigo-100 text-indigo-700",
    "Order Confirmed": "bg-indigo-200 text-indigo-800",
    "Ready to Ship": "bg-blue-100 text-blue-700",
    "Out for Delivery": "bg-pink-100 text-pink-700",
    Delivered: "bg-green-100 text-green-700",
    Completed: "bg-green-300 text-green-900",
    Cancelled: "bg-red-100 text-red-700",
  };

  const cardBgColors = {
    "Total Orders": "bg-slate-200 hover:bg-slate-300 text-slate-900",

    "Order Placed": "bg-indigo-100 hover:bg-indigo-200 text-indigo-800",
    "Order Confirmed": "bg-purple-100 hover:bg-purple-200 text-purple-800",
    "Ready to Ship": "bg-blue-100 hover:bg-blue-200 text-blue-800",
    "Out for Delivery": "bg-pink-100 hover:bg-pink-200 text-pink-800",

    Delivered: "bg-green-100 hover:bg-green-200 text-green-800",
    Completed: "bg-emerald-200 hover:bg-emerald-300 text-emerald-900",

    Cancelled: "bg-red-100 hover:bg-red-200 text-red-800",
    Returned: "bg-orange-100 hover:bg-orange-200 text-orange-800",
    Refunded: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
  };
  const getCardBgByLabel = (label) => {
    return cardBgColors[label] || "bg-gray-100 hover:bg-gray-200 text-gray-800";
  };

  const getStatusIndexById = (id) =>
    statusList.findIndex((s) => s.id === Number(id));

  const getStatusIndexByName = (name) =>
    statusList.findIndex((s) => s.status_name === name);

  // Extra statuses only when status is Delivered
  const deliveredExtraStatuses = ["Return", "Refund", "Exchange"];

  const fetchOrderList = async () => {
    try {
      setOrdersLoading(true);

      const response = await axios_post(true, "order/list", {});
      if (response.status && response.data?.records) {
        const onlineOrders = response.data.records.filter(
          (item) =>
            item.customer_lpo &&
            item.customer_lpo.toLowerCase() === "online customer",
        );

        console.log("online order is ", onlineOrders);

        const formattedOrders = onlineOrders.map((item) => ({
          id: item.id,
          orderNo: item.order_number || `ORD-${item.id}`,
          customer: item.customer_details
            ? `${item.customer_details.first_name} ${item.customer_details.last_name}`
            : "Guest Customer",
          email: item.customer_details?.email || "N/A",
          amount: `₹${item.grand_total}`,
          current_order_status: item.current_order_status || 1,
          current_stage: item.current_stage || null,
          date: item.order_date,
          invoice: item.invoice || null,
          customer_address_id: item.customer_address_id,
        }));

        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch order list:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // 🔥 STATUS FILTER (ID BASED)
    if (activeFilter !== "ALL") {
      filtered = filtered.filter(
        (o) => Number(o.current_order_status) === Number(activeFilter),
      );
    }

    // Customer search
    if (searchCustomer.trim()) {
      filtered = filtered.filter((o) =>
        o.customer.toLowerCase().includes(searchCustomer.toLowerCase()),
      );
    }

    // Order number search
    if (searchOrderNo.trim()) {
      filtered = filtered.filter((o) =>
        o.orderNo.toLowerCase().includes(searchOrderNo.toLowerCase()),
      );
    }

    // Date filters
    if (dateFrom) {
      filtered = filtered.filter((o) => new Date(o.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter((o) => new Date(o.date) <= new Date(dateTo));
    }

    setFilteredOrders(filtered);
  }, [activeFilter, searchCustomer, searchOrderNo, dateFrom, dateTo, orders]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  /* ===================== STATUS LIST ===================== */
  const [company_id, setCompany_id] = useState(21);

  const fetchStatusList = async () => {
    try {
      setStatusLoading(true);

      const response = await axios.get(
        `${constantApi.baseUrl}/order-status/list`,
        { params: { company_id } },
      );

      if (response?.data?.success) {
        setStatusList(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch status list", err);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusList();
  }, []);

  const statsList = [
    { label: "Total Orders", id: "ALL" },
    ...statusList.map((s) => ({
      label: s.status_name,
      id: s.id, // 🔥 IMPORTANT
      order: s.status_order,
    })),
  ];

  const statusIdNameMap = statusList.reduce((acc, s) => {
    acc[s.id] = s.status_name;
    return acc;
  }, {});

  const getStatusNameById = (id) => {
    return statusIdNameMap[id] || "Unknown Status";
  };

  const updateStatus = async (id, newStatus, order) => {
    const newStatusId = Number(newStatus);
    const newStatusName = getStatusNameById(newStatusId);
    const currentStatusName = getStatusNameById(order.current_order_status);

    if (newStatusName === "Out for Delivery") {
      setCurrentOrderForTracking(order);
      setShowTrackingPopup(true);
      return;
    }

    if (
      currentStatusName === "Ready to Ship" &&
      (newStatusName === "Out for Delivery" || newStatusName === "Delivered") &&
      !order.invoice
    ) {
      alert(
        "Cannot change status to Out for Delivery or Delivered without an invoice.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to change the status?`,
    );
    if (!confirmed) return;

    try {
      setLoadingId(id);
      const response = await axios.post(
        `${constantApi.baseUrl}/order/ecommerce/update-order-status`,
        {
          order_id: id,
          status: newStatusId,
          newStatusName: newStatusName,
        },
      );
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id
              ? {
                  ...order,
                  current_order_status: newStatusId,
                  current_stage: newStatusName, // ✅ ADD THIS
                }
              : order,
          ),
        );

        alert("Order status updated successfully");
      } else {
        alert("Status update failed");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusIdByName = (name) =>
    statsList.find((s) => s.status_name === name)?.id || null;

  const handleTrackingSaved = async () => {
    if (!currentOrderForTracking) return;

    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/order/ecommerce/update-order-status`,
        {
          order_id: currentOrderForTracking.id,
          status: "Out for Delivery",
        },
      );

      const statusIdForOutForDelivery = getStatusIdByName("Out for Delivery");

      if (response.status) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === currentOrderForTracking.id
              ? { ...order, current_order_status: statusIdForOutForDelivery }
              : order,
          ),
        );
      }
    } catch (err) {
      alert("Failed to update order status after saving tracking.");
    } finally {
      setShowTrackingPopup(false);
      setCurrentOrderForTracking(null);
    }
  };

  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShippingPopup, setShowShippingPopup] = useState(false);

  const fetchShippingAddress = async (shiipingAddId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${constantApi.baseUrl}/shipping_address/details/${shiipingAddId}`,
      );

      // assuming API returns data in response.data
      setShippingAddress(response.data);
      console.log("shippping address is ", response.data);
    } catch (err) {
      console.error("Failed to fetch shipping address:", err);
      setError("Failed to load shipping address");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (shiipingAddId) => {
    setShowShippingPopup(true);
    fetchShippingAddress(shiipingAddId);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {showTrackingPopup && currentOrderForTracking && (
        <TrackingDetailsPopup
          orderId={currentOrderForTracking.id}
          onClose={() => setShowTrackingPopup(false)}
          onSave={handleTrackingSaved}
          getStatusIdByName={getStatusIdByName} // pass function reference
        />
      )}

      <div className="min-h-screen bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Online Order Management
              </h1>
              <p className="text-sm text-gray-500">
                View and manage customer orders
              </p>
            </div>
            <button
              onClick={() => navigate("/ecom-payments")}
              className="px-4 py-2 rounded-lg bg-black text-white text-sm"
            >
              Payment Collection
            </button>
          </div>

          {/* Stats Cards */}
          {statusLoading ? (
            <Loader text="Loading order statuses..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-3">
              {statsList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveFilter(item.id)}
                  className={`
    cursor-pointer rounded-2xl p-2 shadow-sm transition-all
    ${getCardBgByLabel(item.label)}
    ${activeFilter === item.id ? "ring-4 ring-black scale-105" : ""}
  `}
                >
                  <p className="text-sm font-medium text-gray-700">
                    {item.label}
                  </p>

                  <h2 className="text-2xl font-semibold text-gray-800 mt-1">
                    {item.id === "ALL"
                      ? orders.length
                      : orders.filter(
                          (o) =>
                            Number(o.current_order_status) === Number(item.id),
                        ).length}
                  </h2>
                </div>
              ))}
            </div>
          )}

          {/* Search Filters */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
            />

            <input
              type="text"
              placeholder="Search by order id"
              value={searchOrderNo}
              onChange={(e) => setSearchOrderNo(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
            />

            <input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />

            <input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
              <table className="min-w-[1100px] w-full text-sm table-auto">
                {/* Table Head */}
                <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left min-w-[120px] whitespace-nowrap">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left min-w-[160px] whitespace-nowrap">
                      Order Date
                    </th>
                    <th className="px-4 py-3 text-left min-w-[220px]">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left min-w-[120px] whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left min-w-[140px] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left min-w-[160px] whitespace-nowrap">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left min-w-[180px] whitespace-nowrap">
                      Invoice Number
                    </th>
                    <th className="px-4 py-3 text-left min-w-[180px] whitespace-nowrap">
                      Shipping Address
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b last:border-none hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                          {order.orderNo}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {order.date}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800">{order.customer}</p>
                          <p className="text-xs text-gray-500 break-all">
                            {order.email}
                          </p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {order.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[
                                getStatusNameById(order.current_order_status)
                              ] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {getStatusNameById(order.current_order_status)}
                          </span>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <select
                              disabled={loadingId === order.id}
                              value={order.current_order_status}
                              onChange={(e) =>
                                updateStatus(
                                  order.id,
                                  Number(e.target.value),
                                  order,
                                )
                              }
                              className="border rounded-lg px-2 py-1 text-sm"
                            >
                              {statusList.map((status) => {
                                const statusName = status.status_name;
                                const statusId = status.id;
                                const currentStatusName = getStatusNameById(
                                  order.current_order_status,
                                );
                                const isPrevious =
                                  getStatusIndexById(statusId) <
                                  getStatusIndexById(
                                    order.current_order_status,
                                  );

                                // Disable "Out for Delivery" and "Delivered" if invoice missing
                                const disableDueToInvoiceMissing =
                                  !order.invoice &&
                                  (statusName === "Out for Delivery" ||
                                    statusName === "Delivered");

                                return (
                                  <option
                                    key={statusId}
                                    value={statusId}
                                    disabled={
                                      isPrevious || disableDueToInvoiceMissing
                                    }
                                    className={
                                      isPrevious
                                        ? "text-gray-400 bg-gray-100"
                                        : ""
                                    }
                                  >
                                    {statusName}
                                  </option>
                                );
                              })}

                              {/* Extra options after Delivered */}
                              {getStatusNameById(order.current_order_status) ===
                                "Delivered" &&
                                deliveredExtraStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                            </select>

                            {/* Back icon - rollback status */}
                            {getStatusIndexById(order.current_order_status) >
                              0 && (
                              <button
                                title="Rollback Status"
                                onClick={() => {
                                  const prevIndex =
                                    getStatusIndexById(
                                      order.current_order_status,
                                    ) - 1;
                                  const prevStatus = statusList[prevIndex];

                                  if (prevStatus) {
                                    updateStatus(
                                      order.id,
                                      prevStatus.id,
                                      order,
                                    );
                                  }
                                }}
                                className="text-gray-500 hover:text-black"
                              >
                                ↩
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-blue-600 font-medium underline cursor-pointer">
                          {order.invoice?.invoice_number ? (
                            <Link to={`/invoice/view/${order.invoice.id}`}>
                              {order.invoice.invoice_number}
                            </Link>
                          ) : order?.current_stage === "Ready to Ship" ? (
                            <Link
                              to={`/order/generate_invoice/${order.id}`}
                              className="text-red-600 hover:text-red-800"
                              title="Generate Invoice"
                            >
                              Generate Invoice
                            </Link>
                          ) : (
                            ""
                          )}
                        </td>

                        <td
                          className="px-4 py-3 whitespace-nowrap text-blue-600 underline cursor-pointer"
                          onClick={() =>
                            handleViewClick(order.customer_address_id)
                          }
                        >
                          View
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {showShippingPopup && (
        <ShippingAddressPopup
          onClose={() => {
            setShowShippingPopup(false);
            setShippingAddress(null);
            setError(null);
          }}
          loading={loading}
          error={error}
          address={shippingAddress?.data}
        />
      )}
    </DashboardLayout>
  );
}

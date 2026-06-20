import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";
import OrderTrackingHorizontal from "./OrderTrackingHorizontal";
import { FaChevronRight } from "react-icons/fa";

const getFinalStatusLabel = (order, statusList) => {
  const status = getNormalizedOrderStatus(order, statusList);

  if (status === "delivered") return "Delivered";

  if (
    normalizeStatus(order.current_stage) === "cancelled" ||
    status === "cancelled" ||
    isOrderFullyCancelled(order)
  ) {
    return "Cancelled";
  }

  const hasReturnedItem = order.order_details?.some(item =>
    ["returned", "return requested", "return approved"].includes(
      normalizeStatus(item.order_status)
    )
  );

  if (hasReturnedItem) return "Returned";

  return "";
};

const getNormalizedOrderStatus = (order, statusList) => {
  if (!order || !statusList?.length) return "";

  const found = statusList.find(
    s => Number(s.id) === Number(order.current_order_status)
  );

  return found
    ? normalizeStatus(found.status_name)
    : normalizeStatus(order.status);
};


const normalizeStatus = (status = "") =>
  status?.toString().toLowerCase().replace(/[_-]+/g, " ").trim();

const isItemCancelled = (item) =>
  normalizeStatus(item.order_status) === "cancelled";

const isOrderFullyCancelled = (order) =>
  order?.order_details?.length > 0 &&
  order.order_details.every(isItemCancelled);
const shouldShowTracking = (order, statusList) => {
  const finalLabel = getFinalStatusLabel(order, statusList);

  // ❌ final states → no tracking
  if (["Delivered", "Cancelled", "Returned"].includes(finalLabel)) {
    return false;
  }

  // ✅ all other states → show tracking
  return true;
};
const getLiveStatusLabel = (order, statusList) => {
  if (!order || !statusList?.length) return "";

  const found = statusList.find(
    s => Number(s.id) === Number(order.current_order_status)
  );

  return found?.status_name || "";
};


const canCancelOrder = (order, statusList) => {
  if (!order) return false;

  const status = getNormalizedOrderStatus(order, statusList);

  if (
    ["ready to ship", "shipped", "out for delivery", "delivered", "cancelled"]
      .includes(status)
  ) {
    return false;
  }

  if (isOrderFullyCancelled(order)) return false;

  return true;
};

const canExchangeOrder = (order, statusList) => {
  if (!order) return false;

  const status = getNormalizedOrderStatus(order, statusList);
  if (status !== "delivered") return false;

  if (isOrderFullyCancelled(order)) return false;

  const deliveredDate = new Date(order.order_date);
  const diffDays =
    (new Date() - deliveredDate) / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
};

const canReturnOrder = (order, statusList) => {
  if (!order) return false;

  const status = getNormalizedOrderStatus(order, statusList);
  if (status !== "delivered") return false;

  if (isOrderFullyCancelled(order)) return false;

  const deliveredDate = new Date(order.order_date);
  const diffDays =
    (new Date() - deliveredDate) / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
};
const canViewInvoice = (order, statusList) => {
  if (!order || !statusList?.length) return false;

  const statusObj = statusList.find(
    s => Number(s.id) === Number(order.current_order_status)
  );

  const status = normalizeStatus(statusObj?.status_name);

  return [
    "ready to ship",
    "shipped",
    "out for delivery",
    "delivered"
  ].includes(status);
};


const OrdersSection = ({
  customerOrders,
  ordersLoading,
  ordersError,
  BounceLoader,
  handleAddToCart,
  imageBaseUrl,
  statusList
  // OrderTrackingHorizontal,
}) => {

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest | oldest | high | low
  const [dateFilter, setDateFilter] = useState("all"); // all | today | 7 | 30 | month
  const [statusFilter, setStatusFilter] = useState("all"); // all | delivered | cancelled | returned

  if (ordersLoading) return <BounceLoader />;
  if (ordersError) return <p className="text-red-500 text-center mt-4">{ordersError}</p>;
  if (!customerOrders || customerOrders.length === 0)
    return <p className="text-gray-500 text-center mt-4">No orders found.</p>;

  return (

    <div className="md:max-h-[450px] md:overflow-y-auto pr-1 space-y-3">
      {/* <h2 className="text-lg font-semibold mb-2 text-gray-800 border-b pb-1">
        My Orders
      </h2> */}
      {/* SEARCH + SORT BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">

        {/* 🔍 SEARCH — MANUAL WIDTH */}
        <input
          type="text"
          placeholder="Search by order #, customer, item..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="
      border rounded px-3 py-2 w-full text-xs h-8
      sm:w-[500px]   /* 👈 change this value */
    "
        />

        {/* 🔽 SORT + FILTER GROUP */}
        <div className="grid grid-cols-3 gap-1 w-full sm:flex sm:w-auto font-normal">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-0 pl-1 py-1 !text-[14px] sm:text-xs h-8 w-full sm:w-[150px] min-w-0 "
          >
            <option className="text-xs" value="latest">Latest</option>
            <option className="text-xs" value="oldest">Oldest</option>
            <option className="text-xs" value="high">High → Low</option>
            <option className="text-xs" value="low">Low → High</option>

          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-0 pl-1 py-1 !text-[14px] sm:text-xs h-8 w-full sm:w-[10px] min-w-0"
          >
            <option value="all" className="text-xs">All Orders</option>
            <option value="delivered" className="text-xs">Delivered</option>
            <option value="cancelled" className="text-xs">Cancelled</option>
            <option value="returned" className="text-xs">Returned</option>

          </select>



          {/* 📅 DATE */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-0 pl-1 py-1 !text-[14px] sm:text-xs h-8 w-full sm:w-[150px] min-w-0"
          >
            <option value="all" className="text-xs">All Dates</option>
            <option value="today" className="text-xs">Today</option>
            <option value="7" className="text-xs">Last 7 Days</option>
            <option value="30" className="text-xs">Last 30 Days</option>
            <option value="month" className="text-xs">This Month</option>

          </select>
        </div>

      </div>


      {/* DATE FILTER DROPDOWN */}


      {(() => {
        const filteredOrders = [...customerOrders]
          .filter((order) => {
            const text = searchText.toLowerCase();

            // ---------- SEARCH ----------
            const orderNo = order.order_number?.toString().toLowerCase() || "";

            const customerName =
              `${order.customer_details?.first_name || ""} ${order.customer_details?.last_name || ""}`
                .toLowerCase();

            const itemNameMatch = order.order_details?.some((item) =>
              (
                item.itemLocationModel?.item_name ||
                item.item_name ||
                item.name ||
                ""
              )
                .toLowerCase()
                .includes(text)
            );

            const itemPriceMatch = order.order_details?.some((item) => {
              const qty = Number(item.item_qty || 1);
              const unitNet = Number(item.item_net || 0);
              const unitTax = Number(item.tax_amount || 0);
              const total = Math.round((unitNet + unitTax) * qty);
              return total.toString().includes(text);
            });

            const searchMatch =
              orderNo.includes(text) ||
              customerName.includes(text) ||
              itemNameMatch ||
              itemPriceMatch;

            // ---------- DATE FILTER ----------
            const orderDate = new Date(order.order_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let dateMatch = true;

            if (dateFilter === "today") {
              dateMatch =
                orderDate >= today &&
                orderDate < new Date(today.getTime() + 86400000);
            }

            if (dateFilter === "7") {
              const past7 = new Date(today);
              past7.setDate(today.getDate() - 7);
              dateMatch = orderDate >= past7;
            }

            if (dateFilter === "30") {
              const past30 = new Date(today);
              past30.setDate(today.getDate() - 30);
              dateMatch = orderDate >= past30;
            }

            if (dateFilter === "month") {
              dateMatch =
                orderDate.getMonth() === today.getMonth() &&
                orderDate.getFullYear() === today.getFullYear();
            }
            // ---------- STATUS FILTER ----------
            // ---------- STATUS FILTER ----------
            let statusMatch = true;

            const normalizedStatus = getNormalizedOrderStatus(order, statusList);

            // ✅ DELIVERED
            if (statusFilter === "delivered") {
              statusMatch = normalizedStatus === "delivered";
            }

            // ✅ CANCELLED
            if (statusFilter === "cancelled") {
              statusMatch =
                normalizeStatus(order.current_stage) === "cancelled" ||
                normalizedStatus === "cancelled" ||
                isOrderFullyCancelled(order) ||
                order.order_details?.every(
                  (item) => normalizeStatus(item.order_status) === "cancelled"
                );
            }


            // ✅ RETURNED (item level)
            if (statusFilter === "returned") {
              statusMatch = order.order_details?.some((item) =>
                ["returned", "return requested", "return approved"].includes(
                  normalizeStatus(item.order_status)
                )
              );
            }

            // ✅ ALL
            if (statusFilter === "all") {
              statusMatch = true;
            }


            return searchMatch && dateMatch && statusMatch;
          })


          .sort((a, b) => {
            if (sortBy === "latest")
              return new Date(b.order_date) - new Date(a.order_date);

            if (sortBy === "oldest")
              return new Date(a.order_date) - new Date(b.order_date);

            if (sortBy === "high")
              return Number(b.grand_total || 0) - Number(a.grand_total || 0);

            if (sortBy === "low")
              return Number(a.grand_total || 0) - Number(b.grand_total || 0);

            return 0; // for status filters, keep original order
          });


        if (filteredOrders.length === 0) {
          return (
            <p className="text-center text-gray-500 mt-4">
              No matching orders found.
            </p>
          );
        }


        return filteredOrders.map((order) => (

          <OrderCard
            key={order.id}
            order={order}
            handleAddToCart={handleAddToCart}
            navigate={navigate}
            imageBaseUrl={imageBaseUrl}
            statusList={statusList}
          />
        ));
      })()}


    </div>
  );
};

export default OrdersSection;

/* Small reusable OrderCard component */
const OrderCard = ({ order, handleAddToCart, navigate, imageBaseUrl, statusList }) => {
  const [itemsOpen, setItemsOpen] = useState(false); // 👈 collapsed by default

  // Map order.status (ID) to status_name from statusList
  const getStatusName = (status) => {
    if (!statusList || statusList.length === 0) return "";

    // If status is number, match by ID
    if (!isNaN(status)) {
      const found = statusList.find(s => Number(s.id) === Number(status));
      if (found) return found.status_name;
    }

    // If status is string, try to normalize and match name
    const normalizedStatus = status?.toString().toLowerCase().replace(/[_-]+/g, " ").trim();
    const foundByName = statusList.find(
      s => s.status_name?.toLowerCase() === normalizedStatus
    );
    if (foundByName) return foundByName.status_name;

    return "";
  };


  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-3 hover:shadow-md transition-shadow duration-200">
      {/* HEADER */}
      {/* HEADER WITH CENTERED CUSTOMER */}
      <div className="grid grid-cols-3 items-start text-xs text-gray-600 bg-gray-50 p-3 rounded-lg mb-2">
        {/* LEFT */}
        <div>
          <p className="font-semibold text-gray-800">ORDER DATE</p>
          <p>{new Date(order.order_date).toLocaleDateString()}</p>
        </div>

        {/* CENTER */}
        <div className="text-center">
          <p className="font-medium text-gray-800 truncate">
            Customer
          </p>
          <p className="font-semibold truncate">
            {order.customer_details?.first_name}{" "}
            {order.customer_details?.last_name}
          </p>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <p className="font-semibold text-gray-800">ORDER #</p>
          <p className="text-blue-600 font-medium">
            {order.order_number}
          </p>
        </div>
      </div>


      {/* CUSTOMER + TOTAL */}
      <div className="mb-2 text-gray-700 text-xs space-y-1">
        <div className="flex items-center justify-between w-full mb-2">

          {/* Left Side */}
          {/* Left Side */}
          <div className="text-xs font-semibold">
            {(() => {
              const finalLabel = getFinalStatusLabel(order, statusList);

              let textClass = "text-blue-600";
              let bgClass = "bg-blue-100";
              let label = "";

              // ✅ FINAL STATES
              if (finalLabel) {
                label = finalLabel;

                if (finalLabel === "Delivered") {
                  textClass = "text-green-600";
                  bgClass = "bg-green-100";
                } else if (finalLabel === "Cancelled") {
                  textClass = "text-red-600";
                  bgClass = "bg-red-100";
                } else {
                  textClass = "text-yellow-700";
                  bgClass = "bg-yellow-100";
                }
              } else {
                // ✅ LIVE STATUS COLORS
                label = getLiveStatusLabel(order, statusList) || "Order Placed";
                const s = normalizeStatus(label);

                if (s === "order confirmed" || s === "confirmed") {
                  textClass = "text-purple-600";
                  bgClass = "bg-purple-100";
                } else if (s === "out for delivery") {
                  textClass = "text-orange-600";
                  bgClass = "bg-orange-100";
                } else if (s === "ready to ship") {
                  textClass = "text-indigo-600";
                  bgClass = "bg-indigo-100";
                } else if (s === "shipped") {
                  textClass = "text-cyan-700";
                  bgClass = "bg-cyan-100";
                } else {
                  // placed / processing etc
                  textClass = "text-blue-600";
                  bgClass = "bg-blue-100";
                }
              }

              return (
                <span
                  className={`
          inline-flex items-center
          px-2 py-[2px] rounded-full
          ${textClass} ${bgClass}
        `}
                >
                  {label}
                </span>
              );
            })()}
          </div>

          {/* Center */}
          <div className="text-xs font-medium text-gray-800 text-center">
            Total: ₹{Math.round(Number(order.grand_total || 0))}
          </div>

          {/* Right Side */}
          {(
            normalizeStatus(order.current_stage) === "cancelled" ||
            order.order_details?.some(item => isItemCancelled(item))
          ) && (
              <button
                onClick={() =>
                  navigate(`/cancelled-items/${order.order_number}`, { state: { order } })
                }
                className="!bg-gray-500 text-white px-3 py-1 rounded text-[11px] hover:bg-red-600 transition whitespace-nowrap"
              >
                View Cancelled
              </button>
            )}

        </div>

        {/* ORDER TRACKING */}
        {/* ORDER TRACKING OR FINAL STATUS */}
        {shouldShowTracking(order, statusList) && (
          <div className="mt-3">
            <OrderTrackingHorizontal
              currentOrderStatus={order.current_order_status}
              statusList={statusList}
            />
          </div>
        )}




      </div>

      {/* ITEMS */}
      {itemsOpen && order.order_details?.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-3">

          <div
            className="
        grid
        grid-cols-4
        sm:grid-cols-6
        md:grid-cols-8
        lg:grid-cols-10
        xl:grid-cols-12
        gap-3
      "
          >
            {[...order.order_details]
              .sort((a, b) => {
                const aCancelled = isItemCancelled(a);
                const bCancelled = isItemCancelled(b);
                return aCancelled === bCancelled ? 0 : aCancelled ? 1 : -1;
              })
              .map((item) => {
                const qty = Number(item.item_qty || 1);

                const backendTotal =
                  item.item_total_net ??
                  item.total_net ??
                  item.item_grand_total ??
                  null;

                const unitNet = Number(item.item_net || 0);
                const unitTax = Number(item.tax_amount || 0);
                const manualTotal = (unitNet + unitTax) * qty;

                const totalPrice = Math.round(
                  Number(backendTotal ?? manualTotal ?? 0)
                );

                const isCancelled =
                  normalizeStatus(order.current_stage) === "cancelled" ||
                  isItemCancelled(item);

                return (
                  <div
                    key={item.id}
                    className={`
                p-2 text-[11px] text-center transition
                ${isCancelled
                        ? "bg-gray-100 opacity-70 rounded-lg"
                        : "bg-white rounded-xl border hover:shadow-sm"
                      }
              `}
                  >
                    {/* IMAGE */}
                    <Link to={`/items/${item.item_id || item.id}`}>
                      <img
                        src={
                          item?.itemLocationModel?.item_image
                            ? `${imageBaseUrl}${item.itemLocationModel.item_image.replace(
                              /^\/+/,
                              ""
                            )}`
                            : "/placeholder.png"
                        }
                        alt={item.item_name || "Item"}
                        className="w-14 h-14 mx-auto object-cover rounded-md mb-1"
                      />
                    </Link>

                    {/* NAME */}
                    <p className="font-semibold text-[10px] break-words">
                      {item.itemLocationModel?.item_name || item.name}
                    </p>


                    {/* META */}
                    <p className="text-gray-500 text-[10px]">
                      Qty: {qty}
                    </p>

                    {/* PRICE */}
                    <p className="font-semibold text-gray-900 mt-1">
                      ₹{totalPrice}
                    </p>

                    {/* CANCELLED */}
                    {isCancelled && (
                      <span className="text-red-600 text-[10px] font-semibold">
                        Cancelled
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}



      {/* ACTIONS */}
      <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">

        {/* ✅ LEFT — Show / Hide Items (always left) */}
        <button
          onClick={() => setItemsOpen(prev => !prev)}
          className="
    flex items-center gap-2
    px-3 py-2
    bg-gray-50 hover:bg-gray-100
    border border-gray-200
    rounded-md
    text-gray-700 text-xs font-semibold
    transition
  "
        >
          <span
            className={`transition-transform duration-200 ${itemsOpen ? "rotate-90" : "rotate-0"
              }`}
          >
            ▶
          </span>

          <span>
            {itemsOpen ? "Hide Items" : "Show Items"}
            {order.order_details?.length ? ` (${order.order_details.length})` : ""}
          </span>
        </button>

        {/* ✅ RIGHT — All action buttons */}
        <div className="flex justify-end gap-2 flex-wrap">

          {/* {canCancelOrder(order, statusList) && (
            <button
              onClick={() =>
                navigate(`/cancel-order/${order.id}`, { state: { order } })
              }
              className="!bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
            >
              Cancel
            </button>
          )} */}

          {/* {canReturnOrder(order, statusList) && (
            <button
              onClick={() =>
                navigate(`/return-order/${order.id}`, { state: { order } })
              }
              className="!bg-yellow-500 text-white px-3 py-1 rounded text-xs"
            >
              Return
            </button>
          )} */}

          {/* {canExchangeOrder(order, statusList) && (
            <button
              onClick={() =>
                navigate(`/exchange-order/${order.id}`, { state: { order } })
              }
              className="!bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition"
            >
              Exchange
            </button>
          )} */}

          {order.invoice?.invoice_number &&
            canViewInvoice(order, statusList) && (
              <button
                onClick={() =>
                  navigate(`/invoice?invoice_number=${order.invoice.invoice_number}`)
                }
                className="!bg-green-600 text-white px-3 py-1 rounded text-xs"
              >
                Invoice
              </button>
            )}

          <button
            onClick={() =>
              navigate(`/order_details/${order.id}`, { state: { order } })
            }
            className="!bg-blue-600 text-white px-3 py-1 rounded text-xs"
          >
            View
          </button>

        </div>
      </div>


    </div>
  );
};

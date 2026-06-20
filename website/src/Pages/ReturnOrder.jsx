import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import constantApi from "../constantApi";

// const returnReasons = [
//   "Damaged product",
//   "Wrong item received",
//   "Size too small / large",
//   "Quality not as expected",
//   "Other",
// ];
const roundPrice = (val) => Math.round(Number(val) || 0);

export default function ReturnOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const imageBaseUrl = `${constantApi.imageUrl}/itemsImage/`;
  const [otherReason, setOtherReason] = useState("");

  const [order, setOrder] = useState(state?.order || null);
  const [loadingOrder, setLoadingOrder] = useState(!state?.order);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("original");
  const [loading, setLoading] = useState(false);
  const [reasonMap, setReasonMap] = useState({});
  const [loadingReasons, setLoadingReasons] = useState(true);
  const [itemDeptMap, setItemDeptMap] = useState({});

  const carouselRef = useRef(null);
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        setLoadingReasons(true);

        const res = await axios.get(
          `${constantApi.baseUrl}/order-action-reason-mapping/findAll`
        );

        // const grouped = res.data.data.reduce((acc, item) => {
        //   const deptId = String(item.department_id);
        //   if (!acc[deptId]) acc[deptId] = [];

        //   acc[deptId].push({
        //     id: item.reason.id,
        //     text: item.reason.reason_text,
        //   });

        //   return acc;
        // }, {});
        const grouped = res.data.data.reduce((acc, item) => {

          // ✅ ONLY RETURN TYPE (reason_type_id = 2)
          if (Number(item.reason_type_id) !== 2) return acc;

          const deptId = String(item.department_id);
          if (!acc[deptId]) acc[deptId] = [];

          acc[deptId].push({
            id: item.reason.id,
            text: item.reason.reason_text,
            reason_type_id: item.reason_type_id,
          });

          return acc;
        }, {});

        setReasonMap(grouped);
      } catch (err) {
        console.error("Failed to load reasons", err);
      } finally {
        setLoadingReasons(false);
      }
    };

    fetchReasons();
  }, []);
  useEffect(() => {
    if (!order?.order_details?.length) return;

    const fetchItemDepartments = async () => {
      try {
        const res = await axios.post(
          `${constantApi.baseUrl}/item_location_master/filtered_list`,
          {}
        );

        const deptMap = {};

        res.data?.data?.forEach((loc) => {
          const matchedOrderItem = order.order_details.find(
            (od) =>
              od.itemLocationModel?.item_name?.trim() ===
              loc.item_name?.trim()
          );

          if (matchedOrderItem && loc.departname) {
            deptMap[matchedOrderItem.id] = String(loc.departname);
          }
        });

        setItemDeptMap(deptMap);
      } catch (err) {
        console.error("Failed to load item departments", err);
      }
    };

    fetchItemDepartments();
  }, [order]);

  useEffect(() => {
    if (!order) {
      const fetchOrder = async () => {
        try {
          setLoadingOrder(true);
          const response = await axios.get(`/api/orders/${id}`);
          setOrder(response.data);
        } catch {
          Swal.fire("Error", "Failed to fetch order details", "error");
        } finally {
          setLoadingOrder(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  const toggleItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };


  const handleReturn = async () => {
    if (!selectedItems.length || !reason) {
      Swal.fire("Missing Info", "Select item(s) and reason", "warning");
      return;
    }

    if (reason === "Other" && !otherReason?.trim()) {
      Swal.fire("Missing Info", "Please enter your return reason", "warning");
      return;
    }

    const returnItems = order.order_details
      ?.filter((item) => selectedItems.includes(item.id))
      .map((item) => {
        const product = item.itemLocationModel || {};

        const quantity = Number(item.item_qty || item.quantity || 1);

        // ✅ base price (per unit, without tax)
        const itemPrice = Number(
          item.item_price ??
          item.itemprice ??
          product.itemprice ??
          0
        );

        // ✅ tax %
        const taxPercentage = Number(
          item.tax_percentage ??
          item.tax_percent ??
          product.tax_master_1?.taxcal ??
          0
        );

        // ✅ per-unit price WITH tax
        const itemPriceWithTax = roundPrice(
          itemPrice + (itemPrice * taxPercentage) / 100
        );
        // ✅ total tax (qty based)
        const itemTax =
          Number(item.item_tax) ||
          (itemPrice * quantity * taxPercentage) / 100;

        // ✅ final line total
        const price = roundPrice(
          item.item_grand_total || itemPriceWithTax * quantity
        );
        return {
          id: item.id,
          itemId: product.id || item.item_id || null,
          name: product.item_name || item.name || "Unknown",
          quantity,

          itemPrice,            // per unit (without tax)
          taxPercentage,
          itemPriceWithTax,     // ✅ NOW CORRECT
          itemTax,              // total tax
          price,                // final total
        };
      });




    if (!returnItems?.length) {
      Swal.fire("No items selected", "Please select valid items to return", "warning");
      return;
    }

    const returnData = {
      orderId: order.id || id,
      orderNumber: order.order_number,
      customer: order.customer_details,
      orderDate: order.order_date,
      invoiceNumber: order.invoice?.invoice_number || null,
      invoiceId: order.invoice?.id || null,
      returnDate: new Date().toISOString().split("T")[0],
      total: roundPrice(order.grand_total || 0),
      returnItems,
      returnReason: reason,
      otherReason: reason === "Other" ? otherReason.trim() : null,
      refundMethod: refundMethod || "original",
    };


    console.log("Return Data:", returnData);

    setLoading(true);
    try {
      await axios.post(`${constantApi.baseUrl}/invoice/ecommerce/ecom_return`, returnData);

      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        customClass: { popup: "mini-toast" },
        html: `<div class="toast-box"><div class="toast-content"><div class="toast-title text-green-500">Return success</div></div></div>`,
      });

      navigate("/accounts", {
        state: {
          activeTab: "orders",
          orderId: order.id,
          orderNumber: order.order_number,
          from: "return",
        },
      });
    } catch (error) {
      console.error("Return Error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Return request failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const allItemIds = order?.order_details?.map((item) => item.id) || [];

  const isAllSelected =
    allItemIds.length > 0 &&
    selectedItems.length === allItemIds.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allItemIds);
    }
  };

  const clearSelected = () => {
    if (!selectedItems.length) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Please select items first",
        showConfirmButton: false,
        timer: 1800,
      });
      return;
    }
    setSelectedItems([]);
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 150;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const activeItemId = selectedItems[0];   // first selected item
  const activeDepartmentId = itemDeptMap[activeItemId];
  const dynamicReasons = reasonMap[activeDepartmentId] || [];

  if (loadingOrder)
    return <p className="text-center mt-8 text-gray-500 text-sm">Loading order details...</p>;
  if (!order)
    return <p className="text-center mt-8 text-gray-500 text-sm">Order not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 text-sm font-sans">
      <h1 className="text-lg font-semibold text-gray-800">Return Items</h1>

      {/* Order Summary */}
      <div className="border rounded p-3 bg-gray-50 space-y-1 text-gray-700 text-xs">
        <p><span className="font-medium text-gray-800">Order ID:</span> {order.order_number || id}</p>
        <p><span className="font-medium text-gray-800">Customer:</span> {order.customer_details?.first_name} {order.customer_details?.last_name}</p>
        <p><span className="font-medium text-gray-800">Order Date:</span> {new Date(order.order_date).toLocaleDateString()}</p>
        <p>
          <span className="font-medium text-gray-800">Total:</span> ₹{roundPrice(order.grand_total)}
        </p>
      </div>

      {/* SELECT ALL */}
      <div className="flex justify-between items-center mb-2 px-1 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={toggleSelectAll}
            className="accent-yellow-500 w-4 h-4"
          />
          <span className="font-medium text-gray-700">
            Select All ({order.order_details.length})
          </span>
        </label>

        <button
          onClick={clearSelected}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Clear
        </button>
      </div>

      {/* Items List (Amazon style) */}
      <div className="border rounded p-2 bg-white space-y-2">
        <p className="font-medium text-gray-800 mb-1 text-xs">Select Items</p>
        <div className="space-y-2">
          {order.order_details?.map((item) => (
            <label
              key={item.id}
              className={`flex items-start gap-2 p-2 border rounded cursor-pointer transition text-xs ${selectedItems.includes(item.id)
                ? "!border-yellow-500 bg-yellow-50"
                : "!border-gray-200 hover:border-gray-300"
                }`}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItem(item.id)}
                className="mt-1 accent-yellow-500 w-4 h-4"
              />
              <img
                src={
                  item.itemLocationModel?.item_image
                    ? `${imageBaseUrl}${item.itemLocationModel.item_image.replace(/^\/+/, "")}`
                    : "/placeholder.png"
                }
                alt={item.item_name || item.name}
                className="w-14 h-14 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 line-clamp-2">
                  {item.itemLocationModel?.item_name || item.name}
                </p>
                <p className="text-gray-500 text-[10px]">Qty: {item.item_qty || item.quantity}</p>
                <p className="font-semibold text-gray-800 text-sm">
                  ₹{roundPrice(item.item_grand_total || item.price)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>


      {/* Return Reason */}
      <div className="border rounded p-2 bg-white space-y-1 text-xs">
        <p className="font-medium text-gray-800 mb-1">Return Reason</p>

        <div className="flex flex-col gap-1">
          <div className="border rounded p-2 bg-white space-y-1 text-xs">
            {/* <p className="font-medium text-gray-800 mb-1">Return Reason</p> */}

            {loadingReasons && (
              <p className="text-gray-400 text-xs"></p>
            )}

            {!loadingReasons && !activeDepartmentId && (
              <p className="text-gray-400 text-xs">
                Select a Return Item First
              </p>
            )}

            {!loadingReasons && activeDepartmentId && dynamicReasons.length === 0 && (
              <p className="text-gray-400 text-xs">
                No reasons available for this item
              </p>
            )}

            <div className="flex flex-col gap-1">
              {!loadingReasons &&
                dynamicReasons.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-center gap-1 p-1 border rounded cursor-pointer transition ${reason === r.text
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      checked={reason === r.text}
                      onChange={() => setReason(r.text)}
                      className="accent-yellow-500 w-3 h-3"
                    />
                    <span className="truncate">{r.text}</span>
                  </label>
                ))}
            </div>

            {/* Optional: Other reason */}
            {reason === "Other" && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please describe your reason..."
                className="mt-2 w-full border rounded p-2 text-xs"
                rows={3}
              />
            )}
          </div>

        </div>

        {/* Show textarea ONLY if Other is selected */}
        {reason === "Other" && (
          <textarea
            value={otherReason}
            onChange={(e) => {
              setOtherReason(e.target.value);
              console.log("Other reason:", e.target.value);
            }}
            placeholder="Please describe your reason..."
            className="mt-2 w-full border rounded p-2 text-xs focus:outline-none focus:border-yellow-500"
            rows={3}
          />
        )}
      </div>

      {/* Refund Method */}
      <div className="border rounded p-2 bg-white space-y-1 text-xs">
        <p className="font-medium text-gray-800 mb-1">Refund Method</p>
        <div className="flex flex-col gap-1">
          <label className={`flex items-center gap-1 p-1 border rounded cursor-pointer ${refundMethod === "original" ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-gray-300"
            }`}>
            <input type="radio" checked={refundMethod === "original"} onChange={() => setRefundMethod("original")} className="accent-yellow-500 w-3 h-3" />
            <span>Original payment</span>
          </label>
          {/* <label className={`flex items-center gap-1 p-1 border rounded cursor-pointer ${
            refundMethod === "wallet" ? "!border-yellow-500 !bg-yellow-50" : "border-gray-200 hover:border-gray-300"
          }`}>
            <input type="radio" checked={refundMethod === "wallet"} onChange={() => setRefundMethod("wallet")} className="accent-yellow-500 w-3 h-3"/>
            <span>Store wallet</span>
          </label> */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border text-white rounded !bg-gray-700 hover:bg-gray-100 text-xs"
        >
          Back
        </button>
        <button
          disabled={loading}
          onClick={handleReturn}
          className="px-4 py-1 !bg-yellow-500 !text-white rounded hover:bg-yellow-600 disabled:opacity-60 text-xs"
        >
          {loading ? "Submitting..." : "Confirm Return"}
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constantApi from "constantApi";

const CashierQueueStatus = ({ onClose, orders = [], onSelectOrder }) => {
  const [orderNo, setOrderNo] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSearch = async () => {
    if (!orderNo) {
      toast.warn("Please enter an order number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        // `http://localhost:5610/api/queue/by-order?order_no=${orderNo}`
        `${constantApi.baseUrl}/queue/by-order?order_no=${orderNo}`,
      );
      if (res.data.success) {
        setOrderData(res.data.data);
      } else {
        setOrderData(null);
        toast.error(res.data.message || "Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Error fetching order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!orderData) return;

    setUpdating(true);
    try {
      const res = await axios.post(
        // "http://localhost:5610/api/queue/cashier-update",
        `${constantApi.baseUrl}/queue/cashier-update`,
        {
          id: orderData.id,
          status: "ready",
        },
      );

      if (res.data.success) {
        toast.success("Status updated to Ready");
        setOrderData({ ...orderData, status: "ready" });

        // Auto-close after short delay
        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded">
      <h2 className="text-sm font-bold text-blue-600 mb-4">Hold Orders</h2>

      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {orders.length > 0 ? (
          orders.map((o) => (
            <div
              key={o.id}
              onClick={() => {
                onSelectOrder(o); // ✅ LOAD TO CART
                onClose(); // ✅ CLOSE POPUP
              }}
              className="p-3 border rounded cursor-pointer hover:bg-blue-50"
            >
              <p className="text-sm font-semibold">
                Hold #{o.invoice_number || o.id}
              </p>

              <p className="text-xs text-gray-600">
                Cashier: {o.cashier_name || o.salesman_name || "N/A"}
              </p>

              <p className="text-xs text-gray-500">Total: ₹{o.total}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500">No hold orders found</p>
        )}
      </div>

      <div className="text-right mt-4">
        <button
          onClick={onClose}
          className="px-4 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CashierQueueStatus;

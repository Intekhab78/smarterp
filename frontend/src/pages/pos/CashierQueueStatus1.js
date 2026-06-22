import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constantApi from "constantApi";

const CashierQueueStatus1 = ({ onClose }) => {
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
      <ToastContainer position="top-right" />
      <h2 className="text-sm font-bold text-blue-600 mb-4">
        Check Order Status
      </h2>

      <input
        type="text"
        placeholder="Enter Order No"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
        value={orderNo}
        onChange={(e) => setOrderNo(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded w-full hover:bg-blue-700"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {orderData && (
        <div className="mt-6 p-4 border rounded bg-gray-50 text-sm">
          <p>
            <strong>Order No:</strong> {orderData.order_no}
          </p>
          <p>
            <strong>Status:</strong> {orderData.status}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(orderData.created_at).toLocaleString()}
          </p>

          {orderData.status === "completed" && (
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700"
              onClick={handleStatusUpdate}
              disabled={updating}
            >
              {updating ? "Updating..." : "Mark as Ready"}
            </button>
          )}

          {orderData.status === "ready" && (
            <p className="mt-4 text-green-700 font-semibold">
              ✅ Already Ready
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CashierQueueStatus1;

import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";

const OrderCancellationDetails = ({ orderId }) => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [cancelItems, setCancelItems] = useState([]);
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/order/ecommerce/order-payment-details`,
        {
          // order_id: orderId, // use this when dynamic
          order_number: "S1O1177", // static for now
        },
      );

      console.log("res--------------", res.data);

      // ✅ Correct response mapping
      setOrder(res.data.order_summary || null);
      setCancelItems(res.data.items?.cancelled_items || []);
      setRefunds(res.data.refunds || []);
    } catch (err) {
      console.error("Failed to fetch cancellation details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading cancellation data...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load order details.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg border text-sm space-y-5">
      {/* ================= Order Summary ================= */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <p className="font-medium text-gray-700">
            Order ID:
            <span className="font-normal ml-1">{order.order_number}</span>
          </p>

          <p className="text-gray-500 mt-1">
            Total Qty:
            <span className="ml-1">{order.total_qty}</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-700 font-medium">Total Amount</p>
          <p className="text-lg font-semibold">₹{order.total_amount}</p>
        </div>
      </div>

      {/* ================= Cancelled Items ================= */}
      <div>
        <p className="font-medium text-gray-700 mb-2">Cancelled Items</p>

        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Item ID</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-right">Refund Amount</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {cancelItems.length > 0 ? (
                cancelItems.map((item, index) => (
                  <tr key={index} className="border-t bg-red-50">
                    <td className="px-3 py-2 text-gray-700">
                      #{item.order_item_id}
                      <p className="text-xs text-gray-400">
                        {item.cancel_reason}
                      </p>
                    </td>

                    <td className="px-3 py-2 text-center">{item.qty ?? "-"}</td>

                    <td className="px-3 py-2 text-right">
                      ₹{item.refund_amount}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs">
                        {item.refund_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-3 py-3 text-center text-gray-400"
                  >
                    No cancelled items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= Refund Summary ================= */}
      <div className="border-t pt-4 space-y-2">
        <p className="font-medium text-gray-700">Refund Summary</p>

        {refunds.length > 0 ? (
          refunds.map((refund) => (
            <div
              key={refund.id}
              className="flex justify-between items-center text-sm bg-yellow-50 p-2 rounded"
            >
              <p>
                Refund ID:
                <span className="ml-1 font-medium">
                  {refund.transaction_id || refund.id}
                </span>
              </p>

              <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs">
                ₹{refund.refund_amount}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No refunds issued</p>
        )}
      </div>
    </div>
  );
};

export default OrderCancellationDetails;

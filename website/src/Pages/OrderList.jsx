import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all orders (no filter)
  useEffect(() => {
    fetchOrders();
  }, []);

  // const fetchOrders = async () => {
  //   try {
  //     const res = await axios.post("https://api.jtserp.cloud/api/order/list");

  //     if (res.data?.status && res.data?.data?.records) {
  //       setOrders(res.data.data.records); // FULL ORDER LIST
  //     } else {
  //       setOrders([]);
  //     }
  //   } catch (err) {
  //     setError("Failed to load orders");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border rounded-xl shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Order ID: {order.uuid}</p>
                <p className="text-sm text-gray-600">
                  Amount: ₹{order.total_amount}
                </p>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
              </div>

              <button className="px-4 py-2 bg-primary text-white rounded-lg">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

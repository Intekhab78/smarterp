import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Ecom_order_details() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayments, setShowPayments] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`${constantApi.baseUrl}/order/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="p-10 text-center text-sm text-gray-500">
          Loading order details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-sm">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ================= HERO HEADER ================= */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold">
                Order #{data.order_number}
              </h1>
              <p className="text-xs opacity-80">Placed on {data.order_date}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  data.status === "Partially Cancelled"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {data.status}
              </span>

              <button
                onClick={() => setShowPayments(!showPayments)}
                className="px-4 py-2 rounded-lg bg-white text-gray-800 text-xs font-medium shadow hover:bg-gray-100 transition"
              >
                {showPayments ? "Hide Payments" : "View Payments"}
              </button>
            </div>
          </div>

          {/* ================= INFO CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer */}
            <div className="bg-white rounded-2xl shadow p-5">
              <p className="text-xs text-gray-500 mb-2">Customer</p>
              <p className="font-medium">
                {data.customer_details.first_name}{" "}
                {data.customer_details.last_name}
              </p>
              <p className="text-gray-500 text-xs">
                {data.customer_details.phone}
              </p>
              <p className="text-gray-500 text-xs">
                {data.customer_details.city}, {data.customer_details.state}
              </p>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow p-5">
              <p className="text-xs text-gray-500 mb-2">Payment</p>
              <p className="text-xs text-gray-600">
                Method: {data.payments[0]?.payment_method}
              </p>
              <p className="text-gray-500">
                Payment ID: {data.payments[0]?.razorpay_payment_id}
              </p>
              <p className="text-xs text-gray-600">
                Status: {data.payments[0]?.payment_status}
              </p>
              <p className="font-semibold mt-2">
                Paid: ₹{data.payments[0]?.amount}
              </p>
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">
              <p className="text-xs text-gray-500">Grand Total</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{data.grand_total}
              </p>
            </div>
          </div>

          {/* ================= ORDER ITEMS ================= */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-medium mb-4">Order Items</h2>

            <div className="divide-y">
              {data.order_details.map((item) => (
                <div key={item.id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium">
                      {item.itemLocationModel.item_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.item_qty}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.item_grand_total}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CANCELLED ITEMS ================= */}
          {data.cancellations.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-6 border border-red-200">
              <h2 className="font-medium mb-4 text-red-600">Cancelled Items</h2>

              <div className="space-y-3">
                {data.cancellations.map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between bg-red-50 p-4 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">{c.item_name}</p>
                      <p className="text-xs text-gray-500">
                        Reason: {c.reason}
                      </p>
                    </div>
                    <p className="font-semibold text-red-600">
                      ₹{c.refund_amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PAYMENT DETAILS ================= */}
          <AnimatePresence>
            {showPayments && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl shadow p-6 space-y-5"
              >
                <h2 className="font-medium text-base">Payment Details</h2>

                {data.payments.map((p) => {
                  const cancelledAmount =
                    data.cancellations?.reduce(
                      (sum, c) => sum + Number(c.refund_amount),
                      0,
                    ) || 0;

                  const alreadyRefunded =
                    p.refunds?.reduce(
                      (sum, r) =>
                        r.refund_status === "Completed"
                          ? sum + Number(r.refund_amount)
                          : sum,
                      0,
                    ) || 0;

                  const refundableAmount = cancelledAmount - alreadyRefunded;

                  return (
                    <div key={p.id} className="border rounded-xl p-5 space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {p.payment_method.toUpperCase()} ({p.payment_type})
                          </p>
                          <p className="text-xs text-gray-500">
                            Payment ID: {p.razorpay_payment_id}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            p.payment_status.includes("Refund")
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {p.payment_status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-500">Paid</p>
                          <p className="font-semibold">₹{p.amount}</p>
                        </div>

                        <div>
                          <p className="text-gray-500">Refundable</p>
                          <p className="font-semibold text-red-600">
                            ₹{refundableAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Cancelled: ₹{cancelledAmount}</p>
                        <p>Already Refunded: ₹{alreadyRefunded}</p>
                      </div>

                      {refundableAmount > 0 && p.payment_type === "ONLINE" && (
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-xs transition">
                          Initiate Refund
                        </button>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

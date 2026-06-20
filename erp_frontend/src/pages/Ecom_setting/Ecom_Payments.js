import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Ecom_Payments() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [openRow, setOpenRow] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPayments = async () => {
    const res = await axios.post(
      `${constantApi.baseUrl}/payments/cancelled-refunded`,
      { status },
    );
    setPayments(res.data.data || []);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchPayments();
  }, [status]);

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPayments = payments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const statusBadge = (payment) => {
    if (payment.payment_status === "Cancelled")
      return "bg-red-100 text-red-700";
    if (payment.refunds?.length > 0) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* HEADER */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">
              Cancelled & Refunded Payments
            </h1>
            <p className="text-xs opacity-80">
              Total Records: {payments.length}
            </p>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-xs text-gray-800 rounded-lg px-3 py-2 bg-white shadow"
          >
            <option value="ALL">All</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-900 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Method</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Refund</th>
                <th className="px-4 py-3 text-center">Details</th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayments.map((p) => {
                const refunded = p.refunds?.length > 0;

                return (
                  <>
                    {/* MAIN ROW */}
                    <tr
                      key={p.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">
                        <Link
                          to={`/ecom-order-details/${p.order_id}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {p.order?.order_number || p.order_number}
                        </Link>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${statusBadge(
                            p,
                          )}`}
                        >
                          {p.payment_status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {p.payment_method}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold">
                        ₹{p.amount}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {refunded ? `₹${p.refunds[0].refund_amount}` : "-"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleRow(p.id)}
                          className="text-indigo-600 font-medium hover:underline"
                        >
                          {openRow === p.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDABLE ROW */}
                    <AnimatePresence>
                      {openRow === p.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50"
                        >
                          <td colSpan="6" className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
                              <div className="bg-white rounded-lg p-4 shadow">
                                <p className="font-semibold mb-2">Order Info</p>
                                <p>Order No: {p.order?.order_number}</p>
                                <p>Total Qty: {p.order?.total_qty}</p>
                                <p>Website: {p.website}</p>
                              </div>

                              <div className="bg-white rounded-lg p-4 shadow">
                                <p className="font-semibold mb-2">
                                  Payment Info
                                </p>
                                <p>Type: {p.payment_type}</p>
                                {p.razorpay_payment_id && (
                                  <p>ID: {p.razorpay_payment_id}</p>
                                )}
                                {p.verified_at && (
                                  <p>
                                    Verified:{" "}
                                    {new Date(p.verified_at).toLocaleString()}
                                  </p>
                                )}
                              </div>

                              <div className="bg-white rounded-lg p-4 shadow">
                                <p className="font-semibold mb-2">
                                  Refund Info
                                </p>
                                {refunded ? (
                                  <>
                                    <p>Amount: ₹{p.refunds[0].refund_amount}</p>
                                    <p>Status: {p.refunds[0].refund_status}</p>
                                    <p>Reason: {p.refunds[0].refund_reason}</p>
                                  </>
                                ) : (
                                  <p className="text-gray-500">
                                    No refund issued
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                );
              })}
            </tbody>
          </table>

          {payments.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No records found
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {payments.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              ← Prev
            </button>

            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-full border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

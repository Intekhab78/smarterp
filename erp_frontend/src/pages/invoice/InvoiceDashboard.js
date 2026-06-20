import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { axios_post } from "../../axios";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);
dayjs.extend(isoWeek);

const InvoiceDashboard = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState({
    today: [],
    thisWeek: [],
    thisMonth: [],
    last3Months: [],
    last6Months: [],
    thisYear: [],
  });

  const getInvoiceDetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "invoice/list");

    if (response?.status) {
      const { records } = response?.data;
      setInvoiceData(records);
      filterInvoices(records);
    } else {
      toast.error(response?.message || "Failed to load invoices");
    }
    setLoading(false);
  };

  const filterInvoices = (records) => {
    const now = dayjs();

    const newData = {
      today: [],
      thisWeek: [],
      thisMonth: [],
      last3Months: [],
      last6Months: [],
      thisYear: [],
    };

    records.forEach((invoice) => {
      const created = dayjs(invoice.created_at);

      if (created.isSame(now, "day")) newData.today.push(invoice);
      if (created.isSame(now, "week")) newData.thisWeek.push(invoice);
      if (created.isSame(now, "month")) newData.thisMonth.push(invoice);
      if (created.isSameOrAfter(now.subtract(3, "month")))
        newData.last3Months.push(invoice);
      if (created.isSameOrAfter(now.subtract(6, "month")))
        newData.last6Months.push(invoice);
      if (created.isSame(now, "year")) newData.thisYear.push(invoice);
    });

    setFilteredData(newData);
  };

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <ToastContainer position="top-right" />
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Invoice Summary</h2>

      {loading ? (
        <p className="text-gray-600">Loading invoice data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(filteredData).map(([label, invoices]) => (
            <div
              key={label}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold capitalize text-blue-600 mb-2">
                {label.replace(/([A-Z])/g, " $1")}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Total Invoices:{" "}
                <span className="font-bold text-gray-900">
                  {invoices.length}
                </span>
              </p>
              <div className="max-h-32 overflow-y-auto text-sm text-gray-700 space-y-1">
                {invoices.map((inv) => (
                  <p key={inv.id}>• {inv.invoice_number}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceDashboard;

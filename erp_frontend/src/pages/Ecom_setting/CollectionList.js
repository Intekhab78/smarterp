import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";

const PAGE_SIZE = 10;

const CollectionList = () => {
  const [allCollections, setAllCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${constantApi.baseUrl}/collection/list`, {
        page: 1,
        limit: 1000,
      });

      setAllCollections(res.data.data.records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  /* ------------------ FILTER OPTIONS ------------------ */
  const companies = useMemo(() => {
    return [
      ...new Set(
        allCollections.map((c) => c.company?.compdesc).filter(Boolean)
      ),
    ];
  }, [allCollections]);

  const locations = useMemo(() => {
    return [
      ...new Set(
        allCollections.map((c) => c.location?.locdesclong).filter(Boolean)
      ),
    ];
  }, [allCollections]);

  /* ------------------ FILTERED DATA ------------------ */
  const filteredData = useMemo(() => {
    return allCollections.filter((item) => {
      return (
        (!companyFilter || item.company?.compdesc === companyFilter) &&
        (!locationFilter || item.location?.locdesclong === locationFilter)
      );
    });
  }, [allCollections, companyFilter, locationFilter]);

  /* ------------------ PAGINATION ------------------ */
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        Collection Management
      </h2>

      {/* ------------------ FILTER BAR ------------------ */}
      <div className="flex gap-3 mb-3">
        <select
          className="border text-xs px-2 py-1 rounded"
          value={companyFilter}
          onChange={(e) => {
            setCompanyFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="border text-xs px-2 py-1 rounded"
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* ------------------ TABLE ------------------ */}
      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="w-full text-[11px] text-gray-700">
          <thead className="bg-gray-100 uppercase">
            <tr>
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Date / Time</th>
              <th className="px-2 py-2">Company</th>
              <th className="px-2 py-2">Location</th>
              <th className="px-2 py-2">Customer ID</th>
              <th className="px-2 py-2">Order ID</th>
              <th className="px-2 py-2 text-right">Invoice</th>
              <th className="px-2 py-2">Pay Mode</th>
              <th className="px-2 py-2 text-right">Total</th>
              <th className="px-2 py-2 text-right">Paid</th>
              <th className="px-2 py-2 text-right">Balance</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-6">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2 font-medium">#{item.id}</td>

                  <td className="px-2 py-2">
                    <div>{item.collection_date}</div>
                    <div className="text-[10px] text-gray-500">
                      {item.collection_time}
                    </div>
                  </td>

                  <td className="px-2 py-2">{item.company?.compdesc}</td>
                  <td className="px-2 py-2">{item.location?.locdesclong}</td>
                  <td className="px-2 py-2">{item.customer_id}</td>
                  <td className="px-2 py-2">{item.order_id}</td>

                  <td className="px-2 py-2 text-right">
                    ₹{item.invoice_amount}
                  </td>

                  <td className="px-2 py-2 uppercase">{item.payment_mode}</td>

                  <td className="px-2 py-2 text-right">₹{item.total}</td>

                  <td className="px-2 py-2 text-right text-green-600">
                    ₹{item.pay_amount}
                  </td>

                  <td className="px-2 py-2 text-right text-red-500">
                    ₹{Number(item.balance_amount || 0).toFixed(2)}
                  </td>

                  <td className="px-2 py-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px]
                        ${
                          item.collection_status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {item.collection_status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------ PAGINATION ------------------ */}
      <div className="flex justify-end items-center gap-2 mt-3 text-xs">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-2 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-2 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CollectionList;

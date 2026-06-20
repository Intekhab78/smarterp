import { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios, { axios_post } from "../../axios";

function Rtv() {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGrnDetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "grn/list");

    if (response) {
      if (response.status) {
        const { records } = response?.data;
        setData(records);
      } else {
        ToastMassage(response.message, "error");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getGrnDetails();
  }, []);

  const handleSearch = () => {
    const result = data.filter((item) =>
      item.customer_id.toString().includes(search.trim())
    );
    setFilteredData(result);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          GRN Search (by Customer ID)
        </h2>

        {/* Search Box */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Customer ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-sm text-gray-500 italic">Loading data...</p>
        )}

        {/* Results */}
        {!loading && filteredData.length > 0 ? (
          <div className="space-y-6">
            {filteredData.map((grn) => (
              <div
                key={grn.id}
                className="border rounded-xl shadow-md overflow-hidden bg-white"
              >
                {/* GRN Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700">
                    GRN <span className="text-blue-700">#{grn.grn_number}</span>
                  </h3>
                  <span className="text-xs text-gray-600">
                    {grn.customer_id} — {grn?.customer?.firstname}
                  </span>
                </div>

                {/* GRN Info */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-5 text-sm text-gray-700">
                  <div>
                    <p className="font-medium text-gray-600">Date</p>
                    <p>{grn.grn_date}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Net</p>
                    <p>{grn.total_net}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Total</p>
                    <p>{grn.grand_total}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Status</p>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        grn.status === "recevied"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {grn.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Payment</p>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        grn.payment_status === "pending"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {grn.payment_status}
                    </span>
                  </div>
                </div>

                {/* GRN Details */}
                {grn.grn_details && grn.grn_details.length > 0 ? (
                  <div className="overflow-x-auto border-t">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">Item ID</th>
                          <th className="px-4 py-2 text-center">Qty</th>
                          <th className="px-4 py-2 text-center">Price</th>
                          <th className="px-4 py-2 text-center">Net</th>
                          <th className="px-4 py-2 text-center">VAT</th>
                          <th className="px-4 py-2 text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grn.grn_details.map((d) => (
                          <tr
                            key={d.id}
                            className="hover:bg-gray-50 text-gray-700"
                          >
                            <td className="px-4 py-2 border-t">{d.item_id}</td>
                            <td className="px-4 py-2 border-t text-center">
                              {d.item_qty}
                            </td>
                            <td className="px-4 py-2 border-t text-center">
                              {d.item_price}
                            </td>
                            <td className="px-4 py-2 border-t text-center">
                              {d.item_net}
                            </td>
                            <td className="px-4 py-2 border-t text-center">
                              {d.item_vat}
                            </td>
                            <td className="px-4 py-2 border-t text-center font-medium">
                              {d.item_grand_total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 px-5 py-3 italic">
                    No details found for this GRN.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-sm text-gray-500 italic">
              No results found. Please search with a valid Customer ID.
            </p>
          )
        )}
      </div>
    </DashboardLayout>
  );
}

export default Rtv;

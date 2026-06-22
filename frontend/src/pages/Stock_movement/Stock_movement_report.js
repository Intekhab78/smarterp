import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios, { axios_post } from "../../axios";
import { ToastMassage } from "toast";
import { useEffect, useState } from "react";
import { getCompanyAndLocationId } from "../../utils/comp_loc_id";
import { Link } from "react-router-dom";

function Stock_movement_report() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  });

  const [companyData, setCompanyData] = useState({
    cashier_comp_id: null,
    cashier_loc_id: null,
  });

  // Get logged-in cashier info
  useEffect(() => {
    const { cashier_comp_id, cashier_loc_id } = getCompanyAndLocationId();
    setCompanyData({ cashier_comp_id, cashier_loc_id });
    console.log(
      "cashier_comp_id, cashier_loc_id ",
      cashier_comp_id,
      cashier_loc_id
    );
  }, []);

  // Fetch all companies and locations
  const fetchCompanyAndLocation = async () => {
    try {
      const compRes = await axios_post(true, "company/list", {});
      if (compRes?.status) setCompanies(compRes.data.records || []);

      const locRes = await axios_post(true, "location/list", {});
      if (locRes?.status) setLocations(locRes.data.records || []);
    } catch (err) {
      ToastMassage("Failed to fetch company/location data", "error");
    }
  };

  const getdetails = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios_post(true, "stock_movement/list", {
        page,
        limit: 15,
      });

      console.log("stock_movement------------", response.data);

      if (response?.status) {
        const { totalRecords, currentPage, totalPages, rows } = response.data;
        setData(rows);
        setPagination({ totalRecords, currentPage, totalPages });
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      ToastMassage("Failed to load data", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanyAndLocation();
    getdetails(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getdetails(newPage);
    }
  };

  const getCompanyName = (comp_id) => {
    const company = companies.find((c) => c.id === comp_id);
    return company?.compdesc || "Unknown";
  };

  const getLocationName = (loc_id) => {
    const location = locations.find((l) => l.id === loc_id);
    return location?.locname || "Unknown";
  };

  const handlePrint = () => {
    const printContent = document.getElementById("stockTable").outerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Stock Movement Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #007BFF; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Stock Movement Report</h2>
          ${printContent}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6">
        <div className=" flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-800 mb-4">
            📊 Stock Movement Report
          </h1>
          <Link
            to="/itemwise_stockmvmnt"
            className="text-xs text-white  bg-blue-400 p-1 rounded-sm "
          >
            Item Wise Details
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handlePrint}
                className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Print
              </button>
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
              <table
                id="stockTable"
                className="min-w-max text-xs text-left text-gray-700"
              >
                <thead className="bg-blue-600 text-white uppercase">
                  <tr>
                    <th className="px-3 py-2 w-[90px]">Date</th>
                    <th className="px-3 py-2 w-[150px]">Transaction No</th>
                    <th className="px-3 py-2 w-[150px]">Transaction Type</th>
                    <th className="px-3 py-2 w-[60px]">Qty</th>
                    <th className="px-3 py-2 w-[80px]">Status</th>
                    <th className="px-3 py-2 w-[100px]">Item UPC</th>

                    {/* Increased Width Columns */}
                    <th className="px-3 py-2 w-[200px]">Item</th>
                    <th className="px-3 py-2 w-[180px]">Company</th>
                    <th className="px-3 py-2 w-[180px]">Location</th>
                    <th className="px-3 py-2 w-[450px]">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50 transition duration-150"
                    >
                      <td className="px-3 py-2">
                        {row.created_at.split("T")[0]}
                      </td>
                      <td className="px-3 py-2">{row.transaction_no || "-"}</td>
                      <td className="px-3 py-2">{row.transaction_type}</td>
                      <td className="px-3 py-2">{row.qty}</td>
                      <td className="px-3 py-2">{row.type}</td>
                      <td className="px-3 py-2">{row.itemupc}</td>

                      {/* Expanded Columns */}
                      <td className="px-3 py-2 font-medium text-gray-800">
                        {row?.item_location?.item_name}
                      </td>
                      <td className="px-3 py-2">
                        {getCompanyName(row.comp_id)}
                      </td>
                      <td className="px-3 py-2">
                        {getLocationName(row.loc_id)}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {row.stock_desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2 items-center">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="px-4 py-1 font-medium text-blue-600">
                  {pagination.currentPage}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Stock_movement_report;

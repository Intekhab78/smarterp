import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { axios_post } from "../../axios";

export default function BatchesList({ companyId, locationId }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search/filter inputs
  const [searchItem, setSearchItem] = useState(""); // combined item name + UPC
  const [searchCompany, setSearchCompany] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Dropdown data
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // ======================================================
  // FETCH COMPANIES
  // ======================================================
  const fetchCompanyList = async () => {
    try {
      const response = await axios_post(true, "company/com_list");
      if (response?.status) {
        const allCompanies = response.data;
        // filter: remove main company
        const filtered = allCompanies.filter((c) => c.is_main_comp !== "yes");
        setCompanies(filtered.length ? filtered : allCompanies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error.message);
    }
  };

  // ======================================================
  // FETCH LOCATIONS BASED ON COMPANY
  // ======================================================
  const fetchLocationList = async (companyId) => {
    try {
      if (!companyId) {
        setLocations([]);
        return;
      }
      const response = await axios_post(true, "location/loc_list", {
        company_id: companyId,
      });

      if (response?.status) {
        setLocations(response.data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error.message);
      setLocations([]);
    }
  };

  // Fetch companies on mount
  useEffect(() => {
    fetchCompanyList();
  }, []);

  // Fetch batches when companyId or locationId props change
  useEffect(() => {
    fetchBatches();
  }, [companyId, locationId]);

  // Fetch batches
  async function fetchBatches() {
    setLoading(true);
    try {
      const response = await axios.post(`${constantApi.baseUrl}/batch/list`, {
        page: 1,
        limit: 1000,
      });

      if (response && response.data && response.data.status) {
        setBatches(response.data.data || []);
      } else {
        alert("Failed to fetch batches");
        console.error("Batch fetch error, response:", response);
      }
    } catch (error) {
      alert("Error fetching batches: " + error.message);
      console.error("Batch fetch exception:", error);
    }
    setLoading(false);
  }

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter batches based on combined item search + company + location filters
  // Filter batches based on combined item search + company + location filters
  const filteredBatches = batches.filter((batch) => {
    const itemName = (batch?.itemLocationModel?.item_name || "").toLowerCase();
    const itemUPC = (batch?.itemLocationModel?.itemupc || "").toLowerCase();

    // Trim user inputs to remove prefix/suffix spaces
    const search = searchItem.trim().toLowerCase();
    const companySearch = searchCompany.trim();
    const locationSearch = searchLocation.trim();

    const batchCompanyId = batch.company ? batch.company.toString() : "";
    const batchLocationId = batch.location ? batch.location.toString() : "";

    return (
      (search === "" ||
        itemName.includes(search) ||
        itemUPC.includes(search)) &&
      (companySearch === "" || batchCompanyId === companySearch) &&
      (locationSearch === "" || batchLocationId === locationSearch)
    );
  });

  const totalPages = Math.ceil(filteredBatches.length / rowsPerPage);
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Handle company select change — fetch locations for selected company
  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSearchCompany(companyId); // update filter state
    setSelectedLocation(""); // reset location when company changes
    setSearchLocation(""); // reset location filter
    setLocations([]); // clear locations until fetch completes

    if (companyId) {
      fetchLocationList(companyId);
    }
  };

  // Handle location select change
  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    setSearchLocation(locationId); // update filter state
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-full overflow-x-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Batch List</h1>

        {/* Filters */}
        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap items-center">
          {/* Combined Item Name + UPC */}
          <input
            type="text"
            placeholder="Search by Item Name or UPC"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="border rounded px-2 py-1 w-56 text-sm"
          />

          {/* COMPANY */}
          <select
            className="border px-2 py-1.5 text-sm rounded mt-1"
            value={selectedCompany}
            onChange={handleCompanyChange}
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.compdesc}
              </option>
            ))}
          </select>

          {/* LOCATION */}
          <select
            className="border px-2 py-1.5 text-sm rounded mt-1"
            value={selectedLocation}
            onChange={handleLocationChange}
            disabled={!selectedCompany}
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locname}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading batches...</div>
        ) : paginatedBatches.length === 0 ? (
          <div className="text-center py-10">No batches found.</div>
        ) : (
          <>
            <table className="min-w-full border border-gray-300 rounded-md overflow-hidden text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-3 py-2 border-b">ID</th>
                  <th className="text-left px-3 py-2 border-b">Item UPC</th>
                  <th className="text-left px-3 py-2 border-b">Item Name</th>
                  <th className="text-left px-3 py-2 border-b">Batch Number</th>
                  <th className="text-left px-3 py-2 border-b">GRN Number</th>
                  <th className="text-left px-3 py-2 border-b">Qty</th>
                  <th className="text-left px-3 py-2 border-b">
                    Current Stock
                  </th>
                  <th className="text-left px-3 py-2 border-b">Item Cost</th>
                  <th className="text-left px-3 py-2 border-b">
                    Item Lan Price
                  </th>
                  <th className="text-left px-3 py-2 border-b">Item Price</th>
                  <th className="text-left px-3 py-2 border-b w-100">
                    Company
                  </th>
                  <th className="text-left px-3 py-2 border-b">Location</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className={`hover:bg-gray-50 ${
                      parseFloat(batch.current_in_stock) === 0
                        ? "bg-red-100"
                        : "bg-green-100"
                    }`}
                  >
                    <td className="px-3 py-1 border-b">{batch.id}</td>
                    <td className="px-3 py-1 border-b">
                      {batch?.itemLocationModel?.itemupc}
                    </td>
                    <td className="px-3 py-1 border-b">
                      {batch?.itemLocationModel?.item_name}
                    </td>
                    <td className="px-3 py-1 border-b">{batch.batch_number}</td>
                    <td className="px-3 py-1 border-b">
                      {batch.grn_number || "-"}
                    </td>
                    <td className="px-3 py-1 border-b">{batch.qty}</td>
                    <td className="px-3 py-1 border-b">
                      {batch.current_in_stock}
                    </td>
                    <td className="px-3 py-1 border-b">
                      {batch.itemcost || "-"}
                    </td>
                    <td className="px-3 py-1 border-b">
                      {batch.itemlanprice || "-"}
                    </td>
                    <td className="px-3 py-1 border-b">
                      {batch.item_price || "-"}
                    </td>
                    <td className="px-3 py-1 border-b">
                      {batch.companyDetails?.compdesc}
                    </td>
                    <td className="px-3 py-1 border-b">
                      {batch.locationDetails?.locname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-1 rounded border ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-300"
                    : "text-blue-600 border-blue-600"
                }`}
              >
                Prev
              </button>

              <span>
                Page {currentPage} / {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-1 rounded border ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-300"
                    : "text-blue-600 border-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

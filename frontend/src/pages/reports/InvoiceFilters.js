import { useHeader } from "context/HeaderContext";
import { useSearch } from "context/SearchReportContext";
import React, { useEffect, useState, useMemo } from "react";
import {
  FaSearch,
  FaRedo,
  FaFileDownload,
  FaFilePdf,
  FaPrint,
} from "react-icons/fa";
import {
  getCompanyDetails,
  getLocationDetails,
} from "utils/company_location_Utils";
import {
  getVendorDetails,
  getCustomerDetails,
} from "utils/vendor_customer_Utils";

export default function InvoiceFilters({
  filters,
  handleFilterChange,
  handleReset,
}) {
  const { selectedMainHeader } = useHeader();
  const { setSearchFilters, setSearchResults, exportToExcel } = useSearch(); // get context functions

  const [companyData, setCompanyData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchClicked, setSearchClicked] = useState(false);

  // === Fetch company list ===
  const fetchCompanyList = async () => {
    setLoading(true);
    const companyList = await getCompanyDetails();
    setCompanyData(companyList || []);
    setLoading(false);
  };

  // === Fetch location list ===
  const fetchLocationList = async () => {
    setLoading(true);
    const locationList = await getLocationDetails();
    setLocationData(locationList || []);
    setLoading(false);
  };

  // === Fetch customer list ===
  const fetchCustomerList = async () => {
    setLoading(true);
    const customerList = await getCustomerDetails();
    setCustomerData(customerList || []);
    setLoading(false);
  };

  // === Fetch vendor list ===
  const fetchVendorList = async () => {
    setLoading(true);
    const vendorList = await getVendorDetails();
    setVendorData(vendorList || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanyList();
    fetchLocationList();
    fetchCustomerList();
    fetchVendorList();
  }, []);

  // === Filter locations based on selected company ===
  const filteredLocations = useMemo(() => {
    if (!filters.company) return locationData; // show all if no company selected

    const selectedCompany = companyData.find(
      (c) => String(c.id) === String(filters.company)
    );
    if (!selectedCompany) return locationData;

    return locationData.filter(
      (loc) => String(loc.compdesc) === String(selectedCompany.id)
    );
  }, [filters.company, companyData, locationData]);

  // === Handle Search Button ===

  const handleSearch = () => {
    setSearchFilters({
      ...filters,
      searchClicked: true, // important
    });
  };

  useEffect(() => {
    setSearchFilters(filters);
  }, [filters]);

  return (
    <div className="flex flex-col gap-4">
      {/* === Row 1 === */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Company */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Company</label>
          <select
            value={filters.company}
            onChange={handleFilterChange("company")}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">--- All Companies ---</option>
            {companyData?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.compdesc}
              </option>
            ))}
          </select>
        </div>

        {/* Locations */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Locations</label>
          <select
            value={filters.location}
            onChange={handleFilterChange("location")}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">--- All Locations ---</option>
            {filteredLocations?.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.locname}
              </option>
            ))}
          </select>
        </div>
        {/* Date From */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={handleFilterChange("dateFrom")}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Date To */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={handleFilterChange("dateTo")}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* === Row 2 === */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Customer or Vendor */}
        {selectedMainHeader === "Invoices" || selectedMainHeader === "Sales" ? (
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium mb-1">Customer</label>
            <select
              value={filters.customer}
              onChange={handleFilterChange("customer")}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">--- All Customers ---</option>
              {customerData.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.first_name} {cust.last_name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium mb-1">Vendor</label>
            <select
              value={filters.vendor}
              onChange={handleFilterChange("vendor")}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">--- All Vendors ---</option>
              {vendorData.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.firstname} {v.lastname}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.invoiceStatus}
            onChange={handleFilterChange("invoiceStatus")}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">--- All Status ---</option>
            <option value="Invoiced">Active</option>
            <option value="Draft">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-2 md:mt-6 flex-wrap">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100"
          >
            <FaRedo /> Reset
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaSearch /> Search
          </button>
        </div>

        {/* Export / Actions */}
        <div className="flex items-center gap-2 mt-2 md:mt-6 justify-end">
          {/* <button className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100">
            <FaFileDownload />
          </button> */}

          <button
            // onClick={exportToExcel} // ✅ call this
            onClick={() => exportToExcel(selectedMainHeader)}
            className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            <FaFileDownload />
          </button>
          {/* <button className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100">
            <FaFilePdf />
          </button>
          <button className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100">
            <FaPrint />
          </button> */}
        </div>
      </div>
    </div>
  );
}

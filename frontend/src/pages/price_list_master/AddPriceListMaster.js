import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { axios_post } from "../../axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const AddPriceListMaster = () => {
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [formData, setFormData] = useState({
    comp: "",
    loc: "",
    price_list_code: "",
    price_list_name: "",
    start_date: "",
    end_date: "",
    status: "inactive",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/price_list_master/create`,
        formData
      );
      alert("Price List saved successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error saving price list");
    }
  };

  // FETCH COMPANIES
  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response?.status) {
      const allCompanies = response.data;
      const filtered = allCompanies.filter((c) => c.is_main_comp !== "yes");
      setCompanies(filtered.length ? filtered : allCompanies);
    }
  };

  // FETCH LOCATIONS BASED ON COMPANY
  const fetchLocationList = async (companyId) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });
    if (response?.status) {
      setLocations(response.data);
    } else {
      setLocations([]);
    }
  };

  useEffect(() => {
    fetchCompanyList();
  }, []);

  useEffect(() => {
    if (!selectedCompany) return;
    fetchLocationList(selectedCompany);
    setSelectedLocation("");
  }, [selectedCompany]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-xl mx-auto bg-white shadow-md p-6 mt-10 rounded-lg">
        <h2 className="text-xl font-semibold mb-5 text-center text-gray-800">
          Create price list
        </h2>

        <form onSubmit={submitForm} className="space-y-4">
          {/* Company + Location row */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedCompany}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCompany(value);
                  setFormData((prev) => ({ ...prev, comp: value }));
                }}
              >
                <option value="">Select</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.compdesc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={selectedLocation}
                //   onChange={(e) => setSelectedLocation(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedLocation(value);
                  setFormData((prev) => ({ ...prev, loc: value }));
                }}
                disabled={!selectedCompany}
              >
                <option value="">Select</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locname}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          <div className="flex justify-between items-center gap-4">
            {/* Price List Code */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price list code
              </label>
              <input
                type="text"
                name="price_list_code"
                value={formData.price_list_code}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="PR001"
              />
            </div>

            {/* Price List Name */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price list name
              </label>
              <input
                type="text"
                name="price_list_name"
                value={formData.price_list_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ecom"
              />
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            {/* Start Date */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-auto bg-black text-white py-1 px-2 text-sm rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Save price list
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddPriceListMaster;

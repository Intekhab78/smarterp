import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { axios_post } from "../../axios";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const PriceListMasterEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    comp: "",
    loc: "",
    price_list_code: "",
    price_list_name: "",
    start_date: "",
    end_date: "",
    status: "inactive",
  });

  // LOAD EXISTING DATA
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/price_list_master/details/${id}`
        );
        if (res.data?.data) {
          setFormData(res.data.data);
          fetchLocationList(res.data.data.comp);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchDetails();
  }, [id]);

  // FETCH COMPANIES
  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response?.status) {
      const all = response.data;
      const filtered = all.filter((c) => c.is_main_comp !== "yes");
      setCompanies(filtered.length ? filtered : all);
    }
  };

  // FETCH LOCATIONS
  const fetchLocationList = async (companyId) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });
    if (response?.status) setLocations(response.data);
  };

  useEffect(() => {
    fetchCompanyList();
  }, []);

  // UPDATE FORM
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SUBMIT UPDATE
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${constantApi.baseUrl}/price_list_master/update/${id}`,
        formData
      );
      alert("Price list updated successfully!");
      navigate(-1);
    } catch (err) {
      console.log(err);
      alert("Error updating record");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="max-w-xl mx-auto bg-white shadow-lg p-8 mt-10 rounded-xl border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Edit Price List
        </h2>

        <form onSubmit={submitForm} className="space-y-5">
          {/* Company + Location */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Company
              </label>
              <select
                name="comp"
                value={formData.comp}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, comp: val, loc: "" });
                  fetchLocationList(val);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70"
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.compdesc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Location
              </label>
              <select
                name="loc"
                value={formData.loc}
                onChange={handleChange}
                disabled={!formData.comp}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 disabled:bg-gray-100"
              >
                <option value="">Select Location</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.locname}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* Code + Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Price List Code
              </label>
              <input
                type="text"
                name="price_list_code"
                value={formData.price_list_code}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Price List Name
              </label>
              <input
                type="text"
                name="price_list_name"
                value={formData.price_list_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg bg-gray-200 text-sm hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-900 transition"
            >
              Update Price List
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PriceListMasterEdit;

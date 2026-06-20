import { useState, useEffect } from "react";
import axios from "axios";
import { axios_post } from "../../axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";
import { ToastMassage } from "../../toast"; // ✅ using your toast

export default function TaxSettingsForm() {
  const [formData, setFormData] = useState({
    tax_name: "inclusive",
    company_id: "",
    location_id: "",
    status: "1",
    register_date: "",
  });

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  const user_data = JSON.parse(localStorage.getItem("user_data"));

  // ✅ Fetch companies
  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/user_matched_com_list", {
      company_id: user_data?.company_id,
    });

    if (response?.status) {
      setCompanies(response.data);
    } else {
      ToastMassage(response?.message || "Failed to load companies", "error");
    }
  };

  // ✅ Fetch locations based on company
  const fetchLocationList = async (companyId) => {
    const response = await axios_post(true, "location/com_loc_list", {
      company_id: user_data?.company_id,
    });

    if (response?.status) {
      const filtered = response.data.filter(
        (loc) => parseInt(loc.compdesc) === parseInt(companyId)
      );
      setLocations(filtered);
    } else {
      ToastMassage(response?.message || "Failed to load locations", "error");
    }
  };

  useEffect(() => {
    fetchCompanyList();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "company_id") {
      fetchLocationList(value);
      setFormData((prev) => ({ ...prev, location_id: "" }));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loader
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/taxSettingsRoute/tax-store`,
        formData
      );
      if (res.data.status) {
        ToastMassage("✅ Tax setting added successfully!", "success");
        setFormData({
          tax_name: "inclusive",
          company_id: "",
          location_id: "",
          status: "1",
          register_date: "",
        });
      } else {
        ToastMassage(res.data.message || "Failed to save", "error");
      }
    } catch (err) {
      ToastMassage("❌ Error while saving tax setting", "error");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-lg mx-auto mt-6 bg-white border rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Tax Setting
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Tax Name */}
          <div>
            <label className="block mb-1 text-gray-600">Tax Name</label>
            <select
              name="tax_name"
              value={formData.tax_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="inclusive">Inclusive</option>
              <option value="exclusive">Exclusive</option>
            </select>
          </div>

          {/* Company + Location in same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600">Company</label>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select Company</option>
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.compdesc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Location</label>
              <select
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Status in same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600">Register Date</label>
              <input
                type="date"
                name="register_date"
                value={formData.register_date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Tax Setting"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

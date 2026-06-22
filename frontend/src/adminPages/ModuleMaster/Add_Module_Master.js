import axios from "axios";
import React, { useState } from "react";
import constantApi from "../../constantApi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
function Add_Module_Master() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " "); // "YYYY-MM-DD HH:MM:SS"

  const [formData, setFormData] = useState({
    module_name: "",
    module_description: "",
    note1: "",
    note2: "",
    sorting_order: "",
    status: "1",
    created_at: formattedDate,
    date1: "",
    date2: "",
    created_by: 1,
    updated_by: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/module_master/create`,
        formData
      );
      alert("Module Master Added");
      setLoader(false);
      navigate("/module_masters");
    } catch (err) {
      setLoader(false);
      console.error("Error:", err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            Add Module Master
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Module Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Module Name
              </label>
              <input
                type="text"
                name="module_name"
                value={formData.module_name}
                onChange={handleChange}
                placeholder="Enter Module Name"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Module Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Module Description
              </label>
              <textarea
                name="module_description"
                value={formData.module_description}
                onChange={handleChange}
                placeholder="Enter Module Description"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none h-10 resize-none"
                rows={1}
              />
            </div>

            {/* Note 1 */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Note 1
              </label>
              <input
                type="text"
                name="note1"
                value={formData.note1}
                onChange={handleChange}
                placeholder="Enter Note 1"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Note 2 */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Note 2
              </label>
              <input
                type="text"
                name="note2"
                value={formData.note2}
                onChange={handleChange}
                placeholder="Enter Note 2"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Status, Sorting Order, Date 1, Date 2 */}
            <div className="grid grid-cols-4 gap-4 col-span-2">
              {/* Status */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              {/* Sorting Order */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Sorting Order
                </label>
                <input
                  type="number"
                  name="sorting_order"
                  value={formData.sorting_order}
                  onChange={handleChange}
                  placeholder="Order"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Date 1 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Date 1
                </label>
                <input
                  type="date"
                  name="date1"
                  value={formData.date1}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Date 2 */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Date 2
                </label>
                <input
                  type="date"
                  name="date2"
                  value={formData.date2}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center"
                disabled={loader}
              >
                {loader ? (
                  <div className="loader inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                ) : null}
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Add_Module_Master;

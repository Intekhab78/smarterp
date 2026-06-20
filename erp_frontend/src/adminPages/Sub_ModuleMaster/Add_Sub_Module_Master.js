import axios from "axios";
import React, { useState, useEffect } from "react";
import constantApi from "../../constantApi";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function SubModuleMasterForm() {
  const [loader, setLoader] = useState(false);
  const [moduleMaster, setModuleMaster] = useState([]);
  const navigate = useNavigate();

  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const [formData, setFormData] = useState({
    module_id: "",
    sub_module_name: "",
    sub_module_description: "",
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
        `${constantApi.baseUrl}/sub_module_master/create`,
        formData
      );
      alert("Sub Module Master Added");
      setLoader(false);
      navigate("/sub_module_master");
    } catch (err) {
      setLoader(false);
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/module_master/list`)
      .then((res) => setModuleMaster(res.data.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            Add Sub Module Master
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Select Module */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Select Module
              </label>
              <select
                onChange={(e) =>
                  setFormData({ ...formData, module_id: e.target.value })
                }
                name="module_id"
                value={formData.module_id}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select Module</option>
                {moduleMaster.map((module) => (
                  <option key={module.module_id} value={module.module_id}>
                    {module.module_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Module Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Sub Module Name
              </label>
              <input
                type="text"
                name="sub_module_name"
                value={formData.sub_module_name}
                onChange={handleChange}
                placeholder="Enter Sub Module Name"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Sub Module Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Sub Module Description
              </label>
              <textarea
                name="sub_module_description"
                value={formData.sub_module_description}
                onChange={handleChange}
                placeholder="Enter Sub Module Description"
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

            {/* Sorting Order, Status, Date 1, and Date 2 */}
            <div className="col-span-2 grid grid-cols-4 gap-4">
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

export default SubModuleMasterForm;

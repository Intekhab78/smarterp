import axios from "axios";
import React, { useState } from "react";
import constantApi from "../../constantApi";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Add_Role_Master() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    role_name: "",
    role_description: "",
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
        `${constantApi.baseUrl}/role_master/create`,
        formData
      );
      alert("Role Master Added");
      setLoader(false);
      navigate("/role_master");
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
            Add Role Master
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Module Name */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Role Name
              </label>
              <input
                type="text"
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                placeholder="Enter Role Name"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Module Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Module Description
              </label>
              <textarea
                name="role_description"
                value={formData.role_description}
                onChange={handleChange}
                placeholder="Enter Role Description"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none h-10 resize-none"
                rows={1}
              />
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

export default Add_Role_Master;

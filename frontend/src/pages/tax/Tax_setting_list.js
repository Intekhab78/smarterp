import React, { useEffect, useState } from "react";
import { ToastMassage } from "../../toast";
import axios from "axios";
import constantApi from "constantApi";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
const Tax_setting_list = () => {
  const [taxSettings, setTaxSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchTaxSettings = async () => {
    try {
      const response = await axios.get(
        `${constantApi.baseUrl}/taxSettingsRoute/tax-list`
      ); // adjust API route

      if (response.data.success) {
        setTaxSettings(response.data.data);
      } else {
        ToastMassage(response.data.message || "Failed to fetch", "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      ToastMassage("Something went wrong while fetching tax settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxSettings();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6">
        <h1 className="text-lg font-semibold mb-4 text-gray-700">
          Tax Settings List
        </h1>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading tax settings...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-3 text-left">ID</th>
                  <th className="py-2 px-3 text-left">Tax Name</th>
                  <th className="py-2 px-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {taxSettings.length > 0 ? (
                  taxSettings.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      {/* <td className="py-2 px-3">{item.id}</td> */}
                      <td className="py-2 px-3">{item.tax_name}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status === 0 ? "Inactive" : "Active"}
                        </span>
                      </td>
                      {/* <td className="py-2 px-3">{item.company_id}</td>
                      <td className="py-2 px-3">{item.location_id}</td> */}
                      {/* <td className="py-2 px-3">{item.organisation_id}</td> */}
                      <td className="py-2 px-3 text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-4 text-center text-gray-500 italic"
                    >
                      No tax settings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Tax_setting_list;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../../constantApi";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { MdSettings, MdDeleteOutline } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion } from "framer-motion";

const Sub_Module_Master = () => {
  const [subModules, setSubModules] = useState([]);
  const [popoverId, setPopoverId] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/sub_module_master/list`)
      .then((res) => setSubModules(res.data.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleEditActivity = (id) => {
    const submodule = subModules.find((data) => data.sub_module_id === id);
    navigate("/edit_sub_module_master", { state: { submodule } });
  };

  const handleViewActivity = (id) => navigate(`/view_sub_module_master/${id}`);

  const deleteModule = (id) => {
    axios
      .delete(`${constantApi.baseUrl}/sub_module_master/${id}`)
      .then(() =>
        setSubModules((prev) =>
          prev.filter((data) => data.sub_module_id !== id)
        )
      )
      .catch(() => alert("Failed to delete the submodule."));
  };

  const filteredModules = subModules.filter((data) =>
    data.sub_module_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <MdSettings className="text-blue-600 text-3xl" />
              <h1 className="text-2xl font-semibold text-gray-700">
                Submodule Master
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-3 pr-10 py-2 w-64 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Search submodule..."
                />
              </div>

              <Link to="/add_sub_module_master">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow hover:bg-blue-700 transition-all">
                  + Add Submodule
                </button>
              </Link>

              <div className="relative">
                <GiHamburgerMenu
                  className="text-gray-600 text-2xl cursor-pointer hover:text-gray-800"
                  onClick={() => setPopoverId((prev) => !prev)}
                />
                {popoverId && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-md border border-gray-100 z-10">
                    <ul className="text-sm">
                      <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                        Import
                      </li>
                      <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                        Export
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Sub Module</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((data, index) => (
                  <motion.tr
                    key={data.sub_module_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-4 text-gray-500">
                      {formatDate(data.created_at)}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {data.module.module_name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {data.sub_module_name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {data.sub_module_description}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          data.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {data.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-center flex justify-center gap-3">
                      <BiSolidEdit
                        className="text-blue-600 cursor-pointer hover:scale-110 transition"
                        size={18}
                        onClick={() => handleEditActivity(data.sub_module_id)}
                        title="Edit"
                      />
                      <MdDeleteOutline
                        className="text-red-600 cursor-pointer hover:scale-110 transition"
                        size={18}
                        onClick={() => deleteModule(data.sub_module_id)}
                        title="Delete"
                      />
                      <AiOutlineEye
                        className="text-green-600 cursor-pointer hover:scale-110 transition"
                        size={18}
                        onClick={() => handleViewActivity(data.sub_module_id)}
                        title="View"
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="flex justify-end mt-4 text-sm text-gray-500">
            Showing {filteredModules.length} of {subModules.length} submodules
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sub_Module_Master;

import React, { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineEye } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import axios from "axios";
import constantApi from "../../constantApi";

const Function_Master = () => {
  const [functions, setFunctions] = useState([]);
  const [popoverId, setPopoverId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // pagination count
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/function_master/list`)
      .then((res) => setFunctions(res.data.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleEdit = (id) => {
    const func = functions.find((f) => f.function_master_id === id);
    navigate("/edit_function_master", { state: { func } });
  };

  const handleView = (id) => navigate(`/view_function_master/${id}`);

  const handleDelete = (id) => {
    axios
      .delete(`${constantApi.baseUrl}/function_master/${id}`)
      .then(() =>
        setFunctions((prev) => prev.filter((f) => f.function_master_id !== id))
      )
      .catch(() => alert("Failed to delete function."));
  };

  // Filter by search input
  const filteredFunctions = functions.filter((f) =>
    f.function_master_name.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFunctions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFunctions = filteredFunctions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-7xl mx-auto p-4 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <header className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <AiOutlineDoubleRight
                  className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition"
                  onClick={() => navigate(-1)}
                  title="Back"
                />
                <MdSettings className="text-blue-600 text-3xl" />
                <h1 className="text-2xl font-semibold text-gray-700">
                  Function Master
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/add_function_master">
                  <button className="bg-blue-600 text-white py-2 px-5 text-sm rounded-full hover:bg-blue-700 shadow-md transition">
                    + New
                  </button>
                </Link>
                <div className="relative">
                  <GiHamburgerMenu
                    className="text-gray-700 text-2xl cursor-pointer hover:text-gray-900 transition"
                    onClick={() => setPopoverId((prev) => !prev)}
                  />
                  {popoverId && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                    >
                      <ul>
                        <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer transition">
                          Import Functions
                        </li>
                        <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer transition">
                          Export Functions
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setCurrentPage(1); // reset page on search
                }}
                className="w-64 px-3 py-2 border rounded-full text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm"
                placeholder="Search by function name"
              />
            </div>
          </header>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-md p-4">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-gray-700 bg-gray-100">
                <tr>
                  <th className="p-4">Created At</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Sub Module</th>
                  <th className="p-4">Function Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFunctions.map((f, index) => (
                  <motion.tr
                    key={f.function_master_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-blue-50 hover:shadow-md transition-all rounded-lg"
                  >
                    <td className="p-4 text-gray-500">
                      {new Date(f.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4 font-medium">{f.module.module_name}</td>
                    <td className="p-4">{f.sub_module.sub_module_name}</td>
                    <td className="p-4 font-semibold">
                      {f.function_master_name}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          f.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {f.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <BiSolidEdit
                        className="text-blue-600 cursor-pointer hover:text-blue-800 hover:scale-110 transition-transform"
                        onClick={() => handleEdit(f.function_master_id)}
                        title="Edit"
                      />
                      <MdDeleteOutline
                        className="text-red-600 cursor-pointer hover:text-red-800 hover:scale-110 transition-transform"
                        onClick={() => handleDelete(f.function_master_id)}
                        title="Delete"
                      />
                      <AiOutlineEye
                        className="text-green-600 cursor-pointer hover:text-green-800 hover:scale-110 transition-transform"
                        onClick={() => handleView(f.function_master_id)}
                        title="View"
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4 text-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-lg transition ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50  "
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Function_Master;

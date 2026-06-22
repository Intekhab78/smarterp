import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios_post } from "../../axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FiSearch, FiMail, FiPhone } from "react-icons/fi";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { motion } from "framer-motion";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const getdetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "vendor/list");
    if (response?.status) {
      setVendors(response.data.records || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    getdetails();
  }, []);

  const filteredVendors = vendors.filter(
    (v) =>
      v.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      v.vendor_code?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 rounded-xl">
        {/* Main Container */}
        <div className="bg-white shadow-xl rounded-2xl p-6 max-w-[1400px] mx-auto flex flex-col min-h-[80vh]">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-3xl font-semibold text-blue-700 tracking-tight">
              Vendor Directory
            </h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendor..."
                  className="pl-9 pr-3 py-2 w-64 border border-gray-300 rounded-full text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => navigate("/vendors/add")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm px-5 py-2 rounded-full shadow-md hover:from-blue-700 hover:to-blue-800 transition"
              >
                + Add Vendor
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <p className="text-gray-500 text-sm text-center py-10">
                Loading vendors...
              </p>
            ) : filteredVendors.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">
                No vendors found.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {paginatedVendors.map((v) => (
                  <motion.div
                    key={v.id}
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    onClick={() => setSelectedVendor(v)}
                    className={`cursor-pointer relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 flex flex-col justify-between transition ${
                      selectedVendor?.id === v.id ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    {/* Header: Company Name + Vendor Code */}
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h2 className="text-2xl font-bold text-gray-900 truncate">
                          {v.company_name}
                        </h2>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            v.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        {v.vendor_code}
                      </p>
                    </div>

                    {/* Vendor Contact */}
                    <div className="mb-4 space-y-2">
                      <p className="text-gray-800 text-lg font-semibold">
                        {v.firstname} {v.lastname}
                      </p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {v.vendor_type}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="text-gray-600 text-sm space-y-1 mb-4">
                      <p className="flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        {v.email}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiPhone className="text-gray-400" />
                        {v.mobile}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/vendors/view/${v.id}`);
                        }}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1 rounded-full shadow-sm"
                      >
                        <AiOutlineEye size={14} /> View
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/vendors/edit/${v.id}`);
                        }}
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 border border-green-200 px-3 py-1 rounded-full shadow-sm"
                      >
                        <AiOutlineEdit size={14} /> Edit
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredVendors.length > 0 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorList;

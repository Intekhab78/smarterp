import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { axios_post } from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// @mui material components
import { motion } from "framer-motion";
// Tialwing UI
import constantApi from "../../constantApi";

import { MdDeleteOutline, MdSettings } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiSolidEdit } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import ReactPaginate from "react-paginate";

export default function ItemFamMst() {
  const [selectedValue, setSelectedValue] = useState("");

  // TAILWIND uI
  const [subFamilyMaster, setSubFamilyMaster] = useState([]);
  const [familyMaster, setFamilyMaster] = useState([]);
  const [popoverId, setPopoverId] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at", // created_at | company
    direction: "desc", // asc | desc
  });
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSubFamily = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${constantApi.baseUrl}/sub_family_master/list`
        );
        setSubFamilyMaster(res.data.data || []);
      } catch (error) {
        console.log("error Fetching ItemDeptMast", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubFamily();
  }, []);

  const handleEdit = (id) => {
    const module = subFamilyMaster.find((data) => data.id === id);
    navigate(`/ItemSFamMst/edit/${id}`, { state: { module } });
  };

  const handleViewActivity = (id) => navigate(`/ItemSFamMst/view/${id}`);

  const search = searchInput.toLowerCase();

  const filteredsubfamilymaster = subFamilyMaster.filter(
    (data) =>
      data?.itemsfamname?.toString().toLowerCase().includes(search) ||
      data?.department?.itemdeptname
        ?.toString()
        .toLowerCase()
        .includes(search) ||
      data?.family?.itemfamname?.toString().toLowerCase().includes(search)
  );

  const deleteModule = (id) => {
    alert(`Are You Sure You Want To Delete This ?`);
    axios
      .post(`${constantApi.baseUrl}/sub_family_master/delete`, {
        id: id,
      })
      .then(() =>
        setSubFamilyMaster((prev) => prev.filter((data) => data.id !== id))
      )
      .catch((err) => alert("Failed to delete the Sub Family."));
  };

  const sortedSubFamMst = [...filteredsubfamilymaster].sort((a, b) => {
    let valueA = "";
    let valueB = "";

    if (sortConfig.key === "created_at") {
      valueA = new Date(a?.created_at || 0);
      valueB = new Date(b?.created_at || 0);
    }

    if (sortConfig.key === "location") {
      valueA = a?.location?.locname?.toString().toLowerCase() || "";
      valueB = b?.location?.locname?.toString().toLowerCase() || "";
    }

    if (sortConfig.key === "famname") {
      valueA = a?.itemfamname?.toString().toLowerCase() || "";
      valueB = b?.itemfamname?.toString().toLowerCase() || "";
    }

    if (sortConfig.key === "subfamname") {
      valueA = a?.itemsfamname?.toString().toLowerCase() || "";
      valueB = b?.itemsfamname?.toString().toLowerCase() || "";
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ label, columnKey }) => {
    const isActive = sortConfig.key === columnKey;

    return (
      <th
        className="p-4 w-[115px] whitespace-nowrap"
        onClick={() =>
          setSortConfig((prev) => ({
            key: columnKey,
            direction:
              prev.key === columnKey && prev.direction === "asc"
                ? "desc"
                : "asc",
          }))
        }
      >
        <div className="flex items-center justify-start gap-2">
          <span className={isActive ? "font-semibold text-gray-800" : ""}>
            {label}
          </span>

          <span className="w-4 flex justify-center">
            {isActive && sortConfig.direction === "asc" ? (
              <FaArrowUp className="text-gray-700 text-sm font-semibold" />
            ) : (
              <FaArrowDown className="text-gray-700 text-sm font-bold opacity-30" />
            )}
          </span>
        </div>
      </th>
    );
  };

  const pageCount = Math.ceil(sortedSubFamMst.length / itemsPerPage);

  const paginatedData = sortedSubFamMst.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  console.log(paginatedData);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchInput]);

  const handleExportExcel = () => {
    const confirmExport = window.confirm(
      "Do you want to download the Excel file for all data?"
    );

    if (!confirmExport) return;

    const exportData = sortedSubFamMst.map((item, index) => ({
      "Sr No": index + 1,
      "Created At": new Date(item.created_at).toLocaleDateString("en-GB"),
      "Dept Code": item.department?.itemdeptcode || "",
      Dept: item.department?.itemdeptname || "",
      "Fam Code": item.family?.itemfamcode || "",
      Fam: item.family?.itemfamname || "",
      "Sub Fam Code": item.itemsfamcode || "",
      "Sub Fam": item.itemsfamname || "",
      Description: item.itemsfamlong || "",
      Location: item.location?.locname || "Doesn't added location",
      Status: item.status === 1 ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "ItemSubFam");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `ItemSubFam_List_${Date.now()}.xlsx`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* Tailwind UI */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <MdSettings className="text-blue-600 text-3xl" />
              <h1 className="text-2xl font-semibold text-gray-700">
                Sub Family
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-3 pr-10 py-2 w-64 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Search Sub Family..."
                />
              </div>

              <Link to="/master/ItemSFamMst">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow hover:bg-blue-700 transition-all">
                  + Add Sub Family
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
                      <li
                        className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                        onClick={handleExportExcel}
                      >
                        Export
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm min-h-[300px] relative">
            {loading ? (
              <div className="flex items-center justify-center flex-col absolute inset-0 gap-2 text-gray-500">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading Sub Family...</span>
              </div>
            ) : (
              <table className=" min-w-[1400px] w-full table-auto border-collapse text-xs text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                  <tr>
                    {/* <th className="p-4">Created At</th> */}
                    <SortableHeader label="Created At" columnKey="created_at" />

                    <th className="p-4 w-[115px] whitespace-nowrap">
                      Dept Code
                    </th>
                    <th className="p-4 w-[115px] whitespace-nowrap">Dept </th>
                    <th className="p-4 w-[115px] whitespace-nowrap">
                      Fam Code
                    </th>
                    {/* <th className="p-4 w-[115px]">Fam Name</th> */}
                    <SortableHeader label="Fam" columnKey="famname" />
                    <th className="p-4 w-[115px] whitespace-nowrap">
                      Sub Fam Code
                    </th>
                    {/* <th className="p-4 w-[115px]">Sub Fam </th> */}
                    <SortableHeader label="Sub Fam" columnKey="subfamname" />

                    <th className="p-4 w-[115px] whitespace-nowrap">
                      Description
                    </th>

                    {/* <th className="p-4 w-[115px]">Location</th> */}
                    <SortableHeader label="Location" columnKey="location" />

                    {/* <th className="p-4 w-[115px]">Created By</th> */}
                    <th className="p-4 w-[115px] whitespace-nowrap">Status</th>
                    <th className="p-4 w-[115px] whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((data, index) => (
                    <motion.tr
                      key={data.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-4 w-[115px] text-gray-500 whitespace-nowrap">
                        {new Date(data.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="p-4 w-[115px] font-medium text-gray-800 whitespace-nowrap">
                        {data.department?.itemdeptcode}
                      </td>
                      <td className="p-4 w-[115px] text-gray-600 whitespace-nowrap">
                        {data.department?.itemdeptname}
                      </td>
                      <td className="p-4 w-[115px] text-gray-600 whitespace-nowrap">
                        {data.family?.itemfamcode}
                      </td>

                      <td className="p-4 w-[115px] text-gray-600 whitespace-nowrap">
                        {data.family?.itemfamname || "—"}
                      </td>
                      <td className="p-4 w-[115px] text-gray-600 whitespace-nowrap">
                        {data.itemsfamcode}
                      </td>
                      <td className="p-4 w-[115px] text-gray-600 whitespace-nowrap">
                        {data.itemsfamname}
                      </td>
                      <td className="p-4 w-[115px] text-gray-600 whitespace-nowrap">
                        {data.itemsfamlong}
                      </td>
                      <td className="p-4 w-[115px] text-gray-600 whitespace-nowrap">
                        {data.location?.locname || `Doesn't added location`}
                      </td>
                      {/* <td className="p-4 text-gray-500">{data.created_by}</td> */}
                      {/* <td className="p-4 text-gray-500">{data.created_at}</td> */}

                      <td className="p-4 w-[115px] whitespace-nowrap">
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
                      <td className="p-4 w-[115px] text-center gap-3">
                        <div className="flex justify-center gap-3">
                          <BiSolidEdit
                            className="text-blue-600 cursor-pointer hover:scale-110 transition"
                            size={18}
                            onClick={() => handleEdit(data.id, "edit")}
                            title="Edit"
                          />
                          <MdDeleteOutline
                            className="text-red-600 cursor-pointer hover:scale-110 transition"
                            size={18}
                            onClick={() => deleteModule(data.id)}
                            title="Delete"
                          />
                          <AiOutlineEye
                            className="text-green-600 cursor-pointer hover:scale-110 transition"
                            size={18}
                            onClick={() => handleViewActivity(data.id, "view")}
                            title="View"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination Placeholder */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-3">
            <div className="text-sm text-gray-500">
              Showing {paginatedData.length} of {subFamilyMaster.length} Items
            </div>
            {!loading && (
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={(event) => setCurrentPage(event.selected)}
                previousLabel="Prev"
                nextLabel="Next"
                breakLabel="..."
                containerClassName="flex gap-2"
                pageClassName="px-3 py-1 border rounded-md cursor-pointer hover:bg-blue-100"
                activeClassName="bg-blue-600 text-white"
                previousClassName="px-3 py-1 border rounded-md cursor-pointer"
                nextClassName="px-3 py-1 border rounded-md cursor-pointer"
                disabledClassName="opacity-50 cursor-not-allowed"
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

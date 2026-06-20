import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { axios_post } from "../../axios";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

//tailwind UI
import constantApi from "../../constantApi";
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteOutline, MdSettings } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";

export default function ItemDeptMst() {
  const [popoverId, setPopoverId] = useState(false);
  const [itemData, setItemData] = useState([]);
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
    const fectItemDeptMst = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${constantApi.baseUrl}/item_department/list`,
        );
        setItemData(res.data.data || []);
      } catch (error) {
        console.log("error Fetching ItemDeptMast", error);
      } finally {
        setLoading(false);
      }
    };
    fectItemDeptMst();
  }, []);

  const handleEdit = (id) => {
    const module = itemData.find((data) => data.id === id);
    navigate(`/itemDeptMst/edit/${id}`, { state: { module } });
  };

  const handleViewActivity = (id) => navigate(`/itemDeptMst/view/${id}`);

  const filtereditemdept1 = itemData.filter(
    (data) =>
      data.itemdeptcode
        ?.toString()
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      data.itemdeptname?.toLowerCase().includes(searchInput.toLowerCase()) ||
      data.location.locname
        ?.toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      data.company.compdesc?.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const filtereditemdept = itemData.filter(
    (data) =>
      data.itemdeptcode
        ?.toString()
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      data.itemdeptname?.toLowerCase().includes(searchInput.toLowerCase()) ||
      data.location?.locname
        ?.toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      data.company?.compdesc?.toLowerCase().includes(searchInput.toLowerCase()),
  );

  console.log(filtereditemdept);

  const deleteModule = (id) => {
    alert(`Are You Sure You Want To Delete This ?`);
    axios
      .post(`${constantApi.baseUrl}/item_department/delete`, {
        id: id,
      })
      .then(() => setItemData((prev) => prev.filter((data) => data.id !== id)))
      .catch((err) => alert("Failed to delete the module."));
  };

  const sortedDeptMst = [...filtereditemdept].sort((a, b) => {
    let valueA, valueB;

    if (sortConfig.key === "created_at") {
      valueA = new Date(a.created_at);
      valueB = new Date(b.created_at);
    }
    if (sortConfig.key === "location") {
      valueA = a.location?.locname?.toLowerCase() || "";
      valueB = b.location?.locname?.toLowerCase() || "";
    }

    if (sortConfig.key === "company") {
      valueA = a.company?.compdesc?.toLowerCase() || "";
      valueB = b.company?.compdesc?.toLowerCase() || "";
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ label, columnKey }) => {
    const isActive = sortConfig.key === columnKey;

    return (
      <th
        className="p-4 cursor-pointer select-none group"
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
        <div className="flex items-center justify-center gap-2">
          <span className={isActive ? "font-semibold text-gray-800" : ""}>
            {label}
          </span>

          {/* Arrow icon */}
          <span
            className={`
                          opacity-0 
                          group-hover:opacity-100 
                          transition
                        `}
          >
            {isActive && sortConfig.direction === "asc" ? (
              <FaArrowUp
                title="ascending"
                className="text-gray-700 text-sm font-bold"
              />
            ) : (
              <FaArrowDown
                title="descending"
                className="text-gray-700 text-sm font-bold"
              />
            )}
          </span>
        </div>
      </th>
    );
  };

  const pageCount = Math.ceil(sortedDeptMst.length / itemsPerPage);

  const paginatedData = sortedDeptMst.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [searchInput]);

  const handleExportExcel = () => {
    const confirmExport = window.confirm(
      "Do you want to download the Excel file for all Item Department?",
    );

    if (!confirmExport) return;

    const exportData = sortedDeptMst.map((item, index) => ({
      "Sr No": index + 1,
      Code: item.itemdeptcode || "", // department/code
      Description: item.itemdeptname || "", // description
      Company: item.company?.compdesc || "N/A", // company name
      Location: item.location?.locname || "N/A", // location name
      Status: item.status === 1 ? "Active" : "Inactive",
      "Created At": new Date(item.created_at).toLocaleString("en-GB"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `Location_List_${Date.now()}.xlsx`);
  };

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
                Item Departmment
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-3 pr-10 py-2 w-64 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Search Item Department..."
                />
              </div>

              <Link to="/master/ItemDeptMst">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow hover:bg-blue-700 transition-all">
                  + Add Item
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
                <span className="text-sm">Loading Item...</span>
              </div>
            ) : (
              <table className="w-full text-xs text-center text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                  <tr>
                    <SortableHeader label="Created At" columnKey="created_at" />
                    <th className="p-4">Code</th>
                    <th className="p-4">Description</th>
                    <SortableHeader label="Company" columnKey="company" />
                    <SortableHeader label="Location" columnKey="location" />
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((data, index) => (
                    <motion.tr
                      key={data.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-4 text-gray-500">
                        {new Date(data.created_at)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })
                          .replace(",", "")
                          .toUpperCase()}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {data.itemdeptcode}
                      </td>
                      <td className="p-4 text-gray-600">{data.itemdeptname}</td>
                      {/* <td className="p-4 text-gray-600">
                        {data.company.compdesc}
                      </td>
                      <td className="p-4 text-gray-600">
                        {data.location.locname}
                      </td> */}
                      <td className="p-4 text-gray-600">
                        {data.company?.compdesc || "N/A"}
                      </td>

                      <td className="p-4 text-gray-600">
                        {data.location?.locname || "N/A"}
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
                          onClick={() => handleEdit(data.id)}
                          title="Edit"
                        />
                        <MdDeleteOutline
                          className="text-red-600 cursor-pointer hover:scale-110 transition"
                          size={18}
                          onClick={() => deleteModule(data.id)}
                        />
                        <AiOutlineEye
                          className="text-green-600 cursor-pointer hover:scale-110 transition"
                          size={18}
                          onClick={() => handleViewActivity(data.id)}
                          title="View"
                        />
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
              Showing {paginatedData.length} of {itemData.length} Items
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

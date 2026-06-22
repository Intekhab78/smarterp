import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import AddDepartment from "./Dep_Family"; // adjust path if needed

export default function DepartmentList({ departments = [] }) {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("department_name");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 8;

  // ===== 5 STATIC RECORDS =====
  const staticDepartments = [
    {
      department_code: "D001",
      department_name: "Human Resources",
      start_date: "2024-01-01",
      end_date: "-",
      status: "Active",
    },
    {
      department_code: "D002",
      department_name: "Finance",
      start_date: "2024-01-05",
      end_date: "-",
      status: "Active",
    },
    {
      department_code: "D003",
      department_name: "IT Department",
      start_date: "2024-01-10",
      end_date: "-",
      status: "Inactive",
    },
    {
      department_code: "D004",
      department_name: "Operations",
      start_date: "2024-01-12",
      end_date: "-",
      status: "Active",
    },
    {
      department_code: "D005",
      department_name: "Marketing",
      start_date: "2024-01-15",
      end_date: "-",
      status: "Inactive",
    },
  ];

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${row.department_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });
  };

  const processedData = useMemo(() => {
    let data = departments.length > 0 ? [...departments] : [...staticDepartments];

    // Search
    if (search) {
      data = data.filter((d) =>
        d.department_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      data = data.filter((d) => d.status === statusFilter);
    }

    // Sorting
    data.sort((a, b) =>
      (a[sortKey] || "").localeCompare(b[sortKey] || "")
    );

    return data;
  }, [departments, search, statusFilter, sortKey]);

  const paginated = processedData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalPages = Math.ceil(processedData.length / PAGE_SIZE) || 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border">

      {/* ===== RESPONSIVE HEADER: LEFT TITLE → CENTER CONTROLS → RIGHT BUTTON ===== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 border-b bg-gray-50">

        {/* LEFT: TITLE (center on mobile, left on desktop) */}
        <h2 className="text-base font-semibold text-gray-800 whitespace-nowrap
                 text-center md:text-left w-full md:w-auto">
          Department Master
        </h2>

        {/* CENTER: SEARCH + FILTERS (full width on mobile) */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">

          {/* Large Search Bar */}
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute left-3 top-3 text-gray-400" size={12} />
            <input
              type="text"
              placeholder="Search department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 pr-3 text-[12px] border rounded-full 
                   w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Filters row on mobile, inline on desktop */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 text-[12px] border rounded-full px-3 w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="h-10 text-[12px] border rounded-full px-3 w-full sm:w-auto"
            >
              <option value="department_name">Name</option>
              <option value="department_code">Code</option>
              <option value="start_date">Start Date</option>
            </select>
          </div>
        </div>

        {/* RIGHT: ADD BUTTON (full width on mobile, normal on desktop) */}
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center justify-center gap-1 bg-purple-600 text-white text-[12px] 
               px-5 py-2 rounded-full hover:bg-purple-700 transition
               w-full sm:w-auto"
        >
          <FaPlus size={12} />
          Add New
        </button>

      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Department Name</th>
              <th className="px-3 py-2 text-left">Start Date</th>
              <th className="px-3 py-2 text-left">End Date</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="px-3 py-2 font-medium">
                  {row.department_code || "-"}
                </td>
                <td className="px-3 py-2">{row.department_name}</td>
                <td className="px-3 py-2">{row.start_date || "-"}</td>
                <td className="px-3 py-2">{row.end_date || "-"}</td>

                <td className="px-3 py-2">
                  {row.status === "Active" ? (
                    <span className="inline-block px-2 py-0.5 text-[10px] 
                                     bg-blue-50 text-blue-600 rounded-full font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-[10px] 
                                     bg-red-50 text-red-600 rounded-full font-medium">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-3 py-2">
                  <div className="flex justify-center gap-3">
                    <FaEye
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      size={12}
                    />
                    <FaEdit
                      className="text-green-600 cursor-pointer hover:text-green-800"
                      size={12}
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      size={12}
                      onClick={() => handleDelete(row)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {processedData.length === 0 && (
          <div className="text-center text-gray-500 text-[11px] py-4">
            No departments found
          </div>
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-between items-center px-3 py-2 border-t text-[11px]">
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1} -
          {Math.min(page * PAGE_SIZE, processedData.length)} of{" "}
          {processedData.length}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <AddDepartment
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

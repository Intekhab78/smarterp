import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useState, useMemo } from "react";
import AddPosition from "./Dep_Position"; // adjust path if needed

export default function PositionList({ positions = [] }) {
    const [openModal, setOpenModal] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState("position_name");
    const [page, setPage] = useState(1);

    const PAGE_SIZE = 8;

    // ===== 5 STATIC POSITIONS (RELATED TO DEPT + SUB-DEPT) =====
    const staticPositions = [
        {
            position_name: "HR Executive",
            department_name: "Human Resources",
            sub_department_name: "Recruitment",
            start_date: "2024-01-01",
            end_date: "-",
            status: "Active",
        },
        {
            position_name: "Payroll Officer",
            department_name: "Finance",
            sub_department_name: "Payroll",
            start_date: "2024-01-05",
            end_date: "-",
            status: "Active",
        },
        {
            position_name: "Network Engineer",
            department_name: "IT Department",
            sub_department_name: "Network Team",
            start_date: "2024-01-10",
            end_date: "-",
            status: "Inactive",
        },
        {
            position_name: "Operations Supervisor",
            department_name: "Operations",
            sub_department_name: "Logistics",
            start_date: "2024-01-12",
            end_date: "-",
            status: "Active",
        },
        {
            position_name: "Digital Marketing Manager",
            department_name: "Marketing",
            sub_department_name: "Digital Marketing",
            start_date: "2024-01-15",
            end_date: "-",
            status: "Inactive",
        },
    ];

    const processedData = useMemo(() => {
        let data =
            positions.length > 0
                ? [...positions]
                : [...staticPositions];

        // Search
        if (search) {
            data = data.filter((p) =>
                p.position_name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Status Filter
        if (statusFilter !== "all") {
            data = data.filter((p) => p.status === statusFilter);
        }

        // Sorting
        data.sort((a, b) =>
            (a[sortKey] || "").localeCompare(b[sortKey] || "")
        );

        return data;
    }, [positions, search, statusFilter, sortKey]);

    const paginated = processedData.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const totalPages = Math.ceil(processedData.length / PAGE_SIZE) || 1;

    return (
        <div className="bg-white rounded-lg shadow-sm border">

            {/* ===== HEADER (SAME AS DEPARTMENT) ===== */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-white">

                {/* LEFT: TITLE */}
                <h2 className="text-base font-semibold text-gray-800 whitespace-nowrap">
                    Position Master
                </h2>

                {/* CENTER: SEARCH + FILTER + SORT */}
                <div className="flex items-center gap-3 flex-1 justify-center">

                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" size={12} />
                        <input
                            type="text"
                            placeholder="Search position..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 pl-9 pr-3 text-[12px] border rounded-full w-72
                         focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-10 text-[12px] border rounded-full px-3"
                    >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value)}
                        className="h-10 text-[12px] border rounded-full px-3"
                    >
                        <option value="position_name">Position</option>
                        <option value="department_name">Department</option>
                        <option value="start_date">Start Date</option>
                    </select>
                </div>

                {/* RIGHT: ADD BUTTON */}
                <button
                    onClick={() => setOpenModal(true)}
                    className="flex items-center gap-1 bg-purple-600 text-white text-[12px] 
                     px-5 py-2 rounded-full hover:bg-purple-700 transition"
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
                            <th className="px-3 py-2 text-left">Position</th>
                            <th className="px-3 py-2 text-left">Department</th>
                            <th className="px-3 py-2 text-left">Start Date</th>
                            <th className="px-3 py-2 text-left">End Date</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50 transition">
                                <td className="px-3 py-2 font-medium">
                                    {row.position_name}
                                </td>

                                <td className="px-3 py-2 text-gray-600">
                                    {row.department_name || "-"}
                                </td>

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
                                        <FaEye className="text-blue-500 cursor-pointer" size={12} />
                                        <FaEdit className="text-green-600 cursor-pointer" size={12} />
                                        <FaTrash className="text-red-500 cursor-pointer" size={12} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {processedData.length === 0 && (
                    <div className="text-center text-gray-500 text-[11px] py-4">
                        No positions found
                    </div>
                )}
            </div>

            {/* ===== PAGINATION (SAME AS DEPARTMENT) ===== */}
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
            <AddPosition
                open={openModal}
                onClose={() => setOpenModal(false)}
            />
        </div>
    );
}

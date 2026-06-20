// UservansalTailwind.jsx
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios, { axios_post } from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { ToastMassage } from "toast";

// Keep layout wrappers if you still use them (or replace with your app layout)
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

/*
  Tailwind-only UI version of your original MUI component.
  - Ensure Tailwind CSS is configured in your project.
  - Keep backend helpers (axios_post, ToastMassage) as-is.
*/

export default function Uservansal() {
  const navigate = useNavigate();

  // --- states from original file ---
  const [selectedValue, setSelectedValue] = useState("");
  const [opened, setOpen] = useState(false); // export modal
  const [openMenuMain, setOpenMenuMain] = useState(false); // main menu (three-dot)
  const [openMenuBulk, setOpenMenuBulk] = useState(false); // bulk actions menu
  const [openActionConfirm, setActionConfirm] = useState(false);
  const [openInactiveConfirm, setInactiveConfirm] = useState(false);
  const [dialogbox, setDialogbox] = useState(false); // delete confirm
  const [openedRowMenuId, setOpenedRowMenuId] = useState(null); // per-row menu id
  const [data, setData] = useState([]);
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [SelectedUUID, setSelectedUUID] = useState([]); // array of uuids
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // formData kept (unused heavily here but preserved)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
  });

  // export radio state
  const [exportChoice, setExportChoice] = useState("");
  // export specific dates when needed
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");

  // handleChanged (export radio)
  const handleChanged = (e) => setExportChoice(e.target.value);

  // --- API: fetch details ---
  const getdetails = async () => {
    setLoading(true);
    try {
      const response = await axios_post(true, "user_user_master/list");
      if (response) {
        if (response.status) {
          const records = response?.data?.records || [];
          console.log("records is ", records);

          setData(records);
        } else {
          ToastMassage(response.message, "error");
        }
      }
    } catch (err) {
      console.error("getdetails err:", err);
      ToastMassage("Failed to fetch records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getdetails();
  }, []);

  // --- selection handlers ---
  const handleselection = (ids) => {
    // ids: array of numeric ids (we maintain mapping to uuid)
    const selectedrow = ids
      .map((id) => data.find((row) => row.id === id))
      .filter(Boolean);
    const newUUID = selectedrow.map((r) => r.uuid);
    setSelectedUUID(newUUID);
  };

  // checkbox per row toggle
  const toggleRowCheckbox = (rowId) => {
    const row = data.find((r) => r.id === rowId);
    if (!row) return;
    const uuid = row.uuid;
    setSelectedUUID((prev) => {
      if (prev.includes(uuid)) {
        return prev.filter((u) => u !== uuid);
      } else {
        return [...prev, uuid];
      }
    });
  };

  // select all visible rows on current page
  const toggleSelectAll = () => {
    const visible = paginatedRows;
    if (!selectAllChecked) {
      const allUUIDs = visible.map((r) => r.uuid).filter(Boolean);
      // union with existing
      setSelectedUUID((prev) => Array.from(new Set([...prev, ...allUUIDs])));
      setSelectAllChecked(true);
    } else {
      // remove visible uuids from selection
      const visibleUUIDs = new Set(visible.map((r) => r.uuid));
      setSelectedUUID((prev) => prev.filter((u) => !visibleUUIDs.has(u)));
      setSelectAllChecked(false);
    }
  };

  // open delete confirm
  const handleClickOpened = (orderRow) => {
    // your original called with id; preserve both behaviors:
    // If passed an id, try to find row
    const row =
      typeof orderRow === "object" && orderRow !== null
        ? orderRow
        : data.find((r) => r.id === orderRow) || {};
    setOrderData(row);
    setDialogbox(true);
  };

  const handleClosing = () => {
    setDialogbox(false);
    setActionConfirm(false);
    setInactiveConfirm(false);
  };

  const handleClickactionOpen = () => setActionConfirm(true);
  const handleClickinactiveOpen = () => setInactiveConfirm(true);

  const handleActiveModalSubmit = async (status) => {
    setActionConfirm(false);
    // preserve original commented logic: send SelectedUUID to bulk endpoint
    try {
      // Example: submit selected UUIDs
      // await axios_post(true, 'global/bulk-action', { ids: SelectedUUID, action: status })
      // getdetails(); ToastMassage(...); setInactiveConfirm(false)
      console.log("Bulk action (active):", SelectedUUID, status);
      ToastMassage("Bulk action simulated", "success");
    } catch (err) {
      console.error(err);
      ToastMassage("Bulk action failed", "error");
    }
  };

  const handleActiveModalSubmitInactive = async (status) => {
    setDialogbox(false);
    setActionConfirm(false);
    setInactiveConfirm(false);
    try {
      console.log("Bulk action (inactive):", SelectedUUID, status);
      ToastMassage("Bulk action simulated", "success");
    } catch (err) {
      console.error(err);
      ToastMassage("Bulk action failed", "error");
    }
  };

  // --- delete handler ---
  const handleDelete = async () => {
    const idToDelete = orderData?.id || orderData;
    setIsDeleting(true);
    try {
      const response = await axios_post(true, "user_user_master/delete", {
        id: idToDelete,
      });
      if (response?.status === true) {
        getdetails();
        ToastMassage(response?.message, "success");
        setOrderData({});
        setDialogbox(false);
      } else {
        ToastMassage(response?.message, "error");
        setDialogbox(false);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      ToastMassage("Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- edit/view ---
  const handleEdit = (id, type) => {
    if (type === "edit") {
      navigate(`/uservansal/edit/${id}`);
    } else if (type === "view") {
      navigate(`/uservansal/view/${id}`);
    }
  };

  // --- columns/rows (we'll render table manually) ---
  const columns = [
    { key: "created_at", label: "DATE", width: "w-56" },
    { key: "firstname", label: "Firstname", width: "w-36" },
    { key: "lastname", label: "Lastname", width: "w-36" },
    { key: "role_name", label: "Role", width: "w-44" },
    { key: "email", label: "Email", width: "w-44" },
    { key: "mobile", label: "Mobile", width: "w-36" },
  ];

  // --- filtering ---
  const filteredRows = useMemo(() => {
    if (!searchTerm) return data;
    const s = searchTerm.toLowerCase();
    return data.filter((row) => {
      return (
        (row.firstname || "").toLowerCase().includes(s) ||
        (row.lastname || "").toLowerCase().includes(s) ||
        (row.email || "").toLowerCase().includes(s) ||
        (row.mobile || "").toLowerCase().includes(s)
      );
    });
  }, [searchTerm, data]);

  // --- pagination ---
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [totalPages]);

  const paginatedRows = filteredRows.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  // rerun selectAllChecked when selection changes / page changes
  useEffect(() => {
    const visibleUUIDs = paginatedRows.map((r) => r.uuid).filter(Boolean);
    const allSelected =
      visibleUUIDs.length > 0 &&
      visibleUUIDs.every((u) => SelectedUUID.includes(u));
    setSelectAllChecked(Boolean(allSelected));
  }, [paginatedRows, SelectedUUID]);

  // per-row action menu handlers
  const toggleRowMenu = (id) => {
    setOpenedRowMenuId((prev) => (prev === id ? null : id));
  };

  // small helpers
  const formatDate = (val) =>
    val ? moment(val).format("DD MMM YYYY hh:mm A") : "-";

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <ToastContainer position="top-right" autoClose={4000} theme="light" />

      {/* ================= DELETE CONFIRM MODAL ================= */}
      {dialogbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-md shadow-xl border text-xs">
            <div className="px-4 py-2 border-b font-semibold text-gray-800">
              Confirm Delete
            </div>

            <div className="px-4 py-3 text-gray-600">
              Are you sure you want to delete
              <span className="font-semibold text-gray-800">
                {" "}
                {orderData?.name}
              </span>{" "}
              User JERP?
            </div>

            <div className="px-4 py-2 border-t flex justify-end gap-2">
              <button
                onClick={handleClosing}
                className="px-3 py-1.5 rounded border bg-white hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTAINER ================= */}
      <div className="p-4 text-sm text-gray-700">
        <div className="bg-white rounded-md shadow border">
          {/* ================= HEADER ================= */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <span className="font-semibold text-gray-800">User JERP</span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-2 py-1.5 text-xs border rounded focus:ring-1 focus:ring-blue-500"
              />

              <Link to="/master/uservansal">
                <button className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">
                  + New
                </button>
              </Link>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 border-b text-gray-600 uppercase">
                <tr>
                  {/* <th className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectAllChecked}
                      onChange={toggleSelectAll}
                      className="h-3.5 w-3.5"
                    />
                  </th> */}
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Firstname</th>
                  <th className="px-3 py-2 text-left">Lastname</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Mobile</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      {/* <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={SelectedUUID.includes(row.uuid)}
                          onChange={() => toggleRowCheckbox(row.id)}
                          className="h-3.5 w-3.5"
                        />
                      </td> */}

                      <td className="px-3 py-2">
                        {formatDate(row.created_at)}
                      </td>
                      <td className="px-3 py-2">{row.firstname || "-"}</td>
                      <td className="px-3 py-2">{row.lastname || "-"}</td>
                      <td className="px-3 py-2">
                        {row?.role?.role_name || "-"}
                      </td>
                      <td className="px-3 py-2">{row.email || "-"}</td>
                      <td className="px-3 py-2">{row.mobile || "-"}</td>

                      <td className="px-3 py-2 relative">
                        <button
                          onClick={() => toggleRowMenu(row.id)}
                          className="px-2 py-1 rounded hover:bg-gray-200"
                        >
                          ⋮
                        </button>

                        {openedRowMenuId === row.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border rounded-md shadow text-xs">
                            <button
                              onClick={() => handleEdit(row.id, "edit")}
                              className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleEdit(row.id, "view")}
                              className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleClickOpened(row)}
                              className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-2.5 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

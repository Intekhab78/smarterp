import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { ToastContainer } from "react-toastify";
import { ToastMassage } from "../../toast";

export default function ReasonMapping() {
  const [departments, setDepartments] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    department_id: "",
    reason_id: "",
    reason_type_id: "",
  });

  const [filters, setFilters] = useState({
    department_id: "",
    reason_type_id: "",
    search: "",
  });

  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // number of items per page

  const Action = [
    { id: 1, label: "Cancel" },
    { id: 2, label: "Return" },
    { id: 3, label: "Exchange" },
  ];

  const fetchDepartments = async () => {
    try {
      const res = await axios.post(
        `${constantApi.baseUrl}/item_department/list`
      );
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Department Error ❌", err);
    }
  };

  const fetchReasons = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/order-action-reason-master/list`
      );
      const filterAction = res.data.data.filter((f) => f.status === 1);
      setReasons(filterAction || []);
    } catch (err) {
      console.error("Reason Error ❌", err);
    }
  };

  const fetchMappingList = async (pageNumber = 1) => {
    try {
      const params = {
        page: pageNumber,
        limit,
      };
      if (filters.department_id) params.department_id = filters.department_id;
      if (filters.reason_type_id)
        params.reason_type_id = filters.reason_type_id;
      if (filters.search) params.search = filters.search;

      const res = await axios.get(
        `${constantApi.baseUrl}/order-action-reason-mapping/list`,
        { params }
      );

      const data = res.data.data || [];
      const pagination = res.data.pagination || {};
      const totalCount = pagination.total || 0;
      const limitCount = pagination.limit || limit;
      const currentPage = pagination.page || pageNumber;

      const calculatedTotalPages = Math.ceil(totalCount / limitCount) || 1;

      setList(data);
      setPage(currentPage);
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error("Mapping List Error ❌", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchReasons();
    fetchMappingList(1);
  }, []);

  useEffect(() => {
    fetchMappingList(1);
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoader(true);
    try {
      if (editId) {
        const res = await axios.put(
          `${constantApi.baseUrl}/order-action-reason-mapping/update/${editId}`,
          form
        );
        ToastMassage(res?.data?.message, "success");
        setEditId(null);
      } else {
        const res = await axios.post(
          `${constantApi.baseUrl}/order-action-reason-mapping/create`,
          form
        );
        ToastMassage(res?.data?.message, "success");
      }
      // Only reset reason_id, keep others intact
      setForm((prevForm) => ({
        ...prevForm,
        reason_id: "",
      }));
      fetchMappingList(1);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong.";
      ToastMassage(message, "error");
      setError(message);
    } finally {
      setLoader(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      department_id: item.department_id,
      reason_id: item.reason_id,
      reason_type_id: item.reason_type_id,
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ department_id: "", reason_id: "", reason_type_id: "" });
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mapping?"))
      return;

    setLoadingDeleteId(id);
    try {
      const res = await axios.delete(
        `${constantApi.baseUrl}/order-action-reason-mapping/delete/${id}`
      );
      ToastMassage(res?.data?.message || "Deleted successfully", "success");
      fetchMappingList(page);
    } catch (err) {
      const message = err.response?.data?.message || "Delete failed";
      ToastMassage(message, "error");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  // Pagination handlers
  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      fetchMappingList(p);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Order Action Reason Mapping
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
        >
          <select
            className="border rounded px-3 py-2 text-sm"
            value={form.department_id}
            onChange={(e) =>
              setForm({ ...form, department_id: e.target.value })
            }
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.itemdeptname}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2 text-sm"
            value={form.reason_type_id}
            onChange={(e) =>
              setForm({ ...form, reason_type_id: e.target.value })
            }
            required
          >
            <option value="">Select Action</option>
            {Action.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2 text-sm"
            value={form.reason_id}
            onChange={(e) => setForm({ ...form, reason_id: e.target.value })}
            required
          >
            <option value="">Select Reason</option>
            {reasons.map((r) => (
              <option key={r.id} value={r.id}>
                {r.reason_text}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded text-sm px-4 py-2"
              disabled={loader}
            >
              {loader
                ? editId
                  ? "Updating..."
                  : "Mapping..."
                : editId
                ? "Update"
                : "Map"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-400 text-white rounded text-sm px-4 py-2"
                disabled={loader}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* FILTERS */}
        <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
          <select
            className="border rounded px-3 py-2 text-sm w-full md:w-1/4"
            value={filters.department_id}
            onChange={(e) =>
              setFilters({ ...filters, department_id: e.target.value })
            }
          >
            <option value="">Filter by Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.itemdeptname}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2 text-sm w-full md:w-1/4"
            value={filters.reason_type_id}
            onChange={(e) =>
              setFilters({ ...filters, reason_type_id: e.target.value })
            }
          >
            <option value="">Filter by Action</option>
            {Action.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search Reason"
            className="border rounded px-3 py-2 text-sm w-full md:w-1/3"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* LIST */}
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Department</th>
                <th className="px-3 py-2 text-left">Action</th>
                <th className="px-3 py-2 text-left">Reason</th>
                <th className="px-3 py-2 text-left w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-3 py-2">{m.department?.itemdeptname}</td>
                  <td className="px-3 py-2">
                    {Action.find((a) => a.id === m.reason_type_id)?.label ||
                      "-"}
                  </td>
                  <td className="px-3 py-2">{m.reason?.reason_text}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      title="Edit Mapping"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={loadingDeleteId === m.id}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                      title="Delete Mapping"
                    >
                      {loadingDeleteId === m.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}

              {!list.length && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-400 py-4 text-sm"
                  >
                    No mappings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-1 flex-wrap">
          <button
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>

          {/* Show page numbers, max 5 pages at a time */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 5) return true;
              if (page <= 3) return p <= 5;
              if (page >= totalPages - 2) return p >= totalPages - 4;
              return p >= page - 2 && p <= page + 2;
            })
            .map((p) => (
              <button
                key={p}
                className={`px-2 py-1 text-sm border rounded ${
                  p === page ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                }`}
                onClick={() => goToPage(p)}
                disabled={p === page}
              >
                {p}
              </button>
            ))}

          <button
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>

        <ToastContainer />
      </div>
    </DashboardLayout>
  );
}

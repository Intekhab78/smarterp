import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmailCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${constantApi.baseUrl}/email_category/list`);
      setCategories(res.data.data || []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setStatus(1);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingId) {
        await axios.patch(
          `${constantApi.baseUrl}/email_category/update/${editingId}`,
          { name, status }
        );
      } else {
        await axios.post(`${constantApi.baseUrl}/email_category/create`, {
          name,
          status,
        });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setStatus(cat.status);
    setEditingId(cat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await axios.delete(`${constantApi.baseUrl}/email_category/delete/${id}`);
    if (editingId === id) resetForm();
    fetchCategories();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-4 h-[calc(100vh-90px)] flex gap-4">
        {/* LEFT – FORM */}
        <div className="w-[360px] bg-white rounded shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">
            {editingId ? "Edit Category" : "Add Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-gray-600 mb-1 block">Category Name</label>
              <input
                className="w-full border rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Promotions"
              />
            </div>

            <div>
              <label className="text-gray-600 mb-1 block">Status</label>
              <select
                className="w-full border rounded px-2 py-1.5"
                value={status}
                onChange={(e) => setStatus(+e.target.value)}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs">
                {editingId ? "Update" : "Save"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 px-3 py-1.5 rounded text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT – TABLE */}
        <div className="flex-1 bg-white rounded shadow-sm p-3 flex flex-col">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Email Categories
          </h2>

          <div className="relative flex-1 overflow-auto border rounded">
            {/* Loader */}
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-100 text-gray-600">
                <tr>
                  {/* <th className="px-2 py-2 text-left">ID</th> */}
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Status</th>
                  <th className="px-2 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {!loading && categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No categories found
                    </td>
                  </tr>
                )}

                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t hover:bg-gray-50">
                    {/* <td className="px-2 py-2">{cat.id}</td> */}
                    <td className="px-2 py-2">{cat.name}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          cat.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {cat.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

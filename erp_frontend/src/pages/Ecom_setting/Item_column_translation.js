import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";

export default function ItemColumnTranslation() {
  const [departmentId, setDepartmentId] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const departments = [
    { id: 1, name: "Books" },
    { id: 2, name: "Shoes" },
    { id: 3, name: "Furniture" },
  ];

  useEffect(() => {
    if (departmentId) fetchFields();
  }, [departmentId]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${constantApi.baseUrl}/item_column_translation/department/${departmentId}`,
      );
      setFields(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    setFields(updated);
  };

  const handleAddRow = () => {
    setFields([
      ...fields,
      {
        field_name: "",
        display_label: "",
        sorting_order: 1,
        status: 1,
      },
    ]);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${constantApi.baseUrl}/item_column_translation/bulk-upsert`,
        {
          department_id: departmentId,
          fields,
          user_id: 1,
        },
      );
      fetchFields();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-xl font-semibold mb-6">
            Item Column Translation
          </h1>

          {/* Department Selection */}
          <div className="flex gap-4 items-end mb-6">
            <div className="w-64">
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddRow}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Add Field
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Table */}
          {departmentId && (
            <div>
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 border-b pb-2 mb-3">
                <div className="col-span-3">Field Name</div>
                <div className="col-span-4">Display Label</div>
                <div className="col-span-2">Sort</div>
                <div className="col-span-2">Status</div>
              </div>

              {fields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 mb-3 items-center"
                >
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={field.field_name}
                      onChange={(e) =>
                        handleChange(index, "field_name", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="desc1"
                    />
                  </div>

                  <div className="col-span-4">
                    <input
                      type="text"
                      value={field.display_label}
                      onChange={(e) =>
                        handleChange(index, "display_label", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      placeholder="Author"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={field.sorting_order}
                      onChange={(e) =>
                        handleChange(index, "sorting_order", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="col-span-2">
                    <select
                      value={field.status}
                      onChange={(e) =>
                        handleChange(index, "status", e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>
              ))}

              {fields.length === 0 && !loading && (
                <p className="text-sm text-gray-400">No fields configured.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

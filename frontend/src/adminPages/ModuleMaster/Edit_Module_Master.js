import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../../constantApi";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
function Edit_Module_Master() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({
    module_name: "",
    module_description: "",
    status: 1,
    note1: "",
    note2: "",
    sorting_order: "",
    date1: "",
    date2: "",
  });

  const [editId, setEditId] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (state && state.module) {
      const module = state.module;
      setEditId(module.module_id);
      setEditForm({
        module_name: module.module_name,
        module_description: module.module_description,
        status: module.status,
        note1: module.note1,
        note2: module.note2,
        sorting_order: module.sorting_order,
        date1: module.date1,
        date2: module.date2,
      });
    }
  }, [state]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    axios
      .put(`${constantApi.baseUrl}/module_master/${editId}`, editForm)
      .then((res) => {
        setLoader(false);
        alert("Module Master updated successfully");
        navigate("/module_masters");
        // Redirect or update state as needed
      })
      .catch((err) => {
        setLoader(false);
        console.error("Error updating module: ", err);
        alert("Failed to update the module.");
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 text-center">
                Edit Module Master
              </h2>
            </div>
            <div>
              <button
                className="bg-gray-500 px-4 py-2 rounded-lg text-white text-sm"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </div>
          </div>
          <form
            onSubmit={handleEditSubmit}
            className="grid grid-cols-2 gap-6 text-sm"
          >
            {/* Module Name */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Module Name</label>
              <input
                type="text"
                name="module_name"
                value={editForm.module_name}
                onChange={handleEditChange}
                placeholder="Enter Module Name"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Module Description */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Module Description</label>
              <textarea
                name="module_description"
                value={editForm.module_description}
                onChange={handleEditChange}
                placeholder="Enter Module Description"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Note 1 */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Note 1</label>
              <input
                type="text"
                name="note1"
                value={editForm.note1}
                onChange={handleEditChange}
                placeholder="Enter Note 1"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Note 2 */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Note 2</label>
              <input
                type="text"
                name="note2"
                value={editForm.note2}
                onChange={handleEditChange}
                placeholder="Enter Note 2"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Sorting Order */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Sorting Order</label>
              <input
                type="number"
                name="sorting_order"
                value={editForm.sorting_order}
                onChange={handleEditChange}
                placeholder="Enter Sorting Order"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Status</label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            {/* Date 1 */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Date 1</label>
              <input
                type="datetime-local"
                name="date1"
                value={editForm.date1}
                onChange={handleEditChange}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Date 2 */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Date 2</label>
              <input
                type="datetime-local"
                name="date2"
                value={editForm.date2}
                onChange={handleEditChange}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center"
                disabled={loader}
              >
                {loader ? (
                  <div className="loader inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                ) : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Edit_Module_Master;

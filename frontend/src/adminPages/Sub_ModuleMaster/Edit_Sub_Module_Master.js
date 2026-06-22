import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../../constantApi";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
function Edit_Sub_Module_Master() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    module_id: "",
    sub_module_name: "",
    sub_module_description: "",
    status: 1,
    note1: "",
    note2: "",
    sorting_order: "",
    date1: "",
    date2: "",
  });

  const [moduleMaster, setModuleMaster] = useState([]);
  const [moduleId, setModuleId] = useState();

  const [editId, setEditId] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (state && state.submodule) {
      const sub_module = state.submodule;
      setEditId(sub_module.sub_module_id);
      setEditForm({
        module_id: moduleMaster.module_id,
        sub_module_name: sub_module.sub_module_name,
        sub_module_description: sub_module.sub_module_description,
        status: sub_module.status,
        note1: sub_module.note1,
        note2: sub_module.note2,
        sorting_order: sub_module.sorting_order,
        date1: sub_module.date1,
        date2: sub_module.date2,
      });
    }
  }, [state]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/module_master/list`)
      .then((res) => {
        setModuleMaster(res.data.data);
      })
      .catch((err) => {
        console.error("Error is ", err);
      });
  }, []);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    axios
      .put(`${constantApi.baseUrl}/sub_module_master/${editId}`, editForm)
      .then((res) => {
        setLoader(false);
        alert("Sub Module updated successfully");
        navigate("/sub_module_master");
      })
      .catch((err) => {
        setLoader(false);
        console.error("Error updating module: ", err);
        alert("Failed to update the module.");
      });
  };

  const handleSelect = (id) => {
    setModuleId(id);
    setFormData({
      ...formData,
      module_id: id,
    });
  };
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
          <div className="w-full  bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-black mb-4 text-center">
                  Edit Sub Module Master
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
              {/* Module ID */}
              <div className="flex flex-col">
                <label className="text-gray-600 mb-2">Select Module </label>
                <select
                  onChange={(e) => handleSelect(e.target.value)}
                  name="module_id"
                  id="module_id"
                  // className=" py-2 border-gray-100  "
                  class="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-100 sm:text-sm"
                >
                  {/* Default option */}
                  <option value="">Select Module Master ID</option>
                  {moduleMaster.map((moduleData) => (
                    <option
                      onClick={() => handleSelect(moduleData.module_id)}
                      value={moduleData.module_id}
                      className=" border-gray-100"
                    >
                      {moduleData.module_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 mb-2">Sub Module Name</label>
                <input
                  type="text"
                  name="sub_module_name"
                  value={editForm.sub_module_name}
                  onChange={handleEditChange}
                  placeholder="Enter Module Name"
                  className="border border-gray-300 rounded px-4 py-2"
                />
              </div>

              {/* Module Description */}
              <div className="flex flex-col">
                <label className="text-gray-600 mb-2">Module Description</label>
                <textarea
                  name="sub_module_description"
                  value={editForm.sub_module_description}
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
    </>
  );
}

export default Edit_Sub_Module_Master;

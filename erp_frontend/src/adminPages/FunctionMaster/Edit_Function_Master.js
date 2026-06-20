import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import constantApi from "../../constantApi";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Edit_Function_Master() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({
    function_master_name: "",
    function_master_description: "",
    status: 1,
    note1: "",
    note2: "",
    sorting_order: "",
    date1: "",
    date2: "",
  });

  const [editId, setEditId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [actionOptions, setActionOptions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);

  useEffect(() => {
    if (state && state.functionDetail) {
      const function_master = state.functionDetail;
      setEditId(function_master.function_master_id);
      setEditForm({
        function_master_name: function_master.function_master_name,
        function_master_description:
          function_master.function_master_description,
        status: function_master.status,
        note1: function_master.note1,
        note2: function_master.note2,
        sorting_order: function_master.sorting_order,
        date1: function_master.date1,
        date2: function_master.date2,
      });

      // Ensure actions is an array, even if it's undefined
      const actions = Array.isArray(function_master.actions)
        ? function_master.actions
        : [];

      setSelectedActions(
        actions.map((action) => ({
          value: action.action_id,
          label: action.action_name,
        }))
      );
    }

    // Fetch action options from API
    axios
      .get(`${constantApi.baseUrl}/action_master/list`)
      .then((res) => {
        const options = res.data.data.map((action) => ({
          value: action.action_id,
          label: action.action_name,
        }));
        setActionOptions(options);
      })
      .catch((err) => console.error("Error fetching action options: ", err));
  }, [state]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleActionChange = async (selectedActions) => {
    setSelectedActions(selectedActions);

    // Check for new actions that aren't in the actionOptions list
    const newActions = selectedActions.filter(
      (action) => !actionOptions.some((opt) => opt.value === action.value)
    );

    for (const newAction of newActions) {
      try {
        // Search if the action exists in the database
        const searchResponse = await axios.get(
          `${constantApi.baseUrl}/action_master/search?name=${newAction.label}`
        );

        if (searchResponse.data && searchResponse.data.exists) {
          // If it exists, add it to actionOptions
          const existingAction = searchResponse.data.action;
          setActionOptions((prev) => [
            ...prev,
            {
              value: existingAction.action_id,
              label: existingAction.action_name,
            },
          ]);
        } else {
          // If it doesn't exist, insert it into the database
          const createResponse = await axios.post(
            `${constantApi.baseUrl}/action_master/create`,
            { action_name: newAction.label }
          );

          const createdAction = createResponse.data.action;
          setActionOptions((prev) => [
            ...prev,
            {
              value: createdAction.action_id,
              label: createdAction.action_name,
            },
          ]);

          // Update selected actions with the new action
          setSelectedActions((prev) => [
            ...prev.filter((action) => action.value !== newAction.value),
            {
              value: createdAction.action_id,
              label: createdAction.action_name,
            },
          ]);
        }
      } catch (error) {
        console.error("Error handling new action:", error);
      }
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    axios
      .put(`${constantApi.baseUrl}/function_master/${editId}`, {
        ...editForm,
        actions: selectedActions.map((action) => action.value),
      })
      .then((res) => {
        setLoader(false);
        alert("Function master updated successfully");
        navigate("/function_master");
      })
      .catch((err) => {
        setLoader(false);
        console.error("Error updating function master: ", err);
        alert("Failed to update the function master.");
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
                Edit Function Master
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
            {/* Function Name */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Function Name</label>
              <input
                type="text"
                name="function_master_name"
                value={editForm.function_master_name}
                onChange={handleEditChange}
                placeholder="Enter Function Name"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Function Description */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2">Function Description</label>
              <textarea
                name="function_master_description"
                value={editForm.function_master_description}
                onChange={handleEditChange}
                placeholder="Enter Function Description"
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>

            {/* Actions (multi-select dropdown) */}
            <div className="flex flex-col col-span-2">
              <label className="text-gray-600 mb-2">Select Actions</label>
              <CreatableSelect
                options={actionOptions}
                isMulti
                value={selectedActions}
                onChange={handleActionChange}
                placeholder="Search or type to add actions..."
                className="basic-multi-select"
                classNamePrefix="select"
                createOptionPosition="first"
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

            {/* Submit Button */}
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

export default Edit_Function_Master;

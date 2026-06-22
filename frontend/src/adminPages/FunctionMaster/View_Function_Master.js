import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState, useEffect } from "react";
import constantApi from "../../constantApi";
import axios from "axios";
import { motion } from "framer-motion";

function View_Function_Master() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [functionMaster, setFunctionMaster] = useState(null);

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/function_master/${id}`)
      .then((res) => setFunctionMaster(res.data.data))
      .catch((err) => console.error("Error fetching function data:", err));
  }, [id]);

  if (!functionMaster) return null;

  const fields = [
    { label: "Function Name", value: functionMaster.function_master_name },
    { label: "Description", value: functionMaster.function_master_description },
    {
      label: "Notes",
      value: `${functionMaster.note1 || "-"}, ${functionMaster.note2 || "-"}`,
    },
    { label: "Sorting Order", value: functionMaster.sorting_order },
    {
      label: "Status",
      value:
        functionMaster.status === 1 ? (
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
            Active
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-semibold">
            Inactive
          </span>
        ),
    },
    {
      label: "Created At",
      value: new Date(functionMaster.created_at).toLocaleString(),
    },
    {
      label: "Updated At",
      value: new Date(functionMaster.updated_at).toLocaleString(),
    },
    { label: "Created By", value: `User ${functionMaster.created_by}` },
    { label: "Updated By", value: `User ${functionMaster.updated_by}` },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Function Master</h2>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-sm transition"
            >
              Back
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gray-50 p-3 rounded-lg shadow-sm flex flex-col"
              >
                <span className="text-gray-500 text-xs font-medium">
                  {field.label}
                </span>
                <span className="mt-0.5 text-gray-800 text-sm font-semibold">
                  {field.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default View_Function_Master;

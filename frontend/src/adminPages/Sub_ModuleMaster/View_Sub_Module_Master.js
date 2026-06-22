import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../../constantApi";
import { motion } from "framer-motion";

function View_Sub_Module_Master() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subModule, setSubModule] = useState(null);

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/sub_module_master/${id}`)
      .then((res) => setSubModule(res.data.data))
      .catch((err) => console.error("Error fetching submodule data:", err));
  }, [id]);

  if (!subModule) return null;

  const fields = [
    { label: "Sub Module Name", value: subModule.sub_module_name },
    { label: "Description", value: subModule.sub_module_description },
    {
      label: "Notes",
      value: `${subModule.note1 || "-"}, ${subModule.note2 || "-"}`,
    },
    { label: "Sorting Order", value: subModule.sorting_order },
    {
      label: "Status",
      value:
        subModule.status === 1 ? (
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
      value: new Date(subModule.created_at).toLocaleString(),
    },
    {
      label: "Updated At",
      value: new Date(subModule.updated_at).toLocaleString(),
    },
    { label: "Created By", value: `User ${subModule.created_by}` },
    { label: "Updated By", value: `User ${subModule.updated_by}` },
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
            <h2 className="text-xl font-bold text-gray-800">
              Sub Module Details
            </h2>
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

export default View_Sub_Module_Master;

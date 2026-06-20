import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../../constantApi";
import { motion } from "framer-motion";
import {
  MdArrowBack,
  MdInfoOutline,
  MdAccessTime,
  MdPerson,
} from "react-icons/md";

function View_Module_Master() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${constantApi.baseUrl}/module_master/${id}`)
        .then((res) => setModule(res.data.data))
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [id]);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MdInfoOutline className="text-blue-600 text-2xl" />
              <h2 className="text-lg font-semibold text-gray-800">
                Module Details
              </h2>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
            >
              <MdArrowBack size={16} /> Back
            </button>
          </div>

          {module ? (
            <div className="space-y-3">
              {/* Module Name */}
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm text-xs">
                <p className="text-gray-500 uppercase tracking-wide">
                  Module Name
                </p>
                <p className="text-gray-800 font-semibold text-sm">
                  {module.module_name}
                </p>
              </div>

              {/* Description */}
              <div className="p-3 bg-gray-50 rounded-lg shadow-sm text-xs">
                <p className="text-gray-500 uppercase tracking-wide">
                  Description
                </p>
                <p className="text-gray-700 text-sm">
                  {module.module_description}
                </p>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Card
                  title="Notes"
                  value={`${module.note1 || "-"}${
                    module.note2 ? `, ${module.note2}` : ""
                  }`}
                />
                <Card
                  title="Sorting Order"
                  value={module.sorting_order || "-"}
                />
                <Card
                  title="Status"
                  value={module.status === 1 ? "Active" : "Inactive"}
                  color={module.status === 1 ? "green" : "red"}
                />
                <Card
                  title="Created At"
                  value={formatDate(module.created_at)}
                  icon={<MdAccessTime className="text-gray-400" />}
                />
                <Card
                  title="Updated At"
                  value={formatDate(module.updated_at)}
                  icon={<MdAccessTime className="text-gray-400" />}
                />
                <Card
                  title="Created By"
                  value={`User ${module.created_by}`}
                  icon={<MdPerson className="text-gray-400" />}
                />
                <Card
                  title="Updated By"
                  value={`User ${module.updated_by}`}
                  icon={<MdPerson className="text-gray-400" />}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-6 text-sm">
              Loading module details...
            </p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default View_Module_Master;

// Reusable small card component
const Card = ({ title, value, color, icon }) => (
  <div className="p-2 bg-white rounded-lg shadow-sm flex items-center gap-2 text-xs">
    {icon && icon}
    <div>
      <p className="text-gray-400 uppercase">{title}</p>
      <p
        className={`font-medium ${
          color === "green"
            ? "text-green-600"
            : color === "red"
            ? "text-red-600"
            : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

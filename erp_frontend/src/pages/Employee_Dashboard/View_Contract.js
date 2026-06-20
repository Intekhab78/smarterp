import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import constantApi from "../../constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaFileContract,
  FaSyncAlt,
} from "react-icons/fa";

export default function EmployeeContractView() {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  // ✅ Fetch all contracts
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${constantApi.baseUrl}/contract/list`);
      setContracts(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching contracts:", err);
      toast.error("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // ✅ Delete contract
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contract?")) return;
    try {
      await axios.delete(`${constantApi.baseUrl}/contract/delete/${id}`);
      toast.success("🗑️ Contract deleted successfully!");
      fetchContracts();
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Failed to delete contract");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h1 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
              <FaFileContract className="text-indigo-600" /> Employee Contracts
            </h1>

            <button
              onClick={fetchContracts}
              className="flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
            >
              <FaSyncAlt /> Refresh
            </button>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="text-center text-gray-600 py-10">Loading...</div>
          ) : contracts.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              No contracts found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-indigo-50 text-indigo-700 uppercase text-xs font-semibold border-b">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Designation</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Start</th>
                    <th className="p-3">End</th>
                    <th className="p-3">Salary (₹)</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c, index) => (
                    <tr
                      key={c.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 text-gray-700">{index + 1}</td>
                      <td className="p-3 text-gray-700">
                        {c.emp_fname} {c.emp_lname} <br />
                        <span className="text-[11px] text-gray-500">
                          ID: {c.emp_id}
                        </span>
                      </td>
                      <td className="p-3">{c.department || "-"}</td>
                      <td className="p-3">{c.designation || "-"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[11px] rounded-full font-medium ${
                            c.contract_type === "Permanent"
                              ? "bg-green-100 text-green-700"
                              : c.contract_type === "Temporary"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {c.contract_type}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{c.start_date}</td>
                      <td className="p-3 text-gray-600">{c.end_date || "-"}</td>
                      <td className="p-3 text-gray-800 font-medium">
                        ₹{c.salary?.toLocaleString()}
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-3 text-[15px]">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setSelectedContract(c)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-800"
                            
                            onClick={() => navigate(`/edit_contract/${c.emp_id}`)

                             
                            }
                          >
                            <FaEdit />
                          </button>
                          

                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(c.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CONTRACT DETAILS MODAL */}
        {selectedContract && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-3xl overflow-y-auto h-[85vh] relative">
              <div className="flex justify-between items-center border-b px-6 py-3 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                  <FaFileContract /> Contract Details
                </h2>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-600 hover:text-red-600 font-bold text-lg"
                >
                  ✖
                </button>
              </div>

              <div className="p-6 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <span className="font-medium text-gray-600">Employee:</span>{" "}
                    {selectedContract.emp_fname} {selectedContract.emp_lname}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">ID:</span>{" "}
                    {selectedContract.emp_id}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Designation:
                    </span>{" "}
                    {selectedContract.designation}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Department:
                    </span>{" "}
                    {selectedContract.department}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Contract Type:
                    </span>{" "}
                    {selectedContract.contract_type}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Salary:</span>{" "}
                    ₹{selectedContract.salary?.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Start:</span>{" "}
                    {selectedContract.start_date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">End:</span>{" "}
                    {selectedContract.end_date || "-"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Notice Period:
                    </span>{" "}
                    {selectedContract.notice_period || "-"} days
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Supervisor:</span>{" "}
                    {selectedContract.supervisor || "-"}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-600 mt-3">Benefits:</p>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {selectedContract.benefits || "—"}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-600 mt-3">
                    Terms & Conditions:
                  </p>
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {selectedContract.terms || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

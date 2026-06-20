import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { useState, useEffect } from "react";
import constantApi from "../../constantApi";

function View_Role_Master() {
  const { id } = useParams(); // 👈 Get ID from URL
  const navigate = useNavigate();
  const [roleMaster, setRoleMaster] = useState(null); // single object

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/role_master/${id}`)
      .then((res) => {
        setRoleMaster(res.data.data);
        console.log("response from role_master:", res.data.data);
      })
      .catch((err) => console.error("Error fetching role master data:", err));
  }, [id]);

  if (!roleMaster) return null; // loader can be added here

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black mb-4 text-center">
              Role Master Details
            </h2>
            <button
              className="bg-gray-500 px-4 py-2 rounded-lg text-white text-sm"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
          <table className="table-auto border-collapse border border-gray-300 w-full text-left text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Field</th>
                <th className="border border-gray-300 px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Role Name</td>
                <td className="border border-gray-300 px-4 py-2">
                  {roleMaster.role_name}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Description
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {roleMaster.role_description}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Status</td>
                <td className="border border-gray-300 px-4 py-2">
                  {roleMaster.status === 1 ? "Active" : "Inactive"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Created At</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(roleMaster.created_at).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Updated At</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(roleMaster.updated_at).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Created By</td>
                <td className="border border-gray-300 px-4 py-2">
                  User {roleMaster.created_by}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Updated By</td>
                <td className="border border-gray-300 px-4 py-2">
                  User {roleMaster.updated_by}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default View_Role_Master;

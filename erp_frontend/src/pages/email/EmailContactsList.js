import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../../constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmailContactsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/email_contact/list`
        );
        setData(res.data.data || []);
      } catch {
        console.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-4 h-[calc(100vh-90px)] text-xs">
        <div className="bg-white rounded shadow-sm p-3 h-full flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-800">
              Email Contacts
            </h2>

            <button
              onClick={() => navigate("/add/email/contacts")}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              + Add Contact
            </button>
          </div>

          {/* TABLE CONTAINER */}
          <div className="relative flex-1 overflow-auto border rounded">
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-center">Status</th>
                  <th className="px-3 py-2 text-left">Created</th>
                </tr>
              </thead>

              <tbody>
                {!loading && data.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-gray-400">
                      No email contacts found
                    </td>
                  </tr>
                )}

                {data.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2 truncate">{item.email}</td>

                    <td className="px-3 py-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          item.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-3 py-2 text-gray-600">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="pt-2 text-[11px] text-gray-500">
            Total Contacts: <strong>{data.length}</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

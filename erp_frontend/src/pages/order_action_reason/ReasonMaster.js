import axios from "axios";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReasonMaster() {
  const [list, setList] = useState([]);
  const [reasonText, setReasonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null); // track loading for toggle buttons
  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/order-action-reason-master/list`
      );
      setList(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch reasons:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reasonText.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${constantApi.baseUrl}/order-action-reason-master/create`,
        {
          reason_text: reasonText,
        }
      );
      setReasonText("");
      fetchList();
    } catch (error) {
      console.error("Failed to add reason:", error);
      // optionally show user error message here
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, status) => {
    setToggleLoadingId(id);
    try {
      await axios.put(
        `${constantApi.baseUrl}/order-action-reason-master/updateStatus/${id}`,
        {
          status: status ? 0 : 1,
        }
      );
      fetchList();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setToggleLoadingId(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Order Action Reason Master
        </h2>

        {/* Add Reason */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6 max-w-md">
          <input
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="Enter reason text"
            className="border rounded px-3 py-2 text-sm w-full"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Add
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => navigate("/ecom-order-reason-mapping")}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Mapping
          </button>
        </form>

        {/* List */}
        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">Reason</th>
                <th className="text-center px-3 py-2">Status</th>
                <th className="text-center px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? (
                list.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-3 py-2">{item.reason_text}</td>
                    <td className="text-center px-3 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-center px-3 py-2">
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        disabled={toggleLoadingId === item.id}
                        className="text-blue-600 text-xs"
                      >
                        {toggleLoadingId === item.id ? "Loading..." : "Toggle"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-400 py-4">
                    No reasons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

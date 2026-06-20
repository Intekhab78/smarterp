import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import constantApi from "../../constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmailLogByCampaign({ campaignId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;
    setLoading(true);
    axios
      .get(`${constantApi.baseUrl}/email_log/list/${campaignId}`)
      .then((res) => {
        if (res.data.success) setLogs(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [campaignId]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-4 bg-white rounded shadow text-sm">
        <h2 className="text-lg font-semibold mb-4">Email Logs</h2>
        {loading ? (
          <Loader />
        ) : logs.length === 0 ? (
          <p>No logs found for this campaign.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Email</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">
                  Sent At
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map(({ id, email, status, sent_at }) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{email}</td>
                  <td
                    className={`border border-gray-300 p-2 font-semibold ${
                      status === "sent" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {sent_at ? new Date(sent_at).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

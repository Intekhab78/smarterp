import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../../constantApi";
import Loader from "./Loader";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function CampaignReport() {
  const [campaigns, setCampaigns] = useState([]);
  const [logs, setLogs] = useState([]);
  const [campaignId, setCampaignId] = useState("");
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);

  /* =========================
     LOAD CAMPAIGNS
  ========================= */
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/email_campaign/list`
        );
        setCampaigns(res.data.data || []);
      } catch {
        alert("Failed to load campaigns");
      }
      setLoadingCampaigns(false);
    };
    fetchCampaigns();
  }, []);

  /* =========================
     LOAD LOGS BY CAMPAIGN
  ========================= */
  useEffect(() => {
    if (!campaignId) {
      setLogs([]);
      return;
    }

    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/email_send/list/${campaignId}`
        );
        setLogs(res.data.data || []);
      } catch {
        alert("Failed to load campaign logs");
      }
      setLoadingLogs(false);
    };

    fetchLogs();
  }, [campaignId]);

  /* =========================
     STATUS BADGE
  ========================= */
  const statusBadge = (status) => {
    return status === "sent"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-6 text-xs bg-white h-full">
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-800">
            Campaign Delivery Report
          </h2>
          <p className="text-[11px] text-gray-500">
            View sent email status by campaign
          </p>
        </div>

        {/* FILTER */}
        <div className="mb-4 max-w-xs">
          <select
            className="w-full border rounded px-3 py-1.5 text-xs"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            disabled={loadingCampaigns}
          >
            <option value="">Select Campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subject}
              </option>
            ))}
          </select>
        </div>

        {/* CONTENT */}
        {loadingLogs ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : logs.length === 0 && campaignId ? (
          <div className="text-center py-10 text-gray-500">
            No delivery records found
          </div>
        ) : logs.length > 0 ? (
          <>
            {/* SUMMARY CARD */}
            <div className="mb-4 bg-white rounded shadow-sm p-4 text-[11px]">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-gray-500">Campaign</p>
                  <p className="font-medium text-gray-800">
                    {logs[0]?.campaign?.subject || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Category</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {logs[0]?.campaign?.category?.name || "—"}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500">Total Emails</p>
                  <p className="font-medium text-gray-800">{logs.length}</p>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="border p-3 text-left">Email</th>
                    <th className="border p-3 text-center">Status</th>
                    <th className="border p-3">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50 transition">
                      <td className="border p-3 text-gray-800">{l.email}</td>

                      <td className="border p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusBadge(
                            l.status
                          )}`}
                        >
                          {l.status}
                        </span>
                      </td>

                      <td className="border p-3 text-gray-600">
                        {l.sent_at ? new Date(l.sent_at).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center py-10">
            Select a campaign to view report
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

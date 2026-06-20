import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { ToastMassage } from "../../toast";
import Loader from "./Loader";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function SendEmail() {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD CAMPAIGNS
  ========================= */
  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/email_campaign/list`)
      .then((res) => setCampaigns(res.data.data || []))
      .catch(() => ToastMassage("Failed to load campaigns", "error"));
  }, []);

  /* =========================
     SEND EMAILS
  ========================= */
  const sendEmails = async () => {
    if (!senderEmail) {
      ToastMassage("Please select sender email", "error");
      return;
    }
    if (!campaignId) {
      ToastMassage("Please select a campaign", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${constantApi.baseUrl}/email_send/send`, {
        campaign_id: campaignId,
        sender_email: senderEmail,
      });

      ToastMassage(
        res.data.message || "Emails sent successfully",
        res.data.success ? "success" : "error"
      );
    } catch {
      ToastMassage(
        "An unexpected error occurred while sending emails",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* FULL HEIGHT WRAPPER */}
      <div className="p-6 h-[calc(100vh-90px)] text-xs">
        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
          {/* HEADER */}
          <div className="border-b px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Send Email Campaign
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">
              Send selected campaign to all active email contacts
            </p>
          </div>

          {/* CONTENT */}
          <div className="flex-1 px-6 py-6 max-w-3xl">
            {/* CAMPAIGN SELECT */}
            <div className="mb-5">
              <label className="block mb-1 text-gray-600">
                Select Campaign
              </label>
              <select
                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
              >
                <option value="">-- Choose Campaign --</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.subject}
                  </option>
                ))}
              </select>
            </div>

            {/* SENDER EMAIL */}
            <div className="mb-6">
              <label className="block mb-1 text-gray-600">Sender Email</label>
              {/* <select
                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              >
                <option value="">-- Select Sender Email --</option>
                <option value="sales@jtsmiddleeast.com">
                  sales@jtsmiddleeast.com
                </option>
                <option value="support@jtsmiddleeast.com">
                  support@jtsmiddleeast.com
                </option>
              </select> */}

              <select
                className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-indigo-500"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              >
                <option value="">-- Select Sender Email --</option>
                <option value="sales">sales@jtsmiddleeast.com</option>
                <option value="support">support@jtsmiddleeast.com</option>
              </select>
            </div>

            {/* INFO BOX */}
            <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded p-4 text-[11px] text-indigo-700">
              Emails will be sent to all <strong>active contacts</strong> linked
              with the selected campaign.
            </div>
          </div>

          {/* FOOTER ACTION */}
          <div className="border-t px-6 py-4 flex justify-end">
            <button
              onClick={sendEmails}
              disabled={loading || !campaignId || !senderEmail}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-xs font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Sending..." : "Send Emails"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

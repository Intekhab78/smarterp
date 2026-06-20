import { useState } from "react";
import axios from "axios";
import constantApi from "../../constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmailContacts() {
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitEmails = async () => {
    const emailArray = emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (emailArray.length === 0) {
      setError("Please enter at least one email address");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(`${constantApi.baseUrl}/email_contact/add`, {
        emails: emailArray,
      });
      setEmails("");
      alert("Emails added successfully");
    } catch {
      setError("Failed to save email contacts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* FULL WIDTH CONTAINER */}
      <div className="p-4 h-[calc(100vh-90px)] text-xs">
        <div className="bg-white rounded shadow-sm p-4 h-full flex flex-col">
          {/* HEADER */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Add Email Contacts
            </h2>
            <p className="text-[11px] text-gray-500">
              Enter multiple email addresses separated by commas
            </p>
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">Email Addresses</label>
            <textarea
              className="w-full h-full min-h-[220px] border rounded px-3 py-2 resize-none focus:ring-1 focus:ring-blue-500"
              placeholder="example@gmail.com, test@yahoo.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />

            {error && <p className="mt-2 text-red-500 text-[11px]">{error}</p>}
          </div>

          {/* ACTION BAR */}
          <div className="pt-4 flex justify-end border-t mt-4">
            <button
              onClick={submitEmails}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Saving..." : "Save Emails"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

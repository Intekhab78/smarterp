import { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../../constantApi";
import ReactQuill from "react-quill";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function EmailCampaign() {
  const [form, setForm] = useState({
    subject: "",
    body: "",
    attachment: null,
    category_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCatLoading(true);
        const res = await axios.get(
          `${constantApi.baseUrl}/email_category/list`
        );
        setCategories(res.data.data || []);
      } catch {
        setError("Failed to load categories");
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- SUBMIT ---------------- */
  const submitCampaign = async () => {
    if (!form.category_id || !form.subject || !form.body) {
      alert("All fields are required");
      return;
    }

    const data = new FormData();
    data.append("subject", form.subject);
    data.append("body", form.body);
    data.append("category_id", form.category_id);
    if (form.attachment) data.append("attachment", form.attachment);

    setLoading(true);
    try {
      await axios.post(`${constantApi.baseUrl}/email_campaign/add`, data);
      alert("Campaign created successfully");
      setForm({ subject: "", body: "", attachment: null, category_id: "" });
    } catch {
      alert("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-4 h-[calc(100vh-90px)] text-xs">
        <div className="bg-white rounded shadow-sm h-full flex flex-col">
          {/* HEADER */}
          <div className="px-4 py-3 border-b">
            <h2 className="text-sm font-semibold text-gray-800">
              Create Email Campaign
            </h2>
            <p className="text-[11px] text-gray-500">
              Compose and schedule your email campaign
            </p>
          </div>

          {error && (
            <div className="px-4 py-2 text-red-600 text-xs">{error}</div>
          )}

          {/* CONTENT */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* CATEGORY */}
            <div>
              <label className="block mb-1 text-gray-600">Email Category</label>
              <select
                className="w-full border rounded px-2 py-1.5"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                disabled={catLoading}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}
            <div>
              <label className="block mb-1 text-gray-600">Email Subject</label>
              <input
                className="w-full border rounded px-2 py-1.5"
                placeholder="Enter email subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            {/* BODY */}
            <div>
              <label className="block mb-1 text-gray-600">Email Content</label>
              <div className="border rounded overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={form.body}
                  onChange={(content) => setForm({ ...form, body: content })}
                  className="h-64"
                />
              </div>
            </div>

            {/* ATTACHMENT */}
            <div>
              <label className="block mb-1 text-gray-600">
                Attachment (optional)
              </label>
              <input
                type="file"
                className="text-xs"
                onChange={(e) =>
                  setForm({
                    ...form,
                    attachment: e.target.files[0],
                  })
                }
              />
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="px-4 py-3 border-t flex justify-end">
            <button
              onClick={submitCampaign}
              disabled={loading || catLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-xs disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

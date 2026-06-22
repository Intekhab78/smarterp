import { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "../../constantApi";
import ReactQuill from "react-quill";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useNavigate } from "react-router-dom";

/* =======================
   MODAL COMPONENT
======================= */
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* =======================
   MAIN COMPONENT
======================= */
export default function EmailCampaignList() {
  const [data, setData] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const navigate = useNavigate();

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    subject: "",
    body: "",
    attachment: null,
    category_name: "",
  });
  const [loadingEdit, setLoadingEdit] = useState(false);

  /* =======================
     FETCH CAMPAIGNS
  ======================= */
  const fetchCampaigns = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get(`${constantApi.baseUrl}/email_campaign/list`);
      setData(res.data?.data || []);
    } catch (error) {
      alert("Failed to load campaigns");
    }
    setLoadingList(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  /* =======================
     OPEN EDIT MODAL
  ======================= */
  const openEdit = (campaign) => {
    setEditForm({
      id: campaign.id,
      subject: campaign.subject || "",
      body: campaign.body || "",
      attachment: null,
      category_name: campaign.category?.name || "—",
    });
    setEditOpen(true);
  };

  /* =======================
     SUBMIT EDIT
  ======================= */
  const submitEdit = async () => {
    if (!editForm.subject.trim()) {
      alert("Subject is required");
      return;
    }

    setLoadingEdit(true);
    try {
      const formData = new FormData();
      formData.append("subject", editForm.subject);
      formData.append("body", editForm.body);
      if (editForm.attachment) {
        formData.append("attachment", editForm.attachment);
      }

      await axios.post(
        `${constantApi.baseUrl}/email_campaign/update/${editForm.id}`,
        formData
      );

      alert("Campaign updated successfully");
      setEditOpen(false);
      fetchCampaigns();
    } catch (error) {
      alert("Failed to update campaign");
    }
    setLoadingEdit(false);
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-6 text-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Email Campaigns
          </h2>

          <button
            onClick={() => navigate("/campaigns/create")}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            + Add Campaign
          </button>
        </div>

        {/* =======================
            LIST TABLE
        ======================= */}
        {loadingList ? (
          <div className="text-center py-8 text-gray-500">
            Loading campaigns...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-3 text-left">Subject</th>
                  <th className="border p-3 text-left">Category</th>
                  <th className="border p-3 text-center">Attachment</th>
                  <th className="border p-3">Created</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-gray-500">
                      No email campaigns found
                    </td>
                  </tr>
                ) : (
                  data.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="border p-3 font-medium text-gray-800">
                        {c.subject}
                      </td>

                      {/* CATEGORY */}
                      <td className="border p-3">
                        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                          {c.category?.name || "—"}
                        </span>
                      </td>

                      <td className="border p-3 text-center">
                        {c.attachment ? "📎 Yes" : "—"}
                      </td>

                      <td className="border p-3 text-gray-600">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>

                      <td className="border p-3 text-center">
                        <button
                          className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-xs"
                          onClick={() => openEdit(c)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* =======================
            EDIT MODAL
        ======================= */}
        {editOpen && (
          <Modal onClose={() => !loadingEdit && setEditOpen(false)}>
            <h3 className="text-lg font-semibold mb-1">Edit Email Campaign</h3>
            <p className="text-xs text-gray-500 mb-4">
              Update subject, content, or attachment
            </p>

            {/* CATEGORY BADGE */}
            {editForm.category_name && (
              <div className="mb-3">
                <span className="text-xs text-gray-500 mr-2">Category:</span>
                <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700">
                  {editForm.category_name}
                </span>
              </div>
            )}

            <div
              className="pr-2"
              style={{ maxHeight: "45vh", overflowY: "auto" }}
            >
              <input
                className="w-full border rounded p-2 mb-4"
                placeholder="Email Subject"
                value={editForm.subject}
                onChange={(e) =>
                  setEditForm({ ...editForm, subject: e.target.value })
                }
                disabled={loadingEdit}
              />

              <ReactQuill
                theme="snow"
                value={editForm.body}
                onChange={(content) =>
                  setEditForm({ ...editForm, body: content })
                }
                className="mb-4"
                readOnly={loadingEdit}
              />

              <input
                type="file"
                className="mb-4"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    attachment: e.target.files[0],
                  })
                }
                disabled={loadingEdit}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setEditOpen(false)}
                disabled={loadingEdit}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={submitEdit}
                disabled={loadingEdit}
              >
                {loadingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}

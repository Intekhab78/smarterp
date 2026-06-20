import { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "../../constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

export default function AssignContactsToCampaign() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [contacts, setContacts] = useState([]);
  const [assignedContactIds, setAssignedContactIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ------------------ FETCH DATA ------------------ */

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/email_category/campaigns`
        );
        setCategories(res.data.data || []);
      } catch {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setCampaigns([]);
      setSelectedCampaignId("");
      return;
    }
    const category = categories.find(
      (c) => c.id === Number(selectedCategoryId)
    );
    setCampaigns(category?.campaigns || []);
    setSelectedCampaignId("");
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/email_contact/list`
        );
        setContacts(res.data.data || []);
      } catch {
        setError("Failed to load contacts");
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!selectedCampaignId) {
      setAssignedContactIds(new Set());
      return;
    }

    const fetchAssigned = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/email_campaign_contact/list/${selectedCampaignId}`
        );
        setAssignedContactIds(new Set((res.data.data || []).map((c) => c.id)));
      } catch {
        setError("Failed to load assigned contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchAssigned();
  }, [selectedCampaignId]);

  /* ------------------ ACTIONS ------------------ */

  const toggleContact = (id) => {
    const next = new Set(assignedContactIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setAssignedContactIds(next);
  };

  const saveAssignments = async () => {
    if (!selectedCampaignId) return;
    setSaving(true);
    try {
      await axios.post(
        `${constantApi.baseUrl}/email_campaign_contact/update/${selectedCampaignId}`,
        { contactIds: Array.from(assignedContactIds) }
      );
      alert("Contacts updated successfully");
    } catch {
      alert("Failed to update contacts");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------ UI ------------------ */

  const allSelected =
    contacts.length > 0 && contacts.every((c) => assignedContactIds.has(c.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setAssignedContactIds(new Set());
    } else {
      setAssignedContactIds(new Set(contacts.map((c) => c.id)));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="p-4 h-[calc(100vh-90px)] flex gap-4 text-xs">
        {/* LEFT PANEL */}
        <div className="w-[340px] bg-white rounded shadow-sm p-4">
          <h2 className="text-sm font-semibold mb-3 text-gray-800">
            Campaign Selection
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-gray-600 mb-1 block">Email Category</label>
              <select
                className="w-full border rounded px-2 py-1.5"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategoryId && (
              <div>
                <label className="text-gray-600 mb-1 block">Campaign</label>
                <select
                  className="w-full border rounded px-2 py-1.5"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                >
                  <option value="">Select campaign</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.subject}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white rounded shadow-sm p-3 flex flex-col">
          {/* <h2 className="text-sm font-semibold mb-2 text-gray-800">
            Assign Contacts
          </h2> */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-800">
              Assign Contacts
            </h2>

            {/* {selectedCampaignId && contacts.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="text-[11px] text-blue-600 hover:underline"
              >
                {allSelected ? "Unselect All" : "Select All"}
              </button>
            )} */}

            {selectedCampaignId && contacts.length > 0 && (
              <label className="flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                Select All
              </label>
            )}
          </div>

          <div className="relative flex-1 overflow-auto border rounded">
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!selectedCampaignId ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a campaign to view contacts
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {contacts.length === 0 && (
                  <p className="text-gray-400">No contacts available</p>
                )}

                {contacts.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={assignedContactIds.has(c.id)}
                      onChange={() => toggleContact(c.id)}
                    />
                    <span className="truncate">{c.email}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedCampaignId && (
            <div className="pt-3 flex justify-end">
              <button
                onClick={saveAssignments}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Assignments"}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

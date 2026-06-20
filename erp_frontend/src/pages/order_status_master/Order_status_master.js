import { useEffect, useState } from "react";
import { axios_post } from "../../axios";
import { ToastMassage } from "../../toast";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import constantApi from "constantApi";

export default function Order_status_master() {
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    company_id: "",
    location_id: "",
    status_name: "",
    status_order: "",
    is_final: 0,
    status: 1,
  });

  /* ===================== COMPANY ===================== */
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");

    if (response?.status) {
      const companies = response.data || [];

      // ✅ keep only child companies
      const childCompanies = companies.filter((c) => c.is_main_comp !== "yes");

      setCompanies(childCompanies.length ? childCompanies : companies);
    } else {
      ToastMassage(response?.message, "error");
    }
  };

  /* ===================== LOCATION ===================== */
  const fetchlocationList = async (company_id) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id,
    });

    if (response?.status) {
      setLocations(response.data || []);
    } else {
      ToastMassage(response?.message, "error");
    }
  };

  /* ===================== STATUS LIST ===================== */
  const fetchStatusList = async (company_id) => {
    if (!company_id) return;

    console.log("fetchStatusList--------", company_id);

    const response = await axios.get(
      `${constantApi.baseUrl}/order-status/list`,
      {
        params: { company_id }, // ✅ THIS IS REQUIRED
      }
    );

    if (response?.data?.success) {
      setStatusList(response.data.data || []);
    }
  };

  useEffect(() => {
    fetchcompanyList();
  }, []);

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.company_id || !form.status_name || !form.status_order) {
      return ToastMassage("Required fields missing", "error");
    }

    setLoading(true);

    const api = editId
      ? `order-status/update/${editId}`
      : "order-status/create";

    const response = await axios_post(true, api, form);

    if (response?.success || response?.status) {
      ToastMassage("Saved successfully", "success");
      fetchStatusList(form.company_id);
      setEditId(null);
      setForm({
        ...form,
        status_name: "",
        status_order: "",
        is_final: 0,
      });
    } else {
      ToastMassage(response?.message, "error");
    }

    setLoading(false);
  };

  /* ===================== EDIT ===================== */
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      company_id: item.company_id,
      location_id: item.location_id || "",
      status_name: item.status_name,
      status_order: item.status_order,
      is_final: item.is_final,
      status: item.status,
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-4 max-w-5xl mx-auto">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Order Status Master
        </h2>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded p-3 mb-4"
        >
          <div className="grid grid-cols-6 gap-3">
            {/* Company */}
            <select
              className="border text-xs p-2 rounded"
              value={form.company_id}
              onChange={(e) => {
                const company_id = e.target.value;
                setForm({ ...form, company_id, location_id: "" });
                fetchlocationList(company_id);
                fetchStatusList(company_id);
              }}
              required
            >
              <option value="">Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.compdesc}
                </option>
              ))}
            </select>

            {/* Location */}
            <select
              className="border text-xs p-2 rounded"
              value={form.location_id}
              onChange={(e) =>
                setForm({ ...form, location_id: e.target.value })
              }
            >
              <option value="">Location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.locname}
                </option>
              ))}
            </select>

            {/* Status Name */}
            <input
              type="text"
              placeholder="Status Name"
              className="border text-xs p-2 rounded"
              value={form.status_name}
              onChange={(e) =>
                setForm({ ...form, status_name: e.target.value })
              }
              required
            />

            {/* Order */}
            <input
              type="number"
              placeholder="Order"
              className="border text-xs p-2 rounded"
              value={form.status_order}
              onChange={(e) =>
                setForm({ ...form, status_order: e.target.value })
              }
              required
            />

            {/* Final */}
            <select
              className="border text-xs p-2 rounded"
              value={form.is_final}
              onChange={(e) =>
                setForm({ ...form, is_final: Number(e.target.value) })
              }
            >
              <option value={0}>Not Final</option>
              <option value={1}>Final</option>
            </select>

            {/* Submit */}
            <button
              disabled={loading}
              className="bg-gray-800 text-white text-xs rounded px-3"
            >
              {editId ? "Update" : "Create"}
            </button>
          </div>
        </form>

        {/* ================= LIST ================= */}
        <div className="bg-white border rounded">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2">Order</th>
                <th className="p-2">Final</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {statusList.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-400">
                    No data found
                  </td>
                </tr>
              )}

              {statusList.map((item, i) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2">{item.status_name}</td>
                  <td className="p-2 text-center">{item.status_order}</td>
                  <td className="p-2 text-center">
                    {item.is_final ? "Yes" : "No"}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

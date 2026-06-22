import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";

import axios from "axios";
import constantApi from "../../constantApi";

export default function CertificationsTab({
  employee,
  goToNextTab = () => {},
}) {
  const [rows, setRows] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee?.emp_id) fetchCertifications(employee.emp_id);
  }, [employee?.emp_id]);

  const fetchCertifications = async (emp_id) => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/certification/${emp_id}`,
      );
      // Map server response to include fileName for display
      console.log("fetchCertifications---------", res.data);

      const data = res.data.map((item) => ({
        ...item,
        fileName: item.filePath ? item.filePath.split("/").pop() : "",
      }));
      setRows(data);
    } catch (err) {
      console.error("Error fetching certifications:", err);
    }
  };
  const forceDownload = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        certification: "",
        from_date: "",
        to_date: "",
        certificationFile: null,
        fileName: "",
      },
    ]);
    setEditingIndex(rows.length);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSave = async (index) => {
    if (!employee?.emp_id) return alert("Employee ID missing!");

    setLoading(true);
    const cert = rows[index];
    const formData = new FormData();

    formData.append("emp_id", employee.emp_id);
    formData.append("certification", cert.certification);
    formData.append("from", cert.from_date || "");
    formData.append("to", cert.to_date || "");
    if (cert.certificationFile instanceof File) {
      formData.append("certificationFile", cert.certificationFile);
    }

    try {
      if (cert.id) {
        await axios.put(
          `${constantApi.baseUrl}/certification/update/${cert.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        await axios.post(
          `${constantApi.baseUrl}/certification/create`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      setEditingIndex(null);
      fetchCertifications(employee.emp_id);
    } catch (err) {
      console.error("Error saving certification:", err);
      alert("Failed to save certification.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const cert = rows[index];
    if (!cert.id) {
      setRows(rows.filter((_, i) => i !== index));
      return;
    }

    if (window.confirm("Are you sure to delete this certification?")) {
      try {
        await axios.delete(
          `${constantApi.baseUrl}/certification/delete/${cert.id}`,
        );
        fetchCertifications(employee.emp_id);
      } catch (err) {
        console.error("Error deleting certification:", err);
        alert("Failed to delete certification.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].id || editingIndex === i) await handleSave(i);
    }
    goToNextTab();
  };

  return (
    <div className="space-y-4 w-full">
      <h4 className="font-medium text-gray-800">CERTIFICATIONS</h4>

      <form onSubmit={handleSubmit}>
        <div className="border rounded-md overflow-hidden w-full">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Certification</th>
                <th className="text-left px-4 py-2">From</th>
                <th className="text-left px-4 py-2">To</th>
                <th className="text-left px-4 py-2 text-center">File</th>
                <th className="text-center px-4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">
                    {editingIndex === i ? (
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1"
                        value={row.certification || ""}
                        onChange={(e) =>
                          handleChange(i, "certification", e.target.value)
                        }
                      />
                    ) : (
                      row.certification || "—"
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {editingIndex === i ? (
                      <input
                        type="date"
                        className="w-full border rounded px-2 py-1"
                        value={row.from_date || ""}
                        onChange={(e) =>
                          handleChange(i, "from_date", e.target.value)
                        }
                      />
                    ) : (
                      row.from_date || "—"
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {editingIndex === i ? (
                      <input
                        type="date"
                        className="w-full border rounded px-2 py-1"
                        value={row.to_date || ""}
                        onChange={(e) =>
                          handleChange(i, "to_date", e.target.value)
                        }
                      />
                    ) : (
                      row.to_date || "—"
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {editingIndex === i ? (
                      <div className="flex flex-col">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            handleChange(i, "certificationFile", file);
                            handleChange(i, "fileName", file?.name || "");
                          }}
                        />
                        {row.fileName && (
                          <span className="text-xs text-gray-500 mt-1">
                            📎 {row.fileName}
                          </span>
                        )}
                      </div>
                    ) : row.filePath ? (
                      // <a
                      //   href={`${constantApi.baseUrl.replace("/api", "")}${
                      //     row.filePath
                      //   }`}
                      //   target="_blank"
                      //   rel="noopener noreferrer"
                      //   className="text-blue-600 hover:underline"
                      // >
                      //   View <FaDownload className="inline ml-1" />
                      // </a>

                      <td className="px-4 py-2">
                        {editingIndex === i ? (
                          <div className="flex flex-col">
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                handleChange(i, "certificationFile", file);
                                handleChange(i, "fileName", file?.name || "");
                              }}
                            />
                            {row.fileName && (
                              <span className="text-xs text-gray-500 mt-1">
                                📎 {row.fileName}
                              </span>
                            )}
                          </div>
                        ) : row.filePath ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={`${constantApi.imageUrl}/Employee_certificate/${row.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                forceDownload(
                                  `${constantApi.imageUrl}/Employee_certificate/${row.filePath}`,
                                  row.fileName || "certificate",
                                )
                              }
                              className="text-green-600 hover:underline"
                            >
                              Download <FaDownload className="inline ml-1" />
                            </button>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingIndex(editingIndex === i ? null : i)
                        }
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {editingIndex === i ? (
                          <FaSave onClick={() => handleSave(i)} />
                        ) : (
                          <FaEdit />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(i)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              <tr className="border-t">
                <td colSpan={5} className="px-4 py-2">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-blue-600 hover:underline"
                  >
                    + Add a line
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
            disabled={loading}
          >
            💾 Save & Next
          </button>
        </div>
      </form>
    </div>
  );
}

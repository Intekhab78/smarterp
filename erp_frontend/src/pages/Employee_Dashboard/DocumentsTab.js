import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSave, FaDownload } from "react-icons/fa";
import axios from "axios";
import constantApi from "../../constantApi";

export default function DocumentsTab({ employeeId, goToNextTab }) {
  const [rows, setRows] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const documentOptions = [
    "Aadhaar",
    "PAN",
    "License",
    "Passport",
    "Voter ID",
    "Visa",
  ];
  const forceDownload = async (url, filename = "document") => {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch documents for the employee
  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    axios
      .get(`${constantApi.baseUrl}/documents/list/${employeeId}/documents`)
      .then((res) => setRows(res.data.data || []))
      .catch((err) => console.error("❌ Fetch documents error:", err))
      .finally(() => setLoading(false));
  }, [employeeId]);

  const getFileUrl = (path) => {
    if (!path) return "#";

    // If backend already sends full URL
    if (path.startsWith("http")) return path;

    // 🔥 FIX wrong folder name from backend
    let normalizedPath = path.replace(
      "/uploads/documents/",
      "/uploads/Employee_documents/",
    );

    return `https://api.jtserp.cloud${normalizedPath}`;
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        document: "",
        documentNumber: "",
        issuedBy: "",
        expiry: "",
        visaType: "",
        visaCountry: "",
        file: null,
      },
    ]);
    setEditingIndex(rows.length);
  };

  const handleDelete = async (index) => {
    const doc = rows[index];
    if (doc.id)
      await axios.delete(`${constantApi.baseUrl}/documents/delete/${doc.id}`);
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleEditToggle = (index) =>
    setEditingIndex(editingIndex === index ? null : index);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...rows];
    updated[index].file = file;
    setRows(updated);
  };

  const getAvailableOptions = (currentIndex) => {
    const selectedDocs = rows
      .map((r, i) => (i === currentIndex ? null : r.document))
      .filter(Boolean);
    return documentOptions.filter((doc) => !selectedDocs.includes(doc));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId)
      return alert("❌ Employee ID missing. Please save employee first.");

    try {
      const formData = new FormData();
      formData.append(
        "rows",
        JSON.stringify(
          rows.map((r) => ({
            id: r.id || null,
            document: r.document,
            documentNumber: r.documentNumber,
            issuedBy: r.issuedBy,
            expiry: r.expiry,
            visaType: r.visaType,
            visaCountry: r.visaCountry,
          })),
        ),
      );

      rows.forEach((r) => r.file && formData.append("files", r.file));

      // await axios.post(`${constantApi.baseUrl}/documents/createOrUpdate/${employeeId}/documents`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      await axios.post(
        `${constantApi.baseUrl}/documents/createOrUpdate/${employeeId}/documents`,
        formData,
      );

      alert("✅ Documents submitted successfully!");
      setEditingIndex(null);

      // Refresh the list after save
      const res = await axios.get(
        `${constantApi.baseUrl}/documents/list/${employeeId}/documents`,
      );
      setRows(res.data.data || []);
      console.log("document------------", res.data);
      if (goToNextTab) goToNextTab();
    } catch (err) {
      console.error("❌ Submit documents error:", err);
      alert("❌ Failed to submit documents.");
    }
  };

  if (loading) return <div>Loading documents...</div>;

  return (
    <div className="space-y-6 w-full">
      <h3 className="text-xl font-semibold text-gray-800">
        Employee Documents
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="border rounded-md overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Document</th>
                <th className="px-4 py-3 text-left">Document Number</th>
                <th className="px-4 py-3 text-left">Issued By</th>
                <th className="px-4 py-3 text-left">Expiry</th>
                <th className="px-4 py-3 text-left">File</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <React.Fragment key={i}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {editingIndex === i ? (
                        <select
                          value={row.document}
                          onChange={(e) =>
                            handleChange(i, "document", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        >
                          <option value="">-- Select Document --</option>
                          {getAvailableOptions(i).map((doc) => (
                            <option key={doc} value={doc}>
                              {doc}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{row.document || "—"}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingIndex === i ? (
                        <input
                          type="text"
                          value={row.documentNumber}
                          onChange={(e) =>
                            handleChange(i, "documentNumber", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        <span>{row.documentNumber || "—"}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingIndex === i ? (
                        <input
                          type="text"
                          value={row.issuedBy}
                          onChange={(e) =>
                            handleChange(i, "issuedBy", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        <span>{row.issuedBy || "—"}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingIndex === i ? (
                        <input
                          type="date"
                          value={row.expiry?.split("T")[0] || ""}
                          onChange={(e) =>
                            handleChange(i, "expiry", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        <span>
                          {row.expiry ? row.expiry.split("T")[0] : "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingIndex === i ? (
                        <input
                          type="file"
                          onChange={(e) =>
                            handleFileChange(i, e.target.files[0])
                          }
                        />
                      ) : row.filePath ? (
                        <td className="px-4 py-2">
                          {editingIndex === i ? (
                            <input
                              type="file"
                              onChange={(e) =>
                                handleFileChange(i, e.target.files[0])
                              }
                            />
                          ) : row.filePath ? (
                            <div className="flex items-center gap-3">
                              <a
                                href={getFileUrl(row.filePath)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  forceDownload(
                                    getFileUrl(row.filePath),
                                    row.document || "document",
                                  )
                                }
                                className="text-green-600 hover:underline flex items-center gap-1"
                              >
                                Download <FaDownload />
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
                          onClick={() => handleEditToggle(i)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {editingIndex === i ? <FaSave /> : <FaEdit />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(i)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {row.document === "Visa" && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            {editingIndex === i ? (
                              <input
                                type="text"
                                value={row.visaType}
                                onChange={(e) =>
                                  handleChange(i, "visaType", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1"
                                placeholder="Visa Type"
                              />
                            ) : (
                              <span>
                                <strong>Visa Type:</strong>{" "}
                                {row.visaType || "—"}
                              </span>
                            )}
                          </div>
                          <div>
                            {editingIndex === i ? (
                              <input
                                type="text"
                                value={row.visaCountry}
                                onChange={(e) =>
                                  handleChange(i, "visaCountry", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1"
                                placeholder="Visa Country"
                              />
                            ) : (
                              <span>
                                <strong>Visa Country:</strong>{" "}
                                {row.visaCountry || "—"}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              <tr className="border-t">
                <td colSpan={6} className="px-4 py-3">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-blue-600 hover:underline"
                  >
                    + Add a document
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
          >
            💾 Save & Next
          </button>
        </div>
      </form>
    </div>
  );
}

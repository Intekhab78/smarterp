import React, { useState } from "react";

const GrnExtraCostForm = () => {
  const [rows, setRows] = useState([
    {
      grn_number: "",
      cost_type: "Transport",
      supplier: "",
      mode_of_payment: "Cash",
      cheque_number: "",
      bank_name: "",
      payment_details: "",
      amount: "",
      number_of_item_types: "",
      remarks: "",
      date: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        grn_number: "",
        cost_type: "Transport",
        supplier: "",
        mode_of_payment: "Cash",
        cheque_number: "",
        bank_name: "",
        payment_details: "",
        amount: "",
        number_of_item_types: "",
        remarks: "",
        date: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      {/* Scrollable container */}
      <div className="overflow-x-auto border rounded-md">
        <div className="w-[920px] space-y-1 p-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 bg-gray-50 shadow-sm rounded-md p-1.5 text-xs"
            >
              <input
                type="text"
                placeholder="GRN Number"
                value={row.grn_number}
                onChange={(e) =>
                  handleChange(index, "grn_number", e.target.value)
                }
                className="border px-2 py-2 rounded-sm w-28 text-xs focus:ring focus:ring-blue-200"
              />

              <select
                value={row.cost_type}
                onChange={(e) =>
                  handleChange(index, "cost_type", e.target.value)
                }
                className="border px-2 py-2  rounded-sm w-28 text-xs focus:ring focus:ring-blue-200"
              >
                <option value="Transport">Transport</option>
                <option value="Packing">Packing</option>
                <option value="Custom Duty">Custom Duty</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                placeholder="Supplier"
                value={row.supplier}
                onChange={(e) =>
                  handleChange(index, "supplier", e.target.value)
                }
                className="border px-2 py-2  rounded-sm w-28 text-xs"
              />

              <select
                value={row.mode_of_payment}
                onChange={(e) =>
                  handleChange(index, "mode_of_payment", e.target.value)
                }
                className="border px-2 py-2  rounded-sm w-24 text-xs"
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </select>

              <input
                type="text"
                placeholder="Cheque No."
                value={row.cheque_number}
                onChange={(e) =>
                  handleChange(index, "cheque_number", e.target.value)
                }
                className="border px-2 py-2  rounded-sm w-24 text-xs"
                disabled={row.mode_of_payment === "Cash"}
              />

              <input
                type="text"
                placeholder="Bank Name"
                value={row.bank_name}
                onChange={(e) =>
                  handleChange(index, "bank_name", e.target.value)
                }
                className="border px-2 py-2  rounded-sm w-28 text-xs"
                disabled={row.mode_of_payment === "Cash"}
              />

              <input
                type="text"
                placeholder="Payment Details"
                value={row.payment_details}
                onChange={(e) =>
                  handleChange(index, "payment_details", e.target.value)
                }
                className="border px-2 py-2  rounded-sm w-36 text-xs"
              />

              <input
                type="number"
                placeholder="Amount"
                value={row.amount}
                onChange={(e) => handleChange(index, "amount", e.target.value)}
                className="border px-2 py-2  rounded-sm w-24 text-xs"
              />

              <input
                type="number"
                placeholder="Item Types"
                value={row.number_of_item_types}
                onChange={(e) =>
                  handleChange(index, "number_of_item_types", e.target.value)
                }
                className="border px-2 py-2  rounded-sm w-24 text-xs"
              />

              <input
                type="text"
                placeholder="Remarks"
                value={row.remarks}
                onChange={(e) => handleChange(index, "remarks", e.target.value)}
                className="border px-2 py-2  rounded-sm w-36 text-xs"
              />

              <input
                type="date"
                value={row.date}
                onChange={(e) => handleChange(index, "date", e.target.value)}
                className="border px-2 py-2  rounded-sm w-28 text-xs"
              />

              <button
                onClick={() => removeRow(index)}
                className="bg-red-500 text-white px-2 py-1 rounded-sm hover:bg-red-600 text-xs"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add row button */}
      <div className="mt-3">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-md shadow hover:bg-blue-700 text-sm"
        >
          + Add Row
        </button>
      </div>
    </div>
  );
};

export default GrnExtraCostForm;

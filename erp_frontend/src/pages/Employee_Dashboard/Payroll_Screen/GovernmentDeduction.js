import React, { useState } from "react";

export default function GovernmentDeduction() {
  const [section80C, setSection80C] = useState("150000");
  const [section80D, setSection80D] = useState("");

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-800 mb-1">
        Tax Investment Slot
      </h2>
      {/* <p className="text-xs text-gray-500 mb-4">Configure income tax limits</p> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Section 80C
          </label>
          <input
            type="number"
            value={section80C}
            onChange={(e) => setSection80C(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Section 80D
          </label>
          <input
            type="number"
            value={section80D}
            onChange={(e) => setSection80D(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-xs"
          />
        </div>
      </div>

      <button className="mt-5 px-5 py-2 bg-blue-600 text-white text-xs rounded-lg">
        Save
      </button>
    </div>
  );
}

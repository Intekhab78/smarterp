import React, { useEffect, useState } from "react";
import axios from "axios";
import SettingsPage from "./SettingsPage";

const MODES = [
  {
    value: "daywise",
    label: "Day-wise",
    description: "Open/Close register once per day",
  },
  {
    value: "cashierwise",
    label: "Cashier-wise",
    description: "Separate register open/close per cashier",
  },
];

function RegisterSetting() {
  const [mode, setMode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/register_float/registerSettingList`
        );
        if (res.data.status) {
          setMode(res.data.mode);
        } else {
          setMessage("No active setting found.");
        }
      } catch (err) {
        setMessage("Failed to fetch setting");
      }
    };
    fetchSetting();
  }, []);

  const saveSetting = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${constantApi.baseUrl}/register_float/registerSettingStore`,
        { mode }
      );
      if (res.data.status) {
        setMessage("Mode updated successfully.");
      } else {
        setMessage("Failed to save mode.");
      }
    } catch (err) {
      setMessage("Server error while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Select Register Open/Close Mode
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {MODES.map((item) => (
          <div
            key={item.value}
            onClick={() => setMode(item.value)}
            className={`min-w-[180px] flex-shrink-0 border rounded-md p-3 shadow-sm text-sm cursor-pointer transition-all duration-200 ${
              mode === item.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white hover:shadow-md"
            }`}
          >
            <h3 className="font-medium mb-1">{item.label}</h3>
            <p className="text-xs">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={saveSetting}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Selected Mode"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-center text-xs text-gray-600">{message}</p>
      )}

      <div className="mt-4 text-center text-xs text-gray-500">
        Current Selected Mode:{" "}
        <span className="font-semibold text-blue-600 capitalize">
          {mode || "--"}
        </span>
      </div>
    </div>
  );
}

export default RegisterSetting;

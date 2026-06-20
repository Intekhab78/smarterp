import React, { useState } from "react";

export default function UserInfoPage() {
  const [user, setUser] = useState({
    name: "Mohit Kumar Maurya",
    timezone: "Asia/Calcutta (18/09/2025 07:18:03 pm)",
    pinCode: "271504",
    attendancePin: "233",
    language: "English (IN)",
    emailSignature: "Administrator",
  });

  const [role, setRole] = useState("Administrator");
  const [theme, setTheme] = useState("System");
  const [notification, setNotification] = useState("By Emails");
  const [outOfOffice, setOutOfOffice] = useState("");

  const [workLocation, setWorkLocation] = useState({
    Monday: "Other",
    Tuesday: "Home",
    Wednesday: "Office",
    Thursday: "Unspecified",
    Friday: "Unspecified",
    Saturday: "Office",
    Sunday: "Unspecified",
  });

  const devices = [
    {
      device: "Windows Chrome",
      ip: "152.58.154.196",
      location: "Lucknow, India",
      lastActive: "8 minutes ago",
      active: true,
    },
  ];

  const handleWorkLocationChange = (day, value) => {
    setWorkLocation((prev) => ({ ...prev, [day]: value }));
  };

  const handleSave = () => {
    const finalData = {
      ...user,
      role,
      theme,
      notification,
      outOfOffice,
      workLocation,
    };
    console.log("Saved Data:", finalData);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8 text-sm space-y-10 border border-gray-200">
      {/* USER SECTION */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
          User
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-bold shadow">
              {user.name.charAt(0)}
            </div>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="border rounded-lg px-3 py-1 text-gray-800 font-medium focus:ring focus:ring-blue-200 outline-none"
            />
          </div>
          <span className="text-gray-600 text-xs">{user.timezone}</span>
        </div>
      </div>

      {/* ATTENDANCE */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
          Attendance / Point of Sale
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">PIN Code</span>
          <input
            type="text"
            value={user.pinCode}
            onChange={(e) => setUser({ ...user, pinCode: e.target.value })}
            className="border rounded-lg px-3 py-1 text-gray-800 font-medium focus:ring focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* ROLES */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
          Roles
        </h2>
        <div className="flex items-center gap-6">
          <span className="text-gray-700">Role</span>
          {["Member", "Administrator"].map((opt) => (
            <label key={opt} className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="role"
                value={opt}
                checked={role === opt}
                onChange={(e) => setRole(e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* MASTER DATA + MARKETING */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
            Master Data
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">Contact</span>
            <span className="text-blue-600">Creation</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Export</span>
            <span className="text-gray-600">Allowed</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
            Marketing
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Canned Responses</span>
            <span className="text-blue-600">Canned Response Admin</span>
          </div>
        </div>
      </div>

      {/* HUMAN RESOURCES */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
          Human Resources
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Employees</span>
          <span className="text-gray-800 font-medium">Administrator</span>
        </div>
      </div>

      {/* PREFERENCES */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
          Preferences
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Language</span>
              <select
                value={user.language}
                onChange={(e) => setUser({ ...user, language: e.target.value })}
                className="border rounded-lg px-2 py-1 text-xs focus:ring focus:ring-blue-200"
              >
                <option>English (IN)</option>
                <option>English (US)</option>
                <option>Hindi</option>
                <option>Arabic</option>
              </select>
            </div>
            <div>
              <span className="text-gray-700 block mb-1">Email Signature</span>
              <textarea
                className="w-full border rounded-lg p-2 text-xs focus:ring focus:ring-blue-200"
                value={user.emailSignature}
                onChange={(e) =>
                  setUser({ ...user, emailSignature: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Theme</span>
              <div className="flex items-center gap-4">
                {["System", "Light", "Dark"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="theme"
                      value={opt}
                      checked={theme === opt}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Notification</span>
              <div className="flex items-center gap-4">
                {["By Emails", "In Odoo"].map((opt) => (
                  <label key={opt} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="notification"
                      value={opt}
                      checked={notification === opt}
                      onChange={(e) => setNotification(e.target.value)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Attendance PIN</span>
              <input
                type="text"
                value={user.attendancePin}
                onChange={(e) =>
                  setUser({ ...user, attendancePin: e.target.value })
                }
                className="border rounded-lg px-2 py-1 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WORK SETTINGS */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
          Work Settings
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <span className="text-gray-700 block mb-1">Timezone</span>
              <p className="text-gray-800">{user.timezone}</p>
            </div>
            <div>
              <span className="text-gray-700 block mb-1">Out-of-office</span>
              <textarea
                className="w-full border rounded-lg p-2 text-xs focus:ring focus:ring-blue-200"
                placeholder="Your out-of-office message..."
                value={outOfOffice}
                onChange={(e) => setOutOfOffice(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div>
            <span className="text-gray-700 block mb-2 font-medium">
              Main Work Location
            </span>
            <table className="text-xs w-full border border-gray-200 rounded-lg">
              <tbody>
                {Object.entries(workLocation).map(([day, location]) => (
                  <tr key={day} className="border-b">
                    <td className="py-2 px-3">{day}</td>
                    <td className="py-2 px-3">
                      <select
                        value={location}
                        onChange={(e) =>
                          handleWorkLocationChange(day, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-xs focus:ring focus:ring-blue-200"
                      >
                        <option>Home</option>
                        <option>Office</option>
                        <option>Other</option>
                        <option>Unspecified</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECURITY & DEVICES */}
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-700 border-b pb-2 mb-3 uppercase tracking-wide">
          Security & Devices
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              "Change Password",
              "Two-factor Authentication",
              "API Keys",
              "Passkeys",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center hover:bg-gray-100 p-2 rounded"
              >
                <span className="text-gray-700">{item}</span>
                <button className="px-3 py-1 text-xs bg-gray-100 border rounded-lg hover:bg-gray-200 transition">
                  {item === "Change Password"
                    ? "Change"
                    : item === "Two-factor Authentication"
                    ? "Enable 2FA"
                    : item === "API Keys"
                    ? "Add Key"
                    : "Add Passkey"}
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <span className="block text-gray-700 mb-1 font-medium">
              Devices
            </span>
            {devices.map((d, i) => (
              <div
                key={i}
                className="flex justify-between items-center border rounded-lg p-3 bg-white shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-800">{d.device}</p>
                  <p className="text-xs text-gray-600">{d.ip}</p>
                  <p className="text-xs text-gray-600">{d.location}</p>
                  <p className="text-xs text-green-600">
                    {d.active ? "●" : "○"} Active {d.lastActive}
                  </p>
                </div>
                <button className="px-3 py-1 text-xs bg-gray-100 border rounded-lg hover:bg-gray-200 transition">
                  Log out
                </button>
              </div>
            ))}
            <button className="px-3 py-2 w-full text-xs bg-gray-100 border rounded-lg hover:bg-gray-200 transition">
              Log out from all devices
            </button>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

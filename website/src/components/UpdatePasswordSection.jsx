import React from "react";

const PasswordModal = ({
  show,
  customerEmail,
  newPassword,
  confirmPassword,
  loading,
  message,
  setNewPassword,
  setConfirmPassword,
  onClose,
  onUpdate,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96 relative animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Update Password
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Current Email"
            value={customerEmail || ""}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none transition"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          {message && (
            <p
              className={`text-sm text-center ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 !bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 !bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
            onClick={onUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;

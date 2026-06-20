import { useState } from "react";

function ApplyLeaveModal({ open, onClose }) {
    if (!open) return null;

    const leaveTypes = [
        "Casual Leave",
        "Sick Leave",
        "Earned Leave / Paid Leave",
        "Work From Home",
        "Maternity Leave",
        "Paternity Leave",
        "Unpaid Leave (LWP)",
        "Comp Off",
        "Emergency Leave",
    ];

    // ===== STATES =====
    const [leaveType, setLeaveType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dayType, setDayType] = useState("Full Day");
    const [timeIn, setTimeIn] = useState("");
    const [timeOut, setTimeOut] = useState("");

    // Prevent previous dates
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[450px] rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold">Apply Leave</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Leave Type */}
                    <select
                        className="w-full border p-2 rounded"
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                    >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    {/* Date Range */}
                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="border p-2 rounded w-1/2"
                            min={today}  // 🚫 Prevent previous dates
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />

                        <input
                            type="date"
                            className="border p-2 rounded w-1/2"
                            min={fromDate || today} // 🚫 To date cannot be before From date
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    {/* Full Day / Half Day */}
                    <select
                        className="w-full border p-2 rounded"
                        value={dayType}
                        onChange={(e) => setDayType(e.target.value)}
                    >
                        <option value="Full Day">Full Day</option>
                        <option value="Half Day">Half Day</option>
                    </select>

                    {/* Show Time In / Out only for Half Day */}
                    {dayType === "Half Day" && (
                        <div className="flex gap-2">
                            <input
                                type="time"
                                className="border p-2 rounded w-1/2"
                                value={timeIn}
                                onChange={(e) => setTimeIn(e.target.value)}
                                placeholder="Time In"
                            />

                            <input
                                type="time"
                                className="border p-2 rounded w-1/2"
                                value={timeOut}
                                onChange={(e) => setTimeOut(e.target.value)}
                                placeholder="Time Out"
                            />
                        </div>
                    )}

                    {/* Reason */}
                    <textarea
                        className="w-full border p-2 rounded"
                        placeholder="Reason"
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="border px-4 py-1 rounded"
                        >
                            Cancel
                        </button>

                        <button className="bg-purple-600 text-white px-4 py-1 rounded">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplyLeaveModal;

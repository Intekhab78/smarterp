function LeaveTable({ onApply }) {
    const leaves = [
        { id: 1, type: "Casual", from: "2025-12-16", to: "2025-12-16", days: 0.5, status: "Pending" },
        { id: 2, type: "Sick", from: "2025-11-28", to: "2025-11-28", days: 1, status: "Approved" },
        { id: 3, type: "Paid", from: "2025-10-10", to: "2025-10-12", days: 3, status: "Approved" },
        { id: 4, type: "Casual", from: "2025-09-05", to: "2025-09-05", days: 1, status: "Rejected" },
        { id: 5, type: "Sick", from: "2025-08-20", to: "2025-08-21", days: 2, status: "Pending" },
        { id: 6, type: "Casual", from: "2025-07-15", to: "2025-07-15", days: 1, status: "Approved" },
    ];


    const statusColor = {
        Approved: "text-green-600 bg-green-100",
        Pending: "text-yellow-600 bg-yellow-100",
        Rejected: "text-red-600 bg-red-100",
    };

    return (
        <div className="bg-white border rounded-lg shadow-sm">
            <div className="flex justify-between p-4 border-b">
                <h3 className="font-semibold">Leave Applications</h3>
                <button
                    onClick={onApply}
                    className="bg-purple-600 text-white px-4 py-1 rounded"
                >
                    + Apply Leave
                </button>
            </div>

            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">From</th>
                        <th className="p-3 text-left">To</th>
                        <th className="p-3 text-left">Days</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.map((l) => (
                        <tr key={l.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">{l.type}</td>
                            <td className="p-3">{l.from}</td>
                            <td className="p-3">{l.to}</td>
                            <td className="p-3">{l.days}</td>
                            <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded text-xs ${statusColor[l.status]}`}
                                >
                                    {l.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LeaveTable;

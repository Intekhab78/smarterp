function ManagerLeaveTable() {
    const leaves = [
        {
            id: 1,
            empName: "Rahul Sharma",
            type: "Casual Leave",
            from: "2026-02-05",
            to: "2026-02-05",
            days: 1,
            reason: "Family function",
            status: "Pending",
        },
        {
            id: 2,
            empName: "Anita Verma",
            type: "Sick Leave",
            from: "2026-02-03",
            to: "2026-02-04",
            days: 2,
            reason: "Viral fever",
            status: "Pending",
        },
        {
            id: 3,
            empName: "Mohit Kumar",
            type: "Earned Leave / Paid Leave",
            from: "2026-01-28",
            to: "2026-01-30",
            days: 3,
            reason: "Personal work",
            status: "Pending",
        },
        {
            id: 4,
            empName: "Sneha Patel",
            type: "Work From Home",
            from: "2026-02-01",
            to: "2026-02-01",
            days: 1,
            reason: "Internet setup at home",
            status: "Pending",
        },
        {
            id: 5,
            empName: "Amit Singh",
            type: "Emergency Leave",
            from: "2026-02-06",
            to: "2026-02-06",
            days: 1,
            reason: "Medical emergency",
            status: "Pending",
        },
    ];


    return (
        <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Leave Approval Requests</h3>
            </div>

            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-left">Employee</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">From</th>
                        <th className="p-3">To</th>
                        <th className="p-3">Days</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {leaves.map((l) => (
                        <tr key={l.id} className="border-t">
                            <td className="p-3">{l.empName}</td>
                            <td className="p-3">{l.type}</td>
                            <td className="p-3">{l.from}</td>
                            <td className="p-3">{l.to}</td>
                            <td className="p-3 text-center">{l.days}</td>
                            <td className="p-3">{l.reason}</td>
                            <td className="p-3 flex gap-2">
                                <button className="px-3 py-1 bg-green-600 text-white rounded">
                                    Approve
                                </button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded">
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManagerLeaveTable;

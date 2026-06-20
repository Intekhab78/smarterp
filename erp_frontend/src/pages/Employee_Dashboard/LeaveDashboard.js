// function LeaveDashboard() {
//     const stats = [
//         { title: "Total Leaves", value: 24 },
//         { title: "Used Leaves", value: 10 },
//         { title: "Balance", value: 14 },
//         { title: "Pending Approval", value: 2 },
//     ];

//     return (
//         <div className="grid grid-cols-4 gap-4 mb-6">
//             {stats.map((s) => (
//                 <div
//                     key={s.title}
//                     className="bg-white border rounded-lg p-4 shadow-sm"
//                 >
//                     <p className="text-gray-500 text-sm">{s.title}</p>
//                     <p className="text-2xl font-semibold mt-1">{s.value}</p>
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default LeaveDashboard;


import { useEffect, useState } from "react";

function LeaveDashboard() {
    const totalLeaves = 24;

    const stats = [
        {
            title: "Total Leaves",
            value: 24,
            total: 24,
            color: "#6366F1", // Indigo
        },
        {
            title: "Used Leaves",
            value: 10,
            total: 24,
            color: "#22C55E", // Green
        },
        {
            title: "Balance",
            value: 14,
            total: 24,
            color: "#0EA5E9", // Blue
        },
        {
            title: "Pending Approval",
            value: 2,
            total: 24,
            color: "#F59E0B", // Amber
        },
    ];

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 5 : 100));
        }, 30);

        return () => clearInterval(timer);
    }, []);

    const circumference = 2 * Math.PI * 36; // circle size

    return (
        <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((s) => {
                const percentage = Math.round((s.value / s.total) * 100);
                const dashOffset =
                    circumference -
                    (progress / 100) * (percentage / 100) * circumference;

                return (
                    <div
                        key={s.title}
                        className="bg-white border rounded-lg p-4 shadow-sm flex flex-col items-center"
                    >
                        <div className="relative w-24 h-24 mb-3">
                            <svg className="w-full h-full -rotate-90">
                                {/* Background circle */}
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="36"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="8"
                                />

                                {/* Progress circle */}
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="36"
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth="8"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dashoffset 0.3s ease" }}
                                />
                            </svg>

                            {/* Value + % inside circle */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold">{s.value}</span>
                                <span className="text-xs text-gray-500">{percentage}%</span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm text-center">{s.title}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default LeaveDashboard;

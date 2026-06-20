function ManagerLeaveDashboard() {
    const stats = [
        { title: "Pending Requests", value: 5 },
        { title: "Approved Today", value: 2 },
        { title: "Rejected Today", value: 1 },
        { title: "Total Team Leaves", value: 18 },
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
                <div
                    key={s.title}
                    className="bg-white border rounded-lg p-4 shadow-sm"
                >
                    <p className="text-gray-500 text-sm">{s.title}</p>
                    <p className="text-2xl font-semibold mt-1">{s.value}</p>
                </div>
            ))}
        </div>
    );
}

export default ManagerLeaveDashboard;


// import { useEffect, useState } from "react";

// function ManagerLeaveDashboard() {
//     const teamTotal = 18; // base for percentage

//     const stats = [
//         {
//             title: "Pending Requests",
//             value: 5,
//             total: teamTotal,
//             color: "#F59E0B", // Amber
//         },
//         {
//             title: "Approved Today",
//             value: 2,
//             total: teamTotal,
//             color: "#22C55E", // Green
//         },
//         {
//             title: "Rejected Today",
//             value: 1,
//             total: teamTotal,
//             color: "#EF4444", // Red
//         },
//         {
//             title: "Total Team Leaves",
//             value: 18,
//             total: teamTotal,
//             color: "#6366F1", // Indigo
//         },
//     ];

//     const [progress, setProgress] = useState(0);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setProgress((prev) => (prev < 100 ? prev + 5 : 100));
//         }, 30);

//         return () => clearInterval(timer);
//     }, []);

//     const circumference = 2 * Math.PI * 36; // circle size

//     return (
//         <div className="grid grid-cols-4 gap-6 mb-6">
//             {stats.map((s) => {
//                 const percentage = Math.round((s.value / s.total) * 100);
//                 const dashOffset =
//                     circumference -
//                     (progress / 100) * (percentage / 100) * circumference;

//                 return (
//                     <div
//                         key={s.title}
//                         className="bg-white border rounded-lg p-4 shadow-sm flex flex-col items-center"
//                     >
//                         <div className="relative w-24 h-24 mb-3">
//                             <svg className="w-full h-full -rotate-90">
//                                 {/* Background circle */}
//                                 <circle
//                                     cx="48"
//                                     cy="48"
//                                     r="36"
//                                     fill="none"
//                                     stroke="#E5E7EB"
//                                     strokeWidth="8"
//                                 />

//                                 {/* Progress circle */}
//                                 <circle
//                                     cx="48"
//                                     cy="48"
//                                     r="36"
//                                     fill="none"
//                                     stroke={s.color}
//                                     strokeWidth="8"
//                                     strokeDasharray={circumference}
//                                     strokeDashoffset={dashOffset}
//                                     strokeLinecap="round"
//                                     style={{ transition: "stroke-dashoffset 0.3s ease" }}
//                                 />
//                             </svg>

//                             {/* Value + % inside circle */}
//                             <div className="absolute inset-0 flex flex-col items-center justify-center">
//                                 <span className="text-xl font-bold">{s.value}</span>
//                                 <span className="text-xs text-gray-500">{percentage}%</span>
//                             </div>
//                         </div>

//                         <p className="text-gray-500 text-sm text-center">{s.title}</p>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// export default ManagerLeaveDashboard;

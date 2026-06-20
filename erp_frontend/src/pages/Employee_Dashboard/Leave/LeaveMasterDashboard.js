// import { useEffect, useState } from "react";

// function LeaveMasterDashboard() {
//     const stats = [
//         {
//             title: "Total Leave Types",
//             value: 9,
//             total: 9,
//             color: "#6366F1", // Indigo
//         },
//         {
//             title: "Active Leave Types",
//             value: 7,
//             total: 9,
//             color: "#22C55E", // Green
//         },
//         {
//             title: "Inactive Leave Types",
//             value: 2,
//             total: 9,
//             color: "#EF4444", // Red
//         },
//         {
//             title: "Requires Approval",
//             value: 6,
//             total: 9,
//             color: "#F59E0B", // Amber
//         },
//     ];

//     const [progress, setProgress] = useState(0);

//     useEffect(() => {
//         let timer = setInterval(() => {
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
//                     circumference - (progress / 100) * (percentage / 100) * circumference;

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

//                                 {/* Progress circle (percentage based) */}
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

// export default LeaveMasterDashboard;
import { useEffect, useState } from "react";

function LeaveMasterDashboard() {
    const stats = [
        {
            title: "Total Leave Types",
            value: 9,
            total: 9,
            color: "#6366F1",
        },
        {
            title: "Active Leave Types",
            value: 7,
            total: 9,
            color: "#22C55E",
        },
        {
            title: "Inactive Leave Types",
            value: 2,
            total: 9,
            color: "#EF4444",
        },
        {
            title: "Requires Approval",
            value: 6,
            total: 9,
            color: "#F59E0B",
        },
        {
            title: "Half-Day Allowed",
            value: 5,
            total: 9,
            color: "#0EA5E9",
        },
        {
            title: "Carry Forward Allowed",
            value: 3,
            total: 9,
            color: "#EC4899",
        },
    ];

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 5 : 100));
        }, 30);

        return () => clearInterval(timer);
    }, []);

    const circumference = 2 * Math.PI * 36;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6 mt-2">
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
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="36"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="8"
                                />

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

export default LeaveMasterDashboard;

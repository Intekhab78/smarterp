export default function POSPageFooter() {
    return (
        <div className="fixed bottom-0 left-0 w-full overflow-hidden border-t shadow-sm">

            {/* 🌙 Islamic soft animated gradient */}
            <div className="absolute inset-0 !bg-gradient-to-r 
        !from-emerald-50 !via-green-100 to-emerald-50 
        !dark:from-gray-900 !dark:via-gray-800 !dark:to-gray-900 
        animate-[pulse_8s_ease-in-out_infinite] opacity-80" />

            {/* ✨ Subtle Islamic pattern (Tailwind only) */}
            <div className="absolute inset-0 opacity-10 dark:opacity-20 !bg-[radial-gradient(circle,_#10b981_1px,_transparent_1px)] bg-[size:32px_32px]" />

            {/* Content */}
            <div className="relative px-4 py-2 text-[12px] text-gray-700 dark:text-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-1">

                    {/* LEFT */}
                    <div className="text-center md:text-left">
                        © {new Date().getFullYear()}{" "}
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            Islamic Book Zone
                        </span>{" "}
                        • All Rights Reserved
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3 text-[11px] text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            🔒 <span>Secure POS</span>
                        </span>
                        <span>|</span>
                        <span>Fast Billing</span>
                        <span>|</span>
                        <span>Trusted Store</span>
                    </div>

                </div>
            </div>
        </div>
    );
}


// import { useEffect, useState } from "react";

// export default function POSPageFooter() {
//     const [time, setTime] = useState(new Date());
//     const [online, setOnline] = useState(navigator.onLine);

//     /* ⏰ Live clock */
//     useEffect(() => {
//         const t = setInterval(() => setTime(new Date()), 1000);
//         return () => clearInterval(t);
//     }, []);

//     /* 🌐 Network status */
//     useEffect(() => {
//         const update = () => setOnline(navigator.onLine);
//         window.addEventListener("online", update);
//         window.addEventListener("offline", update);
//         return () => {
//             window.removeEventListener("online", update);
//             window.removeEventListener("offline", update);
//         };
//     }, []);

//     const date = time.toLocaleDateString("en-IN", {
//         weekday: "short",
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//     });

//     const clock = time.toLocaleTimeString("en-IN");

//     /* 🌙 Basic Hijri (optional library later) */
//     const hijri = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//     }).format(time);

//     return (
//         <div className="fixed bottom-0 left-0 w-full overflow-hidden border-t shadow-lg backdrop-blur-md">

//             {/* 🌙 Premium Islamic gradient */}
//             <div className="absolute inset-0 bg-gradient-to-r
//         from-emerald-100 via-green-50 to-emerald-100
//         dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-90" />

//             {/* ✨ Islamic pattern */}
//             <div className="absolute inset-0 opacity-10 dark:opacity-20
//         bg-[radial-gradient(circle,_#059669_1px,_transparent_1px)]
//         bg-[size:28px_28px]" />

//             {/* CONTENT */}
//             <div className="relative px-4 py-2 text-[12px] text-gray-800 dark:text-gray-200">

//                 {/* FIRST ROW */}
//                 <div className="flex flex-col md:flex-row items-center justify-between gap-2">

//                     {/* LEFT → Brand */}
//                     <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
//                         <span className="font-semibold text-emerald-800 dark:text-emerald-400">
//                             © {new Date().getFullYear()} Islamic Book Zone
//                         </span>

//                         <span className="hidden md:block text-gray-400">•</span>

//                         <span className="text-gray-600 dark:text-gray-400">
//                             Authentic Qur’an & Sunnah
//                         </span>
//                     </div>

//                     {/* CENTER → Dates */}
//                     <div className="text-sm font-medium text-center">
//                         📅 {date}  • ⏰ {clock}
//                     </div>

//                     {/* RIGHT → Status */}
//                     <div className="flex flex-wrap items-center gap-2 text-[11px]">

//                         <span className={`px-2 py-1 rounded-full
//               ${online
//                                 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
//                                 : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"}`}>
//                             {online ? "🟢 Online" : "🔴 Offline"}
//                         </span>

//                         <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
//                             ⚡ Fast POS
//                         </span>

//                         <span className="px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
//                             🔒 Secure
//                         </span>

//                     </div>
//                 </div>

//                 {/* SECOND ROW */}
//                 <div className="mt-1 flex flex-wrap justify-between text-[10px] text-gray-500 dark:text-gray-400">

//                     <span>
//                         POS Version 1.0
//                     </span>

//                     <span className="hidden md:block">
//                         Support: +91 XXXXX XXXXX • Powered by JTS Technology
//                     </span>

//                 </div>

//             </div>
//         </div>
//     );
// }
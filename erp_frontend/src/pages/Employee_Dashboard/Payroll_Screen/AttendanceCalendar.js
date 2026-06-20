import React from "react";

export default function AttendanceCalendar({ data, month, year }) {
  // Fix month overflow
  while (month < 0) {
    month += 12;
    year -= 1;
  }
  while (month > 11) {
    month -= 12;
    year += 1;
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // COLOR LOGIC
  const getStatusColor = (status, dateObj) => {
    if (dateObj.getTime() === today.getTime()) return "bg-yellow-300";
    if (dateObj > today) return "bg-gray-200";
    if (!status) return "bg-red-300";
    if (status.toLowerCase() === "present") return "bg-green-400";
    if (status.toLowerCase() === "absent") return "bg-red-400";
    return "bg-yellow-300";
  };

  // Map full object, not only status
  const dateMap = {};
  data.forEach((d) => {
    const dt = new Date(d.datetime);
    if (dt.getMonth() === month && dt.getFullYear() === year) {
      dateMap[dt.getDate()] = d;
    }
  });

  return (
    <div className=" p-2 w-full shadow-sm">
      <div className="border rounded bg-white p-2 w-full shadow-sm">
        <h3 className="text-center font-semibold text-sm mb-2">
          {monthNames[month]} {year}
        </h3>

        <div className="grid grid-cols-7 gap-1">
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateObj = new Date(year, month, day);
            const entry = dateMap[day];
            const status = entry?.status;

            return (
              <div
                key={day}
                className={`relative group h-10 flex flex-col items-center justify-center 
            text-[10px] rounded cursor-pointer ${getStatusColor(
              status,
              dateObj
            )}`}
              >
                <span className="font-semibold text-[12px]">{day}</span>

                {entry?.status === "Present" && (
                  <div
                    className="absolute hidden group-hover:block z-50 
                bg-black text-white text-[10px] px-2 py-1 rounded 
                left-1/2 -translate-x-1/2 top-11 w-max whitespace-nowrap shadow-lg"
                  >
                    <div>
                      <b>Working:</b> {entry.working_hour} hrs
                    </div>
                    <div>
                      <b>In:</b> {entry.punch_in}
                    </div>
                    <div>
                      <b>Out:</b> {entry.punch_out}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Repeat calendar 2 and calendar 3 here */}
    </div>
  );
}

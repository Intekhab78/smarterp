import React, { useState } from "react";

const holidayData = {
  2026: {
    1: [
      { date: "2026-01-01", name: "New Year’s Day" },
      { date: "2026-01-14", name: "Makar Sankranti / Pongal" },
      { date: "2026-01-26", name: "Republic Day" },
    ],
    2: [{ date: "2026-02-17", name: "Maha Shivaratri" }],
    3: [
      { date: "2026-03-04", name: "Holi" },
      { date: "2026-03-29", name: "Ram Navami" },
    ],
    4: [
      { date: "2026-04-02", name: "Good Friday" },
      { date: "2026-04-14", name: "Vaisakhi / Ambedkar Jayanti" },
      { date: "2026-04-21", name: "Mahavir Jayanti" },
    ],
    5: [
      {
        date: "2026-05-01",
        name: "International Workers’ Day / Buddha Purnima",
      },
      { date: "2026-05-13", name: "Eid-ul-Fitr" },
    ],
    7: [{ date: "2026-07-10", name: "Bakrid (Eid al-Adha)" }],
    8: [
      { date: "2026-08-15", name: "Independence Day" },
      { date: "2026-08-20", name: "Raksha Bandhan" },
    ],
    9: [{ date: "2026-09-06", name: "Janmashtami" }],
    10: [
      { date: "2026-10-02", name: "Gandhi Jayanti" },
      { date: "2026-10-12", name: "Dussehra (Vijayadashami)" },
    ],
    11: [
      { date: "2026-11-01", name: "All Saints’ Day" },
      { date: "2026-11-08", name: "Diwali" },
      { date: "2026-11-15", name: "Guru Nanak Jayanti" },
    ],
    12: [{ date: "2026-12-25", name: "Christmas Day" }],
  },
  2027: {
    1: [
      { date: "2027-01-01", name: "New Year’s Day" },
      { date: "2027-01-15", name: "Makar Sankranti / Pongal" },
      { date: "2027-01-26", name: "Republic Day" },
    ],
    2: [{ date: "2027-02-05", name: "Maha Shivaratri" }],
    3: [
      { date: "2027-03-23", name: "Holi" },
      { date: "2027-03-30", name: "Ram Navami" },
    ],
    4: [
      { date: "2027-04-02", name: "Good Friday" },
      { date: "2027-04-14", name: "Vaisakhi / Ambedkar Jayanti" },
      { date: "2027-04-09", name: "Mahavir Jayanti" },
    ],
    5: [
      {
        date: "2027-05-01",
        name: "International Workers’ Day / Buddha Purnima",
      },
      { date: "2027-05-02", name: "Eid-ul-Fitr" },
    ],
    7: [{ date: "2027-07-30", name: "Bakrid (Eid al-Adha)" }],
    8: [
      { date: "2027-08-15", name: "Independence Day" },
      { date: "2027-08-10", name: "Raksha Bandhan" },
    ],
    9: [{ date: "2027-09-25", name: "Janmashtami" }],
    10: [
      { date: "2027-10-02", name: "Gandhi Jayanti" },
      { date: "2027-10-01", name: "Dussehra (Vijayadashami)" },
    ],
    11: [
      { date: "2027-11-14", name: "Diwali" },
      { date: "2027-11-23", name: "Guru Nanak Jayanti" },
    ],
    12: [{ date: "2027-12-25", name: "Christmas Day" }],
  },
};

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function formatHolidayDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    weekday: "short",
  });
}

function generateCalendarCells(year, month, holidaysMap) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();

  const cells = [];

  for (let i = 0; i < firstDay; i++)
    cells.push(<div key={`empty-start-${i}`} />);

  for (let day = 1; day <= daysInMonth; day++) {
    const isHoliday = holidaysMap[day] !== undefined;
    cells.push(
      <div
        key={`${month}-${day}`}
        data-day={day}
        className={`cursor-pointer select-none rounded-md p-2 text-center text-xs font-medium ${
          isHoliday
            ? "bg-green-200 text-green-800 hover:bg-green-300"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        {day}
      </div>
    );
  }

  while (cells.length % 7 !== 0) {
    cells.push(<div key={`empty-end-${cells.length}`} />);
  }

  return cells;
}

export default function HolidayCalendar() {
  const [year, setYear] = useState(2026);
  const [startMonth, setStartMonth] = useState(1);
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const handleDayClick = (month, day) => {
    const holidaysThisMonth = holidayData[year]?.[month] || [];
    const holidaysMap = {};
    holidaysThisMonth.forEach((h) => {
      const d = new Date(h.date).getDate();
      if (!holidaysMap[d]) holidaysMap[d] = [];
      holidaysMap[d].push(h);
    });
    if (holidaysMap[day]) setSelectedHoliday(holidaysMap[day]);
    else setSelectedHoliday(null);
  };

  const handlePrev = () => {
    let newMonth = startMonth - 3;
    let newYear = year;
    if (newMonth < 1) {
      newMonth += 12;
      newYear -= 1;
    }
    setStartMonth(newMonth);
    setYear(newYear);
    setSelectedHoliday(null);
  };

  const handleNext = () => {
    let newMonth = startMonth + 3;
    let newYear = year;
    if (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }
    setStartMonth(newMonth);
    setYear(newYear);
    setSelectedHoliday(null);
  };

  const monthsToShow = [startMonth, startMonth + 1, startMonth + 2].map((m) =>
    m > 12 ? m - 12 : m
  );

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded-lg text-gray-700 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-800">
          Holiday Calendar
        </h2>
        <div className="flex gap-2 text-xs">
          <button
            onClick={handlePrev}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            aria-label="Previous 3 months"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            aria-label="Next 3 months"
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex gap-6 justify-center">
        {monthsToShow.map((month) => {
          const displayMonth = month > 12 ? month - 12 : month;
          const dateObj = new Date(year, displayMonth - 1);
          const monthName = dateObj.toLocaleString("en-IN", { month: "short" });

          const holidaysThisMonth = holidayData[year]?.[displayMonth] || [];
          const holidaysMap = {};
          holidaysThisMonth.forEach((h) => {
            const day = new Date(h.date).getDate();
            if (!holidaysMap[day]) holidaysMap[day] = [];
            holidaysMap[day].push(h);
          });

          return (
            <div
              key={displayMonth}
              className="w-48 border border-gray-300 rounded-md p-3 shadow-sm"
            >
              <div className="text-center text-xs font-semibold text-gray-600 mb-1">
                {monthName} {year}
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-xs font-semibold text-gray-500 mb-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                  <div key={d} className="text-center">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-xs">
                {generateCalendarCells(year, displayMonth, holidaysMap).map(
                  (cell, idx) =>
                    React.cloneElement(cell, {
                      onClick: () => {
                        if (cell.props.children)
                          handleDayClick(displayMonth, cell.props.children);
                      },
                      key: idx,
                    })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedHoliday && (
        <div className="mt-6 p-3 border border-green-300 rounded bg-green-50 text-green-900 text-xs shadow-sm max-w-md mx-auto">
          <h3 className="font-semibold mb-1">Holiday Details</h3>
          <ul className="list-disc list-inside">
            {selectedHoliday.map(({ date, name }, i) => (
              <li key={i}>
                <span className="font-medium">{formatHolidayDate(date)}</span>:{" "}
                {name}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedHoliday(null)}
            className="mt-2 px-2 py-1 text-green-700 hover:text-green-900 font-semibold text-xs"
            aria-label="Close holiday details"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

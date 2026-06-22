import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AttendancePage() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Format date as DD-MM-YYYY (backend format)
  const getTodayDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ✅ Load user from localStorage
  //   useEffect(() => {
  //     const storedUserData = localStorage.getItem("user_data");
  //     console.log("storedUserData", storedUserData);

  //     const empId = localStorage.getItem("emp_id");

  //     if (storedUserData && empId) {
  //       const parsedUser = JSON.parse(storedUserData);
  //       const employee = parsedUser.employeeData || {};

  //       setUser({
  //         emp_id: Number(empId),
  //         email: employee.emp_email || parsedUser.email,
  //         name: `${employee.emp_fname || parsedUser.firstname || ""} ${
  //           employee.emp_lname || parsedUser.lastname || ""
  //         }`.trim(),
  //         designation: employee.emp_designation || "Employee",
  //         profilePic: employee.emp_profile_pic || null,
  //       });
  //     }
  //   }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");
    console.log("storedUserData", storedUserData);

    if (!storedUserData) return;

    const parsedUser = JSON.parse(storedUserData);
    const employee = parsedUser.employeeData;

    // ⛔ If employeeData missing, stop safely
    if (!employee || !employee.emp_id) {
      console.warn("employeeData missing in user_data");
      return;
    }

    setUser({
      emp_id: Number(employee.emp_id),
      email: employee.emp_email || parsedUser.email,
      name: `${employee.emp_fname || parsedUser.firstname || ""} ${
        employee.emp_lname || parsedUser.lastname || ""
      }`.trim(),
      designation: employee.emp_designation || "Employee",
      profilePic: employee.emp_profile_pic || null,
    });
  }, []);

  // ✅ Fetch today's punch records
  const fetchTodayPunchRecords = async (email) => {
    try {
      const date = getTodayDate();

      const response = await fetch(
        `${constantApi.baseUrl}/emp_attendance/punch-details/${email}?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const result = await response.json();

      if (response.ok && result.status) {
        setRecords(result.data || []);

        // 🔥 Determine punch state from LAST record
        const latest = result.data?.[0];
        if (latest && latest.punch_in && !latest.punch_out) {
          setIsPunchedIn(true);
        } else {
          setIsPunchedIn(false);
        }
      }
    } catch (error) {
      console.error("Fetch punch records error:", error);
    }
  };

  // 🔁 Fetch records when user loads
  useEffect(() => {
    if (user?.email) {
      fetchTodayPunchRecords(user.email);
    }
  }, [user]);

  // 📍 Location
  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject("Geolocation not supported");
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude.toString(),
            longitude: pos.coords.longitude.toString(),
          }),
        (err) => reject(err),
      );
    });

  // 💻 Device info
  const getDeviceInfo = () => ({
    device_id: navigator.userAgent,
    device_brand: "web",
    device_model: "browser",
    device_manufacturer: "web",
    device_type: "phone", // DB safe
  });

  // 🕘 Punch handler
  const handlePunch = async () => {
    if (loading || !user) return;

    setLoading(true);
    const now = new Date();

    try {
      const location = await getLocation();
      const device = getDeviceInfo();

      const payload = {
        emp_id: user.emp_id,
        email: user.email,
        datetime: now.toISOString(),
        latitude: location.latitude,
        longitude: location.longitude,
        match_percentage: 0.0,
        device_id: device.device_id,
        device_brand: device.device_brand,
        device_model: device.device_model,
        device_manufacturer: device.device_manufacturer,
        device_type: device.device_type,
        status: isPunchedIn ? "PUNCH_OUT" : "PUNCH_IN",
      };

      const response = await fetch(
        `${constantApi.baseUrl}/emp_attendance/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Attendance failed");
      }

      // 🔁 Re-fetch records after punch
      await fetchTodayPunchRecords(user.email);
    } catch (error) {
      console.error(error);
      alert(error.message || "Attendance error");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ Loading state
  if (!user) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="flex justify-center items-center h-64 text-sm text-slate-500">
          Loading user data...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <img
                src={
                  user.profilePic
                    ? `${constantApi.imageUrl}/Employee_profile/${user.profilePic}`
                    : "/default-avatar.png"
                }
                className="w-14 h-14 rounded-full border object-cover"
                onError={(e) => (e.target.src = "/default-avatar.png")}
              />
              <div>
                <h1 className="text-lg font-semibold text-slate-800">
                  {user.name}
                </h1>
                <p className="text-xs text-slate-500">{user.designation}</p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isPunchedIn
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {isPunchedIn ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          {/* Punch Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handlePunch}
              disabled={loading}
              className={`px-12 py-3 rounded-full text-sm font-semibold text-white shadow-lg
              ${
                loading
                  ? "bg-slate-400"
                  : isPunchedIn
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading
                ? "Processing..."
                : isPunchedIn
                  ? "END WORK SESSION"
                  : "START WORK SESSION"}
            </button>
          </div>

          {/* View Details */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate(`/employee_details/${user.emp_id}`)}
              className="text-sm text-slate-600 underline"
            >
              View Attendance Details
            </button>
          </div>

          {/* Activity */}
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              TODAY&apos;S ACTIVITY
            </h2>

            {records.length === 0 ? (
              <p className="text-xs text-slate-500">No records found.</p>
            ) : (
              <ul className="space-y-2">
                {records.map((r) => (
                  <li
                    key={r.id}
                    className="flex justify-between bg-slate-50 px-4 py-3 rounded-lg"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      IN: {r.punch_in || "--"} | OUT: {r.punch_out || "--"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {r.working_hours || "--"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

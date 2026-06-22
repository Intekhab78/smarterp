import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const AdminAdMonitor = () => {
  const [ads, setAds] = useState([]);
  const [viewerStats, setViewerStats] = useState({});
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  // Fetch ads list from backend
  const fetchAds = async () => {
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/video-advertiesment/list`
      );
      setAds(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();

    // Initialize socket once
    const socket = io(constantApi.addUrl, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Admin socket connected:", socket.id);
      socket.emit("JOIN_ADMIN");
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Admin socket disconnected:", reason);
    });

    socket.on("AD_VIEWER_STATS", (stats) => {
      console.log("📊 Stats received:", stats);
      setViewerStats(stats);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Calculations
  const totalRunningAds = ads.filter((ad) => ad.is_running).length;

  const totalRunningPlaces = Object.values(viewerStats).reduce(
    (sum, count) => sum + count,
    0
  );

  if (loading) {
    return <p className="text-sm text-gray-500">Loading dashboard…</p>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-xs text-gray-500 uppercase">
              Total Advertisements
            </p>
            <h2 className="text-3xl font-semibold mt-2">{ads.length}</h2>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-xs text-gray-500 uppercase">
              Currently Running Ads
            </p>
            <h2 className="text-3xl font-semibold mt-2 text-green-600">
              {totalRunningAds}
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <p className="text-xs text-gray-500 uppercase">
              Total Places Playing Ads
            </p>
            <h2 className="text-3xl font-semibold mt-2 text-blue-600">
              {totalRunningPlaces}
            </h2>
          </div>
        </div>

        {/* Ads Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-5 py-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Live Advertisement Status
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {ads.length === 0 && (
              <p className="text-center text-gray-500 col-span-full">
                No advertisements found.
              </p>
            )}

            {ads.map((ad) => (
              <div
                key={ad.id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {ad.title}
                  </h4>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      ad.is_running
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {ad.is_running ? "Running" : "Stopped"}
                  </span>
                </div>

                {/* <p className="text-xs text-gray-400 mt-1 truncate">
                  {ad.video_path}
                </p> */}

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xs text-gray-500">Playing on</p>
                  <p className="text-lg font-semibold text-indigo-600">
                    {viewerStats[ad.id] || 0}
                    <span className="text-xs text-gray-500 ml-1">screens</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAdMonitor;

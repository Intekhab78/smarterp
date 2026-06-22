import React, { useState } from "react";
import VideoAdvertisementForm from "./VideoAdvertisementForm";
import VideoAdvertisementList from "./VideoAdvertisementList";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const VideoAdvertisementPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6 bg-gray-50 min-h-screen space-y-6">
        <h1 className="text-lg font-semibold text-gray-800">
          Video Advertisements
        </h1>

        <VideoAdvertisementForm
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
        />

        <VideoAdvertisementList refreshKey={refreshKey} />
      </div>
    </DashboardLayout>
  );
};

export default VideoAdvertisementPage;

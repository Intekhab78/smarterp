import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";

const stores = [
  { id: 1, name: "Store One" },
  { id: 2, name: "Store Two" },
  { id: 3, name: "Store Three" },
];

const VideoAdvertisementList = ({ refreshKey }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allCompanies, setAllCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  useEffect(() => {
    fetchCompanies();
    fetchAllLocations();
  }, []);

  useEffect(() => {
    fetchAds();
  }, [refreshKey]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/company/com_list`);
      if (res?.data?.status === true) {
        setAllCompanies(res.data.data);
      } else {
        setAllCompanies([]);
      }
      console.log("fetchCompanies----------", res.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const fetchAllLocations = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/location/loc_list`);
      if (res?.data?.status === true) {
        setAllLocations(res.data.data);
      } else {
        setAllLocations([]);
      }
      console.log("fetchAllLocations----------", res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${constantApi.baseUrl}/video-advertiesment/list`
      );
      setAds(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/video-advertiesment/${id}/status`, { status });
      fetchAds();
    } catch (error) {
      console.error(error);
    }
  };

  const getStoreName = (store_id) => {
    const store = stores.find((s) => s.id === store_id);
    return store ? store.name : `Unknown Store (#${store_id})`;
  };

  const getCompanyName = (company_id) => {
    const company = allCompanies.find((c) => c.id === company_id);
    return company
      ? company.compdesc || company.name || "Unknown Company"
      : `Unknown Company (#${company_id})`;
  };

  const getLocationName = (location_id) => {
    const location = allLocations.find((l) => l.id === location_id);
    return location
      ? location.locname || location.name || "Unknown Location"
      : `Unknown Location (#${location_id})`;
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading advertisements...</p>;
  }

  const playAd = async (id) => {
    // 🔥 INSTANT UI UPDATE
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === id
          ? { ...ad, is_running: true, status: "active" }
          : { ...ad, is_running: false, status: "paused" }
      )
    );

    try {
      await axios.post(`${constantApi.baseUrl}/video/${id}/play`);
    } catch (err) {
      console.error(err);
      // ❌ rollback if API fails
      fetchAds();
    }
  };

  const stopAd = async () => {
    // 🔥 INSTANT UI UPDATE
    setAds((prev) =>
      prev.map((ad) => ({
        ...ad,
        is_running: false,
        status: "stopped",
      }))
    );

    try {
      await axios.post(`${constantApi.baseUrl}/video/stop`);
    } catch (err) {
      console.error(err);
      fetchAds();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Location</th>
            {/* <th className="px-4 py-3 text-left">Store</th> */}
            <th className="px-4 py-3 text-left">Status</th>
            {/* <th className="px-4 py-3 text-right">Action</th> */}
          </tr>
        </thead>

        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800">
                  {ad.title || "Untitled Ad"}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-xs">
                  {ad.video_path}
                </p>
              </td>

              <td className="px-4 py-3 text-xs">
                {getCompanyName(ad.company_id)}
              </td>

              <td className="px-4 py-3 text-xs">
                {getLocationName(ad.location_id)}
              </td>

              {/* <td className="px-4 py-3 text-xs">{getStoreName(ad.store_id)}</td> */}

              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ad.status === "active"
                      ? "bg-green-100 text-green-700"
                      : ad.status === "paused"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {ad.status}
                </span>
              </td>

              {/* <td className="px-4 py-3 text-right space-x-2">
                {ad.status !== "active" && (
                  <button
                    onClick={() => updateStatus(ad.id, "active")}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Activate
                  </button>
                )}
                {ad.status === "active" && (
                  <button
                    onClick={() => updateStatus(ad.id, "paused")}
                    className="text-xs px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Pause
                  </button>
                )}
              </td> */}

              <td className="px-4 py-3 text-right space-x-2">
                {ad.is_running ? (
                  <button
                    onClick={stopAd}
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded"
                  >
                    ⏸ Stop
                  </button>
                ) : (
                  <button
                    onClick={() => playAd(ad.id)}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded"
                  >
                    ▶ Play
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoAdvertisementList;

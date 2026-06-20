import React, { useState, useEffect } from "react";
import axios from "axios";
import constantApi from "constantApi";

const VideoAdvertisementForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    company_id: "",
    location_id: "",
    store_id: "",
    title: "",
    video: null,
    priority: 1,
  });

  const [allCompanies, setAllCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  // temporary static store list
  const stores = [
    { id: 1, name: "Store One" },
    { id: 2, name: "Store Two" },
    { id: 3, name: "Store Three" },
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/company/com_list`);
      if (res?.data?.status === true) {
        setAllCompanies(res.data.data);
      }
      console.log("fetchCompanies----------", res.data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const fetchLocations = async (companyId) => {
    if (!companyId) {
      setLocations([]);
      setForm((prev) => ({ ...prev, location_id: "" }));
      return;
    }
    try {
      const res = await axios.post(`${constantApi.baseUrl}/location/loc_list`, {
        company_id: companyId,
      });

      console.log("fetchLocations----------", res.data);

      if (res?.data?.status === true) {
        setLocations(res.data.data);
      } else {
        setLocations([]); // clear locations if no valid data
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // If company changes, reset location and fetch new locations
    if (name === "company_id") {
      setForm((prev) => ({
        ...prev,
        company_id: value,
        location_id: "",
      }));
      fetchLocations(value);
    } else {
      setForm({ ...form, [name]: files ? files[0] : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("company_id", form.company_id);
    data.append("location_id", form.location_id);
    data.append("store_id", form.store_id);
    data.append("title", form.title);
    data.append("video", form.video);
    data.append("priority", form.priority);

    try {
      await axios.post(
        `${constantApi.baseUrl}/video-advertiesment/create`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onSuccess();
      setForm({
        company_id: "",
        location_id: "",
        store_id: 1,
        title: "",
        video: null,
        priority: 1,
      });
      setLocations([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4"
    >
      <h2 className="text-sm font-semibold text-gray-800 mb-4">
        Add Video Advertisement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Company */}
        <select
          name="company_id"
          value={form.company_id}
          onChange={handleChange}
          className="text-sm border rounded px-3 py-2"
          required
        >
          <option value="">Select Company</option>
          {allCompanies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.compdesc}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          name="location_id"
          value={form.location_id}
          onChange={handleChange}
          className="text-sm border rounded px-3 py-2"
          required
          disabled={!form.company_id}
        >
          <option value="">Select Location</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.locname}
            </option>
          ))}
        </select>

        {/* Store */}
        {/* <select
          name="store_id"
          value={form.store_id}
          onChange={handleChange}
          className="text-sm border rounded px-3 py-2"
          required
        >
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select> */}

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Advertisement title"
          value={form.title}
          onChange={handleChange}
          className="text-sm border rounded px-3 py-2"
          required
        />

        {/* Video File */}
        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleChange}
          className="text-sm border rounded px-3 py-2"
          required
        />

        {/* Priority */}
        {/* <input
          type="number"
          name="priority"
          min="1"
          value={form.priority}
          onChange={handleChange}
          className="text-sm border rounded px-3 py-2"
          required
        /> */}
      </div>

      <div className="mt-4 text-right">
        <button
          type="submit"
          className="text-xs px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Save Advertisement
        </button>
      </div>
    </form>
  );
};

export default VideoAdvertisementForm;

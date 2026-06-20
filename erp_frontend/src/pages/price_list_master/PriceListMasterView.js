import React, { useEffect, useState } from "react";
import axios from "axios";
import constantApi from "constantApi";
import { axios_post } from "../../axios";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const PriceListMasterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  // 1) Fetch main record
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `${constantApi.baseUrl}/price_list_master/details/${id}`
        );
        if (res.data?.data) setData(res.data.data);
      } catch (error) {
        console.error("Error loading record:", error);
      }
    };

    fetchDetails();
  }, [id]);

  // 2) Fetch companies
  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response?.status) {
      const filtered = response.data.filter((c) => c.is_main_comp !== "yes");
      setCompanies(filtered.length ? filtered : response.data);
    }
  };

  // 3) Fetch locations
  const fetchLocationList = async (companyId) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: companyId,
    });
    if (response?.status) setLocations(response.data);
  };

  useEffect(() => {
    fetchCompanyList();
  }, []);

  useEffect(() => {
    if (data?.comp) fetchLocationList(data.comp);
  }, [data]);

  // Helpers
  const getCompanyName = (id) => {
    const comp = companies.find((c) => c.id === id);
    return comp ? comp.compdesc : id;
  };

  const getLocationName = (id) => {
    const loc = locations.find((l) => l.id === id);
    return loc ? loc.locname : id;
  };

  if (!data)
    return <p className="text-sm text-gray-500 text-center mt-8">Loading...</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            Price List Details
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Price List Code</p>
            <p className="font-medium text-gray-800">{data.price_list_code}</p>
          </div>

          <div>
            <p className="text-gray-500">Price List Name</p>
            <p className="font-medium text-gray-800">{data.price_list_name}</p>
          </div>
          {/* 
          <div>
            <p className="text-gray-500">Company</p>
            <p className="font-medium text-gray-800">
              {getCompanyName(data.comp)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium text-gray-800">
              {getLocationName(data.loc)}
            </p>
          </div> */}

          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium text-gray-800">{data.start_date}</p>
          </div>

          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium text-gray-800">{data.end_date || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-800 capitalize">
              {data.status}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-right">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PriceListMasterView;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import moment from "moment";
import constantApi from "constantApi";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function add_ItemDeptMst() {
  const navigate = useNavigate();
  const params = useParams();

  const [data, setData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchCompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response) {
      if (response.status) {
        setCompanies(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchLocationList = async (company_id) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id,
    });
    if (response) {
      if (response.status) {
        setLocations(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchDetails = async () => {
    const response = await axios_post(true, "item_department/details", {
      id: params.id,
    });

    if (response) {
      if (response.status) {
        const details = response.data;
        details.itmdepdt1 = moment(details.itmdepdt1).format("YYYY-MM-DD");
        details.itmdepdt2 = moment(details.itmdepdt2).format("YYYY-MM-DD");
        setData(details);

        if (details.company_id) {
          await fetchLocationList(details.company_id);
        }
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    fetchCompanyList();
    fetchDetails();
  }, []);

  const companyName =
    companies.find((c) => c.id === data?.company_id)?.compdesc || "-";
  const locationName =
    locations.find((l) => l.id === data?.location_id)?.locname || "-";

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-3xl mx-auto p-5 bg-white shadow-md rounded mt-8">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold text-blue-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 7h18M3 12h18M3 17h18"></path>
            </svg>
            Item Department Details
          </h1>
          <Link
            to="/itemDeptMst"
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            &larr; Back
          </Link>
        </div>

        {/* Image */}
        {data.image && (
          <div className="mb-6 flex justify-center">
            <img
              src={`${constantApi.imageUrl}/catImage/${data.image}`}
              alt={data.itemdeptname || "Item Image"}
              className="max-h-48 object-contain rounded border border-gray-300 shadow-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-gray-700">
          <Field label="Code" value={data.itemdeptcode} />
          <Field label="Description" value={data.itemdeptname} />
          <Field label="Long Description" value={data.itemdeptlong} />
          <Field label="Desc in Ecom" value={data.note1} />
          <Field label="Display On Ecom" value={data.note2} />
          <Field label="Note 3" value={data.note3} />
          <Field label="Date 1" value={data.itmdepdt1} />
          <Field label="Date 2" value={data.itmdepdt2} />
          <Field label="Added By" value={data.addedby} />
          <Field label="Created Date" value={data.createddt} />
          <Field
            label="Status"
            value={
              data.status === 1 || data.status === "1" ? "Active" : "Inactive"
            }
            valueClass={
              data.status === 1 || data.status === "1"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          />
          <Field label="Company" value={companyName} />
          <Field label="Location" value={locationName} />
        </div>
      </div>
    </DashboardLayout>
  );
}

const Field = ({ label, value, valueClass = "" }) => (
  <div>
    <h3 className="text-xs font-light text-gray-500 uppercase tracking-wide">
      {label}
    </h3>
    <p className={`mt-0.5 text-sm ${valueClass}`}>{value || "-"}</p>
  </div>
);

export default add_ItemDeptMst;

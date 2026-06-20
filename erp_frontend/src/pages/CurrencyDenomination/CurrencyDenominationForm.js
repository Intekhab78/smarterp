import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { axios_post } from "../../axios";
import { ToastMassage } from "../../toast";

const denominationFields = [
  "Denomination_2000",
  "Denomination_1000",
  "Denomination_500",
  "Denomination_200",
  "Denomination_100",
  "Denomination_50",
  "Denomination_20",
  "Denomination_10",
  "Denomination_5",
  "Denomination_2",
  "Denomination_1",
  "Fills_05",
  "Fills_025",
];

const CurrencyDenominationForm = () => {
  const [countries, setCountries] = useState([]);
  const [denominationList, setDenominationList] = useState([]);
  const [showList, setShowList] = useState(false);

  const [form, setForm] = useState({
    currency_country: "",
    currency: "",
    ...denominationFields.reduce(
      (acc, field) => ({ ...acc, [field]: false }),
      {}
    ),
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchDenominationList = async () => {
    const response = await axios_post(true, "currencyDenomination/list");
    if (response) {
      if (response.status) {
        setDenominationList(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchcountryList = async () => {
    const response = await axios_post(true, "country/list");
    if (response) {
      if (response.status) {
        setCountries(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    fetchcountryList();
    fetchDenominationList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/currencyDenomination/store`,
        form
      );

      toast.success("Denomination record has been successfully saved.");
      fetchDenominationList(); // refresh the list after saving

      setForm({
        currency_country: "",
        currency: "",
        ...denominationFields.reduce(
          (acc, field) => ({ ...acc, [field]: false }),
          {}
        ),
      });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong while saving.");
      }
      console.error("Error saving data:", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-8 bg-white shadow-md rounded-xl">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Currency Denomination Setup
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm"
        >
          {/* Country Dropdown */}
          <div>
            <label className="block text-gray-600 mb-1">Currency Country</label>
            <select
              name="currency_country"
              value={form.currency_country}
              onChange={(e) => {
                const selectedCountry = countries.records?.find(
                  (country) => country.name === e.target.value
                );
                setForm((prev) => ({
                  ...prev,
                  currency_country: selectedCountry?.name || "",
                  currency: selectedCountry?.currency_code || "",
                }));
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              {countries.records?.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Input */}
          <div>
            <label className="block text-gray-600 mb-1">Currency Code</label>
            <input
              name="currency"
              value={form.currency}
              readOnly
              placeholder="e.g., INR"
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="hidden lg:block"></div>

          {/* Denomination Section */}
          <div className="col-span-full mt-4">
            <h3 className="text-gray-700 font-medium mb-2">
              Select Available Denominations
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {denominationFields.map((field) => (
                <label
                  key={field}
                  className="flex items-center space-x-2 text-gray-600"
                >
                  <input
                    type="checkbox"
                    name={field}
                    checked={form[field]}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>{field.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-full flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Show List Button */}
      <div className="max-w-4xl mx-auto mt-4 text-right px-4">
        <button
          onClick={() => setShowList(!showList)}
          className="text-sm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-all"
        >
          {showList ? "Hide Denomination List" : "Show All Denominations"}
        </button>
      </div>

      {/* Denomination Table */}
      {showList && (
        <div className="max-w-6xl mt-6 bg-white shadow-md rounded-xl p-4 overflow-auto mx-12">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            All Saved Denominations
          </h3>
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Country</th>
                <th className="border px-3 py-2">Currency</th>
                {denominationFields.map((field) => (
                  <th
                    key={field}
                    className="border px-3 py-2 whitespace-nowrap"
                  >
                    {field.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {denominationList.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{item.currency_country}</td>
                  <td className="border px-3 py-2">{item.currency}</td>
                  {denominationFields.map((field) => (
                    <td key={field} className="border px-3 py-2 text-center">
                      {item[field.toLowerCase()] === 1 ? "✓" : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CurrencyDenominationForm;

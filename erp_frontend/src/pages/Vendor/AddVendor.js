import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";
import { useNavigate } from "react-router-dom";
import { axios_get, axios_post } from "../../axios";

const AddVendor = () => {
  const navigate = useNavigate();

  const [vendorData, setVendorData] = useState({
    organisation_id: 0,
    vendor_code: "",
    vendor_type: "Other",
    firstname: "",
    lastname: "",
    VendorEmail: "",
    VendorMobileNumbe: "",
    VendorDocumentName: "",

    company_name: "",
    email: "",
    mobile: "",
    address1: "",
    trade_license_upload: null,
    tax_certificate: null,
    import_license_no: "",
    city: "",
    state: "",
    zip: "",
    bank_name: "",
    Account_no: "",
    remarks: "",
    website: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setVendorData({ ...vendorData, [name]: files[0] });
  };

  const OrderNuberRange = async () => {
    let params = {
      function_for: "supplier",
    };
    const response = await axios_post(
      true,
      "code_setting/get-next-comming-code",
      params
    );
    console.log("response data is-------------", response.data);

    if (response) {
      if (response.status) {
        setVendorData((prevData) => ({
          ...prevData,
          vendor_code: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    OrderNuberRange();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("vendorData-------------", vendorData);

    try {
      const formData = new FormData();
      Object.keys(vendorData).forEach((key) => {
        formData.append(key, vendorData[key]);
      });

      await axios.post(`${constantApi.baseUrl}/vendor/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Vendor saved successfully!");
      navigate("/vendor");
      setVendorData({ ...vendorData, organisation_id: "", vendor_code: "" });
    } catch (error) {
      console.error(error);
      alert("Error saving vendor.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="min-h-screen bg-gray-50 flex justify-center py-6">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 flex items-center justify-between shadow-md">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <i className="fas fa-user-tie text-white/90"></i>
              Add Vendor
            </h2>
            <button
              onClick={() => navigate("/vendor")}
              className="bg-white/90 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-md shadow hover:bg-white transition"
            >
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Scrollable Form Section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[80vh] text-sm">
              {/* Personal Details */}
              <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1.5">
                  Company Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Vendor Code
                    </label>
                    <input
                      type="text"
                      name="vendor_code"
                      disabled
                      value={vendorData.vendor_code}
                      onChange={handleChange}
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-md px-3 py-2 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Vendor Type
                    </label>
                    <select
                      name="vendor_type"
                      value={vendorData.vendor_type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Transport">Transport</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Food">Food</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">
                      {" "}
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={vendorData.company_name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={vendorData.website}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={vendorData.mobile}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-600">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={vendorData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1.5">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={vendorData.firstname}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={vendorData.lastname}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Vendor Email
                    </label>
                    <input
                      type="email"
                      name="VendorEmail"
                      value={vendorData.VendorEmail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Vendor Mobile
                    </label>
                    <input
                      type="text"
                      name="VendorMobileNumber"
                      value={vendorData.VendorMobileNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Vendor Document Name
                    </label>
                    <input
                      type="text"
                      name="VendorDocumentName"
                      value={vendorData.VendorDocumentName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1.5">
                  Address Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block mb-1 text-gray-600">Address</label>
                    <textarea
                      name="address1"
                      rows={2}
                      value={vendorData.address1}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">City</label>
                    <input
                      type="text"
                      name="city"
                      value={vendorData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">State</label>
                    <input
                      type="text"
                      name="state"
                      value={vendorData.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">ZIP</label>
                    <input
                      type="text"
                      name="zip"
                      value={vendorData.zip}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1.5">
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={vendorData.bank_name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Account No
                    </label>
                    <input
                      type="text"
                      name="Account_no"
                      value={vendorData.Account_no}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1.5">
                  Additional Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Trade License
                    </label>
                    <input
                      type="file"
                      name="trade_license_upload"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Tax Certificate
                    </label>
                    <input
                      type="file"
                      name="tax_certificate"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">
                      Import License No
                    </label>
                    <input
                      type="text"
                      name="import_license_no"
                      value={vendorData.import_license_no}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block mb-1 text-gray-600">Remarks</label>
                    <textarea
                      name="remarks"
                      rows={2}
                      value={vendorData.remarks}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">Status</label>
                    <select
                      name="status"
                      value={vendorData.status}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium shadow hover:bg-blue-700 transition"
                >
                  Save Vendor
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddVendor;

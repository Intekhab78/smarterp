import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import constantApi from "constantApi";
import { axios_get } from "../../axios";

const ViewVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendorData, setVendorData] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        // setLoading(true);
        const response = await axios_get(true, `vendor/view/${id}`);
        console.log("response data is ----------------", response);

        setVendorData(response.data);
      } catch (error) {
        console.error("Error fetching vendor:", error);
      }
    };
    fetchVendor();
  }, [id]);

  if (!vendorData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="flex justify-center py-20 text-gray-500">
          Loading vendor details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <div className="min-h-screen bg-gray-50 flex justify-center py-6">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 flex items-center justify-between shadow-md">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <i className="fas fa-user-tie text-white/90"></i>
              View Vendor
            </h2>
            <button
              onClick={() => navigate("/vendor")}
              className="bg-white/90 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-md shadow hover:bg-white transition"
            >
              Back
            </button>
          </div>

          {/* Vendor Details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[80vh] text-sm">
            {/* Company Details */}
            <Section title="Company Details">
              <Info label="Vendor Code" value={vendorData.vendor_code} />
              <Info label="Vendor Type" value={vendorData.vendor_type} />
              <Info label="Company Name" value={vendorData.company_name} />
              <Info label="Website" value={vendorData.website} />
              <Info label="Mobile" value={vendorData.mobile} />
              <Info label="Email" value={vendorData.email} />
            </Section>

            {/* Contact Details */}
            <Section title="Contact Details">
              <Info label="First Name" value={vendorData.firstname} />
              <Info label="Last Name" value={vendorData.lastname} />
              <Info label="Vendor Email" value={vendorData.VendorEmail} />
              <Info
                label="Vendor Mobile"
                value={vendorData.VendorMobileNumber}
              />
              <Info
                label="Vendor Document Name"
                value={vendorData.VendorDocumentName}
              />
            </Section>

            {/* Address Details */}
            <Section title="Address Details">
              <Info label="Address" value={vendorData.address1} wide />
              <Info label="City" value={vendorData.city} />
              <Info label="State" value={vendorData.state} />
              <Info label="ZIP" value={vendorData.zip} />
            </Section>

            {/* Bank Details */}
            <Section title="Bank Details">
              <Info label="Bank Name" value={vendorData.bank_name} />
              <Info label="Account No" value={vendorData.Account_no} />
            </Section>

            {/* Additional Info */}

            <Section title="Additional Info">
              <Info
                label="Trade License"
                value={
                  <div className="flex items-center gap-3">
                    <span>{vendorData.trade_license_upload}</span>
                    {vendorData.trade_license_upload && (
                      <a
                        href={`${constantApi.imageUrl}/vendor_docs/${vendorData.trade_license_upload}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </a>
                    )}
                  </div>
                }
              />

              <Info
                label="Tax Certificate"
                value={
                  <div className="flex items-center gap-3">
                    <span>{vendorData.tax_certificate}</span>
                    {vendorData.tax_certificate && (
                      <a
                        href={`${constantApi.imageUrl}/vendor_docs/${vendorData.tax_certificate}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </a>
                    )}
                  </div>
                }
              />

              <Info
                label="Import License No"
                value={vendorData.import_license_no}
              />
              <Info label="Remarks" value={vendorData.remarks} wide />
              <Info label="Status" value={vendorData.status} />
            </Section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Reusable small components for cleaner code
const Section = ({ title, children }) => (
  <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
    <h3 className="text-base font-semibold text-gray-800 mb-3 border-b pb-1.5">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
  </div>
);

const Info = ({ label, value, wide }) => (
  <div className={wide ? "md:col-span-3" : ""}>
    <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
    <p className="border border-gray-200 rounded-md px-3 py-2 bg-gray-100 text-gray-700">
      {value || "-"}
    </p>
  </div>
);

export default ViewVendor;

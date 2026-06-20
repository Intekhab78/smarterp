import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constantApi from "../constantApi";

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await axios.post(`${constantApi.baseUrl}/customer/list`);

      // Customer list is inside data.records
      if (res.data?.data?.records) {
        setCustomers(res.data.data.records);
      } else {
        console.error("Unexpected API response:", res.data);
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return <p className="p-4 text-lg">Loading Customers...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="space-y-4">
          {customers.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/customer/${c.id}`)}
              className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
            >
              <h2 className="text-xl font-bold mb-2">
                {c.first_name} {c.last_name}
              </h2>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <Field label="Customer Code" value={c.customer_code} />
                <Field label="Phone" value={c.phone} />

                <Field label="Alternate Phone" value={c.alternate_phone} />
                <Field label="Email" value={c.email} />

                <Field label="DOB" value={c.dob} />
                <Field label="Gender" value={c.gender} />

                <Field label="Billing Address" value={c.billing_address} />
                <Field label="Shipping Address" value={c.shipping_address} />

                <Field label="City" value={c.city} />
                <Field label="State" value={c.state} />
                <Field label="Country" value={c.country} />
                <Field label="Zipcode" value={c.zipcode} />

                <Field label="GST Number" value={c.gst_number} />
                <Field label="Customer Type" value={c.customer_type} />

                <Field label="Loyalty Points" value={c.loyalty_points} />
                <Field label="Status" value={c.status} />

                <Field label="Created At" value={c.created_at} />
                <Field label="Updated At" value={c.updated_at} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🔹 Reusable Field Component
function Field({ label, value }) {
  return (
    <div>
      <span className="font-semibold text-gray-700">{label}: </span>
      <span className="text-gray-900">{value || "N/A"}</span>
    </div>
  );
}

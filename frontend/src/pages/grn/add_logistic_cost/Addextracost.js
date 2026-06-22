import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { axios_post } from "../../../axios";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Addextracost() {
  const navigate = useNavigate();
  const params = useParams();

  const [grnDetails, setGrnDetails] = useState([]); // store items list
  const [grnData, setGrnData] = useState([]); // store items list
  const [companyId, setCompanyId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [extraCost, setExtraCost] = useState([
    {
      grn_number: "",
      vendor_type: "",
      vendor_name: "",
      cost_type: "Freight Charges",
      supplier: "",
      mode_of_payment: "Cash",
      cheque_number: "",
      bank_name: "",
      amount: "",
      number_of_item_types: "",
      remarks: "",
      date: "",
    },
  ]);
  const [openModal, setOpenModal] = useState(false); // modal control

  const [formData, setFormData] = useState({
    grn_number: "",
    customer_id: "",
    customer_name: "",
  });

  const [vendors, setVendors] = useState([]);
  const [addedExtraCost, setAddedExtraCost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const [filteredNames, setFilteredNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  // ✅ Fetch vendors on load
  const getdetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "vendor/list");

    if (response) {
      if (response.status) {
        const records = response?.data?.records || [];
        setVendors(records);
      } else {
        console.error(response.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getdetails();
  }, []);

  // ✅ Update vendor names when type changes
  useEffect(() => {
    if (selectedType) {
      const filtered = vendors.filter((v) => v.vendor_type === selectedType);
      setFilteredNames(filtered);
      setSelectedName(""); // reset name on type change
    } else {
      setFilteredNames([]);
      setSelectedName("");
    }
  }, [selectedType, vendors]);

  // ✅ Logistics cost options
  const logisticsCosts = [
    { label: "Freight Charges", id: 1 },
    { label: "Fuel Surcharge", id: 2 },
    { label: "Warehousing Fees", id: 3 },
    { label: "Customs Duties", id: 4 },
    { label: "Handling Charges", id: 5 },
    { label: "Packaging Costs", id: 6 },
    { label: "Insurance", id: 7 },
    { label: "Delivery Charges", id: 8 },
    { label: "Demurrage Fees", id: 9 },
    { label: "Import/Export Taxes", id: 10 },
  ];

  // Fetch GRN details
  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "grn/details", {
        id: params.id,
      });
      console.log("fetchOrderDetails response:", response);
      setGrnData(response.data);
      setAddedExtraCost(response.data.extra_costs);

      if (response?.status) {
        const data = response.data;

        setFormData({
          grn_number: data?.grn_number || "",
          customer_id: data?.customer_id || "",
          customer_name:
            (data?.customer?.firstname || "") +
            " " +
            (data?.customer?.lastname || ""),
        });
        // ✅ Save company and location IDs
        setCompanyId(data?.company_id || "");
        setLocationId(data?.location_id || "");

        setExtraCost((prev) =>
          prev.map((r) => ({
            ...r,
            grn_number: data?.grn_number || "",
            supplier:
              (data?.customer?.firstname || "") +
              " " +
              (data?.customer?.lastname || ""),
            number_of_item_types: data?.grn_details?.length || 0,
          })),
        );

        setGrnDetails(data?.grn_details || []);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);
  console.log("addedExtraCost:", addedExtraCost);

  // Handle input changes in extra cost extraCost
  const handleChange = (index, field, value) => {
    const updatedExtraCost = [...extraCost];
    updatedExtraCost[index][field] = value;
    setExtraCost(updatedExtraCost);
  };

  // Add a new extra cost row
  const addRow = () => {
    setExtraCost([
      ...extraCost,
      {
        grn_number: formData.grn_number,
        cost_type: "Freight Charges",
        supplier: formData.customer_name,
        mode_of_payment: "Cash",
        cheque_number: "",
        bank_name: "",
        amount: "",
        number_of_item_types: grnDetails?.length,
        remarks: "",
        date: "",
        company_id: companyId, // ✅ added
        location_id: locationId, // ✅ added
      },
    ]);
  };

  // Remove a row
  const removeRow = (index) => {
    setExtraCost(extraCost.filter((_, i) => i !== index));
  };

  // Calculate total extra amount
  const totalAmount = extraCost.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0,
  );

  // Step 1: Compute total value of all items
  const totalItemValue = grnDetails.reduce(
    (sum, item) =>
      sum + parseFloat(item.rate || 0) * parseFloat(item.item_qty || 0),
    0,
  );

  // Step 2: Map each item with extra charges allocated by value
  const itemsWithCost = grnDetails.map((item) => {
    const qty = parseFloat(item.item_qty || 0);
    const rate = parseFloat(item.rate || 0);
    const itemValue = rate * qty;

    // Extra charges proportionally by item value
    const extraCost = totalItemValue
      ? (itemValue / totalItemValue) * totalAmount
      : 0;

    const totalCost = itemValue + extraCost;

    return {
      ...item,
      extraCostPerItem: (extraCost / qty).toFixed(2), // extra per unit
      totalCost: totalCost.toFixed(2),
    };
  });

  // Handle form submit

  const handleSubmit = (e) => {
    e.preventDefault();

    const grnCosts = {
      id: params.id,
      company_id: companyId,
      location_id: locationId,
      header: {
        grn_number: formData.grn_number,
        customer_id: formData.customer_id,
        customer_name: formData.customer_name,
        total_amount: totalAmount,
      },
      extraCost: extraCost.map((row) => ({
        grn_number: row.grn_number,
        vendor_type: row.vendor_type,
        vendor_name: row.vendor_name,
        cost_type: row.cost_type,
        mode_of_payment: row.mode_of_payment,
        cheque_number: row.cheque_number,
        bank_name: row.bank_name,
        amount: row.amount,
        number_of_item_types: row.number_of_item_types,
        remarks: row.remarks,
        date: row.date,
        company_id: companyId,
        location_id: locationId,
      })),
      itemsWithCost,
    };

    axios_post(true, "grn/update", grnCosts)
      .then((res) => {
        toast.success("Extra Cost added successfully!"); // ✅ show success message
        // navigate("/grn"); // ✅ navigate after success
        fetchOrderDetails();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong!"); // optional error toast
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <form onSubmit={handleSubmit} method="POST" action="#">
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <Grid xs={12} container spacing={0}>
                    <Grid item xs={6}>
                      <MDTypography variant="h6" color="white">
                        <Icon fontSize="small">shopping_cart</Icon>
                        Add extra cost
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} className="text-right space-x-2">
                      <MDTypography component={Link} to="/grn">
                        <MDButton variant="gradient" color="light">
                          Back
                        </MDButton>
                      </MDTypography>

                      {/* ✅ New View Items button */}
                      <MDButton
                        variant="gradient"
                        color="success"
                        onClick={() => setOpenModal(true)}
                      >
                        View Items
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>

                <div className="overflow-x-auto p-4">
                  {/* ✅ GRN Table */}
                  <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full text-sm border border-gray-200">
                      <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            GRN Number
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            GRN Date
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Vendor Name
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-700">
                            Total Unit
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-700">
                            Total Tax
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-700">
                            Total Price
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100 bg-white">
                        <tr
                          key={grnData.grn_number}
                          className="hover:bg-blue-50 transition-all duration-200"
                        >
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {grnData.grn_number}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {grnData.grn_date}
                          </td>
                          <td className="px-4 py-3 text-gray-700 font-medium">
                            {grnData?.vendor_details?.firstname}{" "}
                            {grnData?.vendor_details?.lastname}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            {grnData?.total_qty}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-green-600">
                            {grnData.total_vat}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-600">
                            {grnData.total_net}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            GRN Number
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Cost Type
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Vendor Name
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Vendor Type
                          </th>

                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Mode of Payment
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Total Item Types
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Remarks
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {addedExtraCost.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.date}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.grn_number}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.cost_type}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.vendor_name}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.vendor_type}
                            </td>

                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.mode_of_payment}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.number_of_item_types}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.remarks || "-"}
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-700">
                              {item.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <MDBox pt={2} pb={3} px={0}>
                    {/* ✅ Row Section */}

                    <div className="overflow-x-auto border rounded-lg shadow-sm ">
                      <div className="min-w-[920px] space-y-2 p-4">
                        {extraCost.map((row, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4   p-2 text-xs shadow-sm hover:shadow-md transition"
                          >
                            {/* Vendor Type Dropdown */}
                            <select
                              value={row.vendor_type}
                              className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "vendor_type",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="">Select Vendor Type</option>
                              {[
                                ...new Set(vendors.map((v) => v.vendor_type)),
                              ].map((type, idx) => (
                                <option key={idx} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>

                            {/* Vendor Name Dropdown */}
                            <select
                              value={row.vendor_name}
                              className="border p-2 rounded-md ml-2 focus:ring-2 focus:ring-blue-400"
                              onChange={(e) => {
                                const selectedVendor = vendors.find(
                                  (v) =>
                                    v.firstname + " " + v.lastname ===
                                    e.target.value,
                                );
                                handleChange(
                                  index,
                                  "vendor_name",
                                  selectedVendor
                                    ? selectedVendor.firstname +
                                        " " +
                                        selectedVendor.lastname
                                    : "",
                                );
                              }}
                              disabled={!row.vendor_type}
                            >
                              <option value="">Select Vendor Name</option>
                              {vendors
                                .filter(
                                  (v) => v.vendor_type === row.vendor_type,
                                )
                                .map((vendor) => (
                                  <option
                                    key={vendor.id}
                                    value={
                                      vendor.firstname + " " + vendor.lastname
                                    }
                                  >
                                    {vendor.firstname} {vendor.lastname}
                                  </option>
                                ))}
                            </select>

                            {/* Cost type */}
                            <select
                              value={row.cost_type}
                              onChange={(e) =>
                                handleChange(index, "cost_type", e.target.value)
                              }
                              className="border p-2 rounded-md w-40 focus:ring-2 focus:ring-blue-400"
                            >
                              {logisticsCosts.map((cost) => (
                                <option key={cost.id} value={cost.label}>
                                  {cost.label}
                                </option>
                              ))}
                            </select>

                            {/* Payment */}
                            <select
                              value={row.mode_of_payment}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "mode_of_payment",
                                  e.target.value,
                                )
                              }
                              className="border p-2 rounded-md w-24 focus:ring-2 focus:ring-blue-400"
                            >
                              <option value="Cash">Cash</option>
                              <option value="Cheque">Cheque</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Cheque No."
                              value={row.cheque_number}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "cheque_number",
                                  e.target.value,
                                )
                              }
                              className="border p-2 rounded-md w-24 focus:ring-2 focus:ring-blue-400"
                              disabled={row.mode_of_payment === "Cash"}
                            />

                            <input
                              type="text"
                              placeholder="Bank Name"
                              value={row.bank_name}
                              onChange={(e) =>
                                handleChange(index, "bank_name", e.target.value)
                              }
                              className="border p-2 rounded-md w-28 focus:ring-2 focus:ring-blue-400"
                              disabled={row.mode_of_payment === "Cash"}
                            />

                            <input
                              type="number"
                              placeholder="Amount"
                              value={row.amount}
                              onChange={(e) =>
                                handleChange(index, "amount", e.target.value)
                              }
                              className="border p-2 rounded-md w-24 focus:ring-2 focus:ring-blue-400"
                            />

                            <input
                              type="text"
                              placeholder="Remarks"
                              value={row.remarks}
                              onChange={(e) =>
                                handleChange(index, "remarks", e.target.value)
                              }
                              className="border p-2 rounded-md w-36 focus:ring-2 focus:ring-blue-400"
                            />

                            <input
                              type="date"
                              value={row.date}
                              onChange={(e) =>
                                handleChange(index, "date", e.target.value)
                              }
                              className="border p-2 rounded-md w-28 focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                              type="button"
                              onClick={() => removeRow(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                            >
                              ✖
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add Row Button */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={addRow}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium shadow-sm"
                      >
                        + Add Row
                      </button>
                    </div>

                    {/* ✅ Total and Save Section */}
                    <div className="flex justify-end mt-6">
                      <div className="bg-blue-50 border rounded-lg shadow-md p-4 w-72 text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          Total Amount:{" "}
                          <span className="text-xl text-green-600 font-bold">
                            {totalAmount.toFixed(2)}
                          </span>
                        </p>
                        <button
                          type="submit"
                          className="mt-3 bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 text-sm font-medium shadow-sm"
                        >
                          💾 Save
                        </button>
                      </div>
                    </div>
                  </MDBox>
                </div>
              </Card>
            </form>
          </Grid>
        </Grid>
      </MDBox>

      {/* ✅ Modal for View Items */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          className="absolute top-1/2 left-1/2 bg-white rounded-md shadow-lg p-6"
          style={{ transform: "translate(-50%, -50%)", width: "80%" }}
        >
          <h2 className="text-lg font-bold mb-4">Items List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="border px-3 py-2">Item Name</th>
                  <th className="border px-3 py-2">Quantity</th>
                  <th className="border px-3 py-2">Rate</th>
                  <th className="border px-3 py-2">Net</th>
                  <th className="border px-3 py-2">Extra Cost</th>
                  <th className="border px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {grnDetails.length > 0 ? (
                  grnDetails.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">
                        {item?.itemLocationModel?.item_name || "N/A"}
                      </td>
                      <td className="border px-3 py-2">{item.item_qty}</td>
                      <td className="border px-3 py-2">{item.rate}</td>
                      <td className="border px-3 py-2">{item.item_net}</td>
                      <td className="border px-3 py-2">
                        {item.item_extra_cost}
                      </td>
                      <td className="border px-3 py-2">
                        {item.item_grand_total}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center border px-3 py-2 text-gray-500"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-4">
            <MDButton
              variant="gradient"
              color="error"
              onClick={() => setOpenModal(false)}
            >
              Close
            </MDButton>
          </div>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Addextracost;

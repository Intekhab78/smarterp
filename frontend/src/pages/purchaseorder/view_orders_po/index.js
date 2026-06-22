import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRadioGroup } from "@mui/material/RadioGroup";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import routes from "routes";
import { axios_get, axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import { useParams } from "react-router-dom";

const payment_term = [
  { label: "Cash", value: "1" },
  { label: "BILL TO BILL PAYMENT AR", value: "2" },
  { label: "Net 90 Days", value: "3" },
  { label: "NET 30 DAYS", value: "4" },
  { label: "Net 60 Days", value: "5" },
  { label: "Cash on Delivery", value: "6" },
  { label: "Net 45 Days", value: "7" },
];
//radiobutton
const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  ".MuiFormControlLabel-label":
    checked &&
    {
      //   color: theme.palette.primary.main,
    },
}));

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();
  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }
  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

function View_Orders_po() {
  const navigate = useNavigate();
  const params = useParams();

  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSalesmanValue, setAutocompleteSalesmanValue] =
    useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
  const [item, setItem] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    customer_lpo: "",
    order_number: "",
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    status: "Open",
    order_type: "Normal",
    any_comment: "",
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "purchase_order/details", {
        id: params.id,
      });
      console.log("response data is -------------", response.data);

      if (response.status) {
        const orderData = response.data;
        setSelectedVendor(response.data?.vendor_details);
        setFormData({
          ...formData,
          id: orderData.id,
          customer_id: orderData.customer_id,
          customer_lob: orderData.customer_lob,
          salesman_id: orderData.salesman_id,
          customer_lpo: orderData.customer_lpo,
          order_number: orderData.order_number,
          delivery_date: orderData.delivery_date,
          payment_terms: orderData.payment_terms,
          due_date: orderData.due_date,
          status: orderData.status,
          order_type: orderData.order_type,
          any_comment: orderData.any_comment,
        });
        let AutocompleteValueCustomer = {
          id: orderData?.vendor_details?.id,
          vendor_code: orderData?.vendor_details?.vendor_code,
          user_id: orderData?.vendor_details?.id,
          firstname: orderData?.vendor_details?.firstname,
          lastname: orderData?.vendor_details?.lastname,
          email: orderData?.vendor_details?.email,
        };
        setAutocompleteValue(AutocompleteValueCustomer);

        let AutocompleteValueSalesman = {
          id: orderData?.salesman?.id,
          salesman_code: orderData?.salesman?.salesmanInfo?.salesman_code,
          user_id: orderData?.salesman?.salesmanInfo?.user_id,
          users: {
            firstname: orderData?.salesman?.firstname,
            lastname: orderData?.salesman?.lastname,
            email: orderData?.salesman?.email,
          },
        };
        setAutocompleteSalesmanValue(AutocompleteValueSalesman);

        let AutocompletePayment = {
          label: orderData.payment_terms.name,
          value: orderData.payment_terms.id,
        };
        setAutocompletePaymentValue(AutocompletePayment);

        //items
        let order_details = [];
        for (
          let index = 0;
          index < orderData.po_order_details.length;
          index++
        ) {
          const element = orderData.po_order_details[index];
          let item_uom = element.itemLocationModel?.item_uom?.name;
          // const filteredObject = item_uom.find(
          //   (item) => item.item_uom_id === element.item_uom_id
          // );
          let obje = {
            id: index + 1,
            item_id: element.item_id,
            item_code: element.itemLocationModel?.item_code,
            item_name: element.itemLocationModel?.item_name,

            uom: element.itemLocationModel?.item_uom?.name,
            item_uom: element.itemLocationModel?.item_uom?.name,
            expiry_delivery_date: element.expiry_delivery_date,
            purchase_cost_per_unit: element.purchase_cost_per_unit,
            hsn_code: element.hsn_code,
            receiving_site: element.receiving_site,
            itemtype: element.itemtype,
            landed_cost_per_unit: element.landed_cost_per_unit,
            quantity: element?.item_qty,
            price: element.item_gross,
            excise: element.item_excise,
            discount: element.item_discount_amount,
            net: element.item_net,
            // net: element.itemcost,
            vat: parseFloat(element.itemLocationModel?.tax_master_1?.taxcal),
            taxa_ble: parseFloat(element.taxa_ble).toFixed(2),
            total: parseFloat(element.item_grand_total).toFixed(2),
            actions: "",
            newValue: element.itemLocationModel,
            discounttype: element.discounttype,
          };
          order_details.push(obje);
        }
        setRows(order_details);
        console.log("order details is ------------", order_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    fetchOrderDetails();
  }, []);

  const ItemList = async () => {
    const response = await axios_post(true, "item_location_master/list");

    // console.log("response is from item_location_master", response.data);

    if (response) {
      if (response.status) {
        setItem(response.data); // store full data
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const CustomerList = async () => {
    const response = await axios_post(true, "vendor/list");
    if (response) {
      if (response.status) {
        setCustomerList(response.data.records);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const SalesmanList = async () => {
    const response = await axios_post(true, "salesman/list");
    if (response) {
      if (response.status) {
        setSalesmanList(response.data.records);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const calculateSums1 = (items) => {
    return items.reduce(
      (sums, item) => {
        const itemTax = parseFloat(item?.newValue?.tax_master_1?.taxcal) || 0;
        const quantity = parseFloat(item.quantity) || 1.0;
        const price = parseFloat(item.price) || 0.0;
        const gross = price * quantity;

        // Calculate discount as a percentage
        const discountPercent = parseFloat(item.discount) || 0.0;
        const discountAmount = (gross * discountPercent) / 100;

        const netTotal = gross - discountAmount;
        const taxAmount = (netTotal * itemTax) / 100;
        const total = netTotal + taxAmount;

        sums.initialTotal += gross;
        sums.discount += discountAmount;
        sums.net += netTotal;
        sums.vat += taxAmount;
        sums.total += total;

        return sums;
      },
      {
        initialTotal: 0.0,
        excise: 0.0,
        discount: 0.0,
        net: 0.0,
        vat: 0.0,
        total: 0.0,
      },
    );
  };

  const calculateSums = (items = []) => {
    return items.reduce(
      (sums, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        const gross = quantity * price; // base amount before discounts

        // Discount logic
        const discountValue = parseFloat(item.discount) || 0;
        const discountAmount =
          item.discounttype === "Percentage"
            ? (gross * discountValue) / 100
            : discountValue;

        const netTotal = gross - discountAmount;

        // Tax (VAT) and excise
        const vatPercent =
          item.vat && !isNaN(parseFloat(item.vat))
            ? parseFloat(item.vat)
            : parseFloat(item?.newValue?.tax_master_1?.taxcal) || 0;
        const excise = parseFloat(item.excise) || 0;

        const vatAmount = (netTotal * vatPercent) / 100;
        const total = netTotal + vatAmount + excise;

        // Accumulate all values
        sums.initialTotal += gross;
        sums.discount += discountAmount;
        sums.net += netTotal;
        sums.vat += vatAmount;
        sums.excise += excise;
        sums.total += total;

        return sums;
      },
      {
        initialTotal: 0,
        excise: 0,
        discount: 0,
        net: 0,
        vat: 0,
        total: 0,
      },
    );
  };

  // console.log("sums is ------------", sums);

  const sums = calculateSums(rows);

  const handleBack = () => {
    navigate("/purchaseorder");
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-blue-600 rounded-lg px-4 py-3 shadow-md">
          <h2 className="text-white text-sm md:text-base font-semibold flex items-center gap-2">
            <span className="material-icons text-sm">shopping_cart</span>
            View Purchase Order
          </h2>
          <a
            href="/purchaseorder"
            className="bg-white text-blue-600 font-medium px-3 py-1.5 text-sm rounded-md shadow hover:bg-gray-100 transition"
          >
            Back
          </a>
        </div>

        {/* Vendor / Order Info */}
        {/* Vendor / Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Vendor Info */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-sm hover:shadow-lg transition">
            <h3 className="text-gray-600 font-semibold mb-3 text-xs md:text-sm uppercase tracking-wide">
              Vendor
            </h3>
            {selectedVendor ? (
              <div className="space-y-1 text-gray-700">
                <p className="font-medium">
                  <span className="text-gray-400">Company </span>{" "}
                  {/* {selectedVendor.vendor_code} */}
                  {"-"} {selectedVendor.company_name}
                </p>
                <p className="text-gray-500 text-xs">
                  TAX No: {selectedVendor.import_license_no}
                </p>

                <p className="text-gray-500 text-xs">
                  Address: {selectedVendor.address1}
                </p>
                <p className="font-medium">
                  <span className="text-gray-400">Contact Person</span>{" "}
                  {/* {selectedVendor.vendor_code} */}
                  {"-"} {selectedVendor.firstname} {selectedVendor.lastname}
                </p>

                <p className="text-gray-500 text-xs">
                  <span className="text-black">Email:</span>{" "}
                  {selectedVendor.VendorEmail}
                  <span className="text-black"> Phone:</span>{" "}
                  {selectedVendor.VendorMobileNumber}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 italic">No Vendor Selected</p>
            )}
          </div>

          {/* Order Info */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-sm hover:shadow-lg transition space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-xs md:text-sm uppercase tracking-wide">
                Order Number
              </span>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {formData.order_number || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-xs md:text-sm uppercase tracking-wide">
                Date
              </span>
              <span className="text-gray-700 text-xs md:text-sm">
                {formData.delivery_date || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-xs md:text-sm uppercase tracking-wide">
                Employee
              </span>
              <span className="text-gray-700 text-xs md:text-sm">
                {autocompleteSalesmanValue
                  ? `${autocompleteSalesmanValue.salesman_code} - ${autocompleteSalesmanValue?.users?.firstname}`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-xs md:text-sm uppercase tracking-wide">
                Payment Terms
              </span>
              <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {autocompletePaymentValue?.label || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold text-xs md:text-sm uppercase tracking-wide">
                Supplier LPO
              </span>
              <span className="text-gray-700 text-xs md:text-sm">
                {formData.customer_lpo || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Table with Horizontal Scroll */}
        {/* Table with Horizontal Scroll */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-[1600px] w-full bg-white border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700 text-xs font-semibold border-b border-gray-200">
              <tr>
                {[
                  "ITEM CODE",
                  "ITEM NAME",
                  "UOM",
                  // "Sunit",
                  // "Item Type",
                  // "Currency",

                  "Scheme",
                  "Quantity",
                  "Price",
                  "Total",
                  "Discount Type",
                  "Discount",
                  "Net",
                  "Tax%",
                  "Tax Amt",
                  // "Purchase Cost per Unit",
                  // "Landed Cost per Unit",
                  "Total",
                ].map((header) => (
                  <th
                    key={header}
                    className={`px-3 py-2 text-left whitespace-nowrap border-r border-gray-200 last:border-r-0 ${
                      header === "ITEM NAME" ? "w-[400px] text-left" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows && rows.length > 0 ? (
                rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.newValue?.item_code || "-"}
                    </td>
                    <td className="px-3 py-2 text-left border-r border-gray-100 w-[400px]">
                      {row.item_name || "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.item_uom || "-"}
                    </td>
                    {/* <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.sunit || "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.itemtype || "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.currency || "-"}
                    </td> */}
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.skim || "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.quantity ?? "-"}
                    </td>

                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.price ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {parseFloat(row.quantity) * parseFloat(row.price)}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.discounttype || "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.discount ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.net ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.vat ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.taxa_ble ?? "-"}
                    </td>
                    {/* <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row.purchase_cost_per_unit ?? "-"}
                      {row?.itemLocationModel?.itemcost ?? "-"}
                    </td>
                    <td className="px-3 py-2 text-left  border-r border-gray-100">
                      {row?.itemLocationModel?.itemlanprice ?? "-"}
                    </td> */}
                    <td className="px-3 py-2 text-left ">{row.total ?? "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={17} className="text-left  py-6 text-gray-400">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <p className="block text-gray-700 font-medium mb-2">Vendor Notes</p>
        </div>
        {/* Vendor Note & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Vendor Note */}
          <div className="md:col-span-7">
            <textarea
              name="any_comment"
              value={formData.any_comment || ""}
              placeholder="Enter note..."
              className="w-full h-[180px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none bg-white"
            />
          </div>

          {/* Summary */}
          <div className="md:col-span-5 bg-gray-900 text-white rounded-lg p-4 shadow-md">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-gray-400">Total</p>
              <p className="font-medium">
                {parseFloat(sums.initialTotal).toFixed(2)}
              </p>
              <p className="text-gray-400">Discount</p>
              <p className="font-medium">
                {parseFloat(sums.discount).toFixed(2)}
              </p>
              <p className="text-gray-400">Net Total</p>
              <p className="font-medium">{parseFloat(sums.net).toFixed(2)}</p>
              <p className="text-gray-400">Tax</p>
              <p className="font-medium">{parseFloat(sums.vat).toFixed(2)}</p>
              <p className="pt-2 font-semibold text-gray-200">Total</p>
              <p className="pt-2 font-semibold text-yellow-400">
                {parseFloat(sums.total).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default View_Orders_po;

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

function edit_grn() {
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
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [Salesmans, setSalesmanList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    customer_id: "",
    customer_lob: "",
    salesman_id: "",
    company_id: "",
    location_id: "",
    customer_lpo: "",
    WebGLRenderingContext_number: "",
    delivery_date: "",
    payment_terms: "",
    due_date: "",
    vendor_invoice_no: "",
    vendor_invoice_date: "",
    delivery_note: "",
    status: "Open",
    grn_type: "Normal",
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "grn/details", {
        id: params.id,
      });
      console.log("response from fetchOrderDetails", response.data);

      if (response.status) {
        const orderData = response.data;
        setFormData({
          ...formData,
          id: orderData.id,
          customer_id: orderData.customer_id,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          customer_lob: orderData.customer_lob,
          salesman_id: orderData.salesman_id,
          customer_lpo: orderData.customer_lpo,
          grn_number: orderData.grn_number,
          delivery_date: orderData.grn_date,
          payment_terms: orderData.payment_terms,
          due_date: orderData.grn_due_date,
          vendor_invoice_no: orderData.vendor_invoice_no,
          // vendor_invoice_date: orderData.vendor_invoice_date,
          vendor_invoice_date: orderData.vendor_invoice_date
            ? orderData.vendor_invoice_date.split("T")[0] // ✅ fix here
            : "",
          delivery_note: orderData.delivery_note,
          status: orderData.status,
          grn_type_type: orderData.grn_type,
          current_stage_comment: orderData.current_stage_comment,
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }
        let AutocompleteValueCustomer = {
          id: orderData?.vendor_details?.id,
          vendor_code: orderData?.vendor_details?.vendor_code,
          firstname: orderData?.vendor_details?.firstname,
          lastname: orderData?.vendor_details?.lastname,
          email: orderData?.vendor_details?.email,
          import_license_no: orderData?.vendor_details?.import_license_no,
          address1: orderData?.vendor_details?.address1,
          mobile: orderData?.vendor_details?.mobile,
          // add any other fields you need here...
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
          label: orderData?.payment_terms?.name,
          value: orderData?.payment_terms?.id,
        };
        setAutocompletePaymentValue(AutocompletePayment);

        //items
        let grn_details = [];
        for (let index = 0; index < orderData?.grn_details?.length; index++) {
          const element = orderData.grn_details[index];

          console.log("element is ---------------------", element);

          let item_uom = element.itemLocationModel.item_main_prices;
          const filteredObject = item_uom.find(
            (item) => item.item_uom_id === element.item_uom_id
          );
          let obje = {
            id: index + 1,
            grn_details_id: element.id,
            item_id: element.item_id,
            item_code: element.itemLocationModel.item_code,
            item_name: element.itemLocationModel.item_name,
            uom: element?.item_uom_id,
            item_uom:
              element.itemLocationModel.item_main_prices[0].item_uom.name,
            quantity: element.item_qty,
            price: element.is_free == 1 ? 0.0 : element.item_gross,
            rate:
              element.is_free == 1
                ? 0.0
                : element.rate === null
                ? element.item_gross
                : element.rate,
            excise: element.is_free == 1 ? 0.0 : element.item_excise,
            discount: element.is_free == 1 ? 0.0 : element.item_discount_amount,
            net: element.is_free == 1 ? 0.0 : element.item_net,

            vat:
              element?.is_free == 1
                ? 0
                : parseFloat(element.itemLocationModel?.tax_master_1?.taxcal) ||
                  0.0,

            taxa_ble:
              element?.is_free == 1
                ? 0.0
                : (
                    (parseFloat(element?.item_net) *
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal || 0
                      )) /
                    100
                  ).toFixed(2),

            total:
              element.is_free == 1
                ? 0.0
                : (
                    parseFloat(element?.item_net) +
                    (parseFloat(element?.item_net) *
                      parseFloat(
                        element?.itemLocationModel?.tax_master_1?.taxcal || 0
                      )) /
                      100
                  ).toFixed(2),
            item_extra_cost:
              element.is_free == 1
                ? 0.0
                : (element.is_free == 1
                    ? 0.0
                    : parseFloat(element?.item_extra_cost)
                  ).toFixed(2),

            actions: "",
            newValue: element.itemLocationModel,
            newValue_uom: filteredObject
              ? filteredObject
              : element.itemLocationModel.item_main_prices[0],
            uom_list: element.itemLocationModel.item_main_prices,
            skim: element?.is_free == 1 ? "Free" : "None",
          };
          grn_details.push(obje);
        }
        console.log("grn details is ---------", grn_details);

        setRows(grn_details);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  console.log("from data is ----", formData);

  useEffect(() => {
    ItemList();
    CustomerList();
    SalesmanList();
    fetchcompanyList();

    fetchOrderDetails();
  }, []);

  const ItemList = async () => {
    const response = await axios_get(true, "item/dropdown-list");
    if (response) {
      if (response.status) {
        setItem(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  // ✅ Fetch company list
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response) {
      if (response.status) {
        const allCompanies = response.data;

        // Filter company with id = 21
        const matchedCompany = allCompanies.find(
          (company) => company.id === 21
        );

        console.log("matchedCompany------------", matchedCompany);

        if (matchedCompany) {
          setCompines([matchedCompany]); // show only that one
          // Fetch related locations
          fetchlocationList(matchedCompany.id);
        } else {
          ToastMassage("Company with ID 21 not found", "error");
        }
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  // ✅ Fetch locations based on company
  const fetchlocationList = async (company_id) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: company_id,
    });
    if (response) {
      if (response.status) {
        setlocations(response.data);
        console.log("location is ----------", response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const CustomerList = async () => {
    const response = await axios_post(true, "customer/list");
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

  const ItemSelectUom = (newValue, params) => {
    const updatedRows = rows.map((row) =>
      row.id === params.id
        ? {
            ...row,
            uom: newValue?.item_uom?.id,
            newValue_uom: newValue,
          }
        : row
    );
    setRows(updatedRows);
  };

  console.log("rows is form view grn", rows);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "company_id" && { location_id: "" }),
    }));
    if (name === "company_id") {
      fetchlocationList(value);
    }
  };
  const calculateSums = (items) => {
    return items.reduce(
      (sums, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseFloat(item.quantity) || 0;
        const gross = price * qty; // ✅ initial total (before discount/tax)
        const net = parseFloat(item.net) || 0;
        const tax = parseFloat(item.taxa_ble) || 0;
        const total = parseFloat(item.total) || 0;
        const extraCost = parseFloat(item.item_extra_cost) || 0;

        // derive discount amount if needed
        const discountAmount = gross - net;

        sums.initialTotal += gross;
        sums.discount += discountAmount;
        sums.net += net;
        sums.vat += tax;
        sums.total += total;
        sums.item_extra_cost += extraCost; // ✅ keep extra cost calc

        return sums;
      },
      {
        initialTotal: 0,
        discount: 0,
        net: 0,
        vat: 0,
        total: 0,
        item_extra_cost: 0, // ✅ initialized
      }
    );
  };

  const sums = calculateSums(rows);

  console.log("sums is---------------", sums);
  console.log("rows is---------------", rows);

  const handleBack = () => {
    navigate("/grn");
  };

  const headers = [
    // "ITEM CODE",
    "ITEM NAME",
    "UOM",
    "Quantity",
    "Scheme",
    "Price",
    "Rate",
    "Discount",
    "Net",
    "Tax%",
    "Tax Amt",
    "Total",
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center bg-sky-500 text-white px-6 py-3 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <span className="material-icons text-white">shopping_cart</span>
            <h2 className="text-lg font-semibold">View GRN</h2>
          </div>
          <a href="/grn">
            <button className="bg-white text-sky-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100">
              Back
            </button>
          </a>
        </div>

        {/* GRN Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            ["GRN Number", formData.grn_number],
            ["Company", compines.length > 0 ? compines[0].compdesc : "—"],
            ["Location", locations.length > 0 ? locations[0].locname : "—"],
            [
              "Vendor",
              `${autocompleteValue?.firstname || ""} ${
                autocompleteValue?.lastname || ""
              }`,
            ],
            ["Payment Terms", formData.payment_terms?.name],
            ["Vendor Document No", formData.customer_lpo],
            ["Delivery Date", formData.delivery_date],
            ["Due Date", formData.due_date],
            ["GRN Type", formData.grn_type],
            ["Vendor Invoice No", formData.vendor_invoice_no],
            ["Vendor Invoice Date", formData.vendor_invoice_date],
            ["Delivery Note No.", formData.delivery_note],
            ["Status", formData.status],
          ].map(([label, value], index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-lg p-3 shadow-sm"
            >
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className="text-base text-gray-800 font-semibold">
                {value || ""}
              </p>
            </div>
          ))}
        </div>

        {/* Vendor Info */}
        {/* Vendor Info */}
        {autocompleteValue && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700 mb-2">Vendor Details</h3>
            <p className="text-sm text-gray-700">
              <strong>TAX No:</strong>{" "}
              {autocompleteValue?.import_license_no || "—"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Address:</strong> {autocompleteValue?.address1 || "—"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Contact:</strong>{" "}
              {`${autocompleteValue?.firstname || ""} ${
                autocompleteValue?.lastname || ""
              }`.trim() || "—"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong> {autocompleteValue?.mobile || "—"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {autocompleteValue?.email || "—"}
            </p>
          </div>
        )}

        {/* Item Table */}
        <div className="w-full overflow-x-auto mt-8">
          <table className="min-w-[800px] w-full border border-gray-300 text-sm">
            <thead className="bg-blue-100">
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-2 py-2 text-left text-gray-700 font-semibold border-b border-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {/* <td className="p-2 border">{row.item_code}</td> */}
                    <td className="p-2 border">{row.item_name}</td>
                    <td className="p-2 border">{row.item_uom}</td>
                    <td className="p-2 border">{row.quantity}</td>
                    <td className="p-2 border">{row.scheme}</td>
                    <td className="p-2 border">{row.price}</td>
                    <td className="p-2 border">{row.rate}</td>
                    <td className="p-2 border">{row.discount}</td>
                    <td className="p-2 border">{row.net}</td>
                    <td className="p-2 border">{row.vat}</td>
                    <td className="p-2 border">{row.taxable}</td>
                    <td className="p-2 border">{row.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-300" />

        {/* Notes and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Note */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Vendor Notes
            </label>
            <div className="bg-white border border-gray-300 rounded p-2 min-h-[100px] text-gray-700">
              {formData.current_stage_comment || "—"}
            </div>
          </div>

          {/* Summary */}
          {/* Summary */}
          <div className="bg-black p-4 rounded-lg shadow text-white">
            <div className="flex justify-between py-1 text-sm">
              <span>Total</span>
              <span>{parseFloat(sums.initialTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Discount</span>
              <span>{parseFloat(sums.discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Net Total</span>
              <span>{parseFloat(sums.net).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Tax</span>
              <span>{parseFloat(sums.vat).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Extra Cost</span>
              <span>{parseFloat(sums.item_extra_cost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t mt-2 pt-2 text-base font-semibold">
              <span>Grand Total</span>
              <span>
                {parseFloat(sums.total + sums.item_extra_cost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default edit_grn;

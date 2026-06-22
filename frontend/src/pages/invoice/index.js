import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FaEye, FaEdit, FaFilePdf, FaMoneyBill } from "react-icons/fa";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { axios_post } from "../../axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MDBadge from "components/MDBadge";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField, Box, DialogContentText } from "@mui/material";
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ToastMassage } from "toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useMemo } from "react";
import MDInput from "components/MDInput";
import { convertToWords } from "../../components/Number";
import constantApi from "../../constantApi";
import { useRef } from "react";
import "./Receipt.css";

// import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/images/logos/jtserplogo.png"; // replace with actual path
// import qrCode from "./dummy_qr_code.png"; // optional QR code
import { generateInvoicePdf } from "../../utils/pdfUtils";
import { normalizeReceiptFromApi } from "utils/receiptUtils";
import { useReceipt } from "context/ReceiptContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const rows = [
  {
    id: 1,
    date: "",
    invoice_number: "",
    customer_code: "",
    customer_name: "",
    route_code: "",
    route_name: "",
    salesman_code: "",
    salesman_name: "",
    due_date: "",
    amount: "",
    approval: "",
    status: "",
    erp_status: "",
    invoice_type: "",
    action: "",
    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

export default function invoice() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [opened, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClosed = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { setReceipt, generateReceipt } = useReceipt();

  const ganratePdf = async (id) => {
    try {
      const response = await axios_post(true, "invoice/details", { id });
      generateInvoicePdf(response.data);
    } catch (err) {
      console.error("Error generating PDF", err);
    }
  };

  const handlePrintReceipt = async () => {
    if (!selectedInvoice?.id) return;

    try {
      const response = await axios_post(true, "invoice/details", {
        id: selectedInvoice.id,
      });
      console.log("res data  data ++++++++++", response.data);

      const formattedReceipt = normalizeReceiptFromApi("Sale", response.data);

      setReceipt(formattedReceipt);

      // wait for receipt to render
      await new Promise((r) => setTimeout(r, 600));

      await generateReceipt();
    } catch (err) {
      console.error("Print error:", err);
    }
  };

  const [receiptData, setReceiptData] = useState([]);
  const [receiptD, setReceiptD] = useState([]);
  const [receiptTotalAmount, setReceiptTotalAmount] = useState([]);
  const receiptRef = useRef();

  const [data, setData] = useState([]);
  const [dialogbox, setdialogbox] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [orderData, setorderData] = useState({});
  const [formData, setFormData] = useState({
    module: "Invoice",
    action: "",
    ids: "",
  });

  const userData = JSON.parse(localStorage.getItem("user_data"));
  const user_group = JSON.parse(localStorage.getItem("user_group"));
  const user_id = localStorage.getItem("user_id");
  const usertype = localStorage.getItem("usertype");
  const [actionMaster, setActionMaster] = useState([]);
  const [functionActionMap, setFunctionActionMap] = useState([]);
  const allowedActions = userData?.user_group
    ?.filter((item) => item.function_master_id === 13)
    .map((item) => item.action_id);

  const allowedActionNames = actionMaster
    .filter((action) => allowedActions?.includes(action.action_id))
    .map((action) => action.action_name);

  useEffect(() => {
    axios
      .get(`${constantApi.baseUrl}/action_master/list`)
      .then((res) => {
        setActionMaster(res.data.data);
        // console.log("actionMaster---", res.data.data);
      })
      .catch((err) => console.error("Error fetching action master:", err));

    axios
      .get(`${constantApi.baseUrl}/function_action_master_map/list`)
      .then((res) => {
        setFunctionActionMap(res.data.data);
        // console.log("functionActionMap---", res.data.data);
      })
      .catch((err) =>
        console.error("Error fetching function-action mapping:", err),
      );
  }, []);

  const handleClickOpened = (orderData) => {
    setorderData(orderData);
    setdialogbox(true);
  };
  const handleClosing = () => {
    setdialogbox(false);
    setActionpen(false);
    setInactiveopen(false);
  };
  const handleClickactionOpen = () => {
    setActionpen(true);
  };
  const handleClickinactiveOpen = () => {
    setInactiveopen(true);
  };

  const [anchor, setAnchor] = useState(null);
  const opening = Boolean(anchor);

  const handleClickaction = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleclosedd = () => {
    setAnchor(null);
  };

  const handleselection = (ids) => {
    var selectedrow = ids.map((id) => data.find((row) => row.id === id));
    let newUUID = [];
    selectedrow.map((data, keys) => {
      newUUID.push(data.uuid);
    });
    setSelectedUUID(newUUID);
  };

  const handleActiveModalSubmit = async (status) => {
    setActionpen(false);
    setdialogbox(false);
    setInactiveopen(false);

    formData.ids = SelectedUUID;
    formData.action = status;

    const response = await axios
      .post("global/bulk-action", formData)
      .then((response) => {
        getdetails();
        if (status == "active") {
          toast.success("Mark as Active Successfully");
        } else {
          toast.success("Mark as Inactive Successfully");
        }
        setInactiveopen(false);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const handleDelete = async () => {
    const { uuid } = orderData;
    setdialogbox(false);
    await axios
      .get("order/delete/" + uuid)
      .then((response) => {
        getdetails();
        toast.success("Data delete successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getdetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "invoice/list");
    console.log("reponse data is invoice", response.data);

    if (response) {
      if (response.status) {
        const { records } = response?.data;
        setData(records);
        setLoading(false);
      } else {
        ToastMassage(response.message, "error");
        setLoading(false);
      }
    }
  };
  const invoiceget = localStorage.getItem("usertype");
  const handleEdit = (id, type, invoice_number) => {
    // Condition for edit
    if (type === "edit" && invoice_number && invoice_number.startsWith("POS")) {
      ToastMassage("This invoice can not be edited.", "error");
      return; // stop further execution
    }

    // Condition for view
    if (type === "view" && invoice_number) {
      navigate(`/invoice/view/${id}`);
      return;
    }

    // Navigate for edit if allowed
    if (type === "edit") {
      navigate(`/invoice/edit_invoice/${id}`);
    }
  };

  const handleDownload = async (invoicePdfUrl) => {
    try {
      const response = await fetch(invoicePdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);

  const handledelete = async (ids) => {
    const { id } = orderData;
    setIsDeleting(true);
    try {
      const response = await axios_post(true, "order/delete", {
        id: ids,
      });
      getdetails();
      if (response.status === true) {
        ToastMassage(response.message, "success");
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    getdetails();
  }, []);

  const columns = [
    {
      field: "created_at",
      headerName: "DATE",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) =>
        moment(params?.value).format("DD MMM YYYY hh:mm A"),
    },
    {
      field: "invoice_number",
      headerName: "INVOICE NUMBER",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },

    {
      field: "customer_details",
      headerName: "CUSTOMER NAME",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      // renderCell: (params) =>
      //   params?.value?.customer_code +
      //   " " +
      //   params?.value?.first_name +
      //   " " +
      //   params?.value?.last_name,
      renderCell: (params) => {
        const c = params?.value;

        if (!c) return "Walking Customer";

        return `${c.customer_code || ""} ${c.first_name || ""} ${
          c.last_name || ""
        }`.trim();
      },
    },
    {
      field: "total_qty",
      headerName: "Invoice Qty",
      sortable: true,
      disableColumnMenu: true,
    },
    // {
    //   field: "salesman",
    //   headerName: "SALESMAN NAME",
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   renderCell: (params) =>
    //     params?.value?.firstname + " " + params?.value?.lastname,
    // },

    {
      field: "grand_total",
      headerName: "AMOUNT",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "invoice_type",
      headerName: "Invoice Type",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    // {
    //   field: "order_number",
    //   headerName: "Order No",
    //   width: 130,
    //   valueGetter: (params) => params.row?.orderModel?.order_number || "",
    // },
    {
      field: "order_number",
      headerName: "Order No",
      width: 130,
      renderCell: (params) => {
        const orderId = params.row?.orderModel?.id;
        const orderNumber = params.row?.orderModel?.order_number;

        return (
          <span
            onClick={() => navigate(`/order/view/${orderId}`)}
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {orderNumber || ""}
          </span>
        );
      },
    },
    // {
    //   field: "total_qty",
    //   headerName: "Order QTY",
    //   width: 130,
    //   valueGetter: (params) => params.row?.orderModel?.total_qty || "",
    // },
    {
      field: "invoice_due_date",
      headerName: "DUE DATE",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
  ];

  const downloadExcel = () => {
    // confirmation first
    const confirmExport = window.confirm(
      "Do you want to download the Excel file?",
    );
    if (!confirmExport) return;

    // data check
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = data.map((row, index) => {
      const customer = row.customer_details;

      return {
        "Sr No": index + 1,

        DATE: row.created_at
          ? moment(row.created_at).format("DD MMM YYYY hh:mm A")
          : "",

        "INVOICE NUMBER": row.invoice_number || "",

        "CUSTOMER NAME": customer
          ? `${customer.customer_code || ""} ${customer.first_name || ""} ${
              customer.last_name || ""
            }`.trim()
          : "Walking Customer",

        "Invoice Qty": row.total_qty ?? "",

        AMOUNT: row.grand_total ?? "",

        "Invoice Type": row.invoice_type || "",

        "Order No": row.orderModel?.order_number || "",

        "DUE DATE": row.invoice_due_date
          ? moment(row.invoice_due_date).format("DD MMM YYYY")
          : "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 8 }, // Sr No
      { wch: 15 }, // Created At
      { wch: 15 }, // Dept Code
      { wch: 25 }, // Tax
      { wch: 20 }, // Tax Calculation
      { wch: 12 }, // Status
    ];
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice List");

    XLSX.writeFile(
      workbook,
      `invoice_list_${moment().format("YYYYMMDD_HHmmss")}.xlsx`,
    );
  };
  const [searchTerm, setSearchTerm] = useState("");
  const filteredRows = useMemo(() => {
    return data.filter((row) => {
      const customerName =
        row.customer?.customerInfo?.customer_code +
        " - " +
        row.customer?.firstname;
      const salesmanName =
        row.salesman?.salesmanInfo?.salesman_code +
        " - " +
        row.salesman?.firstname +
        " " +
        row.salesman?.lastname;
      const invoiceNumber = row.invoice_number; // Adjust based on how invoice_number should be searched
      return (
        customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salesmanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.due_date &&
          row.due_date
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* Inline styles for card-rows and layout */}
      <style>{`
           /* Remove shimmer - static gradient header */
           .header-static {
             background: linear-gradient(90deg,#1976d2 0%, #42a5f5 100%);
           }
   
           /* Make DataGrid's virtual scroller render zone a column with gaps so rows look like cards */
           .MuiDataGrid-virtualScrollerRenderZone {
             display: flex;
             flex-direction: column;
             gap: 12px; /* space between card-rows */
             padding: 12px; /* outer padding so cards don't touch edges */
           }
   
           /* Make each row look like a card */
           .MuiDataGrid-row {
             background: #fff;
             border-radius: 12px !important;
             box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
             transition: transform 180ms ease, box-shadow 180ms ease;
             align-items: center;
             min-height: 64px; /* make cards a bit taller for nicer spacing */
           }
   
           .MuiDataGrid-row:hover {
             transform: translateY(-4px);
             box-shadow: 0 14px 34px rgba(15,23,42,0.12);
           }
   
           /* Remove default row border and cell separators */
           .MuiDataGrid-cell {
             border-bottom: none;
             display: flex;
             align-items: center;
           }
   
           /* Card content padding control: give cells padding so it looks like a card */
           .MuiDataGrid-cellContent {
             padding: 12px 8px;
           }
   
           /* Ensure header and table area use full width with no extras */
           .page-card {
             margin: 0;
             border-radius: 8px;
           }
   
           /* Make DataGrid area fill remaining viewport height */
           .datagrid-full-height {
             height: calc(100vh - 220px); /* adjust as needed to fit header + navbar */
           }
   
           /* Action icons hover */
           .icon-action {
             transition: transform 140ms ease, color 140ms ease;
             cursor: pointer;
             display: inline-flex;
           }
           .icon-action:hover {
             transform: scale(1.08);
           }
   
           /* Make checkbox column cells background transparent */
           .MuiDataGrid-checkboxInput {
             transform: scale(1.05);
           }
   
           /* Fix for sticky header overlapping card gaps */
           .MuiDataGrid-columnHeaders {
             background-color: transparent;
             position: sticky;
             top: 0;
             z-index: 3;
           }
         `}</style>

      {/* Delete Confirmation Dialog (modern) */}
      <Dialog open={dialogbox} onClose={handleClosing} fullWidth maxWidth="sm">
        <DialogTitle>Delete Purchase Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{orderData.order_number}</strong> ? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosing}>Cancel</Button>
          <Button color="error" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialogs */}
      <Dialog open={actionopen} onClose={handleClosing}>
        <DialogTitle>Mark Selected Records Active</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to mark selected records as Active?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosing}>No, mistake!</Button>
          <Button onClick={() => handleActiveModalSubmit("active")}>
            Yes, mark as active!
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={inactiveopen} onClose={handleClosing}>
        <DialogTitle>Mark Selected Records Inactive</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to mark selected records as Inactive?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosing}>No, mistake!</Button>
          <Button onClick={() => handleActiveModalSubmit("inactive")}>
            Yes, mark as inactive!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header + Controls */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card className="page-card">
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                className="header-static"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* Left Title */}
                <Grid
                  item
                  sx={{ display: "flex", alignItems: "center", minWidth: 200 }}
                >
                  <MDTypography
                    variant="h6"
                    color="white"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Icon fontSize="small" sx={{ mr: 1 }}>
                      person
                    </Icon>
                    Invoices
                  </MDTypography>
                </Grid>

                {/* Centered Search */}
                <Grid
                  item
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Box sx={{ width: { xs: "92%", md: "60%" } }}>
                    <TextField
                      fullWidth
                      placeholder="Search by customer, salesman, invoice# or due date..."
                      variant="outlined"
                      size="small"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{
                        background: "#fff",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-root": { paddingRight: 1 },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Right Buttons */}
                <Grid
                  item
                  sx={{
                    minWidth: 220,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <MDButton
                    component={Link}
                    to="/master/invoice/add"
                    variant="gradient"
                    color="light"
                    sx={{ textTransform: "none" }}
                  >
                    &#x2b;&nbsp;New
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="light"
                    onClick={handleClickaction}
                  >
                    Mark as Active
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="light"
                    onClick={handleClickinactiveOpen}
                  >
                    Mark as Inactive
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="light"
                    onClick={downloadExcel}
                  >
                    Export
                  </MDButton>
                </Grid>
              </MDBox>

              {/* Selected invoice quick actions (kept intact) */}
              <MDBox pr={1} sx={{ p: 2 }}>
                {selectedInvoice && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: 12,
                      background: "#fafafa",
                      margin: 12,
                      borderRadius: 8,
                      alignItems: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ fontWeight: 400 }}>
                      {selectedInvoice.invoice_number}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        // onClick={() =>
                        //   handleEdit(
                        //     selectedInvoice.id,
                        //     "print",
                        //     selectedInvoice.invoice_number,
                        //   )
                        // }
                        onClick={handlePrintReceipt}
                        className="flex items-center gap-2 bg-blue-700 text-white px-2 py-1 rounded-md border-0 cursor-pointer text-sm"
                      >
                        <FaEye /> Print
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(
                            selectedInvoice.id,
                            "view",
                            selectedInvoice.invoice_number,
                          )
                        }
                        className="flex items-center gap-2 bg-blue-700 text-white px-2 py-1 rounded-md border-0 cursor-pointer text-sm"
                      >
                        <FaEye /> View
                      </button>

                      <button
                        onClick={() =>
                          handleEdit(
                            selectedInvoice.id,
                            "edit",
                            selectedInvoice.invoice_number,
                          )
                        }
                        className="flex items-center gap-2 bg-blue-700 text-white px-2 py-1 rounded-md border-0 cursor-pointer text-sm"
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        onClick={() => ganratePdf(selectedInvoice.id)}
                        className="flex items-center gap-2 bg-blue-700 text-white px-2 py-1 rounded-md border-0 cursor-pointer text-sm"
                      >
                        <FaFilePdf /> PDF
                      </button>

                      <button
                        onClick={() =>
                          navigate("/master/payment", {
                            state: { id: selectedInvoice.id },
                          })
                        }
                        className="flex items-center gap-2 bg-blue-700 text-white px-2 py-1 rounded-md border-0 cursor-pointer text-sm"
                      >
                        <FaMoneyBill /> Payment
                      </button>
                    </div>
                  </div>
                )}
              </MDBox>

              {/* DataGrid wrapped to take full remaining viewport height, rows styled as cards */}
              <MDBox pt={3} sx={{ p: 2 }}>
                <div
                  className="datagrid-full-height"
                  style={{ height: "calc(100vh - 260px)" }}
                >
                  <DataGrid
                    localeText={{ noRowsLabel: "No records" }}
                    autoHeight={false}
                    loading={loading}
                    rows={searchTerm != "" ? filteredRows : data}
                    columns={columns}
                    getRowId={(row) => row.id}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => handleselection(ids)}
                    disableRowSelectionOnClick
                    onRowClick={(params) => {
                      setSelectedInvoice({
                        id: params.row.id,
                        invoice_number: params.row.invoice_number,
                      });
                    }}
                    slotProps={{
                      columnMenu: {
                        sx: {
                          "& .MuiDataGrid-menuList": {
                            minWidth: "200px",
                          },
                          "& .MuiMenuItem-root .MuiTypography-root": {
                            fontSize: "14px",
                          },
                        },
                      },
                    }}
                    getRowClassName={() => "grid-row-card"}
                    sx={{
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "transparent",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      },
                      "& .MuiDataGrid-cell": { alignItems: "center" },
                      border: "none",
                      height: "100%",
                    }}
                  />
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Receipt offscreen - unchanged */}
      <div>
        <div className="receipt receipt-offscreen" ref={receiptRef}>
          <h2 className="center">RECEIPT OF SALE</h2>
          <p className="center">SHOP NAME</p>
          <p className="center">Address: Lorem Ipsum, 1234-5</p>
          <p className="center">Tel: +1 012 345 67 89</p>

          <hr />
          <p className="center">Invoice No: {receiptD}</p>
          <p className="center">{new Date().toLocaleString()}</p>
          <hr />

          <table className="receipt-table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>DISC</th>
                <th>AMT</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.map((item, idx) => {
                const finalPrice = (item.price - item.discount) * item.qty;
                return (
                  <tr key={idx}>
                    <td>{item.itemModel.item_name}</td>
                    <td>{item.item_qty}</td>
                    <td>{Number(item.item_price).toFixed(1)}</td>
                    <td>{Number(item.item_discount_amount).toFixed(1)}</td>
                    <td>{Number(item.item_grand_total).toFixed(1)}</td>
                    {/* <td>{finalPrice.toFixed(2)}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr />
          <p className="center text-center">
            <strong>Total:</strong> {Number(receiptTotalAmount).toFixed(2)}
          </p>
          {/* <p>Cash: {cash.toFixed(2)}</p>
             <p>Change: {change}</p> */}
          <p className="center text-center">Thank you for shopping!</p>
          <hr />
          <p className="center text-center">
            <strong> Term & Conditions:</strong>
          </p>
          <h3 className="center text-center">
            OUR TRADING HOURS ARE 10:00AM TO 10:00PM
          </h3>
          <p className="center text-center">
            Exchange within 15 days of purchase with proof of a Receipt. Sale
            items cannot be credited or refunded. For hygienic reasons swimwear
            and under garment items cannot be exchanged or refunded. No Refund
            will be made if you change your mind after the purchase. Refunds or
            exchanges will be made if the product purchased is defective or
            counterfeit. Free Items cannot be exchanged/Refund/Credited.
          </p>
        </div>

        {/* <button onClick={handleDownload}>Download Receipt</button> */}
      </div>

      <ToastContainer position="top-right" />
    </DashboardLayout>
  );
}

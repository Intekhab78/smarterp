import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios, { axios_post } from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import moment from "moment";

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
import {
  Autocomplete,
  DialogContentText,
  InputLabel,
  TextField,
  Box,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ToastMassage } from "toast";
import jsPDF from "jspdf";
import MDInput from "components/MDInput";
import { convertToWords } from "components/Number";
import constantApi from "constantApi";
import { generateOrderPdf } from "../../utils/pdfUtils";

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

export default function Orders() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);

  let user_data = JSON.parse(localStorage.getItem("user_data"));
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
      })
      .catch((err) => console.error("Error fetching action master:", err));

    axios
      .get(`${constantApi.baseUrl}/function_action_master_map/list`)
      .then((res) => {
        setFunctionActionMap(res.data.data);
      })
      .catch((err) =>
        console.error("Error fetching function-action mapping:", err),
      );
  }, []);

  const [data, setData] = useState([]);
  const [dialogbox, setdialogbox] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [orderData, setorderData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formData, setFormData] = useState({
    module: "Order",
    action: "",
    ids: "",
  });

  const handleClickOpened = (orderData, invoice) => {
    if (invoice === null) {
      setorderData(orderData);
      setdialogbox(true);
    } else {
      ToastMassage("Invoice Generated, Can not be delete, generate new Order.");
    }
  };
  const handleClosing = () => {
    setdialogbox(false);
    setActionpen(false);
    setInactiveopen(false);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
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

  const getdetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "order/list");
    console.log(
      "response form the order list is -----------------",
      response.data,
    );

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
  const handleEdit = (id, type, invoiceNumber, invoice) => {
    if (type === "edit") {
      if (invoice === null) {
        navigate(`/order/edit/${id}`);
      } else {
        ToastMassage("Invoice Generated, Can not be edit, generate new Order.");
      }
    } else if (type === "view") {
      navigate(`/order/view/${id}`);
    }
  };

  const ganratePdf = async (id) => {
    try {
      const response = await axios_post(true, "order/details", { id });
      generateOrderPdf(response.data);
    } catch (err) {
      console.error("Error generating PDF", err);
    }
  };

  const invoiceget = localStorage.getItem("usertype");

  const handleGenerateInvoice1 = (id, type, invoiceNumber, invoice, row) => {
    console.log("row----------", row);
    console.log("Current Stage:----------", row?.current_stage);
    console.log("Current Stage:----------", row?.current_stage);

    if (type === "generate_invoice") {
      if (parseFloat(row?.open_qty) > 0) {
        navigate(`/order/generate_invoice/${id}`);
      } else {
        ToastMassage(
          "Invoice Generated, Can not be generate invoice, generate new Order.",
        );
      }
    }
  };

  const handleGenerateInvoice = (id, type, invoiceNumber, invoice, row) => {
    if (type !== "generate_invoice") return;

    const { order_type, current_stage, current_order_status, open_qty } = row;

    // 1️⃣ Only for online orders
    if (order_type === "online") {
      // 2️⃣ Check stage name first
      if (current_stage !== "Ready to Ship") {
        ToastMassage(
          "We cannot generate invoice until status is Ready to Ship",
        );
        return;
      }

      // 3️⃣ Check status number
      // if (Number(current_order_status) < Number(ready_to_ship_status_no)) {
      //   ToastMassage(
      //     "We cannot generate invoice until status is Ready to Ship"
      //   );
      //   return;
      // }
    }

    // 4️⃣ Normal open qty check
    if (Number(open_qty) > 0) {
      navigate(`/order/generate_invoice/${id}`);
    } else {
      ToastMassage("Invoice already generated. Please create a new order.");
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (invoiceNumber) => {
    const { id } = orderData;
    try {
      const response = await axios_post(true, "order/delete", {
        id: id,
      });
      if (response.status === true) {
        getdetails();
        ToastMassage(response.message, "success");
        handleCloseDeleteModal();
        setorderData({});
        setdialogbox(false);
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
    // { field: "id", headerName: "ID", width: 70 },
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
      field: "order_number",
      headerName: "ORDER NUMBER",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "customer_details",
      headerName: "CUSTOMER NAME",
      width: 200,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) =>
        params?.value?.customer_code +
        " " +
        params?.value?.first_name +
        " " +
        params?.value?.last_name,
    },
    // {
    //   field: "salesman",
    //   headerName: "SALESMAN NAME",
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   renderCell: (params) =>
    //     params?.row?.salesman?.salesmanInfo?.salesman_code +
    //     " - " +
    //     params?.value?.firstname +
    //     " " +
    //     params?.value?.lastname,
    // },

    // {
    //   field: "salesman",
    //   headerName: "EMPLOYEE NAME",
    //   width: 150,
    //   sortable: true,
    //   disableColumnMenu: true,
    //   renderCell: (params) =>
    //     params?.row?.salesman?.salesmanInfo?.salesman_code +
    //     " - " +
    //     params?.value?.firstname +
    //     " " +
    //     params?.value?.lastname,
    // },
    {
      field: "total_qty",
      headerName: "Total Qty",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "open_qty",
      headerName: "Open Qty",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "due_date",
      headerName: "DUE DATE",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "grand_total",
      headerName: "AMOUNT",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    // {
    //   field: "order_type",
    //   headerName: "ORDER TYPE",
    //   width: 100,
    //   sortable: true,
    //   disableColumnMenu: true,
    // },
    {
      field: "invoice_number",
      headerName: "INVOICE NUMBER",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.invoice?.invoice_number,
    },
    // { field: "current_stage", headerName: "APPROVAL", width: 150, sortable: true, disableColumnMenu: false, },
    {
      field: "status",
      headerName: "STATUS",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "current_stage",
      headerName: "CURRENT STATUS",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },

    {
      field: "Action",
      headerName: "Action",
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };
        return (
          <>
            <IconButton onClick={handleClick}>
              <Icon fontSize="small">more_vert</Icon>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              id="action-menu"
              open={open}
              onClose={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {allowedActions?.includes(6) && ( // Assuming 1 is the action_id for "Edit"
                <MenuItem
                  onClick={() =>
                    handleEdit(
                      params.row.id,
                      "edit",
                      params.row.invoice?.invoice_number,
                      params.row.invoice,
                    )
                  }
                >
                  <Icon fontSize="small">edit</Icon> Edit
                </MenuItem>
              )}

              {allowedActions?.includes(5) && ( // Assuming 3 is the action_id for "View"
                <MenuItem onClick={() => handleEdit(params.row.id, "view")}>
                  <Icon fontSize="small">visibility</Icon> View
                </MenuItem>
              )}

              {allowedActions?.includes(7) && ( // Assuming 4 is the action_id for "Delete"
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleClickOpened(params.row, params.row.invoice);
                  }}
                >
                  <Icon fontSize="small">delete</Icon> Delete
                </MenuItem>
              )}
              {invoiceget == 1 ? (
                <>
                  <MenuItem
                    onClick={() =>
                      handleEdit(
                        params.row.id,
                        "edit",
                        params.row.invoice?.invoice_number,
                        params.row.invoice,
                      )
                    }
                  >
                    <Icon fontSize="small">edit</Icon> Edit
                  </MenuItem>
                  <MenuItem onClick={() => ganratePdf(params.row.id)}>
                    <Icon fontSize="small">visibility</Icon> Pdf
                  </MenuItem>
                  <MenuItem onClick={() => handleEdit(params.row.id, "view")}>
                    <Icon fontSize="small">visibility</Icon> View
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleClickOpened(params.row, params.row.invoice);
                    }}
                  >
                    <Icon fontSize="small">delete</Icon> Delete
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleGenerateInvoice(
                        params.row.id,
                        "generate_invoice",
                        params.row.invoice?.invoice_number,
                        params.row.invoice,
                        params.row,
                      );
                    }}
                  >
                    <Icon fontSize="small"> receipt</Icon> Generate Invoice
                  </MenuItem>
                </>
              ) : (
                ""
              )}
            </Menu>
          </>
        );
      },
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

    const exportData = data.map((row, index) => ({
      "Sr No": index + 1,

      DATE: row.created_at
        ? moment(row.created_at).format("DD MMM YYYY hh:mm A")
        : "",

      "ORDER NUMBER": row.order_number || "",

      "CUSTOMER NAME": row.customer_details
        ? `${row.customer_details.customer_code || ""} ${
            row.customer_details.first_name || ""
          } ${row.customer_details.last_name || ""}`.trim()
        : "",

      "Total Qty": row.total_qty ?? "",
      "Open Qty": row.open_qty ?? "",

      "DUE DATE": row.due_date
        ? moment(row.due_date).format("DD MMM YYYY")
        : "",

      AMOUNT: row.grand_total ?? "",

      "INVOICE NUMBER": row.invoice?.invoice_number || "",

      STATUS: row.status === 1 ? "Active" : "Inactive",
    }));

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

    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    XLSX.writeFile(workbook, `orders_${Date.now()}.xlsx`);
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Memoized function to filter rows based on search term
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
      const invoiceNumber = row.invoice_number;
      const orderNumber = row.order_number;
      return (
        customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salesmanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.due_date &&
          row.due_date
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (row.grand_total &&
          row.grand_total
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (row.order_type &&
          row.order_type
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  // console.log('filteredRows', filteredRows);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Page background and card styling */}
      <style>{`
            /* page background */
            .po-page {
              background: #f9f9f9;
              min-height: calc(100vh - 64px); /* account for navbar height */
              padding-bottom: 24px;
            }
    
            /* Make DataGrid virtual scroller render zone behave like vertical stack with gaps (cards) */
            .MuiDataGrid-virtualScrollerRenderZone {
              display: flex;
              flex-direction: column;
              gap: 12px;
              padding: 12px;
            }
    
            /* Card-like rows */
            .MuiDataGrid-row {
              background: #ffffff;
              border-radius: 10px !important;
              box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
              transition: transform 180ms ease, box-shadow 180ms ease;
              align-items: center;
              min-height: 68px;
            }
    
            .MuiDataGrid-row:hover {
              transform: translateY(-6px);
              box-shadow: 0 18px 40px rgba(15,23,42,0.12);
            }
    
            .MuiDataGrid-cell {
              border-bottom: none;
              display: flex;
              align-items: center;
              padding-top: 10px;
              padding-bottom: 10px;
            }
    
            .po-card-wrapper {
              margin: 0;
              border-radius: 10px;
            }
    
            /* full height area for datagrid */
            .datagrid-full-height {
              height: calc(100vh - 240px); /* adjust to fit header and navbar */
            }
    
            /* make column headers transparent so cards show separation */
            .MuiDataGrid-columnHeaders {
              background-color: #e7f2ff; /* light blue header */
              position: sticky;
              top: 0;
              z-index: 4;
              color: #0d47a1;
              border-bottom: 1px solid #cfe7ff;
            }
    
            /* Header bar styling - light blue */
            .po-header {
              background: linear-gradient(90deg, #e8f4ff 0%, #d8ecff 100%) !important;
              color: #0b4f9f !important;
            }
    
            /* Buttons accent */
            .po-header .md-button,
            .po-btn {
              background-color: #e3f2fd !important;
              color: #0d47a1 !important;
              border: 1px solid rgba(13,71,161,0.12) !important;
            }
    
            .bulk-button {
              border-color: rgba(13,71,161,0.18) !important;
              color: #0d47a1 !important;
            }
    
            .MuiIconButton-root {
              color: #0d47a1;
            }
    
            /* DataGrid header cell text */
            .MuiDataGrid-columnHeaderTitle {
              font-weight: 600;
            }
          `}</style>

      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className="po-card-wrapper">
              {/* HEADER - use orders-header class to apply lite-blue look */}
              <MDBox
                className="orders-header"
                mx={2}
                mt={-3}
                py={2}
                px={3}
                variant="gradient"
                borderRadius="lg"
                coloredShadow="info"
                sx={{
                  background: "#1976d2", // solid blue header
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                }}
              >
                {/* LEFT SIDE - TITLE */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Icon fontSize="small">person</Icon>
                  <MDTypography variant="h6" color="white">
                    Orders
                  </MDTypography>
                </Box>

                {/* CENTER - SEARCH BAR */}
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexGrow: 1,
                    maxWidth: 400,
                  }}
                >
                  <Icon
                    fontSize="small"
                    sx={{
                      position: "absolute",
                      left: 12,
                      color: "#555",
                    }}
                  >
                    search
                  </Icon>
                  <MDInput
                    type="text"
                    variant="outlined"
                    name="order_number"
                    sx={{
                      width: "100%",
                      background: "#fff",
                      borderRadius: "8px",
                      input: { paddingLeft: "35px" },
                    }}
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>

                {/* RIGHT SIDE - BUTTONS */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  {/* New Order Button */}
                  <MDTypography component={Link} to="/master/order/add">
                    <MDButton
                      variant="contained"
                      sx={{
                        background: "#fff",
                        color: "#1976d2",
                        fontWeight: 600,
                        "&:hover": { background: "#e3f2fd" },
                      }}
                    >
                      &#x2b;&nbsp;New
                    </MDButton>
                  </MDTypography>

                  {/* Bulk Actions Button */}
                  <MDButton
                    aria-haspopup="true"
                    onClick={handleClickaction}
                    variant="outlined"
                    sx={{
                      borderColor: "#fff",
                      color: "#fff",
                      "&:hover": { background: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    Bulk Actions
                  </MDButton>

                  {/* Import/Export Menu Icon */}
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{
                      color: "#fff",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    <Icon fontSize="small">menu</Icon>
                  </IconButton>
                </Box>

                {/* ---------- BULK ACTION MENU ---------- */}
                <Menu
                  anchorEl={anchor}
                  id="bulk-action-menu"
                  open={opening}
                  onClose={handleclosedd}
                  onClick={handleclosedd}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.25))",
                      mt: 1.5,
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClickactionOpen}>
                    Mark as Active
                  </MenuItem>
                  <MenuItem onClick={handleClickinactiveOpen}>
                    Mark as Inactive
                  </MenuItem>
                </Menu>

                {/* ---------- DIALOGS ---------- */}
                <Dialog open={actionopen} onClose={handleClosing}>
                  <Icon className="icon-round" fontSize="larger" color="error">
                    error
                  </Icon>
                  <DialogContent dividers>
                    <Typography gutterBottom sx={{ fontSize: 18 }}>
                      Are you sure you want to mark selected records as Active?
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleClosing}>
                      No, mistake!
                    </Button>
                    <Button
                      autoFocus
                      onClick={(e) => handleActiveModalSubmit("active")}
                    >
                      Yes, mark as active!
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog open={inactiveopen} onClose={handleClosing}>
                  <Icon className="icon-round" fontSize="larger" color="error">
                    error
                  </Icon>
                  <DialogContent dividers>
                    <Typography gutterBottom sx={{ fontSize: 18 }}>
                      Are you sure you want to mark selected records as
                      Inactive?
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleClosing}>
                      No, mistake!
                    </Button>
                    <Button
                      autoFocus
                      onClick={(e) => handleActiveModalSubmit("inactive")}
                    >
                      Yes, mark as inactive!
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* ---------- IMPORT / EXPORT MENU ---------- */}
                <Menu
                  anchorEl={anchorEl}
                  id="import-export-menu"
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.25))",
                      mt: 1.5,
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClose}>Import</MenuItem>
                  <MenuItem onClick={downloadExcel}>Export</MenuItem>
                </Menu>

                {/* ---------- EXPORT DIALOG ---------- */}
                {/* <BootstrapDialog
                  onClose={handleClosed}
                  aria-labelledby="customized-dialog-title"
                  open={opened}
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClosed}
                  >
                    Export
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <RadioGroup
                      aria-labelledby="export-options"
                      defaultValue=""
                      value={selectedValue}
                      onChange={handleChanged}
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="auto"
                        control={<Radio />}
                        label="All Orders"
                      />
                      <FormControlLabel
                        value="add"
                        control={<Radio />}
                        label="Specific Order"
                      />
                      {selectedValue === "add" && (
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              type="date"
                              label="From"
                              sx={{ width: 150 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              type="date"
                              label="To"
                              sx={{ width: 150 }}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </RadioGroup>

                    <RadioGroup name="export-format">
                      <FormLabel>Export As:</FormLabel>
                      <FormControlLabel
                        value="csv"
                        control={<Radio />}
                        label="CSV (Comma Separated Value)"
                      />
                      <FormControlLabel
                        value="xls"
                        control={<Radio />}
                        label="XLS (Excel Compatible)"
                      />
                    </RadioGroup>
                  </DialogContent>
                  <DialogActions>
                    <MDButton
                      variant="text"
                      color="info"
                      autoFocus
                      onClick={downloadExcel}
                    >
                      Export
                    </MDButton>
                    <MDButton
                      variant="text"
                      color="info"
                      autoFocus
                      onClick={handleClosed}
                    >
                      Cancel
                    </MDButton>
                  </DialogActions>
                </BootstrapDialog> */}
              </MDBox>

              {/* <MDBox pt={3}>
                <div className="datagrid-full-height">
                  <DataGrid
                    localeText={{ noRowsLabel: "No records" }}
                    autoHeight={false}
                    loading={loading}
                    rows={searchTerm != "" ? filteredRows : data}
                    columns={columns}
                    getRowId={(row) => row.id || row.uuid || row._id}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    onRowSelectionModelChange={(ids) => handleselection(ids)}
                    disableRowSelectionOnClick
                    slotProps={{
                      columnMenu: {
                        sx: {
                          "& .MuiDataGrid-menuList": {
                            minWidth: "200px", // Set the minimum width for the menu list
                          },
                          "& .MuiMenuItem-root .MuiTypography-root": {
                            fontSize: "14px", // Apply the specific style to the MenuItem within DataGrid
                          },
                        },
                      },
                    }}
                    sx={{
                      border: "none",
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#e6f6ff",
                        color: "#064e75",
                        fontWeight: 600,
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                      },
                    }}
                  />
                </div>
              </MDBox> */}

              <MDBox pt={3}>
                <div className="datagrid-full-height">
                  <DataGrid
                    localeText={{ noRowsLabel: "No records" }}
                    autoHeight={false}
                    loading={loading}
                    rows={searchTerm !== "" ? filteredRows : data}
                    columns={columns}
                    getRowId={(row) => row.id || row.uuid || row._id}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(ids) => handleselection(ids)}
                    sx={{
                      border: "1px solid #e0e0e0",
                      /* Header */
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        fontWeight: 600,
                      },

                      /* Remove selected row color */
                      "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: "transparent !important",
                      },

                      "& .MuiDataGrid-row.Mui-selected:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  />
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Delete Confirmation Dialog (unchanged) */}
      <Dialog
        open={dialogbox}
        onClose={handleClosing}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Do you really want to delete this {orderData.order_number} Order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosing} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" />
    </DashboardLayout>
  );
}

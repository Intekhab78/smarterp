import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { axios_post } from "../../axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
import { Autocomplete, TextField } from "@mui/material";
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
import { QrCodeScannerOutlined } from "@mui/icons-material";
import { generateGrnPdf } from "utils/pdfUtils";

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
    grn_number: "",
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
    grn_type: "",
    action: "",
    //   <MDBox ml={-1}>
    //     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //   </MDBox>
    // ),
  },
];

export default function grn() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);

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

  const [data, setData] = useState([]);
  const [dialogbox, setdialogbox] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [orderData, setorderData] = useState({});
  const [formData, setFormData] = useState({
    module: "Grn",
    action: "",
    ids: "",
  });

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

  const handledelete = async () => {
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
    const response = await axios_post(true, "grn/list");
    console.log("grn list is ---------------", response.data);

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
  const handleEdit = async (id, type) => {
    if (type === "edit") {
      navigate(`/grn/edit/${id}`);
    } else if (type === "view") {
      navigate(`/grn/view/${id}`);
    } else if (type === "addextracost") {
      navigate(`/grn/addcost/${id}`);
    } else if (type === "rtv") {
      navigate(`/grn/rtv/${id}`);
    } else if (type === "generatePdf") {
      await generatePdf(id); // ✅ properly call the function with id
    }
  };

  const generatePdfdatawithGST = async (id) => {
    try {
      const response = await axios_post(true, "grn/details", { id });

      console.log("generatePdf-------------", response.data);

      if (!response?.data) {
        console.error("No data received for PDF generation");
        return;
      }

      const user_data = JSON.parse(localStorage.getItem("user_data")) || {};
      const pdfData = response.data;
      const customerData = pdfData.customer;
      const item_modal = pdfData.grn_details;

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      let totalCGSTH = 0;
      let totalSGSTH = 0;
      let totalIGST = 0;
      let toatlTaxble = 0;

      let order_number = pdfData.grn_number;
      let order_date = moment(pdfData.created_at).format("DD/MM/YYYY");
      let TotalNet = pdfData.total_net;
      let TotalGrand = pdfData.grand_total;
      let Totaldiscount = pdfData.total_discount_amount;

      let tableRows = "";

      item_modal?.forEach((item, index) => {
        totalCGSTH += parseFloat(item.cgst_amount || 0);
        totalSGSTH += parseFloat(item.sgst_amount || 0);
        totalIGST += parseFloat(item.igst_amount || 0);
        toatlTaxble += parseFloat(item.taxa_ble || 0);

        const truncatedItemCode =
          item.itemModel.item_name.length > 30
            ? item.itemModel.item_name.substring(0, 30)
            : item.itemModel.item_name;

        const totalCGSTPR = parseFloat(item.item_vat) / 2;
        const totalSGSTPR = parseFloat(item.item_vat) / 2;

        tableRows += `
        <tr>
          <td align="center">${index + 1}</td>
          <td>${truncatedItemCode || ""}</td>
          <td>${item.hsn_code || ""}</td>
          <td>${"0.00"}</td>
          <td>${item.receiving_site || ""}</td>
          <td>${
            item.expiry_delivery_date
              ? moment(item.expiry_delivery_date).format("M/YY")
              : ""
          }</td>
          <td>${item.itemModel.item_vat_percentage || ""}</td>
          <td>${item.is_free == 1 ? "0.00" : item.item_qty || ""}</td>
          <td>${
            item.is_free == 1 ? item.item_qty : item.item_discount_amount || ""
          }</td>
          <td>${item.item_price || ""}</td>
          <td>${item.item_net || ""}</td>
          <td>${item.item_grand_total || ""}</td>
          <td>${item.itemModel.rate || ""}</td>
          <td>${totalCGSTPR + "%" || ""}</td>
          <td>${parseFloat(item.cgst_amount || 0).toFixed(2)}</td>
          <td>${totalSGSTPR + "%" || ""}</td>
          <td>${parseFloat(item.sgst_amount || 0).toFixed(2)}</td>
          <td>${item.igst || ""}</td>
          <td>${item.igst_amount || ""}</td>
        </tr>
      `;
      });

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>GRN</title></head>
      <body>
        <h3 style="text-align:center">GRN Report</h3>
        <p><strong>GRN No:</strong> ${order_number} | <strong>Date:</strong> ${order_date}</p>
        <table border="1" cellspacing="0" cellpadding="4" width="100%">
          <thead>
            <tr>
              <th>S No</th>
              <th>Product</th>
              <th>HSN</th>
              <th>Pack</th>
              <th>Batch No</th>
              <th>Exp</th>
              <th>MRP</th>
              <th>Qty</th>
              <th>Disc</th>
              <th>Rate</th>
              <th>Net</th>
              <th>Gross</th>
              <th>PTR</th>
              <th>CGST%</th>
              <th>CGST Amt</th>
              <th>SGST%</th>
              <th>SGST Amt</th>
              <th>IGST%</th>
              <th>IGST Amt</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <br/>
        <h4 style="text-align:right;">Total Amount: INR ${TotalGrand}</h4>
      </body>
      </html>
    `;

      document.body.appendChild(tempDiv);

      doc.html(tempDiv, {
        callback: function (pdf) {
          pdf.save(`GRN_${order_number}.pdf`);
          tempDiv.remove();
        },
        x: 10,
        y: 10,
        width: 270,
        windowWidth: 1000,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const generatePdf = async (id) => {
    try {
      const response = await axios_post(true, "grn/details", { id });

      console.log("generatePdf-------------", response.data);

      generateGrnPdf(response.data);
    } catch (err) {
      console.error("Error generating PDF", err);
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

  const handleDelete = async (ids) => {
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
    // { field: "id", headerName: "ID", width: 70 },
    {
      field: "created_at",
      headerName: "DATE",
      width: 200,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) =>
        moment(params?.value).format("DD MMM YYYY hh:mm A"),
    },
    {
      field: "grn_number",
      headerName: "GRN NUMBER",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "total_qty",
      headerName: "GRN QTY",
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
    {
      field: "order_number",
      headerName: "P O NUMBER",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "vendor_details",
      headerName: "VENDOR NAME",
      width: 200,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) =>
        params?.value?.vendor_code +
        " " +
        params?.value?.firstname +
        " " +
        params?.value?.lastname,
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
    {
      field: "grn_date",
      headerName: "delivery DATE",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },

    // { field: "current_stage", headerName: "APPROVAL", width: 150, sortable: false, disableColumnMenu: true, },

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
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleEdit(params.row.id, "edit");
                }}
              >
                <Icon fontSize="small">edit</Icon> Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "view");
                }}
              >
                <Icon fontSize="small">visibility</Icon> View
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "addextracost");
                }}
              >
                <Icon fontSize="small">visibility</Icon> Add Extra Cost
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "rtv");
                }}
              >
                <Icon fontSize="small">visibility</Icon> RTV
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "generatePdf");
                }}
              >
                <Icon fontSize="small">visibility</Icon> Pdf
              </MenuItem>

              {/* <MenuItem
                onClick={() => {
                  handleClose();
                  handleDownload(params.row.invoice_pdf);
                }}
              >
                <Icon fontSize="small">receipt</Icon> Download Invoice
              </MenuItem> */}
            </Menu>
          </>
        );
      },
    },
  ];

  const downloadExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const confirmExport = window.confirm(
      "Do you want to download the Excel file?"
    );
    if (!confirmExport) return;

    const exportData = data.map((item, index) => ({
      "Sr No": index + 1,

      Date: item.created_at
        ? moment(item.created_at).format("DD MMM YYYY hh:mm A")
        : "",

      "GRN Number": item.grn_number || "",

      "GRN Qty": item.total_qty || "",

      Amount: item.grand_total || "",

      "PO Number": item.order_number || "",

      "Vendor Name": item.vendor_details
        ? `${item.vendor_details.vendor_code || ""} ${
            item.vendor_details.firstname || ""
          } ${item.vendor_details.lastname || ""}`.trim()
        : "",

      "Delivery Date": item.grn_date
        ? moment(item.grn_date).format("DD MMM YYYY")
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = [
      { wch: 8 }, // Sr No
      { wch: 25 }, // Created At
      { wch: 15 }, // Grn Number
      { wch: 15 }, // Grn Qty
      { wch: 18 }, // Amount
      { wch: 12 }, //Po Number
      { wch: 20 }, // Vender Name
      { wch: 15 }, // Delivery Date
    ];
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "GRN List");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `GRN_List_${Date.now()}.xlsx`);
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

      const grnNumber = row.grn_number;
      const poNumber = row.order_number; // <-- PO NUMBER

      return (
        customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salesmanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (row.due_date &&
          row.due_date
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        grnNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // ⭐ NEW — Filter By PO Number
        poNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, data]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Dialog
        className="dialogbox"
        open={dialogbox}
        onClose={handleClosing}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Icon className="icon-round" fontSize="larger">
          error
        </Icon>
        <DialogContent className="dialog-content">
          <Typography gutterBottom style={{ fontSize: "20" }}>
            Are you sure want to delete this record {orderData.grn_number}??
          </Typography>
        </DialogContent>
        <DialogActions className="Dialog-Actions">
          <Button autoFocus onClick={handleClosing}>
            Cancel
          </Button>
          <Button autoFocus onClick={handledelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* styling for card-like rows and header alignment */}
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

      <MDBox className="custome-card grn-page" pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className="grn-card-wrapper">
              {/* HEADER */}
              {/* <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                className="grn-header"

              > */}
              <MDBox
                sx={{
                  background: "linear-gradient(90deg, #1976d2, #0d47a1)",
                  borderRadius: "12px",
                  p: 1.5,
                  mb: 3,
                  height: "64px", // fixed medium header height
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 3px 10px rgba(13,71,161,0.2)",
                }}
              >
                <Grid container spacing={1} alignItems="center">
                  {/* Left title */}
                  <Grid item xs={12} md={3} lg={3}>
                    <MDTypography
                      variant="h6"
                      color="white"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Icon fontSize="medium" sx={{ mr: 1 }}>
                        assignment
                      </Icon>
                      GRN
                    </MDTypography>
                  </Grid>

                  {/* Centered search */}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <MDInput
                      type="text"
                      variant="outlined"
                      name="search"
                      sx={{
                        width: { xs: "50%", md: 300 },
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(13,71,161,0.15)",
                        "& input": { fontSize: "0.9rem" },
                      }}
                      margin="normal"
                      placeholder="🔍 Search by vendor, GRN#, employee, amount..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Grid>

                  {/* Right side buttons */}
                  <Grid
                    item
                    xs={12}
                    md={3}
                    lg={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    {/* + New Button */}
                    <MDTypography component={Link} to="/master/grn/add">
                      <MDButton
                        variant="contained"
                        color="info"
                        sx={{
                          backgroundColor: "#fff",
                          color: "#1976d2",
                          fontWeight: 600,
                          px: 2.5,
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          "&:hover": { backgroundColor: "#e3f2fd" },
                        }}
                      >
                        <Icon fontSize="small" sx={{ fontWeight: "bold" }}>
                          add
                        </Icon>
                        New
                      </MDButton>
                    </MDTypography>

                    {/* Bulk Actions Button */}
                    <MDBox>
                      <MDButton
                        className="bulk-button"
                        aria-haspopup="true"
                        onClick={handleClickaction}
                        variant="contained"
                        sx={{
                          backgroundColor: "#fff",
                          color: "#1976d2",
                          fontWeight: 500,
                          px: 2.5,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        Bulk Actions
                      </MDButton>
                    </MDBox>

                    {/* Menu Button */}
                    <MDBox>
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor: "#fff",
                          color: "#1976d2",
                          p: 1,
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                        aria-haspopup="true"
                      >
                        <Icon fontSize="small">menu</Icon>
                      </IconButton>
                    </MDBox>
                  </Grid>
                </Grid>

                {/* ===================== Account Menu ===================== */}
                <Menu
                  anchorEl={anchor}
                  id="account-menu"
                  open={opening}
                  onClose={handleclosedd}
                  onClick={handleclosedd}
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
                  <MenuItem onClick={handleClickactionOpen}>
                    Mark as Active
                  </MenuItem>
                  <MenuItem onClick={handleClickinactiveOpen}>
                    Mark as Inactive
                  </MenuItem>
                </Menu>

                {/* ===================== Active Dialog ===================== */}
                <Dialog
                  className="dialogbox"
                  open={actionopen}
                  onClose={handleClosing}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <Icon className="icon-round" fontSize="larger" color="error">
                    error
                  </Icon>
                  <DialogContent dividers className="dialog-content">
                    <Typography gutterBottom style={{ fontSize: "20" }}>
                      Are you sure you want to mark as active selected Records?
                    </Typography>
                  </DialogContent>
                  <DialogActions className="Dialog-Actions">
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

                {/* ===================== Inactive Dialog ===================== */}
                <Dialog
                  className="dialogbox"
                  open={inactiveopen}
                  onClose={handleClosing}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <Icon className="icon-round" fontSize="larger" color="error">
                    error
                  </Icon>
                  <DialogContent dividers className="dialog-content">
                    <Typography gutterBottom style={{ fontSize: "20" }}>
                      Are you sure you want to mark as inactive selected
                      Records?
                    </Typography>
                  </DialogContent>
                  <DialogActions className="Dialog-Actions">
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

                {/* ===================== Right Menu (Import / Export) ===================== */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu-right"
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
                  <MenuItem onClick={handleClose}>Import</MenuItem>
                  <MenuItem onClick={downloadExcel}>Export</MenuItem>

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
                      <MDTypography style={{ fontSize: 17 }} gutterBottom />
                      <MDBox>
                        <hr />
                      </MDBox>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue=""
                        value={selectedValue}
                        onChange={handleChanged}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="auto"
                          control={<Radio />}
                          label="GRN"
                        />
                        <FormControlLabel
                          value="add"
                          control={<Radio />}
                          label="Specific GRN"
                        />
                        {selectedValue === "add" && (
                          <Grid
                            container
                            rowSpacing={2}
                            columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                          >
                            <Grid item xs={4}>
                              <TextField
                                type="date"
                                label="From"
                                sx={{ width: 150 }}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                type="date"
                                label="To"
                                sx={{ width: 150 }}
                              />
                            </Grid>
                          </Grid>
                        )}
                      </RadioGroup>

                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue=""
                        name="radio-buttons-group"
                      >
                        <FormLabel id="demo-radio-buttons-group-label">
                          Export As :
                        </FormLabel>
                        <FormControlLabel
                          value="csv"
                          control={<Radio />}
                          label="CSV (Comma Separated Value)"
                        />
                        <FormControlLabel
                          value="xls"
                          control={<Radio />}
                          label="XLS (Microsoft Excel Compatible)"
                        />
                      </RadioGroup>
                    </DialogContent>
                    <DialogActions>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleClosed}
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
                </Menu>
              </MDBox>

              {/* Data area */}
              <MDBox pt={3}>
                <div className="datagrid-full-height">
                  <DataGrid
                    localeText={{ noRowsLabel: "No records" }}
                    autoHeight
                    loading={loading}
                    rows={searchTerm != "" ? filteredRows : data}
                    columns={columns}
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
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "transparent",
                      },
                      border: "none",
                      height: "100%",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
import {
  Autocomplete,
  DialogContentText,
  InputLabel,
  TextField,
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
import { generatePurchaseOrderPdf } from "../../utils/pdfUtils";

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

export default function purchaseorder() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formData, setFormData] = useState({
    module: "Order",
    action: "",
    ids: "",
  });

  const handleClickOpened = (orderData, grn) => {
    if (grn === null) {
      setorderData(orderData);
      setdialogbox(true);
    } else {
      ToastMassage("Grn Generated, Can not be delete, generate new PO.");
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
    const response = await axios_post(true, "purchase_order/list");
    console.log("purchase order list is -----", response.data);

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
  const handleEdit = (id, type, invoiceNumber, grn) => {
    if (type === "edit") {
      if (grn === null) {
        navigate(`/purchaseorder/edit/${id}`);
      } else {
        ToastMassage("Grn Generated, Can not be edit, generate new PO.");
      }
    } else if (type === "view") {
      navigate(`/purchaseorder/view/${id}`);
    }
  };

  const ganratePdf1 = async (id) => {
    try {
      const response = await axios_post(true, "order/details", { id });
      console.log("response-------------", response.data);

      let user_data = JSON.parse(localStorage.getItem("user_data"));

      const pdfData = response.data;
      const customerData = pdfData.customer;
      const item_modal = pdfData.order_details || [];

      let totalCGSTH = 0,
        totalCGSTAmount = 0,
        totalSGSTH = 0,
        totalSGSTAmount = 0,
        totalIGST = 0,
        totalIGSTAmount = 0,
        toatlTaxble = 0;

      let order_number =
        pdfData.invoice == null
          ? pdfData.order_number
          : pdfData.invoice.invoice_number;
      let order_date = moment(pdfData.created_at).format("DD/MM/YYYY");
      let TotalNet = pdfData.total_net || 0;
      let TotalGrand = pdfData.grand_total || 0;
      let Totaldiscount = pdfData.total_discount_amount || 0;

      let tableRows = "";

      item_modal.forEach((item, index) => {
        const locationModel = item.itemLocationModel || {}; // fallback if null/undefined
        const itemName = locationModel.item_name || "N/A";
        const itemPrice = locationModel.itemprice || item.item_price || "0.00";
        const itemRate = locationModel.rate || "0.00";

        totalCGSTH += parseFloat(item.taxa_ble || 0) / 2;
        totalCGSTAmount += parseFloat(item.cgst_amount || 0);
        toatlTaxble += parseFloat(item.taxa_ble || 0);
        totalSGSTH += parseFloat(item.taxa_ble || 0) / 2;
        totalSGSTAmount += parseFloat(item.sgst_amount || 0);
        totalIGST += parseFloat(item.igst || 0);
        totalIGSTAmount += parseFloat(item.igst_amount || 0);

        const totalCGSTPR = parseFloat(item.item_vat || 0) / 2;
        const totalCGST =
          item.is_free == 1 ? 0.0 : parseFloat(item.taxa_ble || 0) / 2;
        const totalSGSTPR = parseFloat(item.item_vat || 0) / 2;
        const totalSGST =
          item.is_free == 1 ? 0.0 : parseFloat(item.taxa_ble || 0) / 2;

        const truncatedItemCode =
          itemName.length > 30 ? itemName.substring(0, 30) : itemName;

        tableRows += `
        <tr>
          <td align="center">${index + 1}</td>
          <td>${truncatedItemCode}</td>
          <td>0.00</td>
          <td>${itemPrice}</td>
          <td>${
            item.discounttype === "Percentage"
              ? `${item.item_discount_amount}%`
              : `${item.item_discount_amount} INR`
          }</td>
          <td>${item.is_free == 1 ? "0.00" : item.item_qty || "0.00"}</td>
          <td>${
            item.is_free == 1
              ? item.item_qty || "0.00"
              : item.item_discount_amount || "0.00"
          }</td>
          <td>${itemPrice}</td>
          <td>${item.item_net || "0.00"}</td>
          <td>${item.item_grand_total || "0.00"}</td>
          <td>${itemRate}</td>
          <td>${totalCGSTPR}%</td>
          <td>${totalCGST.toFixed(2)}</td>
          <td>${totalSGSTPR}%</td>
          <td>${totalSGST.toFixed(2)}</td>
          <td>${item.igst || "0.00"}</td>
          <td>${item.igst_amount || "0.00"}</td>
        </tr>
      `;
      });

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order</title>
<style>
body { font-family: Arial, sans-serif; margin: 0px; }
table { font-size: 11px; width: 100%; border-collapse: collapse; }
th, td { padding: 4px 8px; text-align: left; }
th { background-color: #f2f2f2; }
img { width: 100px; margin-bottom: 10px; }
.table-invoice th, .table-invoice td { border: 1px solid #ddd; }
</style>
</head>
<body>
<table border="0" cellspacing="0" cellpadding="5">
<tr>
  <td><img src="/logo.jpg" alt="Company Logo"></td>
  <td style="border:1px solid #000000;">
    Valansa LifeScience Pvt. Ltd.<br>
    Address: M-23, F/F, B/P, Okhla, New Delhi-25<br>
    Email Id: ${user_data?.email}<br>
    MSME No: 08-0047457<br>
    GST No: 07ABWFM5189R1ZV<br>
    FSSAI No : 1332301000214<br>
    State Code : 07<br>
  </td>
  <td style="text-align: center; font-size: 15px; color:#000000;">
    Purchase Order<br>
    Purchase Number : ${order_number}<br>
    Purchase Date : ${order_date}
  </td>
  <td style="border:1px solid #000000;">
    Bill To Customer<br>
    ${customerData?.firstname || ""} ${customerData?.lastname || ""}<br>
    ${customerData?.email || ""}<br>
    ${customerData.customerInfo?.customer_address_1 || ""}<br>
    ${customerData.customerInfo?.customer_address_2 || ""}<br>
    ${customerData?.country?.name || ""}<br>
    GST No :<br> FSSAI No:
  </td>
</tr>
</table>

<br>
<table border="1" cellspacing="0" cellpadding="5" class="table-invoice">
<tr>
  <th>S No</th>
  <th>Product Description</th>
  <th>Pack</th>
  <th>MRP</th>
  <th>Disc%</th>
  <th>Sales Qty.</th>
  <th>Qty Disc.</th>
  <th>Rate</th>
  <th>Net Amt</th>
  <th>Gross Amt</th>
  <th>PTR</th>
  <th>CGST %</th>
  <th>CGST Amt</th>
  <th>SGST %</th>
  <th>SGST Amt</th>
  <th>IGST %</th>
  <th>IGST Amt</th>
</tr>
${tableRows}
</table>

<table border="0" cellspacing="0" cellpadding="0" style="width: 100%; margin-top: 20px;">
<tr>
  <td style="width:50%">
    <table cellspacing="0" cellpadding="0" style="width: 100%; border:0;">
      <tr><td style="font-weight:bold;">Terms & Conditions</td></tr>
      <tr><td style="font-size:8px;">
        1 - Supplier shall provide medicines in Food Category only.<br/>
        2 - Supplier shall provide medicines in Green Dot.<br/>
        3 - Supplier shall provide medicines with 2-year Shelf life.<br/>
        4 - Supplier shall comply with applicable laws.<br/>
        5 - Failure to comply is material breach.<br/>
        6 - Governed by New Delhi laws.
      </td></tr>
    </table>
  </td>
  <td style="width:50%">
    <table cellspacing="0" cellpadding="0" style="width:100%;">
      <tr>
        <td style="font-weight:bold; text-align:right;">Net Amount</td>
        <td style="text-align:right;">INR ${TotalNet}</td>
        <td style="font-weight:bold; text-align:right;">Total SGST</td>
        <td style="text-align:right;">INR ${totalSGSTH.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; text-align:right;">Total Discount</td>
        <td style="text-align:right;">INR ${Totaldiscount}</td>
        <td style="font-weight:bold; text-align:right;">Total IGST</td>
        <td style="text-align:right;">INR ${totalIGST.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="font-weight:bold; text-align:right;">Total CGST</td>
        <td style="text-align:right;">INR ${totalCGSTH.toFixed(2)}</td>
        <td style="font-weight:bold; text-align:right;">Total Amount</td>
        <td style="text-align:right;">INR ${TotalGrand}</td>
      </tr>
      <tr>
        <td colspan="2" style="font-weight:bold; font-size:smaller; text-align:left">
          Amount in words: ${convertToWords(TotalGrand)} Only
        </td>
      </tr>
    </table>
  </td>
</tr>

<tr>
  <td style="width:50%">
    <table cellspacing="0" cellpadding="0">
      <tr>
        <td style="font-weight:bold;">Bank Details for Online Payment</td>
        <td style="font-weight:bold; float:right;">Via QR Code</td>
      </tr>
      <tr>
        <td style="font-size:8px;">
          ACCOUNT NAME: Valansa LifeScience Pvt Ltd.<br>
          ACCOUNT CURRENCY: INR<br>
          Account No: 9212041716<br>
          IFSC Code : KKBK0000201<br>
          Bank : Kotak Mahindra Bank
        </td>
        <td><img src="/dummy_qr_code.png" alt="QR Code" style="float:right; width:25%"></td>
      </tr>
    </table>
  </td>
</tr>
</table>

</body>
</html>`;

      document.body.appendChild(tempDiv);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      doc.html(tempDiv, {
        callback: function (pdf) {
          pdf.save("Po-order.pdf");
          tempDiv.remove(); // clean up
        },
        x: 20,
        y: 20,
        width: 255,
        windowWidth: 995,
      });
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  const ganratePdf = async (id) => {
    try {
      const response = await axios_post(true, "order/details", { id });
      generatePurchaseOrderPdf(response.data);
    } catch (err) {
      console.error("Error generating PDF", err);
    }
  };

  const invoiceget = localStorage.getItem("usertype");
  const handleGenerateInvoice = (id, type, invoiceNumber, grn, row) => {
    console.log("grn frm the  handleGenerateInvoice", grn, row);

    if (type === "generate_invoice-po") {
      // if (grn === null) {
      if (parseFloat(row?.open_qty) > 0) {
        navigate(`/purchaseorder/generate_invoice-po/${id}`);
      } else {
        ToastMassage("GRN Completed, No Pending Qty.");
      }
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (invoiceNumber) => {
    const { id } = orderData;
    setIsDeleting(true);
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
        setIsDeleting(false);
      } else {
        ToastMassage(response.message, "error");
        setIsDeleting(false);
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
      headerName: "PO NUMBER",
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
      field: "order_date",
      headerName: "PO DATE",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "total_qty",
      headerName: "PO QTY",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "open_qty",
      headerName: "PEND QTY",
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
      field: "grn_number",
      headerName: "GRN NUMBER",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.grn?.grn_number,
    },
    {
      field: "rcd_qty",
      headerName: "RCD QTY",
      width: 100,
      sortable: true,
      disableColumnMenu: true,
      valueGetter: (params) => {
        const total = Number(params.row.total_qty) || 0;
        const received = Number(params.row.open_qty) || 0; // your receive qty column
        return total - received;
      },
    },
    // { field: "order_type", headerName: "ORDER TYPE", width: 100, sortable: true, disableColumnMenu: true, },
    // {
    //     field: "invoice_number", headerName: "GRN NUMBER", width: 100, sortable: true, disableColumnMenu: true,
    //     renderCell: (params) => params?.row?.invoice?.invoice_number,

    // },
    // { field: "current_stage", headerName: "APPROVAL", width: 150, sortable: true, disableColumnMenu: false, },
    {
      field: "status",
      headerName: "STATUS",
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
              <MenuItem
                onClick={() => {
                  handleEdit(
                    params.row.id,
                    "edit",
                    params.row.grn?.grn_number,
                    params.row.grn,
                  );
                }}
              >
                <Icon fontSize="small">edit</Icon> Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  ganratePdf(params.row.id);
                }}
              >
                <Icon fontSize="small">visibility</Icon> Pdf
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "view");
                }}
              >
                <Icon fontSize="small">visibility</Icon> View
              </MenuItem>
              {/* <MenuItem onClick={() => {ganratePdf(params.row.id) }}>
                                <Icon fontSize="small">visibility</Icon> Pdf
                            </MenuItem> */}
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleClickOpened(params.row, params.row.grn);
                }}
              >
                <Icon fontSize="small">delete</Icon> Delete
              </MenuItem>
              {invoiceget == 1 ? (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleGenerateInvoice(
                      params.row.id,
                      "generate_invoice-po",
                      params.row.grn?.grn_number,
                      params.row.grn,
                      params.row,
                    );
                  }}
                >
                  <Icon fontSize="small"> receipt</Icon> Generate GRN
                </MenuItem>
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
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const excelData = data.map((row, index) => ({
      "Sr No": index + 1,
      "PO Number": row.order_number || "",
      "Vendor Name": `${row.vendor_details?.firstname || ""} ${
        row.vendor_details?.lastname || ""
      }`,
      "PO Date": row.order_date
        ? moment(row.order_date).format("DD MMM YYYY")
        : "",
      "Total Qty": row.total_qty,
      "Open Qty": row.open_qty,
      Amount: row.grand_total,
      Status: row.status === 1 ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Orders");

    XLSX.writeFile(workbook, "purchase_orders.xlsx");
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

      {/* <Dialog
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
                        Are you sure want to delete this record {orderData.order_number}??
                    </Typography>
                </DialogContent>
                <DialogActions className="Dialog-Actions">
                    <Button autoFocus onClick={handleClosing}>
                        Cancel
                    </Button>
                    <Button autoFocus onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog> */}
      {/* Page background and card styling */}
      <style>{`
        /* page background */
        .po-page {
          background: #f9f9f9;
          min-height: calc(100vh - 64px); /* account for navbar height */
          padding-bottom: 17px;
        }

        /* Make DataGrid virtual scroller render zone behave like vertical stack with gaps (cards) */
        .MuiDataGrid-virtualScrollerRenderZone {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 8px;
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

      <MDBox className="custome-card po-page" pt={4} pb={3}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card className="po-card-wrapper">
              {/* Header Section */}
              <MDBox
                sx={{
                  background:
                    "linear-gradient(90deg, #1976d2 0%, #2196f3 100%)",
                  borderRadius: "10px",
                  px: 3,
                  py: 2,
                  mt: -3,
                  mx: 2,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Left Title */}
                  <Grid item xs={12} md={3} lg={3}>
                    <MDTypography
                      variant="h6"
                      color="white"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      <Icon fontSize="small" sx={{ mr: 1 }}>
                        person
                      </Icon>
                      Purchase Order
                    </MDTypography>
                  </Grid>

                  {/* Center Search Bar */}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MDInput
                      type="text"
                      variant="outlined"
                      name="order_number"
                      sx={{
                        width: { xs: "95%", md: 500 },
                        background: "#fff",
                        borderRadius: "8px",
                        input: { color: "#333", height: "12px" },
                      }}
                      placeholder="Search by vendor, PO#, employee, amount..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Grid>

                  {/* Right Side Buttons */}
                  <Grid
                    item
                    xs={12}
                    md={3}
                    lg={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <MDTypography
                      component={Link}
                      to="/master/purchaseorder/add"
                    >
                      <MDButton
                        variant="contained"
                        sx={{
                          background: "#fff",
                          color: "#1976d2",
                          fontWeight: 500,
                          px: 2,
                          py: 1,
                          "&:hover": { background: "#e3f2fd" },
                        }}
                      >
                        &#x2b;&nbsp;New
                      </MDButton>
                    </MDTypography>

                    <MDButton
                      variant="outlined"
                      sx={{
                        background: "#fff",
                        color: "#1976d2",
                        borderColor: "#1976d2",
                        px: 2,
                        py: 1,
                        "&:hover": { background: "#e3f2fd" },
                      }}
                      onClick={handleClickaction}
                    >
                      Bulk Actions
                    </MDButton>

                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{
                        background: "#fff",
                        color: "#1976d2",
                        "&:hover": { background: "#e3f2fd" },
                      }}
                    >
                      <IconButton
                        onClick={handleMenuOpen}
                        size="small"
                        sx={{
                          background: "#fff",
                          color: "#1976d2",
                          "&:hover": { background: "#e3f2fd" },
                        }}
                      >
                        <Icon fontSize="small">menu</Icon>
                      </IconButton>

                      <Menu
                        anchorEl={menuAnchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose} // 🔥 must
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            downloadExcel();
                          }}
                        >
                          <Icon fontSize="small" sx={{ mr: 1 }}>
                            download
                          </Icon>
                          Export
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            toast.info("Import clicked");
                          }}
                        >
                          <Icon fontSize="small" sx={{ mr: 1 }}>
                            upload
                          </Icon>
                          Import
                        </MenuItem>
                      </Menu>
                    </IconButton>
                  </Grid>
                </Grid>

                {/* --- Menus and Dialogs remain unchanged --- */}
                {/** Keep all Menu, Dialog, and DataGrid sections exactly as is below **/}
              </MDBox>

              {/* Data Section */}
              <MDBox pt={3} sx={{ p: 2 }}>
                <div
                  className="datagrid-full-height"
                  style={{ height: "calc(100vh - 260px)" }}
                >
                  <DataGrid
                    localeText={{ noRowsLabel: "No records" }}
                    loading={loading}
                    rows={searchTerm !== "" ? filteredRows : data}
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
                    sx={{
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#e7f2ff",
                      },
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
            Do you really want to delete this {orderData.order_number} Purchase
            Order?
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

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

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

export default function payment() {
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

  const [data, setData] = useState([]);
  const [dialogbox, setdialogbox] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [orderData, setorderData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    module: "Order",
    action: "",
    ids: "",
  });
  const validations = () => {
    let errors = {};
    if (!comment) {
      errors.comment = "Comment is required";
    }
    // if (!formData.type) {
    //     errors.type = "Type is required";
    // }
    return errors;
  };

  const handleCommentModalOpen = (id) => {
    setCurrentId(id);
    setCommentOpen(true);
  };

  const handleCommentModalClose = () => {
    setCommentOpen(false);
    setCurrentId(null);
  };

  const handleSubmitComment = async () => {
    let errors = validations(comment);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      const response = await axios_post(
        true,
        "collection/collection_status_update ",
        {
          id: currentId,
          comment: comment,
        }
      );
      getdetails();
      ToastMassage(response.message, "success");
      setCommentOpen(false);
      setComment("");
    }
  };

  const handleClickOpened = (orderData, invoice) => {
    // if (invoice === null) {
    setorderData(orderData);
    setdialogbox(true);
    // } else {
    //     ToastMassage('Invoice Generated, Can not be delete, generate new Order.');
    // }
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
    const response = await axios_post(true, "collection/list");
    console.log("respnse from the collection is ----", response);

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
    // if (type === 'edit') {
    //     if (invoice === null) {
    // } else {
    //     ToastMassage('Invoice Generated, Can not be edit, generate new Order.');
    // }
    // } else if (type === 'view') {
    //     navigate(`/order/view/${id}`);
    // }

    if (type === "edit") {
      navigate(`/payment/edit/${id}`);
    } else if (type === "view") {
      navigate(`/payment/view/${id}`);
    }
  };
  const ganratePdf = async (id) => {
    const response = await axios_post(true, "order/details", {
      id: id,
    });
    let user_data = JSON.parse(localStorage.getItem("user_data"));

    var doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const pdfData = response.data;
    const customerData = pdfData.customer;
    const item_modal = pdfData.order_details;
    let totalCGSTH = 0;
    let totalCGSTAmount = 0;
    let totalSGSTH = 0;
    let totalSGSTAmount = 0;
    let totalIGST = 0;
    let totalIGSTAmount = 0;
    let toatlTaxble = 0;
    // let csgst = parseFloat((parseInt(pdfData.grand_total)*9)/100)
    // let sgst =  parseFloat((parseInt(pdfData.grand_total)*9)/100)
    const tempDiv = document.createElement("div");
    let order_number =
      pdfData.invoice == null
        ? pdfData.order_number
        : pdfData.invoice.invoice_number;
    let order_date = moment(pdfData.created_at).format("DD/MM/YYYY");

    let TotalNet = pdfData.total_net;
    let TotalGrand = pdfData.grand_total;
    let Totaldiscount = pdfData.total_discount_amount;
    let tableRows = "";
    item_modal?.forEach((item, index) => {
      totalCGSTH += parseFloat(item.taxa_ble) / 2;
      totalCGSTAmount += parseFloat(item.cgst_amount || 0);
      toatlTaxble += parseFloat(item.taxa_ble || 0);
      totalSGSTH += parseFloat(item.taxa_ble) / 2;
      totalSGSTAmount += parseFloat(item.sgst_amount || 0);
      totalIGST += parseFloat(item.igst || 0);
      totalIGSTAmount += parseFloat(item.igst_amount || 0);
      const truncatedItemCode =
        item.itemModel.item_name.length > 30
          ? item.itemModel.item_name.substring(0, 30)
          : item.itemModel.item_name;

      let totalCGSTPR = parseFloat(item.item_vat) / 2; // item.cgst
      let totalCGST = item.is_free == 1 ? 0.0 : parseFloat(item.taxa_ble) / 2; // item.cgst_amount
      let totalSGSTPR = parseFloat(item.item_vat) / 2; // item.sgst
      let totalSGST = item.is_free == 1 ? 0.0 : parseFloat(item.taxa_ble) / 2; // item.sgst_amount

      tableRows += `
                <tr>
                    <td align="center">${index + 1}</td>
                    <td>${truncatedItemCode || ""}</td>
                    <td>${item.hsn_code || ""}</td>
                    <td>${"0.00"}</td>
                    <td>${item.receiving_site || ""}</td>
                    <td>${
                      (item.expiry_delivery_date &&
                        moment(item.expiry_delivery_date).format("M/YY")) ||
                      ""
                    }</td>
                    <td>${item.itemModel.itemprice || ""}</td>
                    <td>${
                      item.discounttype === "Percentage"
                        ? `${item.item_discount_amount}%`
                        : `${item.item_discount_amount} INR` || ""
                    }</td>
                    <td>${item.is_free == 1 ? "0.00" : item.item_qty || ""}</td>
                     <td>${
                       item.is_free == 1
                         ? item.item_qty
                         : item.item_discount_amount || ""
                     }</td>
                    <td>${item.item_price || ""}</td>
                    <td>${item.item_net || ""}</td>
                    <td>${item.item_grand_total || ""}</td>
                     <td>${item.itemModel.rate || ""}</td>
                    <td>${totalCGSTPR + "%" || ""}</td>
                    <td>${totalCGST.toFixed(2) || ""}</td>
                    <td>${totalSGSTPR + "%" || ""}</td>
                    <td>${totalSGST.toFixed(2) || ""}</td>
                    
                </tr>
            `;
    });

    tempDiv.innerHTML = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order</title>
    <link rel="stylesheet" href="styles.css">
</head>
<style>
    body {
    font-family: Arial, sans-serif;
    margin: 0px;
}

table {
    font-size: 11px;
    width: 100%;
}

th, td {
    padding: 4px 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

strong {
    font-weight: bold;
    color:#ffffff;
}

img {
    width: 100px;
    margin-bottom: 10px;
}

.table-invoice {
    border-collapse: collapse;
}

.table-invoice th, .table-invoice td {
    border: 1px solid #ddd;
}


</style>
<body>

    <table border="0" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td>
                <img src="/logo.jpg" alt="Company Logo"> 
            </td>
            <td style="border:1px solid #000000;">
                Valansa LifeScience Pvt. Ltd.
                <br>
                Address: M-23, F/F, B/P, Okhla, New Delhi-25<br>
                Email Id: ${user_data?.email}<br>
                MSME No: 08-0047457<br>
                GST No: 07ABWFM5189R1ZV<br>
                FSSAI No : 13323010000214<br>
                State Code : 07<br>
            </td>

            <td style="text-align: center; font-size: 15px; color:#000000;">
                Order<br>
                Order Number : ${order_number}<br>
                Order Date : ${order_date}
            </td>
             <td style="border:1px solid #000000;">
               Bill To Customer<br>
                ${customerData?.firstname} ${customerData?.lastname}<br>
                ${customerData?.email}<br>
                ${customerData.customerInfo?.customer_address_1}<br>
                ${customerData.customerInfo?.customer_address_2}<br>
                ${customerData?.country?.name}<br>
                GST No : ${
                  customerData.custax1 == null ? "" : customerData.custax1
                }<br>
                FSSAI No: ${
                  customerData.customerInfo?.fssai_no == null
                    ? ""
                    : customerData.customerInfo?.fssai_no
                }
            </td>
        </tr>
    </table>
        <br>
    <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
        <tr>
            <th>S No</th>
            <th>Product Description</th>
            <th>HSN</th>
            <th>Pack</th>
            <th>Batch No</th>
            <th>Exp.</th>
            <th>MRP</th>
            <th>Disc</th>
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
        </tr>
         ${tableRows}
    </table>
    <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
            <td style="width: 50%;">
                <table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;border:0;">
                    <tr>
                        <td style="font-weight:bold;">Terms & Conditions</td>
                     </tr>
                     <tr>
                        <td style="font-size:8px;">
                            1 - Supplier shall provide above-mentioned medicines in Food Category only.<br/>
                            2 - Supplier shall provide above mentioned medicines in Green Dot (specifying product is Veg).<br/>
                            3 - Supplier Shall provide above-mentioned medicines with 2-year Shelf life from manufacturing date.<br/>
                            4 - Supplier represents and warrants that it will comply with all applicable local and national laws and regulations pertaining to the performance of its
                            obligations under this Purchase Order. In particular and without limitation, Supplier shall not:<br/>
                            - Deliver any product(s) / service(s) prohibited and/or restricted as per the local or national laws and regulations pertaining to its performance of its obligations under the Ordering Documents.<br/>
                            -Take any action that will render Purchaser and/or its subsidiaries liable for a violation of any applicable anti-bribery legislation.<br/>
                            5 - The supplier’s failure to comply with this provision shall constitute a material breach of this Purchase Order.<br/>
                            6 - This Purchase Order Agreement shall be governed by, and construed in accordance with, the New Delhi, India and all it and Regulation.<br/>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; line-height:"20px">
                <table cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
                <tr>
                <td style="width="100%">
                 <tr style="padding-right: 20%;">
                        <td style="font-weight: bold;text-align:right;">Total Discount</td>
                        <td style="text-align: right;">INR ${Totaldiscount}</td>
                        <td style="font-weight: bold; text-align: right">Total SGST</td>
                        <td style="text-align: right;">INR ${
                          totalSGSTH.toFixed(2) || ""
                        }</td>
                    </tr>
                     <tr style="padding-left: 20%;">
                        <td style="font-weight: bold; text-align:right;">Net Amount</td>
                        <td style="text-align: right;padding-right: 0px;">INR ${TotalNet}</td>
                        <td style="font-weight: bold; text-align: right">Total IGST</td>
                        <td style="text-align: right;">INR ${
                          totalIGST.toFixed(2) || ""
                        }</td>
                    </tr>
                     <tr style="padding-right: 20%;">
                        <td style="font-weight: bold; text-align:right;">Total CGST</td>
                        <td style="text-align: right;">INR ${
                          totalCGSTH.toFixed(2) || ""
                        }</td>
                        <td  style="font-weight: bold; text-align: right">Total Amount</td>
                        <td style="text-align: right;">INR ${TotalGrand}</td>
                    </tr>
                </td>

                </tr>
                </table>
                 <table>
                <tr>
            <td colspan="2" style="font-weight: bold;font-size: smaller; text-align: left">
                Amount in words: ${convertToWords(TotalGrand)} Only
            </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
         <td style="width: 50%;">
            <tr>
         <td style="font-weight:bold;">Bank Details for Online Payment</td>
         <td style="font-weight:bold; float: right;">Via QR Code</td>
         </tr>
        <tr>
            <td style="font-size:8px;">
                ACCOUNT NAME: Valansa LifeScience Pvt Ltd.<br>
                ACCOUNT CURRENCY: INR<br>
                Account No: 9212041716<br>
                IFSC Code : KKBK0000201<br>
                Bank : Kotak Mahindra Bank
            </td>
            <td>
                <img src="/dummy_qr_code.png" alt="Company Logo" style="float: right; width:25%">
            </td>
        </tr>
        <tr>
            <td colspan="2">
            </td>
        </tr>
        <td>
    </table>
</body>
</html>`;
    document.body.appendChild(tempDiv);

    doc.html(tempDiv, {
      callback: function (pdf) {
        pdf.save("order.pdf");
        window.location.reload();
      },
      x: 20,
      y: 20,
      width: 255,
      windowWidth: 995,
    });
  };
  const invoiceget = localStorage.getItem("usertype");
  const handleGenerateInvoice = (id, type, invoiceNumber, invoice) => {
    if (type === "generate_invoice") {
      if (invoice === null) {
        navigate(`/order/generate_invoice/${id}`);
      } else {
        ToastMassage(
          "Invoice Generated, Can not be generate invoice, generate new Order."
        );
      }
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (invoiceNumber) => {
    const { id } = orderData;

    try {
      const response = await axios_post(true, "collection/delete", {
        id: id,
      });
      if (response.status === true) {
        getdetails();
        ToastMassage("collection deleted successfully", "success");
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
      field: "collection_number",
      headerName: "COLLECTION NUMBER",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },

    {
      field: "total_payment_amount",
      headerName: "TOTAL PAYMENT AMOUNT",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "pay_amount",
      headerName: "PAY AMOUNT",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "balance_amount",
      headerName: "BALANCE AMOUNT",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "collection_status",
      headerName: "collection status",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },
    {
      field: "comment",
      headerName: "Comment",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
    },

    {
      field: "name",
      headerName: "PAYMENT TYPE",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.payment_types?.name,
    },
    {
      field: "transaction_num",
      headerName: "TRANSACTION NUMBER",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.transaction?.transaction_num,
    },

    // { field: "cheque_number", headerName: "CHECK NUMBER", width: 100, sortable: true, disableColumnMenu: true, },
    // { field: "bank_num", headerName: "BANK NUMBER", width: 100, sortable: true, disableColumnMenu: true, },
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
                    params.row.invoice?.invoice_number,
                    params.row.invoice
                  );
                }}
              >
                <Icon fontSize="small">edit</Icon> Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEdit(
                    params.row.id,
                    "view",
                    params.row.invoice?.invoice_number,
                    params.row.invoice
                  );
                }}
              >
                <Icon fontSize="small">visibility</Icon> View
              </MenuItem>
              {params.row?.collection_status == "Approved" ? (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleClickOpened(params.row, params.row.invoice);
                  }}
                >
                  <Icon fontSize="small">delete</Icon> Reverse
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleCommentModalOpen(params.row.id, params.row.invoice);
                  }}
                >
                  <CheckCircleIcon fontSize="small">Approved</CheckCircleIcon>{" "}
                  Approved
                </MenuItem>
              )}

              {/* {invoiceget == 1 ? (
                                <MenuItem onClick={() => {
                                    handleClose(); handleGenerateInvoice(params.row.id, 'generate_invoice', params.row.invoice?.invoice_number, params.row.invoice)
                                }}>
                                    < Icon fontSize="small" > receipt</Icon> Generate Invoice
                                </MenuItem >
                            ) : ""
                            } */}
            </Menu>
            <Dialog open={commentOpen} onClose={handleCommentModalClose}>
              <DialogTitle>Add Comment</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please add a comment before approving.
                </DialogContentText>
                <InputLabel sx={{ mb: 1 }}>Comment</InputLabel>
                <TextField
                  margin="dense"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {formErrors.comment && (
                  <MDTypography
                    color="error"
                    sx={{ fontSize: "14px", mt: "10px" }}
                  >
                    {formError.comment}
                  </MDTypography>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCommentModalClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSubmitComment} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );
      },
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  // Memoized function to filter rows based on search term
  const filteredRows = useMemo(() => {
    return data.filter((row) => {
      const customerName =
        row.customer?.customerInfo?.customer_code +
        " - " +
        row.customer?.firstname;
      const invoiceNumber = row.collection_number;
      return (
        customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

      <Dialog
        open={dialogbox}
        onClose={handleClosing}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Do you really want to delete this {orderData.order_number} Payment?
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
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                <Grid container spacing={1}>
                  <Grid item xs={2} mr={40}>
                    <MDTypography variant="h6" color="white">
                      <Icon fontSize="small">person</Icon>
                      Payment
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/payment">
                      <MDButton variant="gradient" color="light">
                        &#x2b;&nbsp;New
                      </MDButton>
                    </MDTypography>
                  </Grid>
                  {SelectedUUID == "" ? (
                    ""
                  ) : (
                    <>
                      <Grid item xs={1} ml={5}>
                        <MDBox>
                          <MDButton
                            className="bulk-button"
                            aria-haspopup="true"
                            onClick={handleClickaction}
                            variant="gradient"
                            color="light"
                          >
                            Bulk Actions
                          </MDButton>
                        </MDBox>
                      </Grid>
                    </>
                  )}
                  <Grid item xs={1}>
                    <MDBox>
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        // aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        // aria-expanded={open ? 'true' : undefined}
                      >
                        <Icon fontSize="small">menu</Icon>
                      </IconButton>
                    </MDBox>
                  </Grid>
                </Grid>
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
                      Are you sure want to mark as active selected Records
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
                      Yes, mark as active !
                    </Button>
                  </DialogActions>
                </Dialog>
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
                      Are you sure want to mark as inactive selected Records
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
                      Yes, mark as inactive !
                    </Button>
                  </DialogActions>
                </Dialog>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  // onClick={handleClose}
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
                  <MenuItem onClick={handleClickOpen}>Export</MenuItem>
                  <BootstrapDialog
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
                      <MDTypography style={{ fontSize: 17 }} gutterBottom>
                        {/* Order Display can export data from Invoice in CSV or XLS format. */}
                      </MDTypography>
                      <MDBox>
                        <hr></hr>
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
                          label=" Order"
                        />
                        <FormControlLabel
                          value="add"
                          control={<Radio />}
                          label="Specific Order"
                        />
                        {selectedValue === "add" && (
                          <>
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
                          </>
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
                  </BootstrapDialog>
                </Menu>
              </MDBox>

              <MDBox pr={1} sx={{ textAlign: "Right" }}>
                <MDInput
                  type="text"
                  // label="Order Number"
                  variant="outlined"
                  name="order_number"
                  sx={{ width: 300 }}
                  margin="normal"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </MDBox>
              <MDBox pt={3}>
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
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

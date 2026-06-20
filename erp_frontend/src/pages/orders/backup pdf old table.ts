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
import { Autocomplete, DialogContentText, InputLabel, TextField } from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ToastMassage } from "toast";
import jsPDF from 'jspdf';
import MDInput from "components/MDInput";

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

    const handleClickOpened = (orderData, invoice) => {
        if (invoice === null) {
            setorderData(orderData);
            setdialogbox(true);
        } else {
            ToastMassage('Invoice Generated, Can not be delete, generate new Oreder.');
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
        if (response) {
            if (response.status) {
                const { records } = response?.data;
                setData(records);
                setLoading(false);
            } else {
                ToastMassage(response.message, 'error')
                setLoading(false);
            }
        }
    };
    const handleEdit = (id, type, invoiceNumber, invoice) => {
        if (type === 'edit') {
            if (invoice === null) {
                navigate(`/order/edit/${id}`);
                console.log("undefined")
            } else {
                ToastMassage('Invoice Generated, Can not be edit, generate new Oreder.');
            }
        } else if (type === 'view') {
            navigate(`/order/view/${id}`);
        }
    };
    const ganratePdf = async (id) => {
        const response = await axios_post(true, "order/details", {
            id: id
        });
        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        })
        const pdfData = response.data;
        const item_modal = pdfData.order_details;
        let totalCGST = 0;
        let totalCGSTAmount = 0;
        let totalSGST = 0;
        let totalSGSTAmount = 0;
        let totalIGST = 0;
        let totalIGSTAmount = 0;
        console.log('response', response.data);
        console.log('item_modal', item_modal);
        const tempDiv = document.createElement('div');
        let tableRows = '';
        item_modal.forEach((item, index) => {
            totalCGST += parseFloat(item.cgst || 0);
            totalCGSTAmount += parseFloat(item.cgst_amount || 0);
            totalSGST += parseFloat(item.sgst || 0);
            totalSGSTAmount += parseFloat(item.sgst_amount || 0);
            totalIGST += parseFloat(item.igst || 0);
            totalIGSTAmount += parseFloat(item.igst_amount || 0);
            const truncatedItemCode = item.itemModel.item_name.length > 30
                ? item.itemModel.item_name.substring(0, 30)
                : item.itemModel.item_name;
            tableRows += `
                <tr>
                    <td align="center">${index + 1}</td>
                    <td>${truncatedItemCode}</td>
                    <td>${item.itemModel.item_code}</td>
                    <td>${item.ship_quantity || ''}</td>
                    <td>${item.batch_number || 'none'}</td>
                    <td>${item.exp_date || ''}</td>
                    <td>${item.item_price || ''}</td>
                    <td>${item.ship_quantity || ''}</td>
                    <td>${item.item_discount_amount || ''}</td>
                    <td>${item.item_qty || ''}</td>
                    <td>${item.itemModel.rate || ''}</td>
                    <td>${item.item_grand_total || ''}</td>
                    <td>${item.ptr_di || ''}</td>
                    <td>${item.taxa_ble || ''}</td>
                    <td>${item.cgst || ''}</td>
                    <td>${item.cgst_amount || ''}</td>
                    <td>${item.sgst || ''}</td>
                    <td>${item.sgst_amount || ''}</td>
                    <td>${item.igst || ''}</td>
                    <td>${item.igst_amount || ''}</td>
                </tr>
            `;
        });


        tempDiv.innerHTML =
            `<!DOCTYPE html>
     <html lang="en">
     <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />

     <title>Invoice Table</title>
     <style>
      body {
        font-family: Arial, sans-serif;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 2% 0;
        font-size: 1vw;
        table-layout: fixed;
      }

      th,
      td {
        border: 0.1vw solid black;
        padding: 0.3vw 0.5vw;
        text-align: left;
        vertical-align: top;
        word-break:break-all;
      }

      th {
        background-color: #f2f2f2;
        font-weight: bolder;
        font-size: 1vw;
      }
        .product-tbl td{
        font-size: 1vw;
        }
      .header-table {
        width: 100%;
      }

      .header-table td {
        border: 0.1vw solid black;
      }

      .header-left {
        width: 25%;
        text-align: left;
      }

      .header-right {
        width: 45%;
        text-align: left;
      }

      .total-row td {
        border-top: 0.2vw solid black;
      }

      .no-border {
        border: none;
      }

      .signature-row td {
        padding-top: 1.5%;
        font-weight: bolder;
      }

      .signature {
        height: 4vw;
        border-bottom: 0.1vw solid black;
        width: 18%;
      }
     </style>
     </head>

     <body>
     <table class="header-table">
      <tr>
        <td class="header-left" rowspan="2">
          <strong style="font-size: small">MEDISPAN PHARMACEUTICAL</strong><br />
          T4-11A, OKHLA AVENUE, DELHI-25<br />
          Tel No.: 9971743983<br />
          INSPE NO.: 08AQPWA7457J<br />
          GSTIN No.: 07ABDPW5538R1ZV<br />
          <strong>Email:</strong> medispanpharmaceutical@gmail.com
        </td>
        <td class="header-right" colspan="2">
          <strong style="font-size: medium"
            >AHMED GASTRO LIVER & DENTAL CLINIC</strong
          ><br />
          A-2/1A RAFI COMPLEX NEAR OKHLA METRO STATION, <br />ABU FAZAL ENCL.
          JAMIA NAGAR<br />
          OKHLA, NEW DELHI<br />
          FASSAI No.: 13323010000214<br />
          State Code: 07<br />
          Tel No.: 9319188872
        </td>
        <td colspan="2" style="margin-bottom: 10%; margin-bottom: 10%"; width:"100%">
          Invoice No.: <strong>${pdfData.order_number || ''}</strong><br />
          Invoice Date: <strong>${pdfData.order_date || ''}</strong><br />

          <hr style="border: 0; border-top: 0.1vw solid black; margin: 1% 0" />

          E.B. No.: <br />
           Due Date: <strong>${pdfData.due_date || ''}</strong><br />
          Page 1 of 1
        </td>
      </tr>
     </table>

     <table class="product-tbl">
      <tr>
        <th width="2%" align="center">-</th>
        <th width="9%">Product Name</th>
        <th width="7%">HSN Code</th>
        <th width="5%">Pack</th>
        <th width="5%">Batch No.</th>
        <th width="5%">Exp.</th>
        <th width="5%">MRP</th>
        <th width="4%">Sale QTY</th>
        <th width="4%">Disc</th>
        <th width="4%">QTY</th>
        <th width="5%">Rate</th>
        <th width="5%">Amount</th>
        <th width="5%">PTR DIS%</th>
        <th width="5%">Taxable</th>
        <th width="5%">CGST%</th>
        <th width="5%">CGST Amount</th>
        <th width="5%">SGST%</th>
        <th width="5%">SGST Amount</th>
        <th width="5%">IGST%</th>
        <th width="5%">IGST Amount</th>
      </tr>
       ${tableRows}
      <tr class="total-row">
        <td colspan="13" align="right"><strong>Total</strong></td>
        <td>${pdfData.taxable_total || ''}</td>
      <td>${totalCGST.toFixed(2) || ''}</td>
      <td>${totalCGSTAmount.toFixed(2) || ''}</td>
      <td>${totalSGST.toFixed(2) || ''}</td>
      <td>${totalSGSTAmount.toFixed(2) || ''}</td>
      <td>${totalIGST.toFixed(2) || ''}</td>
      <td>${totalIGSTAmount.toFixed(2) || ''}</td>
      </tr>
      <tr class="signature-row">
        <td colspan="20" align="LE">
          <strong>Received By:</strong><br /><br />
          <div class="signature"></div>
          <strong>Signature</strong>
        </td>
      </tr>
      </table>
      </body>
      </html>`;
        document.body.appendChild(tempDiv);

        doc.html(tempDiv, {
            callback: function (pdf) {
                pdf.save("order invoice.pdf");
                window.location.reload();
            },
            x: 20,
            y: 20,
            width: 255,
            windowWidth: 995,
        });
    }
    const invoiceget = localStorage.getItem("usertype");
    const handleGenerateInvoice = (id, type, invoiceNumber, invoice) => {
        if (type === 'generate_invoice') {
            if (invoice === null)  {
                navigate(`/order/generate_invoice/${id}`);
            } else {
                ToastMassage('Invoice Generated, Can not be generate invoice, generate new Oreder.');
            }
        }
    };

    const handleDelete = async (invoiceNumber) => {
        const { id } = orderData;

        try {
            const response = await axios_post(true, "order/delete", {
                id: id
            });
            if (response.status === true) {
                getdetails();
                ToastMassage('Order deleted successfully', 'success')
                handleCloseDeleteModal();
                setorderData({});
                setdialogbox(false);
            }
            else {
                ToastMassage(response.message, 'error')
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    }

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
            renderCell: (params) => moment(params?.value).format("DD MMM YYYY hh:mm A"),
        },
        { field: "order_number", headerName: "ORDER NUMBER", width: 150, sortable: true, disableColumnMenu: true, },
        {
            field: "customer",
            headerName: "CUSTOMER NAME",
            width: 200,
            sortable: true,
            disableColumnMenu: true,
            renderCell: (params) => params?.row?.customer?.customerInfo?.customer_code + " - " + params?.value?.firstname,
        },
        {
            field: "salesman",
            headerName: "SALESMAN NAME",
            width: 150,
            sortable: true,
            disableColumnMenu: true,
            renderCell: (params) => params?.row?.salesman?.salesmanInfo?.salesman_code + " - " + params?.value?.firstname + " " + params?.value?.lastname,
        },
        { field: "due_date", headerName: "DUE DATE", width: 100, sortable: true, disableColumnMenu: true, },
        { field: "grand_total", headerName: "AMOUNT", width: 100, sortable: true, disableColumnMenu: true, },
        { field: "order_type", headerName: "ORDER TYPE", width: 100, sortable: true, disableColumnMenu: true, },
        {
            field: "invoice_number", headerName: "INVOICE NUMBER", width: 100, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.invoice?.invoice_number,

        },
        // { field: "current_stage", headerName: "APPROVAL", width: 150, sortable: true, disableColumnMenu: false, },
        { field: "status", headerName: "STATUS", width: 100, sortable: true, disableColumnMenu: true, },

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
                            <MenuItem onClick={() => { handleEdit(params.row.id, 'edit', params.row.invoice?.invoice_number, params.row.invoice) }}>
                                <Icon fontSize="small">edit</Icon> Edit
                            </MenuItem>
                            <MenuItem onClick={() => { ganratePdf(params.row.id) }} >
                                <Icon fontSize="small">visibility</Icon> Pdf
                            </MenuItem>
                            <MenuItem onClick={() => { handleEdit(params.row.id, 'view') }}>
                                <Icon fontSize="small">visibility</Icon> View
                            </MenuItem>
                            {/* <MenuItem onClick={() => {ganratePdf(params.row.id) }}>
                                <Icon fontSize="small">visibility</Icon> Pdf
                            </MenuItem> */}
                            <MenuItem onClick={() => {
                                handleClose(); handleClickOpened(params.row, params.row.invoice)
                            }}>
                                <Icon fontSize="small">delete</Icon> Delete
                            </MenuItem>
                            {invoiceget == 1 ? (
                                <MenuItem onClick={() => {
                                    handleClose(); handleGenerateInvoice(params.row.id, 'generate_invoice', params.row.invoice?.invoice_number, params.row.invoice)
                                }}>
                                    < Icon fontSize="small" > receipt</Icon> Generate Invoice
                                </MenuItem >
                            ) : ""
                            }

                        </Menu >
                    </>
                );
            },
        },

    ];


    const [searchTerm, setSearchTerm] = useState('');

    // Memoized function to filter rows based on search term
    const filteredRows = useMemo(() => {
        return data.filter((row) => {
            const customerName = row.customer?.customerInfo?.customer_code + " - " + row.customer?.firstname;
            const salesmanName = row.salesman?.salesmanInfo?.salesman_code + " - " + row.salesman?.firstname + " " + row.salesman?.lastname;
            const invoiceNumber = row.invoice_number;
            const orderNumber = row.order_number;
            return (
                customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                salesmanName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (row.due_date && row.due_date.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.grand_total && row.grand_total.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.order_type && row.order_type.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                (invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()))

            );
        });
    }, [searchTerm]);

    // console.log('filteredRows', filteredRows);

    return (
        <DashboardLayout>
            <DashboardNavbar />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
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
                        Do you really want to delete this {orderData.order_number} Order?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosing} color="primary">
                        Cancel
                    </Button>
                   <Button onClick={handleDelete} disabled={isDeleting} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <MDBox pt={6} pb={3}>
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
                                            All Orders
                                        </MDTypography>
                                    </Grid>
                                    <Grid item xs={1} ml={40}>
                                        <MDTypography component={Link} to="/master/order/add">
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
                                    <MenuItem onClick={handleClickactionOpen}>Mark as Active</MenuItem>
                                    <MenuItem onClick={handleClickinactiveOpen}>Mark as Inactive</MenuItem>
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
                                        <Button autoFocus onClick={(e) => handleActiveModalSubmit("active")}>
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
                                        <Button autoFocus onClick={(e) => handleActiveModalSubmit("inactive")}>
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
                                    <MenuItem onClick={handleClose}>Import Order</MenuItem>
                                    <MenuItem onClick={handleClickOpen}>Export Orders</MenuItem>
                                    <BootstrapDialog
                                        onClose={handleClosed}
                                        aria-labelledby="customized-dialog-title"
                                        open={opened}
                                    >
                                        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClosed}>
                                            Export Order
                                        </BootstrapDialogTitle>
                                        <DialogContent dividers>
                                            <MDTypography style={{ fontSize: 17 }} gutterBottom>
                                                Order Display can export data from Invoice in CSV or XLS format.
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
                                                <FormControlLabel value="auto" control={<Radio />} label=" Order" />
                                                <FormControlLabel value="add" control={<Radio />} label="Specific Order" />
                                                {selectedValue === "add" && (
                                                    <>
                                                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                                                            <Grid item xs={4}>
                                                                <TextField type="date" label="From" sx={{ width: 150 }} />
                                                            </Grid>
                                                            <Grid item xs={4}>
                                                                <TextField type="date" label="To" sx={{ width: 150 }} />
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
                                                <FormLabel id="demo-radio-buttons-group-label">Export As :</FormLabel>
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
                                            <MDButton variant="text" color="info" autoFocus onClick={handleClosed}>
                                                Export
                                            </MDButton>
                                            <MDButton variant="text" color="info" autoFocus onClick={handleClosed}>
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
            localeText={{noRowsLabel: "No records", }}
                                    autoHeight
                                    loading={loading}
                                    rows={searchTerm != '' ? filteredRows : data}
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
                                                '& .MuiDataGrid-menuList': {
                                                    minWidth: '200px', // Set the minimum width for the menu list
                                                },
                                                '& .MuiMenuItem-root .MuiTypography-root': {
                                                    fontSize: '14px', // Apply the specific style to the MenuItem within DataGrid
                                                }
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

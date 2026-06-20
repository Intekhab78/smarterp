import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
import { Autocomplete, DialogContentText, FormControl, InputLabel, Select, TextField } from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ToastMassage } from "toast";
import jsPDF from 'jspdf';
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

export default function InvoiceType({ data, loading }) {
    const navigate = useNavigate();

    const columns = [
        {
            field: "created_at",
            headerName: "DATE",
            width: 150,
            sortable: true,
            disableColumnMenu: true,
            renderCell: (params) => moment(params?.value).format("DD MMM YYYY hh:mm A"),
        },

        {
            field: "order_number", headerName: "ORDER NUMBER", width: 100, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.invoiceModel?.orderModel?.order_number

        },
        {
            field: "invoice_number", headerName: "INVOICE NUMBER", width: 120, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.invoiceModel?.invoice_number,

        },
        {
            field: "item_name", headerName: "PRODUCT DESCRIPTION", width: 120, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.itemModel?.item_name,

        },
        {
            field: "hsn_code", headerName: "HSN", width: 100, sortable: true, disableColumnMenu: true,
        },
        {
            field: "receiving_site", headerName: "BATCH NO.", width: 100, sortable: true, disableColumnMenu: true,
        },
        {
            field: "expiry_delivery_date", headerName: "EXP.", width: 100, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.expiry_delivery_date === null ? "-" : moment(params?.row?.expiry_delivery_date).format("DD-MM-YYYY"),
        },
        {
            field: "item_qty", headerName: "SALES QTY.", width: 90, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.is_free == 1 ? "0.00" : params?.row?.item_qty,

        },
        {
            field: "item_discount_amount", headerName: "QTY DESC.", width: 90, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.is_free == 1 ? params?.row?.item_qty : params?.row?.item_discount_amount,
        },
        {
            field: "item_price", headerName: "RATE", width: 90, sortable: true, disableColumnMenu: true,
        },
        {
            field: "item_net", headerName: "NET AMT.", width: 90, sortable: true, disableColumnMenu: true,
        },
        {
            field: "item_grand_total", headerName: "GROSS AMT.", width: 90, sortable: true, disableColumnMenu: true,
        },
        {
            field: "rate", headerName: "PTR", width: 90, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.itemModel?.rate,
        },
        {
            field: "customer",
            headerName: "CUSTOMER NAME",
            width: 200,
            sortable: true,
            disableColumnMenu: true,
            renderCell: (params) => params?.row?.invoiceModel?.customer?.customerInfo?.customer_code + " - " + params?.row?.invoiceModel?.customer?.firstname,
        },
        {
            field: "salesman",
            headerName: "SALESMAN NAME",
            width: 200,
            sortable: true,
            disableColumnMenu: true,
            renderCell: (params) => params?.row?.invoiceModel?.salesman?.salesmanInfo?.salesman_code + " - " + params?.row?.invoiceModel?.salesman?.firstname + " " + params?.row?.invoiceModel?.salesman?.lastname,
        },
        {
            field: "type", headerName: "ORDER TYPE", width: 100, sortable: true, disableColumnMenu: true,
            renderCell: (params) => params?.row?.invoiceModel?.orderModel?.type
        },

        // {
        //   field: "Action",
        //   headerName: "Action",
        //   width: 80,
        //   sortable: false,
        //   disableColumnMenu: true,
        //   renderCell: (params) => {
        //     const [anchorEl, setAnchorEl] = useState(null);
        //     const open = Boolean(anchorEl);

        //     const handleClick = (event) => {
        //       setAnchorEl(event.currentTarget);
        //     };

        //     const handleClose = () => {
        //       setAnchorEl(null);
        //     };
        //     return (
        //       <>
        //         <IconButton onClick={handleClick}>
        //           <Icon fontSize="small">more_vert</Icon>
        //         </IconButton>
        //         <Menu
        //           anchorEl={anchorEl}
        //           id="action-menu"
        //           open={open}
        //           onClose={handleClose}
        //           PaperProps={{
        //             elevation: 0,
        //             sx: {
        //               overflow: "visible",
        //               filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
        //               mt: 1.5,
        //               "& .MuiAvatar-root": {
        //                 width: 32,
        //                 height: 32,
        //                 ml: -0.5,
        //                 mr: 1,
        //               },
        //               "&:before": {
        //                 content: '""',
        //                 display: "block",
        //                 position: "absolute",
        //                 top: 0,
        //                 right: 14,
        //                 width: 10,
        //                 height: 10,
        //                 bgcolor: "background.paper",
        //                 transform: "translateY(-50%) rotate(45deg)",
        //                 zIndex: 0,
        //               },
        //             },
        //           }}
        //           transformOrigin={{ horizontal: "right", vertical: "top" }}
        //           anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        //         >
        //           <MenuItem onClick={() => { handleEdit(params.row.id, 'view') }}>
        //             <Icon fontSize="small">visibility</Icon> View
        //           </MenuItem>
        //         </Menu >
        //       </>
        //     );
        //   },
        // },

    ];

    return (
        <DataGrid
            localeText={{ noRowsLabel: "No records", }}
            autoHeight
            loading={loading}
            rows={data}
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
                            minWidth: '200px',
                        },
                        '& .MuiMenuItem-root .MuiTypography-root': {
                            fontSize: '14px',
                        }
                    },
                },
            }}
        />
    );
}
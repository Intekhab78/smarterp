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
import { Autocomplete, Box, Checkbox, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import routes from "routes";
import { axios_get, axios_post } from '../../axios';
import { ToastMassage } from '../../toast';
import "../../../src/pages/formStyle.css";

const payment_term = [
    { label: "Cash", value: "1" },
    { label: "BILL TO BILL PAYMENT AR", value: "2" },
    { label: "Net 90 Days", value: "3" },
    { label: "NET 30 DAYS", value: "4" },
    { label: "Net 60 Days", value: "5" },
    { label: "Cash on Delivery", value: "6" },
    { label: "Net 45 Days", value: "7" },
];

function createtable() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState({});
    const [itemError, setItemError] = useState("");
    const [rows, setRows] = useState([]);
    const [autocompleteValue, setAutocompleteValue] = useState("");
    const [autocompleteSalesmanValue, setAutocompleteSalesmanValue] = useState("");
    const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
    const [isSubmit, setisSubmit] = useState(false);
    const [formData, setFormData] = useState({
        table_name: "",
    });

    const handleAddRow = () => {
        setRows(prevRows => [
            ...prevRows,
            {
                id: prevRows.length + 1,
                item_name: "",
                dataType: "INT",
                length: "",
                null_field: false,
                auto_increment: false
            }
        ]);
    };



    const handleRemoveRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };


    const ItemSelect = (newValue, params) => {
        const updatedRows = rows.map((row) =>
            row.id === params.id
                ? {
                    ...row,
                    item_name: newValue?.item_name,
                }
                : row
        );
        setRows(updatedRows);
    };

    const validation = (formData) => {
        let errors = {};
        if (!formData.table_name) {
            errors.table_name = "Name is required";
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        setisSubmit(true);
        event.preventDefault();
        let errors = validation(formData);
        // let invalidRow = rows.some(row => !row.item_name
        // );
        // if (invalidRow) {
        //     setisSubmit(false);
        //     // setFormError({ general: "Quantity and Price cannot be null or zero." });
        //     ToastMassage('Please select ', 'error');
        //     return;
        // }

        if (Object.keys(errors).length > 0) {
            setisSubmit(false);
            setFormError(errors);
        } else {
            if (rows.length == 0) {
                setisSubmit(false);
                setFormError({});
                setItemError('Please select item');
                ToastMassage('Please select item', 'error')
            } else {
                setFormError({});

                let finalPramas = {
                    ...formData,
                    items: rows
                }

                const response = await axios_post(true, "order/add", finalPramas);
                if (response) {
                    setisSubmit(false);
                    if (response.status) {
                        ToastMassage(response.message, 'success')
                        navigate("/order");

                    } else {
                        ToastMassage(response.message, 'error')
                    }
                }
            }

        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value, // This will correctly update the `table_name`
        }));
    };


    const handleRowChange = (e, rowIndex) => {
        const { name, value } = e.target;
        setRows(prevRows =>
            prevRows.map((row, index) =>
                index === rowIndex
                    ? {
                        ...row,
                        [name]: value,
                    }
                    : row
            )
        );
    };
    const handleRowCheckboxChange = (e, rowIndex, fieldName) => {
        if (fieldName === 'auto_increment' && e.target.checked) {
            setRows(prevRows =>
                prevRows.map((row, index) =>
                    index === rowIndex
                        ? { ...row, [fieldName]: e.target.checked } // Set current row's auto_increment to true
                        : { ...row, [fieldName]: false } // Set all other rows' auto_increment to false
                )
            );
        } else {
            setRows(prevRows =>
                prevRows.map((row, index) =>
                    index === rowIndex
                        ? { ...row, [fieldName]: e.target.checked }
                        : row
                )
            );
        }
    };



    const handleBack = () => {
        window.location.reload();
        navigate("/createtable");
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox className="custome-card" pt={6} pb={3}>
                <Grid container spacing={6} justifyContent="center">
                    <Grid item xs={12}>
                        <form onSubmit={handleSubmit} method="POST" action="#">
                            <Card >
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
                                    <Grid container xs={12} spacing={0}>
                                        <Grid item xs={6} mr={0}>
                                            <MDTypography variant="h6" color="white">
                                                <Icon fontSize="small">shopping_cart</Icon>
                                                Add Table
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/order">
                                                {/* <MDButton variant="gradient" color="light">

                                                </MDButton> */}
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox>
                                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Table Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        sx={{ width: 300 }}
                                                        name="table_name"
                                                        value={formData.table_name}
                                                        onChange={handleChange}
                                                        className="small-input"
                                                    />
                                                    {formError.table_name && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.table_name}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} pb={6}>
                                                <Box sx={{ overflowX: 'auto', marginBottom: "1rem" }}>
                                                    <TableContainer>
                                                        <Table sx={{ minWidth: 800, width: '100%' }} aria-label="responsive table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    {['NAME', 'TYPE', 'LEGTH VALUE', 'NULL', 'AUTO INCREMENT'].map((header) => (
                                                                        <TableCell key={header} sx={{ fontSize: '12px', minWidth: header === 'Action' ? 80 : 150 }}>
                                                                            {header}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {rows.map((row, rowIndex) => (
                                                                    <TableRow key={rowIndex}>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 200 }}>
                                                                            <MDInput
                                                                                type="text"
                                                                                variant="outlined"
                                                                                name="item_name"
                                                                                value={row.item_name}
                                                                                onChange={(e) => handleRowChange(e, rowIndex)}
                                                                                sx={{ fontSize: '12px' }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 200 }}>
                                                                            <Select
                                                                                value={row.dataType || ''}
                                                                                onChange={(event) => ItemSelect(event.target.value, row)}
                                                                                displayEmpty
                                                                                sx={{ marginTop: 0, width: '100%', fontSize: '12px', height: "50px" }}
                                                                            >
                                                                                <MenuItem value="INT">INT</MenuItem>
                                                                                <MenuItem value="VAR">VAR</MenuItem>
                                                                                <MenuItem value="TEXT">TEXT</MenuItem>
                                                                                <MenuItem value="DATE">DATE</MenuItem>
                                                                            </Select>
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                                                            <MDInput
                                                                                type="number"
                                                                                variant="outlined"
                                                                                name="length"
                                                                                value={row.length || ""}
                                                                                onChange={(e) => handleRowChange(e, rowIndex)}
                                                                                placeholder="Length"
                                                                                sx={{ fontSize: '12px' }}
                                                                            />
                                                                        </TableCell>

                                                                        {/* Null Field */}
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                                                            <Checkbox
                                                                                checked={row.null_field || false}
                                                                                onChange={(e) => handleRowCheckboxChange(e, rowIndex, 'null_field')}
                                                                            />
                                                                        </TableCell>

                                                                        {/* Auto Increment */}
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                                                            <Checkbox
                                                                                checked={row.auto_increment || false}
                                                                                onChange={(e) => handleRowCheckboxChange(e, rowIndex, 'auto_increment')}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 80 }}>
                                                                            <MDButton
                                                                                variant="outlined"
                                                                                color="info"
                                                                                iconOnly
                                                                                onClick={() => handleRemoveRow(rowIndex)}
                                                                                sx={{ fontSize: '12px' }}
                                                                            >
                                                                                <Icon fontSize="small">clear</Icon>
                                                                            </MDButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Box>
                                                <MDButton variant="contained" color="secondary" onClick={handleAddRow}>
                                                    Add Row
                                                </MDButton>
                                            </Grid>
                                            <Grid container spacing={2} justifyContent="right" sx={{ mt: 1, mb: 2 }}>
                                                <Grid item xs={2} ml={3}>
                                                    <MDBox sx={{ display: 'flex' }}>
                                                        <MDButton variant="gradient" disabled={isSubmit} color="info" type="submit" fullWidth>
                                                            {isSubmit ?
                                                                <CircularProgress color="white" size={24}
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        marginTop: '-12px',
                                                                        marginLeft: '-12px',
                                                                    }} />
                                                                : 'Save'
                                                            }
                                                        </MDButton>
                                                        <MDButton variant="gradient" disabled={isSubmit} color="secondary" type="submit" fullWidth sx={{ marginLeft: '15px' }} onClick={handleBack}>
                                                            cancel
                                                        </MDButton>
                                                    </MDBox>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </MDBox>
                            </Card>
                        </form>
                    </Grid>
                </Grid>
            </MDBox>
        </DashboardLayout>
    );
}

export default createtable;

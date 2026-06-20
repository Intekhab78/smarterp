import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "../../../../axios";
import CircularProgress from "@mui/material/CircularProgress";
// @mui material components
import Card from "@mui/material/Card";
import { axios_get, axios_post } from '../../../../axios';
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { ToastMassage } from '../../../../toast';
import { Autocomplete, Box, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import moment from "moment";

function Edit_currency() {
    const navigate = useNavigate();
    const params = useParams();

    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    const [rows, setRows] = useState([]);
    let user_data = JSON.parse(localStorage.getItem("user_data"));
    const [formData, setFormData] = useState({
        name: "",
        id: params.id,
        curcode: "",
        curdes: "",
        curldes: "",
        isocode: "",
        symbol: "",
        format: "",
        decimals: "",
        rounding: "",
        // frmdt: "",
        // todt: "",
        // curdess: "",
        // currate: "",
        note1: "",
        note2: "",
        note3: "",
        status: "1",
        itmcatdt1: "",
        itmcatdt2: "",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
    });

    const fetchcountryList = async () => {
        const response = await axios_get(true, "country/list-dropdown");
        if (response) {
            if (response.status) {
                setCountries(response.data);
            } else {
                ToastMassage(response.message, 'error');
            }
        }
    };
    const handleAddRow = () => {
        setRows([
            ...rows,
            {
                id: rows.length + 1,
                frmdt: "",
                todt: "",
                curdess: '',
                currate: "",
            },
        ]);
    };
    const handleRemoveRow = (index) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };
    const OrderNuberRange = async () => {
        let params = {
            function_for: "item"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "curcode": response.data?.number_is,
                }));
            } else {
                ToastMassage(response.message, 'error')
            }
        }
    }
    useEffect(() => {
        fetchcountryList();
        fetchOrderDetails();
        OrderNuberRange();
    }, []);
    const validation = (formData) => {
        let errors = {};
        if (!formData.name) errors.name = "name is required";
        if (!formData.curdes) errors.curdes = "Description is required";
        if (!formData.decimals) errors.decimals = "Decimal is required";
        if (!formData.rounding) errors.rounding = "Rounding is required";

        return errors;
    };
    const itemquantityChange = async (eventOrQuantity, params, type = '') => {
        const { name, checked, value } = eventOrQuantity.target;
        if (!name || (value === undefined && checked === undefined)) {
            return;
        }
        else if (type == '') {
            const updatedRows = rows.map((row) =>
                row.id === params.id
                    ? {
                        ...row,
                        [name]: value,
                    }
                    : row
            );
            setRows(updatedRows);
        }
    };
    const fetchOrderDetails = async () => {
        try {
            const response = await axios_post(true, 'currency/details', {
                id: params.id
            });
            if (response.status) {
                const orderData = response.data;
                setFormData({
                    ...formData,
                    id: orderData.id,
                    name: orderData.name,
                    curcode: orderData.curcode,
                    curdes: orderData.curdes,
                    curldes: orderData.curldes,
                    isocode: orderData.isocode,
                    decimals: orderData.decimals,
                    format: orderData.format,
                    itmcatdt1: moment(orderData.itmcatdt1).format('YYYY-MM-DD'),
                    itmcatdt2: moment(orderData.itmcatdt2).format('YYYY-MM-DD'),
                    note1: orderData.note1,
                    note2: orderData.note2,
                    note3: orderData.note3,
                    rounding: orderData.rounding,
                    symbol: orderData.symbol,
                    status: orderData.status === 1 ? '1' : '0',
                });
                let currency_del = []
                for (let index = 0; index < orderData?.currency_details?.length; index++) {
                    const element = orderData?.currency_details[index];
                    let obje = {
                        id: index + 1,
                        frmdt: moment(element.frmdt).format('YYYY-MM-DD'),
                        todt: moment(element.todt).format('YYYY-MM-DD'),
                        curdess: element.curdess,
                        currate: element.currate,
                    };
                    currency_del.push(obje);
                }
                setRows(currency_del);



            } else {
                ToastMassage(response.message, 'error');
            }
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    };

    const handleSubmit = async (event) => {
        setisSubmit(true);
        event.preventDefault();
        let errors = validation(formData);

        if (Object.keys(errors).length > 0) {
            setisSubmit(false);
            setFormError(errors);
        } else {
            if (rows.length == 0) {
                setisSubmit(false);
                setFormError({});
                ToastMassage('Please select item', 'error')
                // console.log("formData", formData);
            } else {
                setFormError({});
                let finalPramas = {
                    ...formData,
                    currency_del: rows,
                }
                console.log("finalPramas", finalPramas)
                const response = await axios_post(true, "currency/update", finalPramas);
                if (response) {
                    setisSubmit(false);
                    if (response.status) {
                        ToastMassage(response.message, 'success');
                        navigate("/currency");
                    } else {
                        ToastMassage(response.message, 'error');
                    }
                }
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBack = () => {
        navigate("/currency");
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox className="custome-card" pt={6} pb={3}>
                <Grid container spacing={6} justifyContent="center">
                    <Grid item xs={12}>
                        <form onSubmit={handleSubmit} method="POST" action="#">
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
                                    <Grid container spacing={0}>
                                        <Grid item xs={2} mr={35}>
                                            <MDTypography variant="h6" color="white">
                                                <Icon fontSize="small">shopping_cart</Icon>
                                                View currency
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={2} ml={40}>
                                            <MDTypography component={Link} to="/currency">
                                                <MDButton variant="gradient" color="light">
                                                    Back
                                                </MDButton>
                                            </MDTypography>
                                        </Grid>
                                    </Grid>
                                </MDBox>
                                <MDBox pt={4} pb={3} px={3}>
                                    <MDBox>
                                        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>

                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="name"
                                                        className="small-input"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 120 }}
                                                        disabled={true}
                                                    />
                                                    {formError.name && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.name}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Currency Code</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="curcode"
                                                        value={formData.curcode}
                                                        onChange={handleChange}
                                                        disabled={true}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                    />
                                                    {formError.curcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.curcode}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="curdes"
                                                        value={formData.curdes}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 120 }}
                                                        className="small-input"
                                                        disabled={true}
                                                    />
                                                    {formError.curdes && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.curdes}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Long Description</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="curldes"
                                                        value={formData.curldes}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 200 }}
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>ISO Code</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="isocode"
                                                        value={formData.isocode}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 60 }}
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Symbol</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="symbol"
                                                        value={formData.symbol}
                                                        inputProps={{ maxLength: 40 }}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Format</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="format"
                                                        value={formData.format}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 10 }}
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Decimal</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="decimals"
                                                        value={formData.decimals}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                        disabled={true}
                                                        className="small-input"
                                                    />
                                                    {formError.decimals && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.decimals}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Rounding</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="rounding"
                                                        value={formData.rounding}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        disabled={true}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                    {formError.rounding && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.rounding}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note1</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="note1"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.note1}
                                                        onChange={(e) => setFormData({ ...formData, note1: e.target.value })}
                                                        inputProps={{ maxLength: 60 }}
                                                        disabled={true}
                                                    />
                                                    {formError.note1 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note1}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note2</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="note2"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.note2}
                                                        disabled={true}
                                                        inputProps={{ maxLength: 60 }}
                                                        onChange={(e) => setFormData({ ...formData, note2: e.target.value })}
                                                    />
                                                    {formError.note2 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note2}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note3</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="note3"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.note3}
                                                        inputProps={{ maxLength: 60 }}
                                                        onChange={(e) => setFormData({ ...formData, note3: e.target.value })}
                                                        disabled={true}
                                                    />
                                                    {formError.note3 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note3}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}> Date 1</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmcatdt1"
                                                        value={formData.itmcatdt1}
                                                        onChange={handleChange}
                                                        className="small-input"
                                                        disabled={true}
                                                    // disabled
                                                    />
                                                    {formError.itmcatdt1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itmcatdt1}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}> Date 2</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmcatdt2"
                                                        value={formData.itmcatdt2}
                                                        onChange={handleChange}
                                                        className="small-input"
                                                        disabled={true}
                                                    // disabled
                                                    />
                                                    {formError.itmcatdt2 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itmcatdt2}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Added By</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="addedby"
                                                        value={formData.addedby}
                                                        onChange={(e) => handleChange(e)}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 40 }}
                                                        disabled={true}
                                                    />
                                                    {formError.addedby && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.addedby}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Created Date</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="createddt"
                                                        value={formData.createddt}
                                                        className="small-input"
                                                        disabled={true}
                                                    />
                                                    {formError.createddt && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.createddt}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                                                    <Select
                                                        name="status"
                                                        value={formData.status}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                        disabled={true}
                                                    >
                                                        <MenuItem value="1">Active</MenuItem>
                                                        <MenuItem value="0">Inactive</MenuItem>
                                                    </Select>
                                                    {formError.status && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                                                            {formError.status}
                                                        </MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} pb={6}>
                                                <Box sx={{ overflowX: 'auto', marginBottom: "1rem" }}>
                                                    <TableContainer>
                                                        <Table sx={{ minWidth: 800, width: '100%' }} aria-label="responsive table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    {['From date', 'To date', 'Currency name', 'Amount', 'Action'].map((header) => (
                                                                        <TableCell key={header} sx={{ fontSize: '12px', minWidth: header === 'Action' ? 80 : 150 }}>
                                                                            {header}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {rows && rows?.length > 0 && rows.map((row, rowIndex) => (
                                                                    <TableRow key={rowIndex}>
                                                                        {/* <TableCell sx={{ fontSize: '12px', minWidth: 100, }}> */}
                                                                        {/* <Select
                                        name="country_id"
                                        value={row.country_id}
                                        onChange={(event) => {
                                          // const value = parseFloat(event.target.value);
                                          // if (value >= 1 || event.target.value === "") {
                                          itemquantityChange(event, row, 'country_id');
                                          // }
                                        }}
                                        sx={{ width: '100%', height: '43px' }}
                                      // className="small-input"
                                      >
                                        {countries?.map((country) => (
                                          <MenuItem key={country.id} value={country?.id}>
                                            {country?.name}
                                          </MenuItem>
                                        ))}
                                      </Select> */}
                                                                        {/* </TableCell> */}
                                                                        {/* <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                      <Select
                                        name="emirates_id"
                                        value={row.emirates_id}
                                        onChange={(event) => {
                                          // const value = parseFloat(event.target.value);
                                          // if (value >= 1 || event.target.value === "") {
                                          itemquantityChange(event, row, 'emirates_id');
                                          // }
                                        }}
                                        sx={{ width: '100%', height: '43px' }}
                                      // className="small-input"
                                      >
                                        {row?.emirates_array?.map((country) => (
                                          <MenuItem key={country.id} value={country?.id}>
                                            {country?.name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </TableCell> */}
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                                                            <MDInput
                                                                                type="date"
                                                                                variant="outlined"
                                                                                name="frmdt"
                                                                                value={row.frmdt}
                                                                                onChange={(event) => {
                                                                                    // const value = parseFloat(event.target.value);
                                                                                    // if (value >= 1 || event.target.value === "") {
                                                                                    itemquantityChange(event, row, '');
                                                                                    // }
                                                                                }}
                                                                                sx={{ fontSize: '12px' }}
                                                                                disabled={true}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                                                            <MDInput
                                                                                type="date"
                                                                                variant="outlined"
                                                                                name="todt"
                                                                                value={row.todt}
                                                                                onChange={(event) => {
                                                                                    // const value = parseFloat(event.target.value);
                                                                                    // if (value >= 1 || event.target.value === "") {
                                                                                    itemquantityChange(event, row, '');
                                                                                    // }
                                                                                }}
                                                                                disabled={true}
                                                                                inputProps={{
                                                                                    min: row.frmdt,
                                                                                }}
                                                                                sx={{ fontSize: '12px' }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                                                            <MDInput
                                                                                type="text"
                                                                                variant="outlined"
                                                                                name='curdess'
                                                                                value={row.curdess}
                                                                                sx={{ fontSize: '12px' }}
                                                                                onChange={(event) => {
                                                                                    // const value = parseFloat(event.target.value);
                                                                                    // if (value >= 1 || event.target.value === "") {
                                                                                    itemquantityChange(event, row, '');
                                                                                    // }
                                                                                }}
                                                                                disabled={true}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 100 }}>
                                                                            <MDInput
                                                                                type="number"
                                                                                variant="outlined"
                                                                                name='currate'
                                                                                value={row.currate}
                                                                                sx={{ fontSize: '12px' }}
                                                                                disabled={true}
                                                                                onChange={(event) => {
                                                                                    // const value = parseFloat(event.target.value);
                                                                                    // if (value >= 1 || event.target.value === "") {
                                                                                    itemquantityChange(event, row, '');
                                                                                    // }
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell sx={{ fontSize: '12px', minWidth: 80 }}>
                                                                            <MDButton
                                                                                variant="outlined"
                                                                                color="info"
                                                                                iconOnly
                                                                                onClick={() => handleRemoveRow(rowIndex)}
                                                                                sx={{ fontSize: '12px' }}
                                                                                disabled={true}
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
                                                <MDButton variant="contained" color="secondary" onClick={handleAddRow} disabled={true}>
                                                    Add Row
                                                </MDButton>
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

export default Edit_currency;

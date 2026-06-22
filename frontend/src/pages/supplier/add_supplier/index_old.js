import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { axios_get, axios_post } from '../../../axios';
import { ToastMassage } from '../../../toast';
import { Autocomplete, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

function Add_supplier() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");

    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const subpterm = [
        { label: "Cash", value: "1" },
        { label: "BILL TO BILL PAYMENT AR", value: "2" },
        { label: "Net 90 Days", value: "3" },
        { label: "NET 30 DAYS", value: "4" },
        { label: "Net 60 Days", value: "5" },
        { label: "Cash on Delivery", value: "6" },
        { label: "Net 45 Days", value: "7" },
    ];

    const [formData, setFormData] = useState({
        supcat: "",
        supcode: "",
        supname: "",
        supsname: "",
        supbrand: "",
        supsname: "",
        sucomname: "",
        subcountry: "",
        subcur: "",
        suptax1: "",
        suptax2: "",
        suptax3: "",
        subauth: "",
        subfax: "",
        subtoll: "",
        subconpername: "",
        subphone: "",
        subemail1: "",
        submob1: "",
        subadd1: "",
        subconpername2: "",
        subphone2: "",
        subemail2: "",
        subtollmobile: "",
        subadd2: "",
        subadd3: "",
        subconpername3: "",
        subphone3: "",
        subemail3: "",
        subemail3: "",
        subtollother: "",
        subemail4: "",
        subpterm: "",
        note1: "",
        note2: "",
        note3: "",
        itmtaxdt1: "",
        itmtaxdt2: "",
        status: "1",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
    });

    console.log('formData', formData);
    const OrderNuberRange = async () => {
        let params = {
            function_for: "salesman"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "supcode": response.data.number_is,
                }));
            } else {
                ToastMassage(response.message, 'error')
            }
        }
    }
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
    const handleAutocompleteChange = (event, newValue, type) => {
        if (type == "subpterm") {
            setAutocompletePaymentValue(newValue);
            setFormData((prevData) => ({
                ...prevData,
                "subpterm": newValue == null ? "" : newValue?.value,
            }));
        }
    };
    useEffect(() => {
        OrderNuberRange();
        fetchcountryList();
    }, []);

    const validation = (formData) => {
        let errors = {};
        if (!formData.supcode) errors.supcode = "Supplier Code is required";
        if (!formData.supcat) errors.supcat = "Category is required";
        if (!formData.supname) errors.supname = "Supplier Name is required";
        if (!formData.supsname) errors.supsname = "Supplier Short Name is required";
        if (!formData.subcountry) errors.subcountry = "Country is required";
        if (!formData.suptax1) errors.suptax1 = "Tax No 1 is required";
        if (!formData.subadd1) errors.subadd1 = "Address 1 is required";
        if (!formData.addedby) errors.addedby = "Addedby is required";
        if (!formData.createddt) errors.createddt = "Created Date is required";
        if (!formData.status) errors.status = "Status is required";
        return errors;
    };

    const handleSubmit = async (event) => {
        setisSubmit(true);
        event.preventDefault();
        let errors = validation(formData);

        if (Object.keys(errors).length > 0) {
            setisSubmit(false);
            setFormError(errors);
        } else {
            setFormError({});
            const response = await axios_post(true, "supplier_master/store", formData);
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success');
                    navigate("/supplier");
                } else {
                    ToastMassage(response.message, 'error');
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
        navigate("/supplier");
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
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
                                    <Grid container xs={12} spacing={0}>
                                        <Grid item xs={6} mr={0}>
                                            <MDTypography variant="h6" color="white">
                                                <Icon fontSize="small">shopping_cart</Icon>
                                                Add Supplier
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/supplier">
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
                                                    <InputLabel sx={{ mb: 1 }}>Supplier Code</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="supcode"
                                                        value={formData.supcode}
                                                        className="small-input"
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 30 }}
                                                        disabled
                                                    />
                                                    {formError.supcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.supcode}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Supplier Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="supname"
                                                        className="small-input"
                                                        value={formData.supname}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 120 }}
                                                    />
                                                    {formError.supname && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.supname}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Supplier Short Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="supsname"
                                                        className="small-input"
                                                        value={formData.supsname}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                    {formError.supsname && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.supsname}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Brand Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="supbrand"
                                                        className="small-input"
                                                        value={formData.supbrand}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 120 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Company Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="sucomname"
                                                        className="small-input"
                                                        value={formData.sucomname}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 120 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Country</InputLabel>
                                                    <Select
                                                        name="subcountry"
                                                        value={formData.subcountry}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                        className="small-input"
                                                    >
                                                        {countries?.map((country) => (
                                                            <MenuItem key={country.id} value={country?.id}>
                                                                {country?.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formError.subcountry && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.subcountry}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Tax No 1</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="suptax1"
                                                        className="small-input"
                                                        value={formData.suptax1}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                    {formError.suptax1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.suptax1}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Tax No 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="suptax2"
                                                        className="small-input"
                                                        value={formData.suptax2}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Tax No 3</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="suptax3"
                                                        className="small-input"
                                                        value={formData.suptax3}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Tax Authority</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subauth"
                                                        className="small-input"
                                                        value={formData.subauth}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Fax No</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subfax"
                                                        className="small-input"
                                                        value={formData.subfax}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 20 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Toll Free</InputLabel>
                                                    <MDInput
                                                        type="number"
                                                        variant="outlined"
                                                        name="subtoll"
                                                        className="small-input"
                                                        value={formData.subtoll}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 20 }}
                                                    />
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Contact Person name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subconpername"
                                                        className="small-input"
                                                        value={formData.subconpername}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 180 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Phone No</InputLabel>
                                                    <MDInput
                                                        type="number"
                                                        variant="outlined"
                                                        name="subphone"
                                                        className="small-input"
                                                        value={formData.subphone}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Email Id</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subemail1"
                                                        className="small-input"
                                                        value={formData.subemail1}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 180 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Mobile No</InputLabel>
                                                    <MDInput
                                                        type="number"
                                                        variant="outlined"
                                                        name="submob1"
                                                        className="small-input"
                                                        value={formData.submob1}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Address 1</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subadd1"
                                                        className="small-input"
                                                        value={formData.subadd1}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 200 }}
                                                    />
                                                    {formError.subadd1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.subadd1}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Contact Person name 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subconpername2"
                                                        className="small-input"
                                                        value={formData.subconpername2}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Phone No 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subphone2"
                                                        className="small-input"
                                                        value={formData.subphone2}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Email Id 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subemail2"
                                                        className="small-input"
                                                        value={formData.subemail2}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 30 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Mobile No 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subtollmobile"
                                                        className="small-input"
                                                        value={formData.subtollmobile}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Address 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subadd2"
                                                        className="small-input"
                                                        value={formData.subadd2}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 200 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Contact Person name 3</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subconpername3"
                                                        className="small-input"
                                                        value={formData.subconpername3}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Phone No 3</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subphone3"
                                                        className="small-input"
                                                        value={formData.subphone3}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Email Id 3</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subemail3"
                                                        className="small-input"
                                                        value={formData.subemail3}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 30 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Address 3</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subadd3"
                                                        className="small-input"
                                                        value={formData.subadd3}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 200 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Other No</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subtollother"
                                                        className="small-input"
                                                        value={formData.subtollother}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Email Id 4</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="subemail4"
                                                        className="small-input"
                                                        value={formData.subemail4}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 30 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <InputLabel sx={{ mb: 1 }}>Payment Terms</InputLabel>
                                                <Autocomplete
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={subpterm}
                                                    value={autocompletePaymentValue}
                                                    onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'subpterm')}
                                                    // style={{ height: 45 }}
                                                    sx={{ width: 300 }}
                                                    className="small-autocomplete"
                                                    renderInput={(params) => <TextField {...params} className="small-input" />}
                                                ></Autocomplete>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note 1</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="note1"
                                                        value={formData.note1}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 50 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="note2"
                                                        value={formData.note2}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 50 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note 3</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="note3"
                                                        value={formData.note3}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 50 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Date 1</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmtaxdt1"
                                                        value={formData.itmtaxdt1}
                                                        onChange={(e) => setFormData({ ...formData, itmtaxdt1: e.target.value })}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Date 2</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmtaxdt2"
                                                        value={formData.itmtaxdt2}
                                                        onChange={(e) => setFormData({ ...formData, itmtaxdt2: e.target.value })}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                    />
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
                                                        disabled
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
                                                        disabled
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
                                                        <MDButton variant="gradient" disabled={isSubmit} color="secondary" fullWidth sx={{ marginLeft: '15px' }} onClick={handleBack}>
                                                            Cancel
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

export default Add_supplier;

import { Link, useNavigate, useParams } from "react-router-dom";
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

function edit_salesman() {
    const params = useParams();
    const navigate = useNavigate();
    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const [formData, setFormData] = useState({
        empid: "",
        loginid: "",
        pass1: "",
        pass2: "",
        firstname: "",
        lastname: "",
        address: "",
        mobileno: "",
        email: "",
        contactno: "",
        country: "",
        state: "",
        groups: "",
        subgroups: "",
        Companycode: "",
        locdesc: "",
        emcontact: "",
        note1: "",
        note2: "",
        note3: "",
        itmtaxdt1: "",
        itmtaxdt2: "",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
        status: "1",
        salesman_code: "",
        country_id: ""


        // customer_address_1: "",
        // customer_address_2: ""
    });

    const OrderNuberRange = async () => {
        let params = {
            function_for: "salesman"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "salesman_code": response.data.number_is,
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

    const fetchSalesmanDetails = async () => {
        try {
            const response = await axios_post(true, 'salesman/details', {
                id: params.id
            });
      
            if (response.status) {
                const user = response.data.users;
                const SalesmanInfo = response.data;
                setFormData({
                    ...formData,
                    salesman_code: SalesmanInfo.salesman_code,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    cuscode: user.cuscode,
                    cusname: user.firstname,
                    mobileno: user.mobile,
                    email: user.email,
                    country_id: user.country_id,
                    // customer_address_1: SalesmanInfo.customer_address_1,
                    status: SalesmanInfo.status === 1 ? "1" : "0",
                });

            } else {
                ToastMassage(response.message, 'error');
            }
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    };

    useEffect(() => {
        fetchSalesmanDetails();
        // OrderNuberRange();
        fetchcountryList();
    }, []);
    const validation = (formData) => {
        let errors = {};

        if (!formData.firstname) errors.firstname = "FirstName is required";
        if (!formData.lastname) errors.lastname = "LastName is required";
        if (!formData.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email is invalid";
        }
        if (!formData.country_id) errors.country_id = "country is required";
        // if (!formData.loginid) errors.loginid = "login id is required";
        // if (!formData.empid) errors.empid = "emp id is required";
        // if (!formData.mobile) errors.mobile = "Mobile No is required";
        if (!formData.mobileno) errors.mobileno = "Mobile No is required";
        if (!formData.status) errors.status = "Status is required";
        // if (!formData.createddt) errors.createddt = "Created Date is required";
        // if (!formData.addedby) errors.addedby = "Added By is required";
        // if (!formData.customer_address_1) errors.customer_address_1 = "Address is required";
        // if (!formData.Loginid) errors.Loginid = "Login id is required";
        // if (!formData.pass1) errors.pass1 = "Password is required";
        // if (!formData.pass2) errors.pass2 = "RePassword is required";
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
            const response = await axios_post(true, "salesman/update", {
                ...formData,
                id: params.id
            });
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success');
                    navigate("/salesman");
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
        navigate("/salesman");
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
                                    <Grid container xs={12} spacing={0}>
                                        <Grid item xs={6} mr={0}>
                                            <MDTypography variant="h6" color="white">
                                                <Icon fontSize="small">shopping_cart</Icon>
                                                View Employee
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/salesman">
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
                                                    <InputLabel sx={{ mb: 1 }}>Code</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="salesman_code"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.salesman_code}
                                                        inputProps={{ maxLength: 30 }}
                                                        disabled={true}
                                                    />
                                                    {formError.salesman_code && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.salesman_code}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Login Id</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="Loginid"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.Loginid}
                                                        inputProps={{ maxLength: 30 }}
                                                        onChange={(e) => setFormData({ ...formData, Loginid: e.target.value })}
                                                    />
                                                    {formError.Loginid && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.Loginid}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Password</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="pass1"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.pass1}
                                                        inputProps={{ maxLength: 30 }}
                                                        onChange={(e) => setFormData({ ...formData, pass1: e.target.value })}
                                                    />
                                                    {formError.Password && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.pass1}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Re Password</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="pass2"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.pass2}
                                                        inputProps={{ maxLength: 30 }}
                                                        onChange={(e) => setFormData({ ...formData, pass2: e.target.value })}
                                                    />
                                                    {formError.RePassword && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.pass2}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid> */}
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>First Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="firstname"
                                                        className="small-input"
                                                        value={formData.firstname}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        disabled={true}
                                                    />
                                                    {formError.firstname && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.firstname}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Last Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="lastname"
                                                        className="small-input"
                                                        value={formData.lastname}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        disabled={true}
                                                    />
                                                    {formError.lastname && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.lastname}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Address</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="address"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.address}
                                                        inputProps={{ maxLength: 130 }}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    />
                                                    {formError.address && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.address}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid> */}
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Mobile No</InputLabel>
                                                    <MDInput
                                                        type="number"
                                                        variant="outlined"
                                                        name="mobileno"
                                                        className="small-input"
                                                        value={formData.mobileno}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d{0,10}$/.test(value)) {
                                                                handleChange(e);
                                                            }
                                                        }}
                                                        inputProps={{ maxLength: 10 }}
                                                        disabled={true}
                                                    // sx={{ width: 300 }}
                                                    />
                                                    {formError.mobileno && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.mobileno}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Contact No</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="contactno"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.contactno}
                                                        inputProps={{ maxLength: 60 }}
                                                        onChange={(e) => setFormData({ ...formData, contactno: e.target.value })}
                                                    />
                                                    {formError.Contactno && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.contactno}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid> */}
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Email</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        disabled={true}
                                                    />
                                                    {formError.email && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.email}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>country</InputLabel>
                                                    <Select
                                                        name="country_id"
                                                        value={formData.country_id}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                        disabled={true}
                                                    // className="small-input"
                                                    >
                                                        {countries?.map((country) => (
                                                            <MenuItem key={country.id} value={country?.id}>
                                                                {country?.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formError.country_id && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.country_id}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>State</InputLabel>
                                                    <Autocomplete
                                                        options={["", "", "", "", " ", ""]}
                                                        value={formData.state}
                                                        onChange={(event, newValue) => setFormData({ ...formData, state: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        // sx={{ width: 300 }}
                                                        className="small-autocomplete"
                                                    />
                                                    {formError.state && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.state}</MDTypography>}
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Groups</InputLabel>
                                                    <Autocomplete
                                                        options={["", "", "", "", " ", ""]}
                                                        value={formData.groups}
                                                        onChange={(event, newValue) => setFormData({ ...formData, groups: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        // sx={{ width: 300 }}
                                                        className="small-autocomplete"
                                                    />
                                                    {formError.groups && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.groups}</MDTypography>}
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Sub Groups</InputLabel>
                                                    <Autocomplete
                                                        options={["", "", "", "", " ", ""]}
                                                        value={formData.subgroups}
                                                        onChange={(event, newValue) => setFormData({ ...formData, subgroups: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        // sx={{ width: 300 }}
                                                        className="small-autocomplete"
                                                    />
                                                    {formError.subgroups && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.subgroups}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>company Desc</InputLabel>
                                                    <Autocomplete
                                                        options={[" ", " ", " ", " ", " ", ""]}
                                                        value={formData.Companycode}
                                                        onChange={(event, newValue) => setFormData({ ...formData, Companycode: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        // sx={{ width: 300 }}
                                                        className="small-autocomplete"
                                                    />
                                                    {formError.Companycode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.Companycode}</MDTypography>}
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>location Desc</InputLabel>
                                                    <Autocomplete
                                                        options={["", "", "", "", " ", ""]}
                                                        value={formData.locdesc}
                                                        onChange={(event, newValue) => setFormData({ ...formData, locdesc: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        // sx={{ width: 300 }}
                                                        className="small-autocomplete"
                                                    />
                                                    {formError.locdesc && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.locdesc}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Emergency Contact</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="emcontact"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.emcontact}
                                                        inputProps={{ maxLength: 30 }}
                                                        onChange={(e) => setFormData({ ...formData, emcontact: e.target.value })}
                                                    />
                                                    {formError.emcontact && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.emcontact}</MDTypography>
                                                    )}
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
                                                        inputProps={{ maxLength: 50 }}
                                                        onChange={(e) => setFormData({ ...formData, note1: e.target.value })}
                                                    />
                                                    {formError.Note1 && (
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
                                                        inputProps={{ maxLength: 50 }}
                                                        onChange={(e) => setFormData({ ...formData, note2: e.target.value })}
                                                    />
                                                    {formError.Note2 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note2}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note3</InputLabel>
                                                    <MDInput
                                                        type="number"
                                                        name="note3"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.note3}
                                                        inputProps={{ maxLength: 50 }}
                                                        onChange={(e) => setFormData({ ...formData, note3: e.target.value })}
                                                    />
                                                    {formError.Note3 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note3}</MDTypography>
                                                    )}
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
                                                        onChange={handleChange}
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
                                                        onChange={handleChange}
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
                                            </Grid> */}
                                            {/* <Grid item xs={6}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Address 1</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="customer_address_1"
                            value={formData.customer_address_1}
                            onChange={(e) => handleChange(e)}
                            sx={{ width: 300 }}
                          />
                          {formError.customer_address_1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.customer_address_1}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={6}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Address 2</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="customer_address_2"
                            value={formData.customer_address_2}
                            onChange={(e) => handleChange(e)}
                            sx={{ width: 300 }}
                          />
                        </MDBox>
                      </Grid> */}



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
                                            {/* <Grid container spacing={2} justifyContent="right" sx={{ mt: 1, mb: 2 }}>
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
                                            </Grid> */}
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

export default edit_salesman;

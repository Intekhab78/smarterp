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
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

function Add_supplier() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [locations, setlocations] = useState([]);
    const [compines, setCompines] = useState([]);
    const [countries, setCountries] = useState([]);
    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const [formData, setFormData] = useState({
        lastname: "",
        company_id: "",
        location_id: "",
        firstname: "",
        cuscat: "",
        cusname: "",
        cusbrand: "",
        cusemail1: "",
        subemail2: "",
        cusemail3: "",
        cusemail4: "",
        country_id: "",
        mobile: "",
        status: "1",
        cuscode: "",
        customer_address_1: "",
        customer_address_2: "",
        cussname: "",
        cuscomname: "",
        custax1: "",
        custax2: "",
        custax3: "",
        cusauth: "",
        cusfax: "",
        cusdob: "",
        cusanndt: "",
        custoll: "",
        cusconpername: "",
        cusconpername2: "",
        cusconpername3: "",
        cusphone: "",
        cusphone2: "",
        cusphone3: "",
        mobile2: "",
        custaxdt1: "",
        custaxdt2: "",
        cuspterm: "",
        note1: "",
        note2: "",
        note3: "",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
        category: "",
        custitle: "",
        cusadd3: ""
    });
    const fetchcompanyList = async () => {
        const response = await axios_post(true, "company/com_list");
        if (response) {
            if (response.status) {
                setCompines(response.data);
            } else {
                ToastMassage(response.message, 'error');
            }
        }
    };
    const fetchlocationList = async (company_id) => {
        const response = await axios_post(true, "location/loc_list", {
            company_id: company_id
        });
        if (response) {
            if (response.status) {
                setlocations(response.data);
            } else {
                ToastMassage(response.message, 'error');
            }
        }
    };
    const OrderNuberRange = async () => {
        let params = {
            function_for: "supplier"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "cuscode": response.data.number_is,
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
    useEffect(() => {
        OrderNuberRange();
        fetchcompanyList();
        fetchcountryList();
    }, []);
    const validation = (formData) => {
        let errors = {};

        if (!formData.cusemail1) {
            errors.cusemail1 = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.cusemail1)) {
            errors.cusemail1 = "Email is invalid";
        }

        if (!formData.country_id) errors.country_id = "Country is required";
        if (!formData.cusname) errors.cusname = "Supplier name is required";
        if (!formData.mobile) errors.mobile = "Mobile no is required";
        if (!formData.status) errors.status = "Status is required";
        if (!formData.customer_address_1) errors.customer_address_1 = "Address is required";
        if (!formData.createddt) errors.createddt = "Created date is required";
        if (!formData.addedby) errors.addedby = "Added by is required";
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
            const response = await axios_post(true, "supplier/store", formData);
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
            ...(name === "company_id" && { location_id: "" })
        }));
        if (name === "company_id") {
            fetchlocationList(value);
        }
    };

    const handleBack = () => {
        navigate("/supplier");
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
                                                    <InputLabel sx={{ mb: 1 }}>Code</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="cuscode"
                                                        value={formData.cuscode}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        disabled
                                                        className="small-input"
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Supplier Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="cusname"
                                                        value={formData.cusname}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                    {formError.cusname && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.cusname}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Country</InputLabel>
                                                    <Select
                                                        name="country_id"
                                                        value={formData.country_id}
                                                        onChange={handleChange}
                                                        className="small-input"
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
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Address 1</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="customer_address_1"
                                                        value={formData.customer_address_1}
                                                        onChange={(e) => handleChange(e)}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 200 }}
                                                    />
                                                    {formError.customer_address_1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.customer_address_1}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Address 2</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="customer_address_2"
                                                        value={formData.customer_address_2}
                                                        onChange={(e) => handleChange(e)}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 200 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Email Id </InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="cusemail1"
                                                        value={formData.cusemail1}
                                                        onChange={handleChange}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 30 }}
                                                    />
                                                    {formError.cusemail1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.cusemail1}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Mobile No</InputLabel>
                                                    <MDInput
                                                        type="number"
                                                        variant="outlined"
                                                        name="mobile"
                                                        value={formData.mobile}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d{0,10}$/.test(value)) {
                                                                handleChange(e);
                                                            }
                                                        }}
                                                        inputProps={{ maxLength: 10 }}
                                                        className="small-input"
                                                    />
                                                    {formError.mobile && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.mobile}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Tax No</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="custax1"
                                                        value={formData.custax1}
                                                        onChange={(e) => handleChange(e)}
                                                        inputProps={{ maxLength: 10 }}
                                                        className="small-input"
                                                    />
                                                    {formError.custax1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.custax1}</MDTypography>}
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
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Company </InputLabel>
                                                    <Select
                                                        name="company_id"
                                                        value={formData.company_id}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                    // className="small-input"
                                                    >
                                                        {compines?.map((company) => (
                                                            <MenuItem key={company.id} value={company?.id}>
                                                                {company?.compdesc}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formError.company_id && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.company_id}</MDTypography>}
                                                </MDBox>
                                            </Grid>


                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>location</InputLabel>
                                                    <Select
                                                        name="location_id"
                                                        value={formData.location_id}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                    // className="small-input"
                                                    >
                                                        {locations?.map((location) => (
                                                            <MenuItem key={location.id} value={location?.id}>
                                                                {location?.locname}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formError.location_id && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.location_id}</MDTypography>}
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

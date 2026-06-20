import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import moment from 'moment';

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
import { axios_get, axios_post } from '../../../../axios';
import { ToastMassage } from '../../../../toast/index';
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

function Edit_city() {
    const navigate = useNavigate();
    const params = useParams();

    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    const [state, setState] = useState([]);
    const [open, setOpen] = useState();

    const [formData, setFormData] = useState({
        name: "",
        country_id: "",
        state_id: "",
        createddt: new Date().toLocaleString(),
        id: params.id,
    });

    useEffect(() => {
        fetchcountryList();
        fetchOrderDetails();
    }, []);

    const fetchEmiratesList = async (country_id) => {
        const response = await axios_post(true, "state/list", {
            country_id: country_id
        });
        if (response) {
            if (response.status) {
                setState(response.data);
            } else {
                ToastMassage(response.message, 'error');
            }
        }
    };

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
    const validation = (formData) => {
        let errors = {};

        if (!formData.country_id) {
            errors.country_id = "Country is required";
        }

        if (!formData.state_id) {
            errors.state_id = "State is required";
        }
        if (!formData.name) {
            errors.name = "Name is required";
        }
        return errors;
    };

    const fetchOrderDetails = async () => {
        try {
            const response = await axios_post(true, 'city/details', {
                id: params.id
            });
            if (response.status) {
                const orderData = response.data;
                setFormData({
                    ...formData,
                    name: orderData.name,
                    country_id: orderData.country_id,
                    state_id: orderData.state_id,
                });

                if (orderData.country_id) {
                    await fetchEmiratesList(orderData.country_id);
                }
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
            setFormError({});
            const response = await axios_post(true, "city/update", formData);
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success');
                    navigate("/city");
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
            ...(name === "country_id" && { state_id: "" })
        }));
        if (name === "country_id") {
            fetchEmiratesList(value);
        }
    };

    const handleBack = () => {
        navigate("/city");
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
                                                Edit City
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/city">
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
                                                    <InputLabel sx={{ mb: 1 }}>Country</InputLabel>
                                                    <Select
                                                        name="country_id"
                                                        value={formData.country_id}
                                                        onChange={handleChange}
                                                        onKeyDown={() => setOpen(true)} 
                                                        onClose={() => setOpen(false)} 
                                                        sx={{ width: 250, height: 45 }}
                                                  
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
                                                    <InputLabel sx={{ mb: 1 }}>State</InputLabel>
                                                    <Select
                                                        name="state_id"
                                                        value={formData.state_id}
                                                        onChange={handleChange}
                                                        onKeyDown={() => setOpen(true)} 
                                                        onClose={() => setOpen(false)} 
                                                        sx={{ width: 250, height: 45 }}
                                                    // className="small-input"
                                                    >
                                                        {state?.map((country) => (
                                                            <MenuItem key={country.id} value={country?.id}>
                                                                {country?.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formError.state_id && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.state_id}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        // label="Order Number"
                                                        variant="outlined"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                    />
                                                    {formError.name && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.name}</MDTypography>}
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

export default Edit_city;

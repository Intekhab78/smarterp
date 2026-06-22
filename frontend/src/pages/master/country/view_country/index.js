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
import { ToastMassage } from '../../../../toast';
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

function Edit_Country() {
    const navigate = useNavigate();
    const params = useParams();

    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const [formData, setFormData] = useState({
        name: "",
        id: params.id,
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
    useEffect(() => {
        fetchcountryList();
        fetchOrderDetails();
    }, []);
    const validation = (formData) => {
        let errors = {};


        if (!formData.name) errors.name = "name is required";

        return errors;
    };
    const fetchOrderDetails = async () => {
        try {
            const response = await axios_post(true, 'country/details', {
                id: params.id
            });
            if (response.status) {
                const orderData = response.data;
                setFormData({
                    ...formData,

                    name: orderData.name,

                });

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
            const response = await axios_post(true, "country/update", formData);
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success');
                    navigate("/country");
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
        navigate("/country");
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
                                                View Country
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/country">
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
                                                        disabled={true}
                                                        inputProps={{ maxLength: 120 }}
                                                    />
                                                    {formError.name && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.name}</MDTypography>}
                                                </MDBox>
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

export default Edit_Country;

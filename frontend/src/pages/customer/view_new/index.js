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
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { axios_get, axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import { FormControl, MenuItem, Select } from "@mui/material";
import moment from "moment";

function EditNew() {
  const params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    alternate_phone: "",
    dob: "",
    gender: "",
    billing_address: "",
    shipping_address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    gst_number: "",
    customer_type: "",
    loyalty_points: 0,
    status: "1",
    created_at: "",
    updated_at: "",
    deleted_at: "",
  });

  const [countries, setCountries] = useState([]);
  const [formError, setFormError] = useState({});
  const [isSubmit, setisSubmit] = useState(false);

  // Fetch country list
  const fetchcountryList = async () => {
    const response = await axios_get(true, "country/list-dropdown");
    if (response?.status) {
      setCountries(response.data);
    } else {
      ToastMassage(response.message, "error");
    }
  };

  // Fetch customer details
  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "customer/details", {
        id: params.id,
      });
      if (response?.status) {
        const orderData = response.data;
        setFormData({
          customer_code: orderData.customer_code || "",
          first_name: orderData.first_name || "",
          last_name: orderData.last_name || "",
          email: orderData.email || "",
          phone: orderData.phone || "",
          alternate_phone: orderData.alternate_phone || "",
          dob: orderData.dob ? moment(orderData.dob).format("YYYY-MM-DD") : "",
          gender: orderData.gender || "",
          billing_address: orderData.billing_address || "",
          shipping_address: orderData.shipping_address || "",
          city: orderData.city || "",
          state: orderData.state || "",
          country: orderData.country || "",
          zipcode: orderData.zipcode || "",
          gst_number: orderData.gst_number || "",
          customer_type: orderData.customer_type || "",
          loyalty_points: orderData.loyalty_points || 0,
          status: orderData.status === "Active" ? "1" : "0",
          created_at: orderData.created_at || "",
          updated_at: orderData.updated_at || "",
          deleted_at: orderData.deleted_at || "",
        });
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchcountryList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBack = () => {
    navigate("/customer");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
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
                <Grid container spacing={0} alignItems="center">
                  <Grid item xs={6}>
                    <MDTypography variant="h6" color="white">
                      <Icon fontSize="small">shopping_cart</Icon>
                      &nbsp; View Customer
                    </MDTypography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <MDButton
                      variant="gradient"
                      color="light"
                      onClick={handleBack}
                    >
                      Back
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <Grid container spacing={2}>
                  {/* Customer Code */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Customer Code</InputLabel>
                      <MDInput
                        name="customer_code"
                        value={formData.customer_code}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* First Name */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>First Name</InputLabel>
                      <MDInput
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Last Name */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Last Name</InputLabel>
                      <MDInput
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Email</InputLabel>
                      <MDInput
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Phone</InputLabel>
                      <MDInput
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Alternate Phone */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Alternate Phone</InputLabel>
                      <MDInput
                        name="alternate_phone"
                        value={formData.alternate_phone}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Date of Birth */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Date of Birth</InputLabel>
                      <MDInput
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Gender */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Gender</InputLabel>
                      <MDInput
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Billing Address */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Billing Address</InputLabel>
                      <MDInput
                        name="billing_address"
                        value={formData.billing_address}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Shipping Address */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Shipping Address</InputLabel>
                      <MDInput
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* City */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>City</InputLabel>
                      <MDInput
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* State */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>State</InputLabel>
                      <MDInput
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Country */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Country</InputLabel>
                      <Select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      >
                        {countries?.map((country) => (
                          <MenuItem key={country.id} value={country.id}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </MDBox>
                  </Grid>

                  {/* Zipcode */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Zipcode</InputLabel>
                      <MDInput
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* GST Number */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>GST Number</InputLabel>
                      <MDInput
                        name="gst_number"
                        value={formData.gst_number}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Customer Type */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Customer Type</InputLabel>
                      <MDInput
                        name="customer_type"
                        value={formData.customer_type}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Loyalty Points */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Loyalty Points</InputLabel>
                      <MDInput
                        name="loyalty_points"
                        value={formData.loyalty_points}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled
                        fullWidth
                      >
                        <MenuItem value="1">Active</MenuItem>
                        <MenuItem value="0">Inactive</MenuItem>
                      </Select>
                    </MDBox>
                  </Grid>

                  {/* Created At */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Created At</InputLabel>
                      <MDInput
                        name="created_at"
                        value={formData.created_at}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>

                  {/* Updated At */}
                  <Grid item xs={12} sm={4}>
                    <MDBox pb={2}>
                      <InputLabel>Updated At</InputLabel>
                      <MDInput
                        name="updated_at"
                        value={formData.updated_at}
                        disabled
                        fullWidth
                      />
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditNew;

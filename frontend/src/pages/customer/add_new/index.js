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
import { axios_get, axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import { FormControl, MenuItem, Select } from "@mui/material";

function AddNew() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [isSubmit, setisSubmit] = useState(false);
  const [countries, setCountries] = useState([]);
  let user_data = JSON.parse(localStorage.getItem("user_data"));

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
    created_at: new Date().toLocaleString(),
    updated_at: new Date(),
    deleted_at: null,
  });

  const OrderNumberRange = async () => {
    let params = { function_for: "customer" };
    const response = await axios_post(
      true,
      "code_setting/get-next-comming-code",
      params
    );
    if (response) {
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          customer_code: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchCountryList = async () => {
    const response = await axios_get(true, "country/list-dropdown");
    if (response) {
      if (response.status) {
        setCountries(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  useEffect(() => {
    OrderNumberRange();
    fetchCountryList();
  }, []);

  const validation = (formData) => {
    let errors = {};
    if (!formData.first_name) errors.first_name = "First Name is required";
    if (!formData.last_name) errors.last_name = "Last Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone is required";
    if (!formData.billing_address)
      errors.billing_address = "Billing Address is required";
    if (!formData.customer_type)
      errors.customer_type = "Customer Type is required";
    if (!formData.gst_number) errors.gst_number = "GST Number is required";
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
      const response = await axios_post(true, "customer/store", formData);
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/customer");
        } else {
          ToastMassage(response.message, "error");
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
    navigate("/customer");
  };

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
                        Add Customer
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/customer">
                        <MDButton variant="gradient" color="light">
                          Back
                        </MDButton>
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Customer Code</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="customer_code"
                            value={formData.customer_code}
                            onChange={handleChange}
                            disabled
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>First Name</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="small-input"
                          />
                          {formError.first_name && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.first_name}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Last Name</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="small-input"
                          />
                          {formError.last_name && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.last_name}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Email</InputLabel>
                          <MDInput
                            type="email"
                            variant="outlined"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="small-input"
                          />
                          {formError.email && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.email}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Phone</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,10}$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                            inputProps={{ maxLength: 10 }}
                            className="small-input"
                          />
                          {formError.phone && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.phone}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Alternate Phone
                          </InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            name="alternate_phone"
                            value={formData.alternate_phone}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,10}$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                            inputProps={{ maxLength: 10 }}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Date of Birth</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Gender</InputLabel>
                          <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="small-input"
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Customer Type</InputLabel>
                          <Select
                            name="customer_type"
                            value={formData.customer_type}
                            onChange={handleChange}
                            className="small-input"
                          >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Retail">Retail</MenuItem>
                            <MenuItem value="Wholesale">Wholesale</MenuItem>
                          </Select>
                          {formError.customer_type && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.customer_type}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Number</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="gst_number"
                            value={formData.gst_number}
                            onChange={handleChange}
                            className="small-input"
                          />
                          {formError.gst_number && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.gst_number}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Billing Address
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="billing_address"
                            value={formData.billing_address}
                            onChange={handleChange}
                            className="small-input"
                          />
                          {formError.billing_address && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.billing_address}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Shipping Address
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="shipping_address"
                            value={formData.shipping_address}
                            onChange={handleChange}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>State</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Country</InputLabel>
                          <Select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="small-input"
                          >
                            <MenuItem value="">Select</MenuItem>
                            {countries.map((item, index) => (
                              <MenuItem key={index} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                          <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="small-input"
                          >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                          </Select>
                          {formError.status && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.status}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <MDBox display="flex" justifyContent="flex-end" pt={2}>
                          <MDButton
                            type="submit"
                            variant="gradient"
                            color="info"
                            disabled={isSubmit}
                          >
                            {isSubmit ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "Save"
                            )}
                          </MDButton>
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

export default AddNew;

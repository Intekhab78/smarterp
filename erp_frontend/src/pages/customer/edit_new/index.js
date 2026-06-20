import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axios_get, axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import {
  Card,
  Grid,
  InputLabel,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    customer_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    alternate_phone: "",
    dob: "",
    gender: "",
    gst_number: "",
    billing_address: "",
    shipping_address: "",
    state: "",
    country: "",
    zipcode: "",
    status: "",
  });
  const [countries, setCountries] = useState([]);

  // Fetch country list
  const fetchcountryList = async () => {
    const response = await axios_get(true, "country/list-dropdown");
    if (response?.status) {
      setCountries(response.data);
    } else {
      ToastMassage(response.message, "error");
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios_post(true, "customer/details", { id });
      if (response.status) {
        setFormData(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchcountryList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validation = () => {
    const errors = {};
    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.last_name) errors.last_name = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const errors = validation();
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      setIsSubmit(false);
      return;
    }

    try {
      const response = await axios_post(true, "customer/update", {
        ...formData,
        id,
      });
      if (response.status) {
        ToastMassage(response.message, "success");
        navigate("/customer");
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmit(false);
  };

  const handleBack = () => navigate("/customer");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Card>
              <MDBox px={3} py={2}>
                <MDTypography variant="h6">Edit Customer</MDTypography>
              </MDBox>
              <MDBox px={3} py={2}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        error={!!formError.first_name}
                        helperText={formError.first_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        error={!!formError.last_name}
                        helperText={formError.last_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formError.email}
                        helperText={formError.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!formError.phone}
                        helperText={formError.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Alternate Phone"
                        name="alternate_phone"
                        value={formData.alternate_phone || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="DOB"
                        type="date"
                        name="dob"
                        value={formData.dob || ""}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="GST Number"
                        name="gst_number"
                        value={formData.gst_number || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Billing Address"
                        name="billing_address"
                        value={formData.billing_address || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Shipping Address"
                        name="shipping_address"
                        value={formData.shipping_address || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleChange}
                      />
                    </Grid> */}

                    {/* Country */}
                    <Grid item xs={12} sm={4}>
                      <MDBox pb={2}>
                        <InputLabel>Country</InputLabel>
                        <Select
                          name="country"
                          value={formData.country || ""}
                          onChange={handleChange}
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

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zipcode"
                        name="zipcode"
                        value={formData.zipcode || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Select
                        fullWidth
                        name="status"
                        value={formData.status || "Active"}
                        onChange={handleChange}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <MDButton
                        type="submit"
                        disabled={isSubmit}
                        variant="gradient"
                        color="info"
                      >
                        {isSubmit ? <CircularProgress size={24} /> : "Save"}
                      </MDButton>
                      <MDButton
                        onClick={handleBack}
                        variant="gradient"
                        color="secondary"
                        sx={{ ml: 2 }}
                      >
                        Cancel
                      </MDButton>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditCustomer;

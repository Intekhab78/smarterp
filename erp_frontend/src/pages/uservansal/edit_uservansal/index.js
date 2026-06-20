import { useState, useEffect } from "react";
import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { FormControl, Icon, MenuItem, Select } from "@mui/material";

function Edit_Uservansal() {
  const navigate = useNavigate();
  const params = useParams();

  const [formError, setFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    id: "",
    lastname: "",
    email: "",
    mobile: "",
    companies: [],
    location_id: "",
    password: "",
  });

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "user_user_master/details", {
        id: params.id,
      });
      if (response.status) {
        const orderData = response.data;
        console.log("orderData--", orderData);

        const companyIds =
          orderData.user_company?.map((company) => company.company_id) || [];

        console.log("companyIds---------", companyIds);

        setFormData({
          id: orderData.id || "",
          firstname: orderData.firstname || "",
          lastname: orderData.lastname || "",
          companies: companyIds,
          //   companies2: orderData.company_id,

          location_id: orderData.location_id,
          email: orderData.email || "",
          mobile: orderData.mobile || "",
        });

        if (companyIds.length) {
          await fetchLocationList(companyIds);
        }
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const fetchCompanyList = async () => {
    try {
      const response = await axios_post(true, "company/com_list");
      if (response.status) {
        setCompanies(response.data);
        console.log("comapny is ", response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  const fetchLocationList = async (companies) => {
    try {
      const response = await axios_post(true, "location/loc_list", {
        companies,
      });
      console.log("location is ", response.data);

      if (response.status) {
        setLocations(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchCompanyList();
  }, []);

  const handleSubmit = async (event) => {
    setIsSubmit(true);
    event.preventDefault();

    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setIsSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      try {
        const response = await axios_post(
          true,
          "user_user_master/update",
          formData,
        );
        console.log("form data is --", formData);

        setIsSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/uservansal");
        } else {
          ToastMassage(response.message, "error");
        }
      } catch (error) {
        console.error("Failed to update user:", error);
        setIsSubmit(false);
      }
    }
  };

  const validate = (formData) => {
    const errors = {};
    if (!formData.firstname) errors.firstname = "Firstname is required";
    if (!formData.lastname) errors.lastname = "Lastname is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.mobile) errors.mobile = "Mobile is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "companies" && typeof value === "string"
          ? value.split(",")
          : value,
      ...(name === "companies" && { location_id: "" }),
    }));
    if (name === "companies") {
      fetchLocationList(typeof value === "string" ? value.split(",") : value);
    }
  };

  const handleBack = () => {
    navigate("/uservansal");
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
                        Edit User JERP
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/uservansal">
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
                          <InputLabel sx={{ mb: 1 }}>Firstname</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="firstname"
                            value={formData.firstname}
                            className="small-input"
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 10 }}
                            // disabled
                          />
                          {formError.firstname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.firstname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Lastname</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="lastname"
                            className="small-input"
                            value={formData.lastname}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 120 }}
                          />
                          {formError.lastname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.lastname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Email</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="email"
                            className="small-input"
                            value={formData.email}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 180 }}
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
                          <InputLabel sx={{ mb: 1 }}>Password</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 50 }}
                          />
                          {formError.password && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.password}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Mobile</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            name="mobile"
                            value={formData.mobile}
                            // onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,10}$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                            inputProps={{ maxLength: 10 }}
                          />
                          {formError.mobile && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.mobile}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Company</InputLabel>
                          <Select
                            name="companies"
                            value={formData.companies}
                            onChange={(event) => {
                              const { value } = event.target;
                              setFormData((prevData) => ({
                                ...prevData,
                                companies:
                                  typeof value === "string"
                                    ? value.split(",")
                                    : value,
                              }));
                              fetchLocationList(
                                typeof value === "string"
                                  ? value.split(",")
                                  : value,
                              );
                            }}
                            multiple
                            sx={{ width: 250, height: 45 }}
                            renderValue={(selected) =>
                              selected
                                .map(
                                  (id) =>
                                    companies.find(
                                      (company) => company.id === id,
                                    )?.compdesc,
                                )
                                .join(", ")
                            }
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 224,
                                  width: 250,
                                },
                              },
                            }}
                          >
                            {companies?.map((company) => (
                              <MenuItem
                                key={company.id}
                                value={company.id}
                                onClick={() => {
                                  document.activeElement.blur();
                                }}
                              >
                                {company.compdesc}
                              </MenuItem>
                            ))}
                          </Select>

                          {formError.companies && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.companies}
                            </MDTypography>
                          )}
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
                          {formError.location_id && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.location_id}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid
                        container
                        spacing={2}
                        justifyContent="right"
                        sx={{ mt: 1, mb: 2 }}
                      >
                        <Grid item xs={2} ml={3}>
                          <MDBox sx={{ display: "flex" }}>
                            <MDButton
                              variant="gradient"
                              disabled={isSubmit}
                              color="info"
                              type="submit"
                              fullWidth
                            >
                              {isSubmit ? (
                                <CircularProgress
                                  color="white"
                                  size={24}
                                  sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                  }}
                                />
                              ) : (
                                "Save"
                              )}
                            </MDButton>
                            <MDButton
                              variant="gradient"
                              disabled={isSubmit}
                              color="secondary"
                              fullWidth
                              sx={{ marginLeft: "15px" }}
                              onClick={handleBack}
                            >
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

export default Edit_Uservansal;

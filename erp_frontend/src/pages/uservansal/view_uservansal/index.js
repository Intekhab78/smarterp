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
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";

function Edit_Uservansal() {
  const navigate = useNavigate();
  const params = useParams();
  const [formError, setFormError] = useState({});
  const [isSubmit, setisSubmit] = useState(false);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [formData, setFormData] = useState({
    firstname: "",
    id: 1,
    lastname: "",
    email: "",
    mobile: "",
    companies: [],
    location_id: "",
  });
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response) {
      if (response.status) {
        setCompines(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchlocationList = async (company_id) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: company_id,
    });
    if (response) {
      if (response.status) {
        setlocations(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "user_user_master/details", {
        id: params.id,
      });
      if (response.status) {
        const orderData = response.data;
        const companyIds =
          orderData.user_company?.map((company) => company.company_id) || [];

        setFormData({
          id: orderData.id || "",
          firstname: orderData.firstname || "",
          lastname: orderData.lastname || "",
          companies: companyIds,
          location_id: orderData.location_id,
          email: orderData.email || "",
          mobile: orderData.mobile || "",
        });

        if (companyIds.length) {
          await fetchlocationList(companyIds);
        }
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchcompanyList();
  }, [params.id]);

  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();

    let errors = validation(formData);

    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});

      const response = await axios_post(
        true,
        "user_user_master/update",
        formData
      );

      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/uservansal");
        } else {
          ToastMassage(response.message, "error");
        }
      }
    }
  };

  const validation = (formData) => {
    let errors = {};
    if (!formData.firstname) errors.firstname = "Firstname is required";
    if (!formData.company_id) errors.company_id = "Company id is required";
    if (!formData.location_id) errors.location_id = "Location id is required";
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
      fetchlocationList(Array.isArray(value) ? value : value.split(","));
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
                  {" "}
                  <Grid container xs={12} spacing={0}>
                    <Grid item xs={6} mr={0}>
                      <MDTypography variant="h6" color="white">
                        View User JERP
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
                            onChange={handleChange}
                            disabled={true}
                            className="small-input"
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
                            value={formData.lastname}
                            onChange={handleChange}
                            disabled={true}
                            className="small-input"
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
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
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
                              fetchlocationList(
                                typeof value === "string"
                                  ? value.split(",")
                                  : value
                              );
                            }}
                            multiple
                            sx={{ width: 250, height: 45 }}
                            renderValue={(selected) =>
                              selected
                                .map(
                                  (id) =>
                                    compines.find(
                                      (company) => company.id === id
                                    )?.compdesc
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
                            {compines?.map((company) => (
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

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Password</InputLabel>
                          <MDInput
                            type={"password"}
                            variant="outlined"
                            name="password"
                            className="small-input"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={true}
                          />
                          {formError.password && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {" "}
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
                            className="small-input"
                            value={formData.mobile}
                            onChange={handleChange}
                            disabled={true}
                            inputProps={{ maxLength: 50 }}
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
                          <InputLabel sx={{ mb: 1 }}>Company </InputLabel>
                          <Select
                            name="companies"
                            value={formData.companies || []}
                            onChange={handleChange}
                            multiple
                            sx={{ width: 250, height: 45 }}
                            disabled={!compines.length}
                            renderValue={(selected) =>
                              selected
                                .map(
                                  (id) =>
                                    compines.find(
                                      (company) => company.id === id
                                    )?.compdesc
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
                            {compines?.map((company) => (
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

                          {formError.company_id && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.company_id}
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
                            disabled={true}
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

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
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";

function Add_Itemcolor() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [isSubmit, setisSubmit] = useState(false);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [countries, setCountries] = useState([]);
  let user_data = JSON.parse(localStorage.getItem("user_data"));

  const [formData, setFormData] = useState({
    sno: "",
    itemcolcode: "",
    itemcolname: "",
    itemcolname: "",
    company_id: "",
    location_id: "",
    note1: "",
    note2: "",
    note3: "",
    itmcoldt1: "",
    itmcoldt2: "",
    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),
    status: "1",
  });
  const OrderNuberRange = async () => {
    let params = {
      function_for: "item_color",
    };
    const response = await axios_post(
      true,
      "code_setting/get-next-comming-code",
      params
    );
    if (response) {
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          itemcolcode: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchcountryList = async () => {
    const response = await axios_get(true, "country/list-dropdown");
    if (response) {
      if (response.status) {
        setCountries(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
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
  useEffect(() => {
    OrderNuberRange();
    fetchcountryList();
    fetchcompanyList();
  }, []);
  const validation = (formData) => {
    let errors = {};

    if (!formData.itemcolcode)
      errors.itemcolcode = "Item colorCode is required";
    if (!formData.itemcolname) errors.itemcolname = "Description is required";
    if (!formData.itemcoldesclong)
      errors.itemcoldesclong = "Long description is required";
    if (!formData.addedby) errors.addedby = "Added by is required";
    if (!formData.createddt) errors.createddt = "Created date is required";
    if (!formData.status) errors.status = "Status is required";
    // if (!formData.customer_address_1) errors.customer_address_1 = "Address is required";
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
      const response = await axios_post(true, "item_color/store", formData);
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/itemcolor");
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
      ...(name === "company_id" && { location_id: "" }),
    }));
    if (name === "company_id") {
      fetchlocationList(value);
    }
  };

  const handleBack = () => {
    navigate("/itemcolor");
  };

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
                        Add Item Color
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/itemcolor">
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
                          <InputLabel sx={{ mb: 1 }}>Item ColorCode</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="itemcolcode"
                            value={formData.itemcolcode}
                            className="small-input"
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 10 }}
                            disabled
                          />
                          {formError.itemcolcode && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemcolcode}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="itemcolname"
                            className="small-input"
                            value={formData.itemcolname}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 120 }}
                          />
                          {formError.itemcolname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemcolname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Long Description
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="itemcoldesclong"
                            className="small-input"
                            value={formData.itemcoldesclong}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 180 }}
                          />
                          {formError.itemcoldesclong && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemcoldesclong}
                            </MDTypography>
                          )}
                        </MDBox>
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
                            name="itmcoldt1"
                            value={formData.itmcoldt1}
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
                            name="itmcoldt2"
                            value={formData.itmcoldt2}
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
                          {formError.addedby && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.addedby}
                            </MDTypography>
                          )}
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
                          {formError.createddt && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.createddt}
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
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.status}
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

export default Add_Itemcolor;

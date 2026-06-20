import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRadioGroup } from "@mui/material/RadioGroup";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import routes from "routes";
import { axios_get, axios_post, axios_post_image } from "../../../axios";
import { ToastMassage } from "../../../toast";

function Add_ItemFamMst() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteuomValue, setAutocompleteuomValue] = useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
  const [item, setItem] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  const [uoms, setuomList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  let user_data = JSON.parse(localStorage.getItem("user_data"));

  console.log("user data", user_data);

  const [formData, setFormData] = useState({
    itemfamcode: "",
    itemfamname: "",
    itemfamlong: "",
    itemdeptname: "",
    note1: "",
    note2: "",
    note3: "",
    itmfamdt1: "",
    company_id: "",
    location_id: "",
    itmfamdt2: "",
    // addedby: `${user_data.firstname} ${user_data.lastname}`,
    addedby: `${user_data.usertype}`,
    createddt: new Date().toLocaleString(),
    status: "1",
  });

  useEffect(() => {
    ItemList();
    uomList();
    fetchcompanyList();
    OrderNuberRange();
    getDepartmentList();
  }, []);

  const ItemList = async () => {
    const response = await axios_post(true, "item/list");
    if (response) {
      if (response.status) {
        setItem(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const getDepartmentList = async () => {
    const response = await axios_post(true, "item_department/list");
    if (response) {
      if (response.status) {
        setDepartmentList(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const uomList = async () => {
    const response = await axios_post(true, "item_uom/list");
    if (response) {
      if (response.status) {
        setuomList(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const OrderNuberRange = async () => {
    let params = {
      function_for: "family_master",
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
          itemfamcode: response.data?.number_is,
        }));
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

  const validation = (formData) => {
    let errors = {};
    if (!formData.itemfamname) {
      errors.itemfamname = "Description is required";
    }
    if (!formData.itemfamlong)
      errors.itemfamlong = "Long discription is required";
    // if (!formData.itemfamcode) {
    //     errors.itemfamcode = "Family code is required";
    // }
    if (!formData.itemdeptname) {
      errors.itemdeptname = "Department name is required";
    }
    if (!formData.createddt) errors.createddt = "Created date is required";
    if (!formData.addedby) errors.addedby = "Added by is required";
    if (!formData.status) {
      errors.status = "Status  is required";
    }

    return errors;
  };
  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    const data = new FormData();
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      const response = await axios_post(true, "family_master/store", formData);
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/ItemFamMst");
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
    navigate("/ItemFamMst");
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
                      <MDTypography
                        variant="h6"
                        color="white"
                        sx={{ width: 161 }}
                      >
                        <Icon fontSize="small">shopping_cart</Icon>
                        Add Family
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/ItemFamMst">
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
                          <InputLabel sx={{ mb: 1 }}>Family code</InputLabel>
                          <MDInput
                            type="text"
                            // label="Order Number"
                            variant="outlined"
                            name="itemfamcode"
                            value={formData.itemfamcode}
                            onChange={handleChange}
                            sx={{ width: 300 }}
                            disabled
                          />
                          {/* {formError.itemfamcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itemfamcode}</MDTypography>} */}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Family Name </InputLabel>
                          <MDInput
                            type="varchar"
                            name="itemfamname"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemfamname}
                            inputProps={{ maxLength: 120 }}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemfamname: e.target.value,
                              })
                            }
                          />
                          {formError.itemfamname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemfamname}
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
                            type="varchar"
                            name="itemfamlong"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemfamlong}
                            inputProps={{ maxLength: 180 }}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemfamlong: e.target.value,
                              })
                            }
                          />
                          {formError.itemfamlong && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemfamlong}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Department Name
                          </InputLabel>
                          <Select
                            name="itemdeptname"
                            value={formData.itemdeptname}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemdeptname: e.target.value,
                              })
                            }
                            className="small-input"
                          >
                            {departmentList?.map((country) => (
                              <MenuItem key={country.id} value={country?.id}>
                                {country?.itemdeptname}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.itemdeptname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdeptname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Desc in Ecom</InputLabel>
                          <MDInput
                            type="varchar"
                            name="note1"
                            variant="outlined"
                            className="small-input"
                            value={formData.note1}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note1: e.target.value,
                              })
                            }
                          />
                          {formError.note1 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.note1}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Display On Ecom
                          </InputLabel>
                          <MDInput
                            type="varchar"
                            name="note2"
                            variant="outlined"
                            className="small-input"
                            value={formData.note2}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note2: e.target.value,
                              })
                            }
                          />
                          {formError.note2 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.note2}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid> */}

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Display On Ecom
                          </InputLabel>

                          <Select
                            name="note2"
                            variant="outlined"
                            className="small-input"
                            value={formData.note2}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note2: e.target.value,
                              })
                            }
                            fullWidth
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Select>

                          {formError.note2 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.note2}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note3</InputLabel>
                          <MDInput
                            type="varchar"
                            name="note3"
                            variant="outlined"
                            className="small-input"
                            value={formData.note3}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note3: e.target.value,
                              })
                            }
                          />
                          {formError.note3 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.note3}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 1</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmfamdt1"
                            value={formData.itmfamdt1}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itmfamdt1: e.target.value,
                              })
                            }
                            className="small-input"
                            // disabled
                          />
                          {formError.itmfamdt1 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmfamdt1}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 2</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmfamdt2"
                            value={formData.itmfamdt2}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itmfamdt2: e.target.value,
                              })
                            }
                            className="small-input"
                            // disabled
                          />
                          {formError.itmfamdt2 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmfamdt2}
                            </MDTypography>
                          )}
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

export default Add_ItemFamMst;

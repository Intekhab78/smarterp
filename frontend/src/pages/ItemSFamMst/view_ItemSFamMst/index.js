import { Link, useNavigate, useParams } from "react-router-dom";
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
import moment from "moment";

function Edit_ItemSFamMst() {
  const params = useParams();
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
  const [isSubmit, setisSubmit] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [FmailyList, setFmailyList] = useState([]);

  let user_data = JSON.parse(localStorage.getItem("user_data"));

  const [formData, setFormData] = useState({
    itemsfamcode: "",
    itemsfamname: "",
    itemsfamlong: "",
    company_id: "",
    location_id: "",
    itemdeptname: "",
    itemfamcode: "",
    note1: "",
    note2: "",
    note3: "",
    itmsfamdt1: "",
    itmsfamdt2: "",
    id: params.id,
    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),
    status: "1",
  });
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
  const getFmailyList = async (departId) => {
    const response = await axios_post(true, "family_master/list", {
      id: departId,
    });
    if (response) {
      if (response.status) {
        setFmailyList(response.data);
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
    ItemList();
    uomList();
    fetchcompanyList();
    OrderNuberRange();
    getDepartmentList();
    // getFmailyList();
    fetchOrderDetails();
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
      function_for: "item",
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
          itemsfamcode: response.data?.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };

  const validation = (formData) => {
    let errors = {};
    if (!formData.itemsfamname) {
      errors.itemsfamname = "Description is required";
    }
    if (!formData.itemsfamlong) {
      errors.itemsfamlong = " Long Description is required";
    }

    if (!formData.itemfamcode) {
      errors.itemfamcode = "Family Name is required";
    }
    if (!formData.itemdeptname) {
      errors.itemdeptname = "Department name is required";
    }
    if (!formData.createddt) errors.createddt = "Created Date is required";
    if (!formData.addedby) errors.addedby = "Added By is required";
    if (!formData.status) {
      errors.status = "Status  is required";
    }
    return errors;
  };
  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "sub_family_master/details", {
        id: params.id,
      });
      if (response.status) {
        const orderData = response.data;
        setFormData({
          ...formData,
          sno: "",
          itemsfamcode: orderData.itemsfamcode,
          itemsfamname: orderData.itemsfamname,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          itemsfamlong: orderData.itemsfamlong,
          itemdeptname: orderData.itemdeptname,
          itemfamcode: orderData.itemfamcode,
          note3: orderData.note3,
          note1: orderData.note1,
          note2: orderData.note2,
          itmsfamdt1: moment(orderData.itmsfamdt1).format("YYYY-MM-DD"),
          itmsfamdt2: moment(orderData.itmsfamdt2).format("YYYY-MM-DD"),
          status: orderData.status === 0 ? "0" : "1",
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }
        getFmailyList(orderData.itemdeptname);
      } else {
        ToastMassage(response.message, "error");
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
      const response = await axios_post_image(
        true,
        "sub_family_master/update",
        formData
      );
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/ItemSFamMst");
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
    navigate("/ItemSFamMst");
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
                        View sub Family
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/ItemSFamMst">
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
                          <InputLabel sx={{ mb: 1 }}>Code</InputLabel>
                          <MDInput
                            type="text"
                            // label="Order Number"
                            variant="outlined"
                            name="itemsfamcode"
                            value={formData.itemsfamcode}
                            onChange={handleChange}
                            sx={{ width: 300 }}
                            disabled
                          />
                          {formError.itemsfamcode && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.code}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Description </InputLabel>
                          <MDInput
                            type="varchar"
                            name="itemsfamname"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemsfamname}
                            disabled={true}
                            inputProps={{ maxLength: 120 }}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemsfamname: e.target.value,
                              })
                            }
                          />
                          {formError.itemsfamname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemsfamname}
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
                            name="itemsfamlong"
                            variant="outlined"
                            className="small-input"
                            value={formData.itemsfamlong}
                            inputProps={{ maxLength: 180 }}
                            disabled={true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemsfamlong: e.target.value,
                              })
                            }
                          />
                          {formError.itemsfamlong && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemsfamlong}
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
                            disabled={true}
                            // onChange={(e) => setFormData({ ...formData, itemdeptname: e.target.value })}
                            onChange={(e) => {
                              const selectedDeptId = e.target.value;
                              setFormData({
                                ...formData,
                                itemdeptname: selectedDeptId,
                                itemfamcode: "",
                              });
                              getFmailyList(selectedDeptId);
                            }}
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
                          <InputLabel sx={{ mb: 1 }}>Family Name</InputLabel>
                          <Select
                            name="itemfamcode"
                            value={formData.itemfamcode}
                            disabled={true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itemfamcode: e.target.value,
                              })
                            }
                            className="small-input"
                          >
                            {FmailyList?.map((country) => (
                              <MenuItem key={country.id} value={country?.id}>
                                {country?.itemfamname}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.itemfamcode && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemfamcode}
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
                            disabled={true}
                            value={formData.note1}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note1: e.target.value,
                              })
                            }
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Display On Ecom
                          </InputLabel>
                          <MDInput
                            type="text"
                            name="note2"
                            variant="outlined"
                            className="small-input"
                            disabled={true}
                            value={formData.note2}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note2: e.target.value,
                              })
                            }
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note3</InputLabel>
                          <MDInput
                            type="text"
                            name="note3"
                            variant="outlined"
                            className="small-input"
                            disabled={true}
                            value={formData.note3}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note3: e.target.value,
                              })
                            }
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 1</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmsfamdt1"
                            value={formData.itmsfamdt1}
                            disabled={true}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itmsfamdt1: e.target.value,
                              })
                            }
                            className="small-input"
                            // disabled
                          />
                          {formError.itmsfamdt1 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmsfamdt1}
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
                            name="itmsfamdt2"
                            disabled={true}
                            value={formData.itmsfamdt2}
                            className="small-input"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                itmsfamdt2: e.target.value,
                              })
                            }

                            // disabled
                          />
                          {formError.itmsfamdt2 && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itmsfamdt2}
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
                            inputProps={{ maxLength: 40 }}
                            className="small-input"
                            disabled={true}
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
                          <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                          <Select
                            name="status"
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                status: e.target.value,
                              })
                            }
                            sx={{ width: 250, height: 45 }}
                            disabled={true}
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
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Company </InputLabel>
                          <Select
                            name="company_id"
                            disabled={true}
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
                            disabled={true}
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
                      {/* <Grid container spacing={2} justifyContent="right" sx={{ mt: 1, mb: 2 }}>
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
                                                        <MDButton variant="gradient" disabled={isSubmit} color="secondary" type="submit" fullWidth sx={{ marginLeft: '15px' }} onClick={handleBack}>
                                                            cancel
                                                        </MDButton>
                                                    </MDBox>
                                                </Grid>
                                            </Grid> */}
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

export default Edit_ItemSFamMst;

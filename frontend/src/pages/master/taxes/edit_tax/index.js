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
import { Autocomplete, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import routes from "routes";
import { axios_get, axios_post, axios_post_image } from "../../../../axios";
import { ToastMassage } from '../../../../toast';
import moment from "moment";

function EditTaxes() {
  const navigate = useNavigate();
  const params = useParams();
  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [isSubmit, setisSubmit] = useState(false);
  const [countries, setCountries] = useState([]);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  let user_data = JSON.parse(localStorage.getItem("user_data"));

  const [formData, setFormData] = useState({
    taxcode: "",
    taxname: "",
    taxlong: "",
    note1: "",
    company_id: "",
    location_id: "",
    note2: "",
    note3: "",
    itmtaxdt1: "",
    itmtaxdt2: "",
    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),
    status: "1",
    taxlegis: "",
    taxpor1: "",
    taxcal: "",
    taxpor1desc: "",
    taxpor2: "",
    taxpor2desc: "",
    taxpor3: "",
    taxpor3desc: "",
    taxvalidfrm: "",
    taxvalidto: "",
    id: params.id
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
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response) {
      if (response.status) {
        setCompines(response.data);
      } else {
        ToastMassage(response.message, 'error');
      }
    }
  };
  const fetchlocationList = async (company_id) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: company_id
    });
    if (response) {
      if (response.status) {
        setlocations(response.data);
      } else {
        ToastMassage(response.message, 'error');
      }
    }
  };

  const OrderNuberRange = async () => {
    let params = {
      function_for: "item"
    }
    const response = await axios_post(true, "code_setting/get-next-comming-code", params);
    if (response) {
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          "taxcode": response.data?.number_is,
        }));
      } else {
        ToastMassage(response.message, 'error')
      }
    }
  }
  const validation = (formData) => {
    let errors = {};
    if (!formData.taxname) {
      errors.taxname = "Description is required";
    }
    if (!formData.taxlong) {
      errors.taxlong = " Long description is required";
    }
    if (!formData.createddt) errors.createddt = "Created date is required";
    if (!formData.taxlegis) {
      errors.taxlegis = "Legislation is required";
    }
    if (!formData.addedby) errors.addedby = "Added by is required";
    if (!formData.taxcode) {
      errors.taxcode = "Item category code  is required";
    }
    if (!formData.taxcal) {
      errors.taxcal = "Tax calculation is required";
    }
    // if (!formData.taxpor1) {
    //   errors.taxpor1 = "Tax Portion 1 is required";
    // }
    // if (!formData.taxpor2) {
    //   errors.taxpor2 = "Tax Portion 2 is required";
    // }
    // if (!formData.taxpor3) {
    //   errors.taxpor3 = "Tax Portion 3 is required";
    // }
    if (parseFloat(formData.taxpor1) + parseFloat(formData.taxpor2) + parseFloat(formData.taxpor3) > parseFloat(formData.taxcal)) {
      // errors.taxcal = `Sum of Tax Portions (${formData.taxpor1 + formData.taxpor2 + formData.taxpor3}) exceeds Tax Calculation (${formData.taxcal})`;
      errors.taxcal = `Tax all portion sum should not be more than tax calculation`;
    }
    if (!formData.taxvalidfrm) {
      errors.taxvalidfrm = "Valid From date is required";
    }
    return errors;
  };
  useEffect(() => {
    OrderNuberRange();
    fetchcompanyList();
    fetchcountryList();
    fetchOrderDetails();
  }, []);
  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, 'tax_master/details', {
        id: params.id
      });
      if (response.status) {
        const orderData = response.data;
        setFormData({
          ...formData,
          sno: "",
          taxcode: orderData.taxcode,
          taxname: orderData.taxname,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          taxlong: orderData.taxlong,
          note1: orderData.note1,
          note2: orderData.note2,
          note3: orderData.note3,
          taxcal: orderData.taxcal,
          taxlegis: orderData.taxlegis,
          taxpor1: orderData.taxpor1,
          taxpor1desc: orderData.taxpor1desc,
          taxpor2: orderData.taxpor2,
          taxpor2desc: orderData.taxpor2desc,
          taxpor3: orderData.taxpor3,
          taxpor3desc: orderData.taxpor3desc,
          taxvalidfrm: moment(orderData.taxvalidfrm).format('YYYY-MM-DD'),
          taxvalidto: moment(orderData.taxvalidto).format('YYYY-MM-DD'),
          itmtaxdt1: moment(orderData.itmtaxdt1).format('YYYY-MM-DD'),
          itmtaxdt2: moment(orderData.itmtaxdt2).format('YYYY-MM-DD'),
          status: orderData.status === 0 ? "0" : "1",
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
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
      const response = await axios_post_image(true, "tax_master/update", formData);
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, 'success')
          navigate("/tax");

        } else {
          ToastMassage(response.message, 'error')
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "company_id" && { location_id: "" })
    }));
    if (name === "company_id") {
      fetchlocationList(value);
    }
  };

  const handleBack = () => {
    navigate("/tax");
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                        Edit Tax
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/tax">
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
                          <InputLabel sx={{ mb: 1 }}> Code</InputLabel>
                          <MDInput
                            type="varchar"
                            variant="outlined"
                            name="taxcode"
                            value={formData.taxcode}
                            className="small-input"
                            inputProps={{ maxLength: 10 }}
                            disabled
                          />
                          {formError.taxcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.taxcode}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Description </InputLabel>
                          <MDInput
                            type="text"
                            name="taxname"
                            variant="outlined"
                            className="small-input"
                            value={formData.taxname}
                            inputProps={{ maxLength: 120 }}
                            onChange={(e) => setFormData({ ...formData, taxname: e.target.value })}
                          />
                          {formError.taxname && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.taxname}</MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Long Description</InputLabel>
                          <MDInput
                            type="varchar"
                            name="taxlong"
                            variant="outlined"
                            className="small-input"
                            value={formData.taxlong}
                            inputProps={{ maxLength: 180 }}
                            onChange={(e) => setFormData({ ...formData, taxlong: e.target.value })}
                          />
                          {formError.taxlong && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.taxlong}</MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Calculation</InputLabel>
                          <TextField
                            name="taxcal"
                            value={formData.taxcal}
                            onChange={handleChange}
                            type="number"
                            className="small-input"
                          />
                          {formError.taxcal && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxcal}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Portion 1</InputLabel>
                          <TextField
                            name="taxpor1"
                            value={formData.taxpor1}
                            onChange={handleChange}
                            type="number"
                            className="small-input"
                          />
                          {/* {formError.taxpor1 && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxpor1}
                            </MDTypography>
                          )} */}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Portion 1 Description</InputLabel>
                          <TextField
                            name="taxpor1desc"
                            value={formData.taxpor1desc}
                            onChange={handleChange}
                            className="small-input"
                            type="text"
                          />
                          {/* {formError.taxpor1desc && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxpor1desc}
                            </MDTypography>
                          )} */}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Portion 2</InputLabel>
                          <TextField
                            name="taxpor2"
                            value={formData.taxpor2}
                            onChange={handleChange}
                            type="number"
                            className="small-input"
                          />
                          {/* {formError.taxpor2 && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxpor2}
                            </MDTypography>
                          )} */}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Portion 2 Description</InputLabel>
                          <TextField
                            name="taxpor2desc"
                            value={formData.taxpor2desc}
                            onChange={handleChange}
                            className="small-input"
                            type="text"
                          />
                          {/* {formError.taxpor2desc && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxpor2desc}
                            </MDTypography>
                          )} */}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Portion 3</InputLabel>
                          <TextField
                            name="taxpor3"
                            value={formData.taxpor3}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            className="small-input"
                          />
                          {/* {formError.taxpor3 && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxpor3}
                            </MDTypography>
                          )} */}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax Portion 3 Description</InputLabel>
                          <TextField
                            name="taxpor3desc"
                            value={formData.taxpor3desc}
                            onChange={handleChange}
                            className="small-input"
                            type="text"
                          />
                          {/* {formError.taxpor3desc && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxpor3desc}
                            </MDTypography>
                          )} */}
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Legislation</InputLabel>
                          <Select
                            name="taxlegis"
                            value={formData.taxlegis}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            className="small-input"
                          >
                            {countries?.map((country) => (
                              <MenuItem key={country.id} value={country?.id}>
                                {country?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.taxlegis && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.taxlegis}</MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Valid From</InputLabel>
                          <TextField
                            name="taxvalidfrm"
                            value={formData.taxvalidfrm}
                            onChange={handleChange}
                            type="date"
                            className="small-input"
                          />
                          {formError.taxvalidfrm && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                              {formError.taxvalidfrm}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Valid To</InputLabel>
                          <TextField
                            name="taxvalidto"
                            value={formData.taxvalidto}
                            onChange={handleChange}
                            type="date"
                            className="small-input"
                            inputProps={{
                              min: formData.taxvalidfrm || "",
                            }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 1</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmtaxdt1"
                            value={formData.itmtaxdt1}
                            onChange={(e) => setFormData({ ...formData, itmtaxdt1: e.target.value })}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}> Date 2</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmtaxdt2"
                            value={formData.itmtaxdt2}
                            onChange={(e) => setFormData({ ...formData, itmtaxdt2: e.target.value })}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note1</InputLabel>
                          <MDInput
                            type="text"
                            name="note1"
                            variant="outlined"
                            className="small-input"
                            value={formData.note1}
                            onChange={(e) => setFormData({ ...formData, note1: e.target.value })}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note2</InputLabel>
                          <MDInput
                            type="text"
                            name="note2"
                            variant="outlined"
                            className="small-input"
                            value={formData.note2}
                            onChange={(e) => setFormData({ ...formData, note2: e.target.value })}
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
                            value={formData.note3}
                            onChange={(e) => setFormData({ ...formData, note3: e.target.value })}
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
                          {formError.addedby && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.addedby}</MDTypography>}
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
                          {formError.createddt && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.createddt}</MDTypography>}
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
                            {/* {formError.status && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.status}</MDTypography>} */}
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
                          {formError.company_id && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.company_id}</MDTypography>}
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
                          {formError.location_id && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.location_id}</MDTypography>}
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
    </DashboardLayout >
  );
}

export default EditTaxes;

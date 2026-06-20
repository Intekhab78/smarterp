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
import { axios_get, axios_post, axios_post_image } from '../../../axios';
import { ToastMassage } from '../../../toast';

function Add_Item() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [itemError, setItemError] = useState("");
  const [rows, setRows] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteuomValue, setAutocompleteuomValue] = useState("");
  const [autocompletePaymentValue, setAutocompletePaymentValue] = useState("");
  const [item, setItem] = useState([]);
  const [Customers, setCustomerList] = useState([]);
  const [uoms, setuomList] = useState([]);
  const [isSubmit, setisSubmit] = useState(false);
  let user_data = JSON.parse(localStorage.getItem("user_data"));
  const [formData, setFormData] = useState({
    itemcatname: "",
    rate: "",
    itemdesc: "",
    itemdesclong: "",
    itemdesc3: "",
    itemdesc4: "",
    itemupc: "",
    itemref: "",
    stylecode: "",
    colorname: "",
    sizename: "",
    departname: "",
    familyname: "",
    subfamliy: "",
    brandname: "",
    hsncode: "",
    itemcost: "",
    itemprice: "",
    itemlanprice: "",
    minstklvl: "",
    maxstklvl: "",
    itmstkmgmt: "",
    itmuom: "",
    itmwweight: "",
    itmwpurunit: "",
    itmwsalesunit: "",
    itmtax1code: "",
    itmtax2code: "",
    itmtax3code: "",
    itmcostingmet: "",
    suppliername: "",
    itmexpiry: "",
    note1: "",
    note2: "",
    note3: "",
    itmdt1: "",
    itmdt2: "",

    status: "",



    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),

  });

  useEffect(() => {
    ItemList();
    uomList();
    OrderNuberRange();
  }, []);

  const ItemList = async () => {
    const response = await axios_post(true, "item/list");
    if (response) {
      if (response.status) {
        setItem(response.data);
      } else {
        ToastMassage(response.message, 'error')
      }
    }
  }

  const uomList = async () => {
    const response = await axios_post(true, "item_uom/list");
    if (response) {

      if (response.status) {
        setuomList(response.data);
      } else {
        ToastMassage(response.message, 'error')
      }
    }
  }
  const handleAutocompleteChange = (event, newValue, type) => {

    if (type == 'uom') {
      setAutocompleteuomValue(newValue);
      setFormData((prevData) => ({
        ...prevData,
        "uom": newValue == null ? "" : newValue?.id,
      }));
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
          "code": response.data?.number_is,
        }));
      } else {
        ToastMassage(response.message, 'error')
      }
    }
  }
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: e.target.files[0],
    }));
  };


  const validation = (formData) => {
    let errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.createddt) errors.createddt = "Created Date is required";
    if (!formData.addedby) errors.addedby = "Added By is required";
    if (!formData.rate) errors.rate = "PTR is required";
    if (!formData.uom) {
      errors.uom = "UOM is required";
    }
    if (!formData.code) {
      errors.code = "Code  is required";
    }
    if (!formData.tax) {
      errors.tax = "Tax  is required";
    }
    if (!formData.price) {
      errors.price = "Price  is required";
    }
    if (!formData.stock) {
      errors.stock = "Stock  is required";
    }
    if (!formData.barcode) {
      errors.barcode = "Barcode is required";
    }
    if (!formData.partNumber) {
      errors.partNumber = "Part Number is required";
    }



    return errors;
  };
  const handleSubmit = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);
    const data = new FormData();

    data.append('uom', formData.uom);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('code', formData.code);
    data.append('barcode', formData.barcode);
    data.append('partNumber', formData.partNumber);
    data.append('name', formData.name);
    data.append('tax', formData.tax);
    if (formData.images) {
      data.append('image', formData.images);
    }
    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      const response = await axios_post(true, "item/store", formData);
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, 'success')
          navigate("/item");

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
    }));
  };

  const handleBack = () => {
    navigate("/item");
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
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
                  <Grid container spacing={0}>
                    <Grid item xs={6} mr={0}>
                      <MDTypography variant="h6" color="white">
                        <Icon fontSize="small">shopping_cart</Icon>
                        Add Item
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/item">
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
                          <InputLabel sx={{ mb: 1 }}>Code</InputLabel>
                          <MDInput
                            type="text"
                            // label="Order Number"
                            variant="outlined"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            sx={{ width: 300 }}
                            className="small-input"
                            disabled
                          />
                          {formError.code && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.code}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                          <MDInput
                            type="text"
                            // label="Order Number"
                            variant="outlined"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="small-input"
                          />
                          {formError.name && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.name}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputLabel sx={{ mb: 1 }}>UOM</InputLabel>
                        <Autocomplete
                          disablePortal
                          id="uom-combo-box"
                          options={uoms}
                          getOptionLabel={(option) => option.name || ''}
                          renderOption={(props, option) => (
                            <li {...props}>{option?.name}</li>
                          )}
                          value={autocompleteuomValue}
                          onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'uom')}
                          className="small-autocomplete"
                          renderInput={(params) => <TextField {...params} className="small-input" />}
                        />
                        {formError.uom && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.uom}</MDTypography>}

                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Tax%</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            sx={{ width: 300 }}
                            name="tax"
                            value={formData.tax}
                            onChange={handleChange}
                            className="small-input"
                          />
                          {formError.tax && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.tax}</MDTypography>}

                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Stock</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            className="small-input"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                          />
                          {formError.stock && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.stock}</MDTypography>}

                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Price</InputLabel>
                          <MDInput
                            type="number"
                            name="price"
                            variant="outlined"
                            className="small-input"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                          {formError.price && (
                            <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itemprice}</MDTypography>
                          )}
                        </MDBox>
                      </Grid>






                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Barcode</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            className="small-input"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                          />
                          {formError.barcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.barcode}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Part No.</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            className="small-input"
                            name="partNumber"
                            value={formData.partNumber}
                            onChange={handleChange}
                          />
                          {formError.partNumber && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.partNumber}</MDTypography>}
                        </MDBox>
                      </Grid>
                       <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>PTR</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            className="small-input"
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                          />
                          {formError.rate && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.rate}</MDTypography>}
                        </MDBox>
                      </Grid>
                      {/* <Grid item xs={12}> */}
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
                            <MDButton variant="gradient" disabled={isSubmit} color="secondary" type="submit" fullWidth sx={{ marginLeft: '15px' }} onClick={handleBack}>
                              cancel
                            </MDButton>
                          </MDBox>
                          <MDBox>

                          </MDBox>
                        </Grid>
                      </Grid>
                      {/* </Grid> */}
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

export default Add_Item;

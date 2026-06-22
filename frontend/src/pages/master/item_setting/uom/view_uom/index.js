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
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { axios_get, axios_post } from '../../../../../axios';
import { ToastMassage } from '../../../../../toast';
import { Autocomplete, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import moment from "moment";

function EditItemUOM() {
    const navigate = useNavigate();
    const params = useParams();
    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const [formData, setFormData] = useState({
        sno: "",
        uomcode: "",
        uomname: "",
        uomdec: "",
        uomlong: "",
        unittype: "",
        symbol: "",
        note1: "",
        note2: "",
        note3: "",
        itmuomdt1: "",
        itmuomdt2: "",
        status: "1",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
        id: params.id,
    });
    console.log('formData', formData)
    const OrderNuberRange = async () => {
        let params = {
            function_for: "salesman"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "uomcode": response.data.number_is,
                }));
            } else {
                ToastMassage(response.message, 'error')
            }
        }
    }
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
    useEffect(() => {
        OrderNuberRange();
        fetchcountryList();
        fetchOrderDetails();
    }, []);

    const validation = (formData) => {
        let errors = {};

        if (!formData.uomcode) errors.uomcode = "UOM code is required";
        if (!formData.uomdec) errors.uomdec = "Description is required";
        if (!formData.uomlong) errors.uomlong = "Long description is required";
        if (!formData.unittype) errors.unittype = "Unit type is required";
        if (!formData.addedby) errors.addedby = "Added by is required";
        if (!formData.symbol) errors.symbol = "Symbol is required";

        if (!formData.createddt) errors.createddt = "Created date is required";
        if (!formData.status) errors.status = "Status is required";
        // if (!formData.customer_address_1) errors.customer_address_1 = "Address is required";
        return errors;
    };

    const fetchOrderDetails = async () => {
        try {
            const response = await axios_post(true, 'item_uom/details', {
                id: params.id
            });
            if (response.status) {
                const orderData = response.data;
                setFormData({
                    ...formData,
                    sno: "",
                    uomcode: orderData.uomcode,
                    uomname: orderData.uomname,
                    uomdec: orderData.uomdec,
                    uomlong: orderData.uomlong,
                    unittype: orderData.unittype,
                    symbol: orderData.symbol,
                    note1: orderData.note1,
                    note2: orderData.note2,
                    note3: orderData.note3,
                    itmuomdt1: moment(orderData.itmuomdt1).format('YYYY-MM-DD'),
                    itmuomdt2: moment(orderData.itmuomdt2).format('YYYY-MM-DD'),
                    status: orderData.status === 0 ? "0" : "1",
                });

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
            const response = await axios_post(true, "item_uom/update", formData);
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success');
                    navigate("/item-uom");
                } else {
                    ToastMassage(response.message, 'error');
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
        navigate("/item-uom");
    }

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
                                                View UOM
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/item-uom">
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
                                                        variant="outlined"
                                                        name="uomcode"
                                                        value={formData.uomcode}
                                                        className="small-input"
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 10 }}
                                                        disabled
                                                    />
                                                    {formError.uomcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.uomcode}</MDTypography>}

                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="uomdec"
                                                        className="small-input"
                                                        value={formData.uomdec}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 120 }}
                                                        disabled={true}
                                                    />
                                                    {formError.uomdec && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.uomdec}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Long Description</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="uomlong"
                                                        className="small-input"
                                                        value={formData.uomlong}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 180 }}
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Unit Type</InputLabel>
                                                    <Autocomplete
                                                        options={["Volume", "Weight", "Each", "Other", "Length", "Time", "Area"]}
                                                        value={formData.unittype}
                                                        onChange={(event, newValue) => setFormData({ ...formData, unittype: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        // sx={{ width: 300 }}
                                                        className="small-autocomplete"
                                                        disabled={true}
                                                    />
                                                    {formError.unittype && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.unittype}</MDTypography>}
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Symbol</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="symbol"
                                                        className="small-input"
                                                        value={formData.symbol}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 5 }}
                                                        disabled={true}
                                                    />
                                                    {formError.symbol && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.symbol}</MDTypography>}

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="uomname"
                                                        className="small-input"
                                                        value={formData.uomname}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 120 }}
                                                        disabled={true}
                                                    />
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
                                                        disabled={true}
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
                                                        disabled={true}
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
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Date 1</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmuomdt1"
                                                        value={formData.itmuomdt1}
                                                        onChange={(e) => setFormData({ ...formData, itmuomdt1: e.target.value })}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Date 2</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmuomdt2"
                                                        value={formData.itmuomdt2}
                                                        onChange={(e) => setFormData({ ...formData, itmuomdt2: e.target.value })}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        disabled={true}
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
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                                                    <Select
                                                        name="status"
                                                        value={formData.status}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                        disabled={true}
                                                    >
                                                        <MenuItem value="1">Active</MenuItem>
                                                        <MenuItem value="0">Inactive</MenuItem>
                                                    </Select>
                                                    {formError.status && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>
                                                            {formError.status}
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
                            <MDButton variant="gradient" disabled={isSubmit} color="secondary" fullWidth sx={{ marginLeft: '15px' }} onClick={handleBack}>
                              Cancel
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

export default EditItemUOM;

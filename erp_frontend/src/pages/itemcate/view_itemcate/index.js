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
import { axios_get, axios_post, axios_post_image } from '../../../axios';
import { ToastMassage } from '../../../toast';
import moment from "moment";

function Edit_itemcate() {
    const navigate = useNavigate();
    const params = useParams();
    const [locations, setlocations] = useState([]);
    const [compines, setCompines] = useState([]);
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
        itemcatcode: "",
        itemcatname: "",
        itemdesclong: "",
        abcgroup: "",
        company_id: "",
        location_id: "",
        note1: "",
        note2: "",
        note3: "",
        itmcatdt1: "",
        itmcatdt2: "",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
        status: "1",
        stockmgmt: "",
        negativestock: "yes",
        id: params.id,
    });

    useEffect(() => {
        ItemList();
        fetchcompanyList();
        uomList();
        OrderNuberRange();
        fetchOrderDetails();
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
    const OrderNuberRange = async () => {
        let params = {
            function_for: "item"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "itemcatcode": response.data?.number_is,
                }));
            } else {
                ToastMassage(response.message, 'error')
            }
        }
    }
    const fetchOrderDetails = async () => {
        try {
            const response = await axios_post(true, 'item_category/details', {
                id: params.id
            });
            if (response.status) {
                const orderData = response.data;
                setFormData({
                    ...formData,
                    sno: "",
                    itemcatcode: orderData.itemcatcode,
                    itemcatname: orderData.itemcatname,
                    itemdesclong: orderData.itemdesclong,
                    abcgroup: orderData.abcgroup,
                    company_id: orderData.company_id,
                    location_id: orderData.location_id,
                    stockmgmt: orderData.stockmgmt,
                    negativestock: orderData.negativestock,
                    note1: orderData.note1,
                    note2: orderData.note2,
                    note3: orderData.note3,
                    itmcatdt1: moment(orderData.itmcatdt1).format('YYYY-MM-DD'),
                    itmcatdt2: moment(orderData.itmcatdt2).format('YYYY-MM-DD'),
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
    const validation = (formData) => {
        let errors = {};
        if (!formData.itemcatname) {
            errors.itemcatname = "Description is required";
        }
        if (!formData.itemdesclong) {
            errors.itemdesclong = " Long Description is required";
        }

        if (!formData.createddt) errors.createddt = "Created Date is required";
        if (!formData.addedby) errors.addedby = "Added By is required";
        // if (!formData.status) {
        //     errors.status = "Status  is required";
        // }
        if (!formData.itemcatcode) {
            errors.itemcatcode = "Item category code  is required";
        }
        if (!formData.abcgroup) {
            errors.abcgroup = "ABC class  is required";
        }
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
            const response = await axios_post_image(true, "item_category/update", formData);
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success')
                    navigate("/itemcate");

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
        navigate("/itemcate");
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
                                                View Item category
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/itemcate">
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
                                                    <InputLabel sx={{ mb: 1 }}> Item Categorye code</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        variant="outlined"
                                                        name="itemcatcode"
                                                        value={formData.itemcatcode}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 10 }}
                                                        disabled
                                                    />
                                                    {formError.itemcatcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itemcatcode}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Description </InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        name="itemcatname"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.itemcatname}
                                                        inputProps={{ maxLength: 120 }}
                                                        disabled={true}
                                                        onChange={(e) => setFormData({ ...formData, itemcatname: e.target.value })}
                                                    />
                                                    {formError.itemcatname && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itemcatname}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Long Description</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="itemdesclong"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.itemdesclong}
                                                        inputProps={{ maxLength: 180 }}
                                                        disabled={true}
                                                        onChange={(e) => setFormData({ ...formData, itemdesclong: e.target.value })}
                                                    />
                                                    {formError.itemdesclong && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itemdesclong}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>ABC class</InputLabel>
                                                    <Autocomplete
                                                        options={["Class A", "Class B", "Class C", "Class D"]}
                                                        value={formData.abcgroup}
                                                        onChange={(event, newValue) => setFormData({ ...formData, abcgroup: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        // sx={{ width: 300 }}
                                                        className="small-autocomplete"
                                                        disabled={true}
                                                    />
                                                    {formError.abcgroup && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.abcgroup}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Stock Management</InputLabel>
                                                    <Autocomplete
                                                        options={["Managed", "Not Managed", "Potency Managed"]}
                                                        value={formData.stockmgmt}
                                                        onChange={(event, newValue) => setFormData({ ...formData, stockmgmt: newValue })}
                                                        renderInput={(params) => <TextField {...params} variant="outlined" className="small-input" />}
                                                        className="small-autocomplete"
                                                        disabled={true}
                                                    />
                                                    {formError.stockmgmt && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: '10px' }}>
                                                            {formError.stockmgmt}
                                                        </MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Negative Stock</InputLabel>
                                                    <RadioGroup
                                                        row
                                                        value={formData.negativestock}
                                                        onChange={(event) => setFormData({ ...formData, negativestock: event.target.value })}
                                                    >
                                                        <FormControlLabel
                                                            value="yes"
                                                            control={<Radio />}
                                                            label="Yes"
                                                            disabled={true}
                                                        />
                                                        <FormControlLabel
                                                            value="no"
                                                            control={<Radio />}
                                                            label="No"
                                                            disabled={true}
                                                        />
                                                    </RadioGroup>
                                                    {formError.negativestock && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: '10px' }}>
                                                            {formError.negativestock}
                                                        </MDTypography>
                                                    )}
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
                                                        disabled={true}
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
                                                        disabled={true}
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
                                                        disabled={true}
                                                        value={formData.note3}
                                                        onChange={(e) => setFormData({ ...formData, note3: e.target.value })}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}> Date 1</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmcatdt1"
                                                        value={formData.itmcatdt1}
                                                        onChange={(e) => setFormData({ ...formData, itmcatdt1: e.target.value })}
                                                        className="small-input"
                                                        disabled={true}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}> Date 2</InputLabel>
                                                    <MDInput
                                                        type="date"
                                                        variant="outlined"
                                                        name="itmcatdt2"
                                                        value={formData.itmcatdt2}
                                                        disabled={true}
                                                        onChange={(e) => setFormData({ ...formData, itmcatdt2: e.target.value })}
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
                                                    <InputLabel sx={{ mb: 1 }}>Company </InputLabel>
                                                    <Select
                                                        name="company_id"
                                                        value={formData.company_id}
                                                        disabled={true}
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
                                                    {formError.location_id && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.location_id}</MDTypography>}
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
                                                            disabled={true}
                                                        >
                                                            <MenuItem value="1">Active</MenuItem>
                                                            <MenuItem value="0">Inactive</MenuItem>
                                                        </Select>
                                                        {/* {formError.status && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.status}</MDTypography>} */}
                                                    </MDBox>
                                                </Grid>
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
        </DashboardLayout >
    );
}

export default Edit_itemcate;

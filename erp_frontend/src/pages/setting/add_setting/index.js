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
import { axios_get, axios_post } from '../../../axios';
import { ToastMassage } from '../../../toast';
import { FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

function Add_Setting() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [item, setItem] = useState([]);
    const [site, setSite] = useState([]);
    const [currency, setCurrency] = useState([]);


    let user_data = JSON.parse(localStorage.getItem("user_data"));
    let user_data_id = JSON.parse(localStorage.getItem("user_id"));
    const [formData, setFormData] = useState({
        barcode: "",
        sno: "",
        supname: "",
        whlongdesc: "",
        locdesc: "",
        whnegstock: "",
        ccurrency: "",
        fixed_cost: "",
        status: "1",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
    });

    const OrderNuberRange = async () => {
        let params = {
            function_for: "salesman"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "salesman_code": response.data.number_is,
                }));
            } else {
                ToastMassage(response.message, 'error')
            }
        }
    }
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

    const SiteList = async () => {
        const response = await axios_post(true, "location/list");
        if (response) {
            if (response.status) {
                setSite(response.data.records);
            } else {
                ToastMassage(response.message, 'error')
            }
        }
    }
    const fetchCurrencyList = async () => {
        const response = await axios_post(true, "currency/list");
        if (response) {
            if (response.status) {
                setCurrency(response.data);
            } else {
                ToastMassage(response.message, 'error');
            }
        }
    };
    useEffect(() => {
        OrderNuberRange();
        ItemList();
        SiteList();
        fetchCurrencyList();
    }, []);

    const validation = (formData) => {
        let errors = {};
        if (!formData.whnegstock) errors.whnegstock = "Landed cost is required";
        if (!formData.barcode) errors.barcode = "Barcode is required";
        if (!formData.whlongdesc) errors.whlongdesc = "site is required";
        // if (!formData.locdesc) errors.locdesc = "Site Description is required";
        if (!formData.addedby) errors.addedby = "Added by is required";
        if (!formData.createddt) errors.createddt = "Created date is required";
        if (!formData.status) errors.status = "Status is required";
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
            const response = await axios_post(true, "setting_landed_cost/store", {
                ...formData,
                addedby: user_data_id,
            });
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success');
                    navigate("/setting");
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
        if (name === "barcode") {
            const selectedItem = item.find((items) => items.id === value);
            if (selectedItem && selectedItem.customer_info && selectedItem.customer_info.users) {
                setFormData((prevData) => ({
                    ...prevData,
                    supname: selectedItem.customer_info.users.firstname || "",
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    supname: "",
                }));
            }
        }
        else if (name === "whlongdesc") {
            const selectedItem = site.find((items) => items.id === value);
            if (selectedItem && selectedItem) {
                setFormData((prevData) => ({
                    ...prevData,
                    locdesc: selectedItem.locname || "",
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    locdesc: "",
                }));
            }
        }
    };

    const handleBack = () => {
        navigate("/setting");
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
                                                Add Setting
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/setting">
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
                                                    <InputLabel sx={{ mb: 1 }}>Barcode</InputLabel>
                                                    <Select
                                                        name="barcode"
                                                        value={formData.barcode}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                    // className="small-input"
                                                    >
                                                        {item?.map((items) => (
                                                            <MenuItem key={items.id} value={items?.id}>
                                                                {items?.item_code}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formError.barcode && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.barcode}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Supplier Name</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="supname"
                                                        className="small-input"
                                                        value={formData.supname}
                                                        onChange={handleChange}
                                                        disabled
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />

                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Site</InputLabel>
                                                    <Select
                                                        name="whlongdesc"
                                                        value={formData.whlongdesc}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                    // className="small-input"
                                                    >
                                                        {site?.map((items) => (
                                                            <MenuItem key={items.id} value={items?.id}>
                                                                {items?.loccode}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {formError.whlongdesc && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.whlongdesc}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Site Desc</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="locdesc"
                                                        className="small-input"
                                                        value={formData.locdesc}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        disabled
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                    {/* {formError.locdesc && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.locdesc}</MDTypography>} */}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Landed Cost</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="whnegstock"
                                                        className="small-input"
                                                        value={formData.whnegstock}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                    {formError.whnegstock && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.whnegstock}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Fixed Cost Per Unit</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="fixed_cost"
                                                        className="small-input"
                                                        value={formData.fixed_cost}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Currency</InputLabel>
                                                    <Select
                                                        name="ccurrency"
                                                        value={formData.ccurrency}
                                                        onChange={handleChange}
                                                        sx={{ width: 250, height: 45 }}
                                                    // className="small-input"
                                                    >
                                                        {currency?.map((country) => (
                                                            <MenuItem key={country.id} value={country?.id}>
                                                                {country?.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
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
        </DashboardLayout>
    );
}

export default Add_Setting;

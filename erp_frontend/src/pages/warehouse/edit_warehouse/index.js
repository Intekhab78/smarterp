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
import { axios_get, axios_post } from '../../../axios';
import { ToastMassage } from '../../../toast';
import { Checkbox, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import moment from "moment";

function edit_warehouse() {
    const params = useParams();

    const navigate = useNavigate();
    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    const [locations, setlocations] = useState([]);
    const [compines, setCompines] = useState([]);
    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const [formData, setFormData] = useState({
        whcode: "",
        whdesc: "",
        whlongdesc: "",
        whnegstock: "",
        locdesc: "",
        itmcatdt1: "",
        itmcatdt2: "",
        note1: "",
        note2: "",
        note3: "",
        status: "",
        company_id: "",
        location_id: "",
        addedby: `${user_data.firstname} ${user_data.lastname}`,
        createddt: new Date().toLocaleString(),
    });
    const OrderNuberRange = async () => {
        let params = {
            function_for: "warehouse"
        }
        const response = await axios_post(true, "code_setting/get-next-comming-code", params);
        if (response) {
            if (response.status) {
                setFormData((prevData) => ({
                    ...prevData,
                    "cuscode": response.data.number_is,
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
    
    
    const fetchOrderDetails = async () => {
        try {
            const response = await axios_post(true, 'warehouse_master/details', {
                id: params.id
            });
            if (response.status) {
                const orderData1 = response.data;
                setFormData({
                    ...formData,
                    whcode: orderData1.whcode,
                    whdesc: orderData1.whdesc,
                    whlongdesc: orderData1.whlongdesc,
                    note1: orderData1.note1,
                    note2: orderData1.note2,
                    note3: orderData1.note3,
                    company_id: orderData1.company_id,
                    location_id: orderData1.location_id,
                    locdesc: orderData1.locdesc,
                    whnegstock: orderData1.whnegstock === 1 ? "1" : "0",
                    itmcatdt1: moment(orderData1.itmcatdt1).format('YYYY-MM-DD'),
                    itmcatdt2: moment(orderData1.itmcatdt2).format('YYYY-MM-DD'),
                    status: orderData1.status == 1 ? '1' : '0',
                });
                if (orderData1.company_id) {
                    await fetchlocationList(orderData1.company_id);
                }

            } else {
                ToastMassage(response.message, 'error');
            }
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    };
    useEffect(() => {
        // OrderNuberRange();
        fetchOrderDetails();
        fetchcountryList();
        fetchcompanyList();
    }, []);

    const validation = (formData) => {
        let errors = {};

        // if (!formData.locdesc) errors.locdesc = "country is required";
        if (!formData.whdesc) errors.whdesc = "Description is required";
        if (!formData.company_id) errors.company_id = "Company id is required";
        if (!formData.location_id) errors.location_id = "Location id is required";
        if (!formData.whlongdesc) errors.whlongdesc = "Long  description is required";
        // if (!formData.locdesc) errors.locdesc = "Location is required";
        if (!formData.status) errors.status = "Status is required";
        if (!formData.createddt) errors.createddt = "Created date is required";
        if (!formData.addedby) errors.addedby = "Added by is required";
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
            const response = await axios_post(true, "warehouse_master/update", {
                ...formData,
                id: params.id
            });
            if (response) {
                setisSubmit(false);
                if (response.status) {
                    ToastMassage(response.message, 'success');
                    navigate("/warehouse");
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
            ...(name === "company_id" && { location_id: "" })
        }));
        if (name === "company_id") {
            fetchlocationList(value);
        }
    };


    const handleBack = () => {
        navigate("/warehouse");
    }

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
                                                Edit Warehouse
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/warehouse">
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
                                                        name="whcode"
                                                        value={formData.whcode}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        disabled
                                                        className="small-input"
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="whdesc"
                                                        value={formData.whdesc}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                    {formError.whdesc && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.whdesc}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Long Description</InputLabel>
                                                    <MDInput
                                                        type="text"
                                                        variant="outlined"
                                                        name="whlongdesc"
                                                        value={formData.whlongdesc}
                                                        onChange={handleChange}
                                                        // sx={{ width: 300 }}
                                                        className="small-input"
                                                        inputProps={{ maxLength: 60 }}
                                                    />
                                                    {formError.whlongdesc && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.whlongdesc}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Location Name</InputLabel>
                                                    <Select
                                                        name="locdesc"
                                                        value={formData.locdesc}
                                                        onChange={handleChange}
                                                        className="small-input"
                                                    >
                                                        {countries?.map((country) => (
                                                            <MenuItem key={country.id} value={country?.id}>
                                                                {country?.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {/* {formError.locdesc && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.locdesc}</MDTypography>} */}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Negative Stock Allow</InputLabel>
                                                    <Checkbox
                                                        name="whnegstock"
                                                        checked={formData.whnegstock === "1"}
                                                        onChange={(e) =>
                                                            handleChange({
                                                                target: {
                                                                    name: "whnegstock",
                                                                    value: e.target.checked ? "1" : "0",
                                                                },
                                                            })
                                                        }
                                                    />
                                                    {formError.whnegstock && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.whnegstock}</MDTypography>}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note1</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="note1"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.note1}
                                                        onChange={(e) => setFormData({ ...formData, note1: e.target.value })}
                                                    />
                                                    {formError.note1 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note1}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Note2</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="note2"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.note2}
                                                        onChange={(e) => setFormData({ ...formData, note2: e.target.value })}
                                                    />
                                                    {formError.note2 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note2}</MDTypography>
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
                                                        onChange={(e) => setFormData({ ...formData, note3: e.target.value })}
                                                    />
                                                    {formError.note3 && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.note3}</MDTypography>
                                                    )}
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
                                                        onChange={handleChange}
                                                        className="small-input"
                                                    // disabled
                                                    />
                                                    {formError.itmcatdt1 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itmcatdt1}</MDTypography>}
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
                                                        onChange={handleChange}
                                                        className="small-input"
                                                    // disabled
                                                    />
                                                    {formError.itmcatdt2 && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.itmcatdt2}</MDTypography>}
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
        </DashboardLayout>
    );
}

export default edit_warehouse;

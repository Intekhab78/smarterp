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
import { Autocomplete, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";

function edit_role() {
    const navigate = useNavigate();
    const params = useParams();

    const [formError, setFormError] = useState({});
    const [isSubmit, setisSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    const [errorCheckBox, setErrorCheckBox] = useState(false);

    let user_data = JSON.parse(localStorage.getItem("user_data"));

    const [formData, setFormData] = useState({
        id: params.id,
        name: '',
        description: '',
    });
    const [checkboxes, setCheckboxes] = useState([
        {
            name: 'currency',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'state',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'country',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'city',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'warehouse',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'location',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'company',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'item',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'item department',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Brand',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Employee',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Order',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Purchase Order',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'UOM',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Tax',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Supplier',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Customer',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Role',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Sub Fmaily',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Item Category',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Item color',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Family',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Size',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Invoice',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Portolio',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Create Table',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Grn',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },
        {
            name: 'Payment',
            options: ['list', 'Add', 'Update', 'Delete'],
            checked: [false, false, false, false],
        },

    ])
    const handleCheckboxChange = (rolename, optionIndex) => {
        setErrorCheckBox('');
        setCheckboxes((prevCheckboxes) => {
            const updatedCheckboxes = [...prevCheckboxes];
            const roleIndex = updatedCheckboxes.findIndex((group) => group.name === rolename);
            updatedCheckboxes[roleIndex].checked[optionIndex] = !updatedCheckboxes[roleIndex].checked[optionIndex];
            return updatedCheckboxes;
        });
    };

    const validation = (formData) => {
        let errors = {};

        if (!formData.name) errors.name = "Name is required";
        if (!formData.description) errors.description = "Description is required";
        const hasPermissions = checkboxes.some(role => role.checked.includes(true));
        if (!hasPermissions) {
            setErrorCheckBox('Please select at least one permission');
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
            let new_role_details = [];
            for (let i = 0; i < checkboxes.length; i++) {
                let checkboxOptions = checkboxes[i].options;
                let checkbox = checkboxes[i];
                let permissionObj = {
                    title: checkboxes[i].name,
                    is_create: 0,
                    is_delete: 0,
                    is_edit: 0,
                    is_view: 0,
                };
                for (let o = 0; o < checkboxOptions.length; o++) {
                    let options = checkboxOptions[o];
                    let checked = checkbox.checked[o];
                    if (checked) {
                        if (options === 'Add') permissionObj.is_create = 1;
                        if (options === 'Delete') permissionObj.is_delete = 1;
                        if (options === 'Update') permissionObj.is_edit = 1;
                        if (options === 'list') permissionObj.is_view = 1;
                    }
                }
                new_role_details.push(permissionObj);
            }

            if (new_role_details.length === 0) {
                setErrorCheckBox('Please select one permission');
            } else {
                setFormError({});
                const response = await axios_post(true, "roles/update", {
                    ...formData,
                    permissions: new_role_details,
                });
                if (response) {
                    setisSubmit(false);
                    if (response.success === true) {
                        ToastMassage(response.message, 'success');
                        navigate("/role");
                    } else {
                        ToastMassage(response.message, 'error');
                    }
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
        navigate("/role");
    }

    const fetchSalesmanDetails = async () => {
        try {
            const response = await axios_post(true, 'roles/details', {
                id: params.id
            });
            console.log('response', response);
            if (response.status) {
                setFormData({
                    ...formData,
                    name: response.data.name,
                    description: response.data.description,
                });
                let role_details = response.data.permissions;
                let updatedCheckboxes = [...checkboxes];

                role_details.forEach((role) => {
                    let roleIndex = updatedCheckboxes.findIndex((group) => group.name === role.title);
                    if (roleIndex !== -1) {
                        updatedCheckboxes[roleIndex].checked = [
                            role.is_view === 1,
                            role.is_create === 1,
                            role.is_edit === 1,
                            role.is_delete === 1
                        ];
                    }
                });

                setCheckboxes(updatedCheckboxes);
            } else {
                ToastMassage(response.message, 'error');
            }
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        }
    };
    useEffect(() => {
        fetchSalesmanDetails();
    }, []);

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
                                                View Role
                                            </MDTypography>
                                        </Grid>

                                        <Grid item xs={6} ml={0}>
                                            <MDTypography component={Link} to="/role">
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
                                                    <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="name"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        disabled={true}

                                                    />
                                                    {formError.name && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.name}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                                                    <MDInput
                                                        type="varchar"
                                                        name="description"
                                                        variant="outlined"
                                                        className="small-input"
                                                        value={formData.description}
                                                        onChange={handleChange}
                                                        disabled={true}

                                                    />
                                                    {formError.description && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.description}</MDTypography>
                                                    )}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <MDBox pb={2}>
                                                    <InputLabel sx={{ mb: 1 }}>Permission</InputLabel>
                                                    {errorCheckBox && (
                                                        <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{errorCheckBox}</MDTypography>
                                                    )}
                                                    {checkboxes.map((role, roleIndex) => (
                                                        <div key={roleIndex}>
                                                            <InputLabel>{role.name}</InputLabel>
                                                            <div className="form-check" >
                                                                {role.options.map((option, optionIndex) => (
                                                                    <label className="form-check-label"
                                                                        key={optionIndex}
                                                                        style={{ marginRight: '1rem' }}>
                                                                        <input
                                                                            type="checkbox"
                                                                            name={`${role.name}-${option}`}
                                                                            checked={role.checked[optionIndex]}
                                                                            onChange={() => handleCheckboxChange(role.name, optionIndex)}
                                                                            className={`input-role ${errorCheckBox ? 'is-invalid' : ''}`}
                                                                            disabled={true}
                                                                        />
                                                                        {option}
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
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

export default edit_role;

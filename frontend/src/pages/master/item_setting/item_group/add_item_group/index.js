import { Link } from "react-router-dom";
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../../axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const places = [{ label: "UNITED ARAB EMIRATES", value: "UNITED ARAB EMIRATES0" }];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function AddItemGroup() {
  const [selectedValue, setSelectedValue] = useState("");
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: 1,
  });
  const navigate = useNavigate();

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validation = (values) => {
    let error = {};
    if (!values.code) {
      error.code = "Code is required";
    }
    if (!values.name) {
      error.name = "Name is required";
    }
    return error;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errordisplay = validation(formData);
    console.log(errordisplay);

    if (Object.keys(errordisplay).length > 0) {
      setFormError(errordisplay);
    } else {
      try {
        const response = await axios.post("item-group/add", formData);
        console.log(response.data.data);
        navigate("/item-group");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={9}>
            <Card component="form" role="form" onSubmit={handleSubmit}>
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
                <MDTypography variant="h6" color="white">
                  Add Item Group
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <MDBox pb={2}>
                    <MDInput
                      type="text"
                      label="Item Group Code"
                      variant="outlined"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      helperText={formError.code}
                      sx={{ width: 400 }}
                    />
                    <MDButton onClick={handleClickOpen}>
                      <Icon fontSize="small">settings</Icon>
                    </MDButton>
                    <BootstrapDialog
                      onClose={handleClose}
                      aria-labelledby="customized-dialog-title"
                      open={open}
                    >
                      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Item group Code
                      </BootstrapDialogTitle>
                      <DialogContent dividers>
                        <MDTypography style={{ fontSize: 17 }} gutterBottom>
                          Your Item group Code number are set an auto generate mode to save your
                          time. Are you sure about changing this setting?
                        </MDTypography>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="male"
                          value={selectedValue}
                          onChange={handleChanged}
                          name="radio-buttons-group"
                        >
                          <FormControlLabel
                            value="auto"
                            control={<Radio />}
                            label="Continue auto-generating Item group Code"
                          />
                          {selectedValue === "auto" && (
                            <>
                              <Grid
                                container
                                rowSpacing={2}
                                columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                              >
                                <Grid item xs={4}>
                                  <TextField label="Prefix" required sx={{ width: 150 }} />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField label="Next Number" required sx={{ width: 150 }} />
                                </Grid>
                              </Grid>
                            </>
                          )}
                          <FormControlLabel
                            value="add"
                            control={<Radio />}
                            label="I will add them manually each time"
                          />
                        </RadioGroup>
                      </DialogContent>
                      <DialogActions>
                        <MDButton variant="text" color="info" autoFocus onClick={handleClose}>
                          Save
                        </MDButton>
                        <MDButton variant="text" color="info" autoFocus onClick={handleClose}>
                          Cancel
                        </MDButton>
                      </DialogActions>
                    </BootstrapDialog>
                  </MDBox>
                  <MDBox pb={1}>
                    <MDInput
                      type="text"
                      label="Item Group Name"
                      variant="outlined"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      helperText={formError.name}
                      sx={{ width: 450 }}
                    />
                  </MDBox>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/item-group">
                    <MDButton variant="gradient" color="info" fullWidth>
                      Cancel
                    </MDButton>
                  </MDTypography>
                </Grid>
                <Grid item xs={2} ml={3}>
                  <MDBox>
                    <MDButton variant="gradient" color="info" type="submit" fullWidth>
                      Save
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddItemGroup;

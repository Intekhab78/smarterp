import { Link } from "react-router-dom";
import { useState } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRadioGroup } from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const select_key = [{ label: "", value: "" }];

const order_type = [
  { label: "Any", value: "Any" },
  { label: "All", value: "All" },
];

const offer_type = [
  { label: "Any", value: "Any" },
  { label: "All", value: "All" },
];

const item_category = [
  { label: "Non-food items", value: "Non-food items" },
  { label: "Dry Products", value: "Dry Products" },
  { label: "Fresh Products", value: "Fresh Products" },
  { label: "Chilled Products", value: "Chilled Products" },
];

const item_brand = [
  { label: "BLISS", value: "BLISS" },
  { label: "QK Meat", value: "QK Meat" },
  { label: "SARIMI", value: "SARIMI" },
  { label: "jekor", value: "jekor" },
  { label: "DORY", value: "DORY" },
  { label: "MATONI", value: "MATONI" },
];

const item_group = [{ label: "", value: "" }];

const salesman_supervisor_category = [{ label: "", value: "" }];

//checkbox
const label = { inputProps: { "aria-label": "Checkbox demo" } };

//radiobutton
const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    ".MuiFormControlLabel-label":
      checked &&
      {
        //   color: theme.palette.primary.main,
      },
  })
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();
  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }
  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

function Add_Promotion() {
  const [showMessage, setShowMessage] = React.useState(false);

  const onButtonClickHandler = () => {
    setShowMessage(!showMessage);
  };
  const [checked, setChecked] = React.useState(false);

  const handleChecked = (event) => {
    setChecked(event.target.checked);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [value, setValue] = React.useState("1");
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleBack = () => {
    console.log("cfvgbhnjm");
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  const handleNext = () => {
    console.log("cfvgbhjnk");
    //setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep < value.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={10}>
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
                <MDTypography variant="h6" color="white">
                  Add Promotion
                </MDTypography>
              </MDBox>
              <TabContext value={value}>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox component="form" role="form">
                    <MDBox>
                      <TabList
                        onChange={handleChange}
                        value={value}
                        aria-label="lab API tabs example"
                        activeStep={activeStep}
                      >
                        <Tab label="Select Key Combination" value="1" />
                        <Tab label="Key Value" value="2" />
                        <Tab label="Promotion" value="3" />
                      </TabList>
                    </MDBox>
                    <TabPanel value="1">
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={9} pb={2}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={select_key}
                            // style={{ height: 45 }}
                            sx={{ width: 700 }}
                            required
                            renderInput={(params) => <TextField {...params} label="Select Key" />}
                          ></Autocomplete>
                        </Grid>
                        <Grid item xs={12} align="center">
                          <MDTypography style={{ fontSize: 17 }}>
                            To create new key combination click on “+” Button.
                          </MDTypography>
                          <MDButton
                            onClick={onButtonClickHandler}
                            sx={{ "& > :not(style)": { m: 1 } }}
                          >
                            <Fab color="info" size="medium" aria-label="add">
                              <AddIcon />
                            </Fab>
                          </MDButton>
                        </Grid>
                        {showMessage && (
                          <>
                            <Grid item xs={9} pb={2}>
                              <MDTypography fontWeight="regular">Location</MDTypography>
                              <FormGroup row>
                                <FormControlLabel control={<Checkbox />} label="Country" />
                                <FormControlLabel control={<Checkbox />} label="Region" />
                                <FormControlLabel control={<Checkbox />} label="Area" />
                                <FormControlLabel control={<Checkbox />} label="Route" />
                              </FormGroup>
                            </Grid>
                            <Grid item xs={9} pb={2}>
                              <MDTypography fontWeight="regular">Customer</MDTypography>
                              <FormGroup row>
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="Sales Organisation"
                                />
                                <FormControlLabel control={<Checkbox />} label="Channel" />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="Customer Category"
                                />
                                <FormControlLabel control={<Checkbox />} label="Customer" />
                              </FormGroup>
                            </Grid>
                            <Grid item xs={9} pb={2}>
                              <MDTypography fontWeight="regular">Item</MDTypography>
                              <FormGroup row>
                                <FormControlLabel control={<Checkbox />} label="Major Category" />
                                <FormControlLabel control={<Checkbox />} label="Item Group" />
                              </FormGroup>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={6} pb={2}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={item_group}
                            // style={{ height: 45 }}
                            sx={{ width: 300 }}
                            required
                            renderInput={(params) => <TextField {...params} label="Item" />}
                          ></Autocomplete>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="3">
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={9} pb={2}>
                          <MDInput
                            type="text"
                            label="Name"
                            variant="outlined"
                            sx={{ width: 600 }}
                          />
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <MDInput
                            type="date"
                            label="Start Date"
                            variant="outlined"
                            sx={{ width: 300 }}
                          />
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <MDInput
                            type="date"
                            label="End Date"
                            variant="outlined"
                            sx={{ width: 300 }}
                          />
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={order_type}
                            // style={{ height: 45 }}
                            sx={{ width: 300 }}
                            required
                            renderInput={(params) => <TextField {...params} label="Order Type:" />}
                          ></Autocomplete>
                        </Grid>
                        <Grid item xs={6} pb={2}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={offer_type}
                            // style={{ height: 45 }}
                            sx={{ width: 300 }}
                            required
                            renderInput={(params) => <TextField {...params} label="Offer Type:" />}
                          ></Autocomplete>
                        </Grid>
                      </Grid>
                    </TabPanel>
                  </MDBox>
                </MDBox>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={2} mr={3}>
                    <MDTypography component={Link} to="/promotion">
                      <MDButton variant="gradient" color="info" fullWidth>
                        Cancel
                      </MDButton>
                    </MDTypography>
                  </Grid>
                  <Grid item xs={2} ml={3}>
                    <MDBox>
                      <MDButton variant="gradient" color="info" fullWidth>
                        Save
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </TabContext>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="right" sx={{ mt: 1, mb: 1 }}>
          <MDTypography>
            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              //disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </MDButton>
          </MDTypography>

          <MDBox>
            <MDButton variant="gradient" color="info" fullWidth onClick={handleNext}>
              Next
            </MDButton>
          </MDBox>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Add_Promotion;

import { Link } from "react-router-dom";
import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../../axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
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

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const customer = [
  { label: "EMARAT", value: "EMARAT" },
  { label: "BLUEMART SUPERMARKET", value: "BLUEMART SUPERMARKET" },
  { label: "EMARAT - ABUKADRA", value: "EMARAT - ABUKADRA" },
  { label: "EMARAT - FRESH PLUS BCT", value: "EMARAT - FRESH PLUS BCT" },
  { label: "EMARAT - RAJAN", value: "EMARAT - RAJAN" },
];

const list = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7", value: "7" },
];

const merchandiser = [{ label: "", value: "" }];

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

const steps = ["Add Activty", "Activty Details"];

function Add_Activity() {
  const [selectedValue, setSelectedValue] = useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = useState({
    activity_name: "",
    valid_from: "",
    valid_to: "",
  });

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const isStepValid = () => {
  //   switch (activeStep) {
  //     case 0:
  //       return (
  //         formData.activity_name !== "" && formData.valid_from !== "" && formData.valid_to !== ""
  //       );
  //     case 1:
  //       return formData.email !== "";
  //     default:
  //       return true;
  //   }
  // };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={9}>
            <Card component="form" role="form">
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
                  Add Activity Profile
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </MDBox>
                <MDBox>
                  {/* <Typography>{steps[activeStep]}</Typography> */}
                  {activeStep === 0 && (
                    <Grid container rowSpacing={2} pt={4} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                      <Grid item xs={7}>
                        <MDInput
                          label="Activity Name"
                          name="activity_name"
                          type="text"
                          sx={{ width: 300 }}
                          value={formData.activity_name}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <MDInput
                          label="Valid From"
                          name="valid_from"
                          type="date"
                          sx={{ width: 300 }}
                          value={formData.valid_from}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <MDInput
                          label="Valid To"
                          name="valid_to"
                          type="date"
                          sx={{ width: 300 }}
                          value={formData.valid_to}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                    </Grid>
                  )}
                  {activeStep === 1 && (
                    <Grid container rowSpacing={2} pt={4} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                      <Grid item xs={3}>
                        <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                          Type
                        </MDTypography>
                      </Grid>
                      <Grid item xs={6}>
                        <RadioGroup
                          name="use-radio-group"
                          defaultValue="first"
                          value={selectedValue}
                          onChange={handleChanged}
                        >
                          <MyFormControlLabel value="first" label="Customer" control={<Radio />} />
                          <MyFormControlLabel
                            value="second"
                            label="Merchandiser"
                            control={<Radio />}
                          />
                        </RadioGroup>
                      </Grid>
                      {selectedValue === "first" && (
                        <>
                          <Grid item xs={4}>
                            <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                              Customer
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={customer}
                              sx={{ width: 300 }}
                              renderInput={(params) => <TextField {...params} label="Customer" />}
                            ></Autocomplete>
                          </Grid>
                        </>
                      )}
                      {selectedValue === "second" && (
                        <>
                          <Grid item xs={4}>
                            <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                              Merchandiser
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={merchandiser}
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField {...params} label="Merchandiser" />
                              )}
                            ></Autocomplete>
                          </Grid>
                        </>
                      )}
                      <Grid item xs={4}>
                        <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                          Activity
                        </MDTypography>
                      </Grid>
                      <Grid item xs={3}>
                        <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                          Status
                        </MDTypography>
                      </Grid>
                      <Grid item xs={3}>
                        <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                          Priority
                        </MDTypography>
                      </Grid>
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={4}>
                          <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                            Stock In Store
                          </MDTypography>
                        </Grid>
                        <Grid item xs={3}>
                          <RadioGroup
                            name="use-radio-group"
                            defaultValue="no"
                            value={selectedValue}
                            onChange={handleChanged}
                          >
                            <MyFormControlLabel value="yes" label="Yes" control={<Radio />} />
                            <MyFormControlLabel value="no" label="No" control={<Radio />} />
                          </RadioGroup>
                        </Grid>
                        {selectedValue == "yes" && (
                          <>
                            <Grid item xs={3}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={list}
                                renderInput={(params) => <TextField {...params} label="" />}
                              ></Autocomplete>
                            </Grid>
                          </>
                        )}
                      </Grid>
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={4}>
                          <MDTypography fontWeight="regular" style={{ fontSize: 17 }}>
                            Shelf Display
                          </MDTypography>
                        </Grid>
                        <Grid item xs={3}>
                          <RadioGroup
                            name="radio-group"
                            defaultValue="no"
                            value={selectedValue}
                            onChange={handleChanged}
                          >
                            <MyFormControlLabel value="yes" label="Yes" control={<Radio />} />
                            <MyFormControlLabel value="no" label="No" control={<Radio />} />
                          </RadioGroup>
                        </Grid>
                        {selectedValue == "yes" && (
                          <>
                            <Grid item xs={3}>
                              <Autocomplete
                                disablePortal
                                id="dropdown"
                                options={list}
                                renderInput={(params) => <TextField {...params} label="" />}
                              ></Autocomplete>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  )}
                  <MDBox pt={4}>
                    <MDButton
                      disabled={activeStep === 0}
                      variant="contained"
                      color="info"
                      onClick={handleBack}
                    >
                      Back
                    </MDButton>
                    <MDButton variant="contained" color="primary" onClick={handleNext}>
                      {activeStep === steps.length - 1 ? "Save" : "Next"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Add_Activity;

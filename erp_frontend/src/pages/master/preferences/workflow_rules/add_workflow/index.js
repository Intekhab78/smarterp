import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import Radio from "@mui/material/Radio";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const Module = [
  { label: "Customer", value: "Customer" },
  { label: "Item", value: "Item" },
  { label: "Salesman", value: "Salesman" },
  { label: "Journey Plan", value: "Journey Plan" },
  { label: "Order", value: "Order" },
  { label: "Deliviery", value: "Deliviery" },
];

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

function Add_Workflow() {
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
                  New Workflow Rule
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <MDTypography fontWeight="regular" color="inherit" pb={2}>
                    1. Name your workflow
                  </MDTypography>
                  <MDTypography style={{ fontSize: 14 }} color="text" gutterBottom pb={2}>
                    Give a Name and Description for your workflow
                  </MDTypography>
                  <Grid item xs={6}>
                    <MDBox pb={2}>
                      <MDInput
                        type="text"
                        label="Workflow Rule Name"
                        variant="outlined"
                        required
                        sx={{ width: 300 }}
                      />
                    </MDBox>
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Module}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        required
                        renderInput={(params) => <TextField {...params} label="Module" />}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="text"
                          label="Description"
                          variant="outlined"
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox>
                  <MDTypography fontWeight="regular" color="inherit" pb={2}>
                    2. Choose when to Trigger
                  </MDTypography>
                  <MDTypography style={{ fontSize: 14 }} color="text" gutterBottom pb={2}>
                    Specify when to execute the workflow.
                  </MDTypography>
                  <Grid item xs={6}>
                    <MDBox pb={2}>
                      <MDInput
                        type="text"
                        label="Workflow type"
                        variant="outlined"
                        required
                        sx={{ width: 300 }}
                      />
                    </MDBox>
                  </Grid>
                  <MDTypography style={{ fontSize: 14 }} gutterBottom>
                    when Load Request is
                  </MDTypography>
                  <Grid item xs={6} pb={2}>
                    <RadioGroup name="use-radio-group" defaultValue="created">
                      <MyFormControlLabel value="created" label="Created" control={<Radio />} />
                      <MyFormControlLabel value="edited" label="Edited" control={<Radio />} />
                      <MyFormControlLabel
                        value="created or edited"
                        label="Created or Edited"
                        control={<Radio />}
                      />
                      <MyFormControlLabel value="deleted" label="Deleted" control={<Radio />} />
                    </RadioGroup>
                  </Grid>
                </MDBox>
                <MDBox>
                  <MDTypography fontWeight="regular" color="inherit" pb={2}>
                    3. Configure multi-level approval with specific approvers
                  </MDTypography>
                  <Grid item xs={6} pb={2}>
                    <RadioGroup name="use-radio-group" defaultValue="or">
                      <MyFormControlLabel value="or" label="Or" control={<Radio />} />
                      <MyFormControlLabel value="and" label="And" control={<Radio />} />
                    </RadioGroup>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/reason">
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

export default Add_Workflow;

import { Link } from "react-router-dom";
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
import { styled } from "@mui/material/styles";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const route = [
  { label: "FRESH11", value: "FRESH11" },
  { label: "ROUTE TEST21", value: "ROUTE TEST21" },
  { label: "FRESh12", value: "FRESh12" },
];

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

//dialog box
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

function Add_Journey_plans() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
                  <Icon fontSize="small">layers</Icon>
                  Add Journey Plan
                </MDTypography>
              </MDBox>
              <TabContext value={value}>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox component="form" role="form">
                    <MDBox>
                      <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Overview" value="1" />
                        <Tab label="Schedule" value="2" />
                        <Tab label="Customers" value="3" />
                      </TabList>
                    </MDBox>
                    <TabPanel value="1">
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={6}>
                          <MDBox>
                            <MDInput
                              type="text"
                              label="Journey Name"
                              variant="outlined"
                              required
                              sx={{ width: 250 }}
                            />
                          </MDBox>
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
                        <Grid item xs={6}>
                          <MDBox pb={2}>
                            <MDInput
                              type="date"
                              label="Start Date"
                              variant="outlined"
                              required
                              sx={{ width: 300 }}
                            />
                          </MDBox>
                        </Grid>
                        <Grid item xs={6}>
                          <MDBox pb={2}>
                            <MDInput
                              type="date"
                              label="End Date"
                              variant="outlined"
                              sx={{ width: 300 }}
                            />
                          </MDBox>
                        </Grid>
                        <Grid item xs={6}>
                          <MDBox pb={2}>
                            <MDInput
                              type="time"
                              label="Start Time"
                              variant="outlined"
                              sx={{ width: 300 }}
                            />
                          </MDBox>
                        </Grid>
                        <Grid item xs={6}>
                          <MDBox pb={2}>
                            <MDInput
                              type="time"
                              label="End Time"
                              variant="outlined"
                              sx={{ width: 300 }}
                            />
                          </MDBox>
                        </Grid>
                        <Grid item xs={9}>
                          <MDTypography>
                            No End : <Checkbox {...label} />
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={9} pb={2}>
                          <MDTypography fontWeight="regular">Select Journey Plan Base</MDTypography>
                          <RadioGroup row name="use-radio-group" defaultValue="yes">
                            <MyFormControlLabel value="yes" label="Dat Wise" control={<Radio />} />
                            <MyFormControlLabel value="no" label="Week Wise" control={<Radio />} />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={9} pb={2}>
                          <MDTypography fontWeight="regular">Select weeks of a month</MDTypography>
                          <FormGroup row>
                            <FormControlLabel control={<Checkbox />} label="Week 1" />
                            <FormControlLabel control={<Checkbox />} label="Week 2" />
                            <FormControlLabel control={<Checkbox />} label="Week 3" />
                            <FormControlLabel control={<Checkbox />} label="Week 4" />
                            <FormControlLabel control={<Checkbox />} label="Week 5" />
                          </FormGroup>
                        </Grid>
                        <Grid item xs={9} pb={2}>
                          <MDTypography fontWeight="regular">
                            Select first day of a week
                          </MDTypography>
                          <RadioGroup row name="use-radio-group" defaultValue="1">
                            <MyFormControlLabel value="1" label="Monday" control={<Radio />} />
                            <MyFormControlLabel value="2" label="Tuesday" control={<Radio />} />
                            <MyFormControlLabel value="3" label="Wednesday" control={<Radio />} />
                            <MyFormControlLabel value="4" label="Thursday" control={<Radio />} />
                            <MyFormControlLabel value="5" label="Friday" control={<Radio />} />
                            <MyFormControlLabel value="6" label="Saturday" control={<Radio />} />
                            <MyFormControlLabel value="7" label="Sunday" control={<Radio />} />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={9} pb={2}>
                          <MDTypography fontWeight="regular">Select day-off of week</MDTypography>
                          <RadioGroup row name="use-radio-group" defaultValue="7">
                            <MyFormControlLabel value="1" label="Monday" control={<Radio />} />
                            <MyFormControlLabel value="2" label="Tuesday" control={<Radio />} />
                            <MyFormControlLabel value="3" label="Wednesday" control={<Radio />} />
                            <MyFormControlLabel value="4" label="Thursday" control={<Radio />} />
                            <MyFormControlLabel value="5" label="Friday" control={<Radio />} />
                            <MyFormControlLabel value="6" label="Saturday" control={<Radio />} />
                            <MyFormControlLabel value="7" label="Sunday" control={<Radio />} />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={9} pb={2}>
                          <MDTypography fontWeight="regular">Enforce Flag</MDTypography>
                          <RadioGroup row name="use-radio-group" defaultValue="no">
                            <MyFormControlLabel value="yes" label="Yes" control={<Radio />} />
                            <MyFormControlLabel value="no" label="No" control={<Radio />} />
                          </RadioGroup>
                        </Grid>
                        <Grid item xs={9} pb={2}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={route}
                            // style={{ height: 45 }}
                            sx={{ width: 700 }}
                            required
                            renderInput={(params) => <TextField {...params} label="Route " />}
                          ></Autocomplete>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="3">
                      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                        <Grid item xs={9} pb={2}>
                          <MDTypography fontWeight="regular">Is Product Catalog</MDTypography>
                          <RadioGroup row name="use-radio-group" defaultValue="">
                            <MyFormControlLabel value="yes" label="Yes" control={<Radio />} />
                            <MyFormControlLabel value="no" label="No" control={<Radio />} />
                          </RadioGroup>
                        </Grid>
                      </Grid>
                    </TabPanel>
                  </MDBox>
                </MDBox>
                <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                  <Grid item xs={2} mr={3}>
                    <MDTypography component={Link} to="/journey-plan">
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
      </MDBox>
    </DashboardLayout>
  );
}

export default Add_Journey_plans;

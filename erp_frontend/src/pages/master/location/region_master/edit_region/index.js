import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const places = [
  { label: "UNITED ARAB EMIRATES", value: "UNITED ARAB EMIRATES0" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "Qatar", value: "Qatar" },
];
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

function EditRegion() {
  const { id } = useParams();

  const initialVlaues = {
    region_code: "",
    region_name: "",
    country_id: "",
    region_status: 1,
    uuid: "",
    id: "",
  };

  const [selectedValue, setSelectedValue] = useState(initialVlaues);
  const [formError, setFormError] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryList, setcountryList] = useState([]);
  const navigate = useNavigate();

  const SelectedCountry = async () => {
    try {
      const response = await axios.get("country/list");
      const { data } = response;
      let country = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,
          value: data.id,
        };
        country.push(Object);
      });
      setcountryList(country);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanged = (event) => {
    const { name, value } = event.target;
    setSelectedValue({
      ...selectedValue,
      [name]: value,
    });
  };
  const getBankDetails = async () => {
    const response = await axios
      .get("region/edit/" + id)
      .then((response) => {
        const { data } = response?.data;
        setSelectedValue({ ...data });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getBankDetails();
    SelectedCountry();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("selectedValue", selectedValue);
    selectedValue.country_id = selectedCountry.value;
    await axios
      .post("region/edit/" + id, selectedValue)
      .then((response) => {
        navigate("/region");
        toast.success("Data edit Successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={9}>
            <Card component="form" role="form" onSubmit={(e) => handleSubmit(e, id)}>
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
                  Edit Region
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Region Code"
                          variant="outlined"
                          disabled
                          value={selectedValue?.region_code}
                          sx={{ width: 250 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Region Name"
                          variant="outlined"
                          name="region_name"
                          value={selectedValue?.region_name}
                          onChange={handleChanged}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={countryList}
                        // value={selectedValue?.country}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedValue?.selectedCountry}
                        onChange={(event, newValue) => setSelectedCountry(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            error={!!formError}
                            helperText={selectedCountry ? "" : "Country is required"}
                          />
                        )}
                        // renderInput={(params) => <TextField {...params} label="Country" />}
                      ></Autocomplete>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/region">
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

export default EditRegion;

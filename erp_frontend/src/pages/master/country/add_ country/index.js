import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "../../../../axios";
import CircularProgress from "@mui/material/CircularProgress";
// @mui material components
import Card from "@mui/material/Card";
import { axios_get, axios_post } from '../../../../axios';
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { ToastMassage } from '../../../../toast/index';
import { Autocomplete, TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";



function Addcountry() {
  const navigate = useNavigate();
  const [isSubmit, setisSubmit] = useState(false);
  const [value, setValue] = useState();
  const [currencyList, setcurrencyList] = useState([]);
  const [selectedCategory, setselectedCategory] = useState({});
  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    country_code: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const Currencyoptions = async () => {
    try {
      const response = await axios.get("all-currency");
      const { data } = response;
      let currency = [];
      data.data.map((data) => {
        let Object = {
          label: data.name,

          ...data,
        };
        currency.push(Object);
      });
      setcurrencyList(currency);
    } catch (error) {
      console.error(error);
    }
  };
  const handleBack = () => {
    navigate("/country");
  }

  useEffect(() => {
    Currencyoptions();
  }, []);
  const validation = (formData) => {
    let errors = {};

    if (!formData.name) errors.name = "Name  is required";
    if (!formData.country_code) errors.country_code = "Country code  is required";

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
      const response = await axios_post(true, "country/store", formData);
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, 'success');
          navigate("/country");
        } else {
          ToastMassage(response.message, 'error');
        }
      }
    }
  };

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
                        Add country
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/country">
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
                            type="text"
                            variant="outlined"
                            name="name"
                            className="small-input"
                            value={formData.name}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 120 }}
                          />
                          {formError.name && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.name}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Country Code</InputLabel>
                          <MDInput
                            type="number"
                            variant="outlined"
                            name="country_code"
                            className="small-input"
                            value={formData.country_code}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 4 }}
                          />
                          {formError.country_code && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.country_code}</MDTypography>}
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

export default Addcountry;

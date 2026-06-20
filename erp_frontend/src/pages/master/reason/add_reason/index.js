import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categorylist = [
  { label: "Receipt Reason", value: "Receipt Reason" },
  { label: "Visit Reason", value: "Visit Reason" },
  { label: "Non Service Reason", value: "Non Service Reason" },
  { label: "Good Return Reason", value: "Good Return Reason" },
  { label: "Bad Return Reason", value: "Bad Return Reason" },
  { label: "Debit Note Reason", value: "Debit Note Reason" },
];
function AddReason() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validation = (values) => {
    let error = {};
    if (!values.name) {
      error.name = "name is required";
    }

    return error;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errordisplay = validation(formData);
    console.log(errordisplay);

    if (Object.keys(errordisplay).length > 0) {
      setFormError(errordisplay);
    } else {
      try {
        formData.type = selectedCategory.value;
        const response = await axios.post("reason-type/add", formData);
        navigate("/reason");
        toast.success("Data add Successfully");
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
                  Add Reason
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Grid item xs={6}>
                    <MDBox pb={2}>
                      <MDInput
                        error
                        type="text"
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        sx={{ width: 300 }}
                        helperText={formError.name}
                      />
                    </MDBox>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Categorylist}
                        sx={{ width: 300 }}
                        value={selectedCategory}
                        onChange={(event, newValue) => setSelectedCategory(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Category"
                            error={!!formError}
                            helperText={selectedCategory ? "" : "type is required"}
                          />
                        )}
                      ></Autocomplete>
                      {/* {selectedCategory == 0 && <div className="error">type is required</div>} */}
                    </Grid>
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

export default AddReason;

import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Autocomplete, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import axios from "../../../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const reason_category = [
  { label: "Receipt Reason", value: "Receipt Reason" },
  { label: "Visit Reason", value: "Visit Reason" },
  { label: "Non Service Reason", value: "Non Service Reason" },
  { label: "Good Return Reason", value: "Good Return Reason" },
  { label: "Bad Return Reason", value: "Bad Return Reason" },
  { label: "Debit Note Reason", value: "Debit Note Reason" },
];

function EditReason() {
  const { id } = useParams();

  const initialVlaues = {
    name: "",
    type: "",
    uuid: "",
    id: "",
  };
  let [selectedValue, setSelectedValue] = useState(initialVlaues);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedValue({
      ...selectedValue,
      [name]: value,
    });
  };
  const editcategory = (value) => {
    setSelectedValue({
      ...selectedValue,
      type: value,
    });
  };
  const getReasonDetails = async () => {
    const response = await axios
      .get("reason-type/edit/" + id)
      .then((response) => {
        const { data } = response?.data;
        setSelectedValue({ ...data });
        console.log(response);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getReasonDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    selectedValue.type = selectedValue.type.value;
    await axios
      .post("reason-type/edit/" + id, selectedValue)
      .then((response) => {
        navigate("/reason");
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
                  Edit Reason
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid item xs={6}>
                    <MDBox pb={2}>
                      <MDInput
                        type="text"
                        label="Name"
                        name="name"
                        variant="outlined"
                        sx={{ width: 300 }}
                        value={selectedValue?.name}
                        onChange={handleChange}
                      />
                    </MDBox>
                    <Grid item xs={6}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={reason_category}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedValue?.type}
                        onChange={(event, newValue) => editcategory(newValue)}
                        renderInput={(params) => <TextField {...params} label="Category" />}
                      ></Autocomplete>
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
                    <MDButton type="submit" variant="gradient" color="info" fullWidth>
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

export default EditReason;

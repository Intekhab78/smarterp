import { Link } from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios, { axios_post } from "../../../axios";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { InputLabel } from "@mui/material";
import { ToastMassage } from '../../../toast';

function Change_Password() {
  const [formError, setFormError] = useState({});
  const [selectedCategory, setselectedCategory] = useState("");
  const [isdisabled, setIsDisabled] = useState(true);
  const [user, setUser] = useState({
    new_password: "",
    user_id: "",
    confirm_password: "",
    old_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError("")
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const isSubmitDisabled = !(user.confirm_password && user.old_password && user.new_password);

  const validation = (values) => {
    let error = {};
    if (!values.confirm_password) {
      error.confirm_password = "password is required";
    }
    if (!values.old_password) {
      error.old_password = "password is required";
    }
    if (!values.new_password) {
      error.new_password = "password is required";
    }
    if (values.new_password !== values.confirm_password) {
      error.confirm_password = "Password does not match";
    }
    // if (values.new_password.length < 8) {
    //   error.confirm_password = "Password must be 8 character long";
    // }
    // const isContainsUppercase = /^(?=.*[A-Z])/;
    // if (!isContainsUppercase.test(values.new_password)) {
    //   error.confirm_password = "Password must have at least one Uppercase character.";
    // }
    // const isContainsLowercase = /^(?=.*[a-z])/;
    // if (!isContainsLowercase.test(values.new_password)) {
    //   error.confirm_password = "Password must have at least one Lowercase character.";
    // }
    // const isContainsNumber = /^(?=.*[0-9])/;
    // if (!isContainsNumber.test(values.new_password)) {
    //   error.confirm_password = "Password must contain at least one Digit.";
    // }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errordisplay = validation(user);
    if (Object.keys(errordisplay).length > 0) {
      setFormError(errordisplay);
    } else {
      user.user_id = localStorage.getItem("user_id");
      const response = await axios_post(true, "change_password", user)
      setFormError("")

      if (response.status === true) {
        ToastMassage(response.message, 'success');
        setUser({
          new_password: "",
          confirm_password: "",
          old_password: "",
        })
      } else {
        ToastMassage(response.message, 'error');
      }
    }

  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                  Change Password
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid item xs={8}>
                    <MDBox pb={2}>
                      <InputLabel sx={{ mb: 1 }}>Old Password</InputLabel>
                      <MDInput
                        type="text"
                        variant="outlined"
                        name="old_password"
                        value={user.old_password}
                        onChange={handleChange}
                        sx={{ width: 600 }}
                        helperText={
                          formError.old_password && (
                            <span style={{ color: 'red' }}>{formError.old_password}</span>
                          )
                        }
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={8}>
                    <MDBox pb={2}>
                      <InputLabel sx={{ mb: 1 }}>Password</InputLabel>
                      <MDInput
                        error
                        type="text"
                        name="new_password"
                        variant="outlined"
                        onChange={handleChange}
                        value={user.new_password}
                        sx={{ width: 600 }}
                        helperText={
                          formError.new_password && (
                            <span style={{ color: 'red' }}>{formError.new_password}</span>
                          )
                        }
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={8}>
                    <MDBox pb={2}>
                      <InputLabel sx={{ mb: 1 }}>Confirm Password</InputLabel>
                      <MDInput
                        error
                        type="text"
                        variant="outlined"
                        name="confirm_password"
                        onChange={handleChange}
                        value={user.confirm_password}
                        sx={{ width: 600 }}
                        helperText={
                          formError.confirm_password && (
                            <span style={{ color: 'red' }}>{formError.confirm_password}</span>
                          )
                        }
                      />
                    </MDBox>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={4} ml={3}>
                  <MDBox>
                    <MDButton
                      variant="gradient"
                      color="info"
                      type="submit"
                      disabled={isSubmitDisabled}
                      fullWidth
                    >
                      Change Password
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

export default Change_Password;

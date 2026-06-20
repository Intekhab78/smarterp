import { useEffect, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import axios from "../../../axios";
// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import InputLabel from "@mui/material/InputLabel";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Forget from "layouts/authentication/forget-password";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// import gImage from "assets/images/inv-g (1).jpeg"

import { token } from "stylis";
import { CircularProgress, MenuItem, Select } from "@mui/material";

import { axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";

function Basic() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    type: "User",
  });

  const [errors, setErrors] = useState({});
  const [isSubmit, setisSubmit] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   let tokenGet = localStorage.getItem("token");
  //   console.log("tokent get is ---------------", tokenGet);

  //   if (tokenGet) {
  //     return navigate("/dashboard");
  //   }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisSubmit(true);
    const staticCredentials = {
      email: "",
      password: "",
    };
    // const user = { ...loginData };
    const user = {
      ...loginData,
      id: isNaN(loginData.email) ? "" : loginData.email, // add this line
    };

    const validationErrors = {};
    if (!user.email) {
      validationErrors.email = "Email or ID is required";
    }
    if (!user.password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setisSubmit(false);
      return;
    }

    console.log("user from login is ", user);

    const response = await axios_post(true, "auth/login", user);
    console.log("response from login is ", response.data);
    // return; // ⛔ Stops execution here
    if (response) {
      if (response.status) {
        ToastMassage("Successfully Login", "success");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.id);
        localStorage.setItem("role_id", response.data.role_id);
        localStorage.setItem("usertype", response.data.usertype);
        localStorage.setItem("emp_id", response.data?.employeeData?.emp_id);

        localStorage.setItem("user_data", JSON.stringify(response.data));
        localStorage.setItem(
          "user_group_data",
          JSON.stringify(response.data.user_group),
        );

        // ⭐ Redirect based on role
        if (response.data.role_id === 2) {
          navigate(
            `/employee_details/${response?.data?.employeeData?.emp_id}`,
            { replace: true },
          );
        } else if (response.data.role_id === 5) {
          navigate("/managerpage", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        // navigate("/dashboard");
        // window.location.reload();
      } else {
        ToastMassage(response.message, "error");
      }
    }
    setisSubmit(false);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <InputLabel sx={{ mb: 1 }}>Name Or User ID</InputLabel>
              <MDInput
                // type="email"
                type="text" // changed from "email"
                variant="outlined"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                helperText={errors.email}
                FormHelperTextProps={{
                  sx: { color: "red" },
                }}
                sx={{ width: "100%" }}
              />
            </MDBox>
            <MDBox mb={2}>
              <InputLabel sx={{ mb: 1 }}>Password</InputLabel>
              <MDInput
                type="password"
                variant="outlined"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                helperText={errors.password}
                FormHelperTextProps={{
                  sx: { color: "red" },
                }}
                sx={{ width: "100%" }}
              />
            </MDBox>
            {/* <MDBox mb={2}>
              <InputLabel sx={{ mb: 1 }}>Type</InputLabel>
              <Select
                name="type"
                value={loginData.type}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  borderColor: "#ccc",
                }}
              >
                <MenuItem value="Salesman">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton
                type="submit"
                variant="gradient"
                disabled={isSubmit}
                color="info"
                fullWidth
              >
                {isSubmit ? (
                  <CircularProgress
                    color="white"
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                ) : (
                  "Login"
                )}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

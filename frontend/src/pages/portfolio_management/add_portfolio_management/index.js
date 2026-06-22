import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

import { axios_get, axios_post, axios_post_image } from '../../../axios';
import { ToastMassage } from '../../../toast';

function AddPortfolioManagement() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    images: [],
  });
  console.log("formData", formData);

  const fetchCategories = async () => {
    const response = await axios_post(true, "Portfolio-category/list");
    if (response?.status) {
      setCategories(response?.data);
    } else {
      ToastMassage(response?.message, 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validation = (formData) => {
    let errors = {};

    if (!formData.title) {
      errors.title = "title is required";
    }
    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (formData.images.length === 0) {
      errors.images = "At least one image is required";
    } else if (formData.images.length > 15) {
      errors.images = "You cannot upload more than 15 images";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    setIsSubmit(true);
    event.preventDefault();
    let errors = validation(formData);

    if (Object.keys(errors).length > 0) {
      setIsSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      formData.images.forEach((image, index) => {
        data.append(`images`, image);
      });
      const response = await axios_post_image(true, "Portfolio-category/store", data);
      if (response) {
        setIsSubmit(false);
        if (response.status === true) {
          ToastMassage(response.message, 'success');
          navigate("/portfolio-management");
        } else {
          ToastMassage(response.message, 'error');
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 15) {
      ToastMassage("You cannot upload more than 15 images", "error");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleBack = () => {
    navigate("/portfolio-management");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <form onSubmit={handleSubmit} method="POST" action="#">
              <Card >
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
                  <Grid container spacing={0}>
                    <Grid item xs={2} mr={35}>
                      <MDTypography variant="h6" color="white">
                        <Icon fontSize="small">shopping_cart</Icon>
                        Add Portfolio
                      </MDTypography>
                    </Grid>

                    <Grid item xs={2} ml={40}>
                      <MDTypography component={Link} to="/portfolio-management">
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
                      <Grid item xs={6}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Title</InputLabel>
                          <MDInput
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            sx={{ width: 300 }}
                          />
                          {formError.title && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.title}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={6}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Category</InputLabel>
                          <Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            sx={{ width: 300, height: 45 }}
                          >
                            {categories.map((category) => (
                              <MenuItem key={category.id} value={category.id}>
                                {category?.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.category && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.category}</MDTypography>}
                        </MDBox>
                      </Grid>
                      <Grid item xs={6}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Upload Images</InputLabel>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                          />
                          {formError.images && <MDTypography color="error" sx={{ fontSize: '14px', mt: "10px" }}>{formError.images}</MDTypography>}
                          <MDTypography variant="caption" color="textSecondary" sx={{ display: 'block' }}>You can upload up to 15 images.</MDTypography>
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

export default AddPortfolioManagement;

import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios"; // add this on top if not imported

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { axios_get, axios_post } from "../../../axios";
import { ToastMassage } from "../../../toast";
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import moment from "moment";
import constantApi from "constantApi";

function add_ItemDeptMst() {
  const navigate = useNavigate();
  const params = useParams();
  const [formError, setFormError] = useState({});
  const [isSubmit, setisSubmit] = useState(false);
  const [countries, setCountries] = useState([]);
  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);
  let user_data = JSON.parse(localStorage.getItem("user_data"));
  const [image, setImage] = useState(null); // Store image file

  const [formData, setFormData] = useState({
    itemdeptcode: "",
    itemdeptname: "",
    itemdeptlong: "",
    note1: "",
    note2: "",
    note3: "",
    company_id: "",
    location_id: "",
    itmdepdt1: "",
    itmdepdt2: "",
    addedby: `${user_data.firstname} ${user_data.lastname}`,
    createddt: new Date().toLocaleString(),
    status: "1",
    id: params.id,
  });
  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    if (response) {
      if (response.status) {
        setCompines(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchlocationList = async (company_id) => {
    const response = await axios_post(true, "location/loc_list", {
      company_id: company_id,
    });
    if (response) {
      if (response.status) {
        setlocations(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const OrderNuberRange = async () => {
    let params = {
      function_for: "item",
    };
    const response = await axios_post(
      true,
      "code_setting/get-next-comming-code",
      params
    );
    if (response) {
      if (response.status) {
        setFormData((prevData) => ({
          ...prevData,
          itemdeptcode: response.data.number_is,
        }));
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchcountryList = async () => {
    const response = await axios_get(true, "country/list-dropdown");
    if (response) {
      if (response.status) {
        setCountries(response.data);
      } else {
        ToastMassage(response.message, "error");
      }
    }
  };
  const fetchOrderDetails = async () => {
    try {
      const response = await axios_post(true, "item_department/details", {
        id: params.id,
      });
      if (response.status) {
        const orderData = response.data;
        setFormData({
          ...formData,
          itemdeptname: orderData.itemdeptname,
          itemdeptcode: orderData.itemdeptcode,
          itemdeptlong: orderData.itemdeptlong,
          note1: orderData.note1,
          company_id: orderData.company_id,
          location_id: orderData.location_id,
          note2: orderData.note2,
          note3: orderData.note3,
          itmdepdt1: moment(orderData.itmdepdt1).format("YYYY-MM-DD"),
          itmdepdt2: moment(orderData.itmdepdt2).format("YYYY-MM-DD"),
          status: orderData.status === 0 ? "0" : "1",
        });
        if (orderData.company_id) {
          await fetchlocationList(orderData.company_id);
        }
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };
  useEffect(() => {
    OrderNuberRange();
    fetchcountryList();
    fetchOrderDetails();
    fetchcompanyList();
  }, []);

  const validation = (formData) => {
    let errors = {};
    if (!formData.itemdeptcode)
      errors.itemdeptcode = "Item department Code is required";

    if (!formData.itemdeptlong)
      errors.itemdeptlong = "Long description is required";
    if (!formData.addedby) errors.addedby = "Added by is required";
    if (!formData.company_id) errors.company_id = "Company id is required";
    if (!formData.location_id) errors.location_id = "Location id is required";
    if (!formData.createddt) errors.createddt = "Created date is required";
    if (!formData.status) errors.status = "Status is required";
    if (!formData.itemdeptname) {
      errors.itemdeptname = "Description is required";
    }
    return errors;
  };

  const handleSubmit1 = async (event) => {
    setisSubmit(true);
    event.preventDefault();
    let errors = validation(formData);

    if (Object.keys(errors).length > 0) {
      setisSubmit(false);
      setFormError(errors);
    } else {
      setFormError({});
      const response = await axios_post(
        true,
        "item_department/update",
        formData
      );
      if (response) {
        setisSubmit(false);
        if (response.status) {
          ToastMassage(response.message, "success");
          navigate("/itemDeptMst");
        } else {
          ToastMassage(response.message, "error");
        }
      }
    }
  };
  const handleSubmit6 = async (event) => {
    event.preventDefault();
    setisSubmit(true);

    let errors = validation(formData);
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      setisSubmit(false);
      return;
    }
    setFormError({});

    try {
      const data = new FormData();

      // Append all fields from formData object
      Object.entries(formData).forEach(([key, value]) => {
        // If value is null or undefined, append empty string to avoid issues
        data.append(key, value ?? "");
      });

      // Append image file if selected
      if (image) {
        data.append("file", image); // "file" must match your backend multer field name
      }

      // Send formData via axios_post with appropriate headers
      const response = await axios_post(true, "item_department/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setisSubmit(false);

      if (response.status) {
        ToastMassage(response.message, "success");
        navigate("/itemDeptMst");
      } else {
        ToastMassage(response.message, "error");
      }
    } catch (error) {
      setisSubmit(false);
      ToastMassage("Something went wrong!", "error");
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setisSubmit(true);

    let errors = validation(formData);
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      setisSubmit(false);
      return;
    }
    setFormError({});

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value ?? "");
      });

      if (image) {
        data.append("file", image);
      }

      // const response = await axios({

      //   method: "post",
      //   url: baseURL + "item_department/update",
      //   data: data,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });

      const response = await axios.post(
        `${constantApi.baseUrl}/item_department/update`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setisSubmit(false);

      if (response.data.status) {
        ToastMassage(response.data.message, "success");
        navigate("/itemDeptMst");
      } else {
        ToastMassage(response.data.message, "error");
      }
    } catch (error) {
      setisSubmit(false);
      ToastMassage("Something went wrong!", "error");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "company_id" && { location_id: "" }),
    }));
    if (name === "company_id") {
      fetchlocationList(value);
    }
  };

  const handleBack = () => {
    navigate("/itemDeptMst");
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
                      <MDTypography
                        variant="h6"
                        color="white"
                        sx={{ width: 177 }}
                      >
                        <Icon fontSize="small">shopping_cart</Icon>
                        Edit Item Department
                      </MDTypography>
                    </Grid>

                    <Grid item xs={6} ml={0}>
                      <MDTypography component={Link} to="/itemDeptMst">
                        <MDButton variant="gradient" color="light">
                          Back
                        </MDButton>
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  <MDBox>
                    <Grid
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                    >
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Code</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="itemdeptcode"
                            value={formData.itemdeptcode}
                            className="small-input"
                            onChange={handleChange}
                            inputProps={{ maxLength: 10 }}
                            disabled
                          />
                          {formError.itemdeptcode && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdeptcode}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="itemdeptname"
                            className="small-input"
                            value={formData.itemdeptname}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 120 }}
                          />
                          {formError.itemdeptname && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdeptname}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Long Description
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="itemdeptlong"
                            className="small-input"
                            value={formData.itemdeptlong}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            inputProps={{ maxLength: 180 }}
                          />
                          {formError.itemdeptlong && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.itemdeptlong}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Desc in Ecom</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="note1"
                            value={formData.note1}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 50 }}
                          />
                        </MDBox>
                      </Grid>
                      {/* <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Display On Ecom
                          </InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="note2"
                            value={formData.note2}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 50 }}
                          />
                        </MDBox>
                      </Grid> */}

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>
                            Display On Ecom
                          </InputLabel>

                          <Select
                            variant="outlined"
                            name="note2"
                            value={formData.note2}
                            onChange={handleChange}
                            fullWidth
                            className="small-input"
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Select>
                        </MDBox>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Note 3</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="note3"
                            value={formData.note3}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                            inputProps={{ maxLength: 50 }}
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Date 1</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmdepdt1"
                            value={formData.itmdepdt1}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Date 2</InputLabel>
                          <MDInput
                            type="date"
                            variant="outlined"
                            name="itmdepdt2"
                            value={formData.itmdepdt2}
                            onChange={handleChange}
                            // sx={{ width: 300 }}
                            className="small-input"
                          />
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Added By</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="addedby"
                            value={formData.addedby}
                            onChange={(e) => handleChange(e)}
                            className="small-input"
                            inputProps={{ maxLength: 40 }}
                            disabled
                          />
                          {formError.addedby && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.addedby}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Created Date</InputLabel>
                          <MDInput
                            type="text"
                            variant="outlined"
                            name="createddt"
                            value={formData.createddt}
                            className="small-input"
                            disabled
                          />
                          {formError.createddt && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.createddt}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Status</InputLabel>
                          <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                          >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Inactive</MenuItem>
                          </Select>
                          {formError.status && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.status}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Company </InputLabel>
                          <Select
                            name="company_id"
                            value={formData.company_id}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {compines?.map((company) => (
                              <MenuItem key={company.id} value={company?.id}>
                                {company?.compdesc}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.company_id && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.company_id}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>location</InputLabel>
                          <Select
                            name="location_id"
                            value={formData.location_id}
                            onChange={handleChange}
                            sx={{ width: 250, height: 45 }}
                            // className="small-input"
                          >
                            {locations?.map((location) => (
                              <MenuItem key={location.id} value={location?.id}>
                                {location?.locname}
                              </MenuItem>
                            ))}
                          </Select>
                          {formError.location_id && (
                            <MDTypography
                              color="error"
                              sx={{ fontSize: "14px", mt: "10px" }}
                            >
                              {formError.location_id}
                            </MDTypography>
                          )}
                        </MDBox>
                      </Grid>

                      {/* image sections */}

                      <Grid item xs={12} sm={4}>
                        <MDBox pb={2}>
                          <InputLabel sx={{ mb: 1 }}>Upload Image</InputLabel>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            // required
                            style={{ width: "100%" }}
                          />
                        </MDBox>
                      </Grid>

                      <Grid
                        container
                        spacing={2}
                        justifyContent="right"
                        sx={{ mt: 1, mb: 2 }}
                      >
                        <Grid item xs={2} ml={3}>
                          <MDBox sx={{ display: "flex" }}>
                            <MDButton
                              variant="gradient"
                              disabled={isSubmit}
                              color="info"
                              type="submit"
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
                                "Save"
                              )}
                            </MDButton>
                            <MDButton
                              variant="gradient"
                              disabled={isSubmit}
                              color="secondary"
                              fullWidth
                              sx={{ marginLeft: "15px" }}
                              onClick={handleBack}
                            >
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

export default add_ItemDeptMst;

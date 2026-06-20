import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
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
import axios from "../../../../../axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const area = [
  { label: "Dubai", value: "Dubai" },
  { label: "Jabel Ali", value: "Jabel Ali" },
  { label: "Abu Dhabi", value: "Abu Dhabi" },
];
const region = [{ label: "RN", value: "RN" }];

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

function EditBranch() {
  const { id } = useParams();

  const initialVlaues = {
    depot_code: "",
    depot_name: "",
    depot_manager: "",
    depot_manager_contact: "",
    region_id: "",
    area_id: "",
    status: 1,
    uuid: "",
    id: "",
  };
  let [selectedValue, setSelectedValue] = useState(initialVlaues);
  const [regionList, setregionList] = useState([]);
  const navigate = useNavigate();
  const [areaList, setareaList] = useState([]);
  const [selectedCategory, setselectedCategory] = useState("");
  const [selectArea, setselectArea] = useState("");

  const SelectedCategory = async () => {
    try {
      const response = await axios.get("region/list");
      const { data } = response;
      let region = [];
      data.data.map((data) => {
        let Object = {
          label: data.region_name,
          value: data.id,
        };
        region.push(Object);
      });
      setregionList(region);
    } catch (error) {
      console.error(error);
    }
  };
  const Selectedarea = async () => {
    try {
      const response = await axios.get("area/list");
      const { data } = response;
      let area = [];
      data.data.map((data) => {
        let Object = {
          label: data.area_name,
          value: data.id,
        };
        area.push(Object);
      });
      setareaList(area);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedValue({
      ...selectedValue,
      [name]: value,
    });
  };

  const getDepotDetails = async () => {
    const response = await axios
      .get("depot/edit/" + id)
      .then((response) => {
        const { data } = response?.data;
        setSelectedValue({ ...data });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getDepotDetails();
    SelectedCategory();
    Selectedarea();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("selectedValue", selectedValue);
    selectedValue.region_id = selectedCategory.value;
    selectedValue.area_id = selectArea.value;
    await axios
      .post("depot/edit/" + id, selectedValue)
      .then((response) => {
        navigate("/depot");
        toast.success("Data edit Successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
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
                  Edit Branch/Depot
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          disabled
                          label="Depot code:"
                          name="depot_code"
                          variant="outlined"
                          value={selectedValue?.depot_code}
                          sx={{ width: 250 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Depot Name"
                          name="depot_name"
                          variant="outlined"
                          value={selectedValue?.depot_name}
                          sx={{ width: 300 }}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Depot Manager"
                          name="depot_manager"
                          variant="outlined"
                          value={selectedValue?.depot_manager}
                          sx={{ width: 300 }}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox>
                        <MDInput
                          type="text"
                          label="Manager Contact"
                          name="depot_manager_contact"
                          variant="outlined"
                          value={selectedValue?.depot_manager_contact}
                          sx={{ width: 300 }}
                          onChange={handleChange}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={regionList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedValue?.selectedCategory}
                        onChange={(event, newValue) => setselectedCategory(newValue)}
                        renderInput={(params) => <TextField {...params} label="Region:" />}
                      ></Autocomplete>
                    </Grid>
                    <Grid item xs={6} pb={2}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={areaList}
                        // style={{ height: 45 }}
                        sx={{ width: 300 }}
                        value={selectedValue?.selectArea}
                        onChange={(event, newValue) => setselectArea(newValue)}
                        renderInput={(params) => <TextField {...params} label="Area:" />}
                      ></Autocomplete>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/depot">
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

export default EditBranch;

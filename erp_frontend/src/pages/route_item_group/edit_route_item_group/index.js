import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "../../../axios";

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
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const routes = [
  { label: "FRESH11", value: "FRESH11" },
  { label: "ROUTE TEST21", value: "ROUTE TEST21" },
  { label: "FRESh12", value: "FRESh12" },
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

function EditRoute_item_group() {
  const { id } = useParams();
  const initialVlaues = {
    code: "",
    name: "",
    route_id: "",
    item_code: "",
    status: 1,
    uuid: "",
    id: "",
  };
  const [selectedValue, setSelectedValue] = useState(initialVlaues);
  const [selectedCategory, setselectedCategory] = useState("");
  const [itemList, setitemList] = useState([]);
  const [selectitem, setselectitem] = useState([]);
  const [routelist, setroutelist] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedValue({
      ...selectedValue,
      [name]: value,
    });
  };
  const Selecteitemlist = async () => {
    const payload = {
      page: 1,
      page_size: 10,
    };
    try {
      const response = await axios.post("item/list", payload);
      const { data } = response;
    

      let route = [];
      data.data.map((data) => {
        let Object = {
          label: data.item_code + "-" + data.item_name,
          value: data.id,
        };
        route.push(Object);
      });
      setitemList(route);
    } catch (error) {
      console.error(error);
    }
  };

  const Selecteroutelist = async () => {
    try {
      const response = await axios.post("route/list");
      const { data } = response;
      let route = [];
      data.data.map((data) => {
        let Object = {
          label: data.route_name,
          value: data.id,
        };
        route.push(Object);
      });
      setroutelist(route);
    } catch (error) {
      console.error(error);
    }
  };
  const getrouteDetails = async () => {
    const response = await axios
      .get("route-item-grouping/edit/" + id)
      .then((response) => {
        const { data } = response?.data;
        setSelectedValue({ ...data });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };
  useEffect(() => {
    Selecteroutelist();
    Selecteitemlist();
    getrouteDetails();
  }, []);

  const handleSubmit = async (e) => {
   
    e.preventDefault();
    selectedValue.route_id = selectedCategory.value;
    selectedValue.item_code = selectitem;
    await axios
      .post("route-item-grouping/edit/" + id, selectedValue)
      .then((response) => {
        navigate("/route-item-group");
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
                  Edit Route Item Group
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox pb={2}>
                    <MDInput
                      disabled
                      type="text"
                      label="CODE"
                      variant="outlined"
                      name="code"
                      value={selectedValue?.code}
                      onChange={handleChange}
                      sx={{ width: 400 }}
                    />
                  </MDBox>
                  <MDBox pb={2}>
                    <MDInput
                      type="text"
                      label="NAME"
                      variant="outlined"
                      name="name"
                      value={selectedValue?.name}
                      onChange={handleChange}
                      sx={{ width: 450 }}
                    />
                  </MDBox>
                  <MDBox pb={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={routelist}
                      // style={{ height: 45 }}
                      value={selectedCategory}
                      onChange={(event, newValue) => setselectedCategory(newValue)}
                      sx={{ width: 450 }}
                      renderInput={(params) => <TextField {...params} label="ROUTE" />}
                    ></Autocomplete>
                  </MDBox>
                  <Grid item xs={6}>
                    <MDBox pb={2}>
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={itemList}
                        value={selectitem}
                        disableCloseOnSelect
                        // getOptionLabel={(option) => option.label}
                        renderOption={(props, option, { selectitem }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selectitem}
                            />
                            {option.label}
                          </li>
                        )}
                        style={{ width: 400 }}
                        onChange={(event, newValue) => setselectitem(newValue)}
                        renderInput={(params) => <TextField {...params} label="Item Code" />}
                      ></Autocomplete>
                    </MDBox>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/route-item-group">
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

export default EditRoute_item_group;

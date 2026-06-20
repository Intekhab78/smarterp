import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios";
import * as React from "react";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useRadioGroup } from "@mui/material/RadioGroup";
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
// import { DataGrid } from "@material-ui/data-grid";
import { DataGrid } from "@mui/x-data-grid";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import routes from "routes";

const load_type = [{ label: "", value: "" }];

const source_van = [
  { label: "786786", value: "786786" },
  { label: "80211", value: "80211" },
  { label: "TEST", value: "TEST" },
  { label: "Dubai (1)", value: "Dubai (1)" },
];

const destination_van = [
  { label: "786786", value: "786786" },
  { label: "80211", value: "80211" },
  { label: "TEST", value: "TEST" },
  { label: "Dubai (1)", value: "Dubai (1)" },
];

const item = [
  { label: "20 APP CHARCOAL PINZA MARGHARITA", value: "20 APP CHARCOAL PINZA MARGHARITA" },
  { label: "20-051 FFF FS CHICKEN TIKKA TOPPING", value: "20-051 FFF FS CHICKEN TIKKA TOPPING" },
  { label: "55500000 Test Item", value: "55500000 Test Item" },
  { label: "55555500001 Test Item 1", value: "55555500001 Test Item 1" },
];

const uom = [
  { label: "CA", value: "CA" },
  { label: "TB", value: "TB" },
  { label: "BC", value: "BC" },
  { label: "CD", value: "CD" },
  { label: "PK", value: "PK" },
  { label: "EA", value: "EA" },
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

//radiobutton
const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    ".MuiFormControlLabel-label":
      checked &&
      {
        //   color: theme.palette.primary.main,
      },
  })
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();
  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }
  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};

function Edit_VanToVan_Transfer() {
  const [rows, setRows] = useState([]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        item_name: "",
        uom: "",
        quantity: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const columns = [
    { field: "id", headerName: "#", width: 100 },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 300,
      renderCell: (params) => (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={item}
          // style={{ height: 45 }}
          sx={{ width: 250 }}
          renderInput={(params) => <TextField {...params} label="Item" variant="standard" />}
        ></Autocomplete>
      ),
    },
    {
      field: "uom",
      headerName: "UOM",
      width: 200,
      renderCell: (params) => (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={uom}
          // style={{ height: 45 }}
          sx={{ width: 190 }}
          renderInput={(params) => <TextField {...params} label="uom" variant="standard" />}
        ></Autocomplete>
      ),
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 200,
      renderCell: (params) => (
        <MDInput
          type="number"
          label="Quantity"
          variant="standard"
          // sx={{ width: 200 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <MDButton
          variant="outlined"
          color="info"
          iconOnly
          onClick={() => handleRemoveRow(params.rowIndex)}
        >
          <Icon fontSize="small">clear</Icon>
        </MDButton>
      ),
    },
  ];

  const { id } = useParams();

  const initialVlaues = {
    source_route_id: "",
    destination_route_id: "",
    code: "",
    date: "",
    status: 1,
    uuid: "",
    id: "",
  };
  let [selectedValue, setSelectedValue] = useState(initialVlaues);
  const navigate = useNavigate();
  const [selectDestination, setselectDestination] = useState("");
  const [destiRoute, setdestiRoute] = useState([]);
  const [selectsource, setselectsource] = useState("");
  const [sourceRoute, setsourceRoute] = useState([]);
  const [value, setValue] = useState(moment().format("YYYY-MM-DD"));

  const SelectedDestination = async () => {
    try {
      const response = await axios.post("route/list");
      const { data } = response;
      let category = [];
      data.data.map((data) => {
        let Object = {
          label: data.route_name,
          value: data.id,
        };
        category.push(Object);
      });
      setdestiRoute(category);
    } catch (error) {
      console.error(error);
    }
  };
  const SelectedRoute = async () => {
    try {
      const response = await axios.post("route/list");
      const { data } = response;
      let type = [];
      data.data.map((data) => {
        let Object = {
          label: data.route_name,
          value: data.id,
        };
        type.push(Object);
      });
      setsourceRoute(type);
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

  const getDetails = async () => {
    const response = await axios
      .get("van-to-van-transfer/edit/" + id)
      .then((response) => {
        const { data } = response?.data;
        setSelectedValue({ ...data });
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    selectedValue.destination_route_id = selectDestination.value;
    selectedValue.source_route_id = selectsource.value;
    selectedValue.date = value;
    await axios
      .post("van-to-van-transfer/edit/" + id, selectedValue)
      .then((response) => {
        navigate("/van-to-van-transfer");
        toast.success("Data edit Successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getDetails();
    SelectedDestination();
    SelectedRoute();
  }, []);

  const onChangeDate = (e) => {
    const newDate = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setValue(newDate);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
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
                  <Icon fontSize="small">local_shipping</Icon>
                  Edit Van To Van Transfer
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox>
                  <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={sourceRoute}
                          style={{ height: 45 }}
                          sx={{ width: 300 }}
                          value={selectedValue?.selectsource}
                          onChange={(event, newValue) => setselectsource(newValue)}
                          renderInput={(params) => <TextField {...params} label="Source Van:" />}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          disabled
                          type="text"
                          label="Code"
                          variant="outlined"
                          name="code"
                          value={selectedValue?.code}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={destiRoute}
                          style={{ height: 45 }}
                          sx={{ width: 300 }}
                          value={selectedValue?.selectDestination}
                          onChange={(event, newValue) => setselectDestination(newValue)}
                          renderInput={(params) => (
                            <TextField {...params} label="Destination Van:" />
                          )}
                        ></Autocomplete>
                      </MDBox>
                    </Grid>
                    <Grid item xs={6}>
                      <MDBox pb={2}>
                        <MDInput
                          type="date"
                          label="Date"
                          variant="outlined"
                          value={value}
                          onChange={onChangeDate}
                          sx={{ width: 300 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12}>
                      <DataGrid
            localeText={{noRowsLabel: "No records", }} rows={rows} columns={columns} disableRowSelectionOnClick />
                      <MDButton variant="contained" color="secondary" onClick={handleAddRow}>
                        Add Row
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
              <Grid container spacing={2} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
                <Grid item xs={2} mr={3}>
                  <MDTypography component={Link} to="/van-to-van-transfer">
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

export default Edit_VanToVan_Transfer;

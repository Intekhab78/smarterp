import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios, { axios_get, axios_post } from "../../axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MDBadge from "components/MDBadge";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Autocomplete, DialogContentText, TextField } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMemo } from "react";
import MDInput from "components/MDInput";
import { ToastMassage } from "toast";
import moment from "moment";

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

const rows = [
	{
		id: 1,
		code: "",
		name: "",
		address: "",
		mobile: "",
		customer_group: "",
		approval: "",
		status: "",
		action: "",

		//   <MDBox ml={-1}>
		//     <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
		//   </MDBox>
		// ),
	},
];

export default function Setting() {
	const [selectedValue, setSelectedValue] = useState("");

	const handleChanged = (event) => {
		setSelectedValue(event.target.value);
	};

	const [opened, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClosed = () => {
		setOpen(false);
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [dialogbox, setdialogbox] = useState(false);
	const [actionopen, setActionpen] = useState(false);
	const [inactiveopen, setInactiveopen] = useState(false);
	const [SelectedUUID, setSelectedUUID] = useState([]);
	const [customerData, setcustomerData] = useState({});
	const [orderData, setorderData] = useState({});
	const [loading, setLoading] = useState(true);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [formData, setFormData] = useState({
		module: "CustomerInfo",
		action: "",
		ids: "",
	});

	const handleClickOpened = (orderData) => {
		setorderData(orderData);
		setdialogbox(true);
	};
	const handleClosing = () => {
		setdialogbox(false);
		setActionpen(false);
		setInactiveopen(false);
	};
	const handleClickactionOpen = () => {
		setActionpen(true);
	};
	const handleClickinactiveOpen = () => {
		setInactiveopen(true);
	};

	const [anchor, setAnchor] = useState(null);
	const opening = Boolean(anchor);

	const handleClickaction = (event) => {
		setAnchor(event.currentTarget);
	};

	const handleclosedd = () => {
		setAnchor(null);
	};

	const handleselection = (ids) => {
		var selectedrow = ids.map((id) => data.find((row) => row.id === id));
		let newUUID = [];
		selectedrow.map((data, keys) => {
			newUUID.push(data.uuid);
		});
		setSelectedUUID(newUUID);
	};
	const handleCloseDeleteModal = () => {
		setOpenDeleteModal(false);
	};
	const handleActiveModalSubmit = async (status) => {
		setActionpen(false);
		setdialogbox(false);
		setInactiveopen(false);

		formData.ids = SelectedUUID;
		formData.action = status;

		const response = await axios
			.post("global/bulk-action", formData)
			.then((response) => {
				getdetails();
				if (status == "active") {
					toast.success("Mark as Active Successfully");
				} else {
					toast.success("Mark as Inactive Successfully");
				}
				setInactiveopen(false);
			})
			.catch((err) => {
				console.error(err.message);
			});
	};
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		const { id } = orderData;
		
		setIsDeleting(true);
		try {
			const response = await axios_post(true, "setting_landed_cost/delete", {
				id: orderData
			});
			if (response?.status === true) {
				getdetails();
				ToastMassage(response?.message, 'success')
				handleCloseDeleteModal();
				setorderData({});
				setdialogbox(false);
				setIsDeleting(false);
			}
			else {
				ToastMassage(response?.message, 'error')
				setdialogbox(false);
				setIsDeleting(false);
			}
		} catch (error) {
			console.error('Error deleting order:', error);
		}
	}

	const getdetails = async () => {
		setLoading(true);
		const response = await axios_post(true, "setting_landed_cost/list");
		if (response) {
			if (response.status) {
				const records = response?.data;
				setData(records);
				setLoading(false);
			} else {
				ToastMassage(response.message, 'error')
				setLoading(false);
			}
		}
	};

	const handleEdit = (id, type) => {
		if (type === 'edit') {
			navigate(`/setting/edit/${id}`)

		} else if (type === 'view') {
			navigate(`/setting/view/${id}`);
		}
	}

	useEffect(() => {
		getdetails();
	}, []);

	const columns = [
		{
			field: "updated_at",
			headerName: "DATE",
			width: 150,
			sortable: true,
			disableColumnMenu: true,
			renderCell: (params) => moment(params?.value).format("DD MMM YYYY hh:mm A"),
		},
		{
			field: "itemsizecode", headerName: "BARCODE", width: 150, sortable: true, disableColumnMenu: true,
			renderCell: (params) => params?.row?.item_master?.item_code

		},
		{
			field: "locdesc", headerName: "Site", width: 150, sortable: true, disableColumnMenu: true,
			renderCell: (params) => params?.row?.location?.loccode

		},
		{
			field: "supname",
			headerName: "Supplier Name",
			width: 250,
			sortable: true,
			disableColumnMenu: true,

		},
		{
			field: "status",
			headerName: "STATUS",
			width: 150,
			sortable: true,
			disableColumnMenu: true,
			renderCell: (params) => (params.row.status === 1 ? "Active" : "Inactive"),
		},
		{
			field: "Action",
			headerName: "Action",
			width: 80,
			sortable: false,
			disableColumnMenu: true,
			renderCell: (params) => {
				const [anchorEl, setAnchorEl] = useState(null);
				const open = Boolean(anchorEl);

				const handleClick = (event) => {
					setAnchorEl(event.currentTarget);
				};

				const handleClose = () => {
					setAnchorEl(null);
				};
				return (
					<>
						<IconButton onClick={handleClick}>
							<Icon fontSize="small">more_vert</Icon>
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							id="action-menu"
							open={open}
							onClose={handleClose}
							PaperProps={{
								elevation: 0,
								sx: {
									overflow: "visible",
									filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
									mt: 1.5,
									"& .MuiAvatar-root": {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									"&:before": {
										content: '""',
										display: "block",
										position: "absolute",
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: "background.paper",
										transform: "translateY(-50%) rotate(45deg)",
										zIndex: 0,
									},
								},
							}}
							transformOrigin={{ horizontal: "right", vertical: "top" }}
							anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
						>
							<MenuItem onClick={() => { handleClose(); handleEdit(params.row.id, 'edit') }}>
								<Icon fontSize="small">edit</Icon> Edit
							</MenuItem>
							<MenuItem onClick={() => { handleEdit(params.row.id, 'view') }}>
								<Icon fontSize="small">visibility</Icon> View
							</MenuItem>
							<MenuItem onClick={() => {
								handleClose(); handleClickOpened(params.row.id)
							}}>
								<Icon fontSize="small">delete</Icon> Delete
							</MenuItem>
						</Menu>
					</>
				);
			},
		},
	];
	const [searchTerm, setSearchTerm] = useState('');
	const filteredRows = useMemo(() => {
		return data.filter((row) => {
			const itemCodeMatch = row.supname;
			const customerName = row.item_master?.item_code;
			return (
				(itemCodeMatch?.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(customerName?.toLowerCase().includes(searchTerm.toLowerCase()))

			)
		});
	}, [searchTerm]);

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
			<Dialog
				open={dialogbox}
				onClose={handleClosing}
				aria-labelledby="delete-dialog-title"
				aria-describedby="delete-dialog-description"
			>
				<DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
				<DialogContent>
					<DialogContentText id="delete-dialog-description">
						Do you really want to delete this {orderData.name}Setting?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClosing} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} disabled={isDeleting} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<MDBox pt={6} pb={3}>
				<Grid container spacing={6}>
					<Grid item xs={12}>
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
								<Grid container spacing={1}>
									<Grid item xs={3} mr={30}>
										<MDTypography variant="h6" color="white">
											<Icon fontSize="small">person</Icon>
											Setting
										</MDTypography>
									</Grid>
									<Grid item xs={1} ml={40}>
										<MDTypography component={Link} to="/master/setting">
											<MDButton variant="gradient" color="light">
												&#x2b;&nbsp;New
											</MDButton>
										</MDTypography>
									</Grid>
									{SelectedUUID == "" ? (
										""
									) : (
										<>
											<Grid item xs={1} ml={5}>
												<MDBox>
													<MDButton
														className="bulk-button"
														aria-haspopup="true"
														onClick={handleClickaction}
														variant="gradient"
														color="light"
													>
														Bulk Actions
													</MDButton>
												</MDBox>
											</Grid>
										</>
									)}
									<Grid item xs={1}>
										<MDBox>
											<IconButton
												onClick={handleClick}
												size="small"
												sx={{ ml: 2 }}
												// aria-controls={open ? 'account-menu' : undefined}
												aria-haspopup="true"
											// aria-expanded={open ? 'true' : undefined}
											>
												<Icon fontSize="small">menu</Icon>
											</IconButton>
										</MDBox>
									</Grid>
								</Grid>
								<Menu
									anchorEl={anchor}
									id="account-menu"
									open={opening}
									onClose={handleclosedd}
									onClick={handleclosedd}
									PaperProps={{
										elevation: 0,
										sx: {
											overflow: "visible",
											filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
											mt: 1.5,
											"& .MuiAvatar-root": {
												width: 32,
												height: 32,
												ml: -0.5,
												mr: 1,
											},
											"&:before": {
												content: '""',
												display: "block",
												position: "absolute",
												top: 0,
												right: 14,
												width: 10,
												height: 10,
												bgcolor: "background.paper",
												transform: "translateY(-50%) rotate(45deg)",
												zIndex: 0,
											},
										},
									}}
									transformOrigin={{ horizontal: "right", vertical: "top" }}
									anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
								>
									<MenuItem onClick={handleClickactionOpen}>Mark as Active</MenuItem>
									<MenuItem onClick={handleClickinactiveOpen}>Mark as Inactive</MenuItem>
								</Menu>
								<Dialog
									className="dialogbox"
									open={actionopen}
									onClose={handleClosing}
									aria-labelledby="alert-dialog-title"
									aria-describedby="alert-dialog-description"
								>
									<Icon className="icon-round" fontSize="larger" color="error">
										error
									</Icon>
									<DialogContent dividers className="dialog-content">
										<Typography gutterBottom style={{ fontSize: "20" }}>
											Are you sure want to mark as active selected Records
										</Typography>
									</DialogContent>
									<DialogActions className="Dialog-Actions">
										<Button autoFocus onClick={handleClosing}>
											No, mistake!
										</Button>
										<Button autoFocus onClick={(e) => handleActiveModalSubmit("active")}>
											Yes, mark as active !
										</Button>
									</DialogActions>
								</Dialog>
								<Dialog
									className="dialogbox"
									open={inactiveopen}
									onClose={handleClosing}
									aria-labelledby="alert-dialog-title"
									aria-describedby="alert-dialog-description"
								>
									<Icon className="icon-round" fontSize="larger" color="error">
										error
									</Icon>
									<DialogContent dividers className="dialog-content">
										<Typography gutterBottom style={{ fontSize: "20" }}>
											Are you sure want to mark as inactive selected Records
										</Typography>
									</DialogContent>
									<DialogActions className="Dialog-Actions">
										<Button autoFocus onClick={handleClosing}>
											No, mistake!
										</Button>
										<Button autoFocus onClick={(e) => handleActiveModalSubmit("inactive")}>
											Yes, mark as inactive !
										</Button>
									</DialogActions>
								</Dialog>
								<Menu
									anchorEl={anchorEl}
									id="account-menu"
									open={open}
									onClose={handleClose}
									// onClick={handleClose}
									PaperProps={{
										elevation: 0,
										sx: {
											overflow: "visible",
											filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
											mt: 1.5,
											"& .MuiAvatar-root": {
												width: 32,
												height: 32,
												ml: -0.5,
												mr: 1,
											},
											"&:before": {
												content: '""',
												display: "block",
												position: "absolute",
												top: 0,
												right: 14,
												width: 10,
												height: 10,
												bgcolor: "background.paper",
												transform: "translateY(-50%) rotate(45deg)",
												zIndex: 0,
											},
										},
									}}
									transformOrigin={{ horizontal: "right", vertical: "top" }}
									anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
								>
									<MenuItem onClick={handleClose}>Import </MenuItem>
									<MenuItem onClick={handleClickOpen}>Export </MenuItem>
									{/* <MenuItem onClick={handleClose}>Download</MenuItem> */}
									<BootstrapDialog
										onClose={handleClosed}
										aria-labelledby="customized-dialog-title"
										open={opened}
									>
										<BootstrapDialogTitle id="customized-dialog-title" onClose={handleClosed}>
											Export
										</BootstrapDialogTitle>
										<DialogContent dividers>
											<MDTypography style={{ fontSize: 17 }} gutterBottom>
												{/* Customer can export their data from Invoice in CSV or XLS format. */}
											</MDTypography>
											<MDBox>
												<hr></hr>
											</MDBox>
											<RadioGroup
												aria-labelledby="demo-radio-buttons-group-label"
												defaultValue=""
												value={selectedValue}
												onChange={handleChanged}
												name="radio-buttons-group"
											>
												<FormControlLabel value="auto" control={<Radio />} label=" Customer" />
												<FormControlLabel
													value="add"
													control={<Radio />}
													label="Specific Customer"
												/>
												{selectedValue === "add" && (
													<>
														<Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
															<Grid item xs={4}>
																<TextField type="date" label="From" sx={{ width: 150 }} />
															</Grid>
															<Grid item xs={4}>
																<TextField type="date" label="To" sx={{ width: 150 }} />
															</Grid>
														</Grid>
													</>
												)}
											</RadioGroup>
											<RadioGroup
												aria-labelledby="demo-radio-buttons-group-label"
												defaultValue=""
												name="radio-buttons-group"
											>
												<FormLabel id="demo-radio-buttons-group-label">Export As :</FormLabel>
												<FormControlLabel
													value="csv"
													control={<Radio />}
													label="CSV (Comma Separated Value)"
												/>
												<FormControlLabel
													value="xls"
													control={<Radio />}
													label="XLS (Microsoft Excel Compatible)"
												/>
											</RadioGroup>
										</DialogContent>
										<DialogActions>
											<MDButton variant="text" color="info" autoFocus onClick={handleClosed}>
												Export
											</MDButton>
											<MDButton variant="text" color="info" autoFocus onClick={handleClosed}>
												Cancel
											</MDButton>
										</DialogActions>
									</BootstrapDialog>
								</Menu>
							</MDBox>
							<MDBox pr={1} sx={{ textAlign: "Right" }}>
								<MDInput
									type="text"
									// label="Order Number"
									variant="outlined"
									name="order_number"
									sx={{ width: 300 }}
									margin="normal"
									placeholder="Search"
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</MDBox>
							<MDBox pt={3}>
								<DataGrid
									localeText={{ noRowsLabel: "No records", }}
									autoHeight
									loading={loading}
									rows={searchTerm != '' ? filteredRows : data}
									columns={columns}
									initialState={{
										pagination: {
											paginationModel: { page: 0, pageSize: 10 },
										},
									}}
									pageSizeOptions={[5, 10, 20]}
									checkboxSelection
									onRowSelectionModelChange={(ids) => handleselection(ids)}
									disableRowSelectionOnClick
									slotProps={{
										columnMenu: {
											sx: {
												'& .MuiDataGrid-menuList': {
													minWidth: '200px', // Set the minimum width for the menu list
												},
												'& .MuiMenuItem-root .MuiTypography-root': {
													fontSize: '14px', // Apply the specific style to the MenuItem within DataGrid
												}
											},
										},
									}}
								/>
							</MDBox>
						</Card>
					</Grid>
				</Grid>
			</MDBox>
		</DashboardLayout>
	);
}
import * as React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FaEdit } from "react-icons/fa";
import JsBarcode from "jsbarcode";

// react-router-dom components
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { axios_get, axios_post } from "../../axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// @mui material components
import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
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
import { Grid, CircularProgress } from "@mui/material";

import { useNavigate } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ToastMassage } from "toast";
import jsPDF from "jspdf";
import { useMemo } from "react";
import MDInput from "components/MDInput";
import AddButtonHeader from "components/AddButtonHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

import { getCurrentUser, getCurrentUserName } from "../../utils/currentUser";
import constantApi from "constantApi";
import axios from "axios";

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

export default function item() {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState("");

  const handleChanged = (event) => {
    setSelectedValue(event.target.value);
  };

  const [opened, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClosed = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [data, setData] = useState([]);
  const [dialogbox, setdialogbox] = useState(false);
  const [actionopen, setActionpen] = useState(false);
  const [inactiveopen, setInactiveopen] = useState(false);
  const [SelectedUUID, setSelectedUUID] = useState([]);
  const [orderData, setorderData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    module: "Item",
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

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
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

  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const getdetails = async (pageNo = page, size = pageSize, search = "") => {
    setLoading(true);

    const response = await axios.get(
      `${constantApi.baseUrl}/item_location_master/pagination_list`,
      {
        params: {
          page: Number(pageNo) + 1,
          limit: Number(size),
          search,
        },
      },
    );

    if (response?.data?.status) {
      const records = response.data.data.map((item) => ({
        ...item,
        id: item.uuid,
        rowId: item.id,
        uuid: item.item_id,
      }));

      setData(records);
      setRowCount(response.data.pagination.totalRecords);
    }

    setLoading(false);
  };

  useEffect(() => {
    getdetails(paginationModel.page, paginationModel.pageSize, searchTerm);
  }, [paginationModel.page, paginationModel.pageSize, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPaginationModel((prev) => ({
      ...prev,
      page: 0, // 🔥 RESET PAGE
    }));
  };

  const [locations, setlocations] = useState([]);
  const [compines, setCompines] = useState([]);

  const fetchcompanyList = async () => {
    const response = await axios_post(true, "company/com_list");
    console.log("fetchcompanyList----", response.data);

    if (response) {
      if (response?.status) {
        const mainCompanies = response.data.filter(
          (company) => company.is_main_comp != "yes",
        );
        setCompines(mainCompanies);
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
  const [itemCategories, setItemCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios_get(true, "item_category/dropdown-list");

      setItemCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    // getdetails();
    fetchCategories();
    fetchcompanyList();
    fetchlocationList();
  }, []);

  // const handleEdit = (id, type) => {
  //   if (type == "edit") {
  //     navigate(`/item/edit/${id}`);
  //   } else if (type === "view") {
  //     navigate(`/item/view/${id}`);
  //   }
  //   } else if (type === "barcode") {
  //     navigate(`/master/barcodeprinter/${id}`);
  //   }
  // };

  // const DPI = 96;
  // const LABEL_WIDTH_IN = 2;
  // const LABEL_HEIGHT_IN = 1;

  // const LABEL_WIDTH = LABEL_WIDTH_IN * DPI; // 192px
  // const LABEL_HEIGHT = LABEL_HEIGHT_IN * DPI; // 96px

  const DPI = 96;

  // label size in millimeters
  const LABEL_WIDTH_MM = 50.8;
  const LABEL_HEIGHT_MM = 25.4;

  // mm → px conversion
  const MM_TO_PX = DPI / 25.4;

  const LABEL_WIDTH = Math.round(LABEL_WIDTH_MM * MM_TO_PX); // ≈ 192px
  const LABEL_HEIGHT = Math.round(LABEL_HEIGHT_MM * MM_TO_PX); // ≈ 96px

  const handleBarCode = async () => {
    if (!SelectedUUID || SelectedUUID.length === 0) {
      alert("Please select at least one item to download.");
      return;
    }

    try {
      for (const uuid of SelectedUUID) {
        const response = await axios_post(
          true,
          "item_location_master/details",
          { uuid },
        );

        if (response.data.status) {
          const { item_barcode_img, item_name, itemprice, itemupc } =
            response.data;

          if (item_barcode_img) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = item_barcode_img;

            img.onload = () => {
              // fixed barcode area (3:2 ratio = 300x200, but here you fixed 300x100)
              const barcodeWidth = 300;
              const barcodeHeight = 100; // keep ratio 3:2 (width:height)

              // canvas size = barcode area + space for text
              canvas.width = barcodeWidth + 40;
              canvas.height = barcodeHeight + 130;

              // white background
              ctx.fillStyle = "#fff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              // item name
              ctx.fillStyle = "#000";
              ctx.font = "bold 16px Arial";
              ctx.textAlign = "center";
              ctx.fillText(item_name, canvas.width / 2, 20);

              // item price
              ctx.font = "14px Arial";
              ctx.fillText(`${itemprice}`, canvas.width / 2, 40);

              // barcode image
              ctx.drawImage(img, 20, 60, barcodeWidth, barcodeHeight);

              // optional UPC below
              // const spacedUPC = itemupc.split("").join(" ");
              // ctx.font = "24px monospace";
              // ctx.fillText(spacedUPC, canvas.width / 2, 60 + barcodeHeight + 30);

              // export + download
              const finalImg = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = finalImg;
              link.download = `barcode_${item_name}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };
          } else {
            alert(`Barcode image not available for ${uuid}`);
          }
        }
      }
    } catch (error) {
      console.error("Error downloading multiple barcodes:", error);
    }
  };

  const drawWrappedText1 = (
    ctx,
    text,
    x,
    startY,
    maxWidth,
    lineHeight,
    maxLines = 2,
  ) => {
    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && line !== "") {
        lines.push(line.trim());
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }

    if (line) lines.push(line.trim());

    // limit number of lines
    lines = lines.slice(0, maxLines);

    lines.forEach((l, i) => {
      ctx.fillText(l, x, startY + i * lineHeight);
    });

    return lines.length; // number of lines drawn
  };

  const drawWrappedText = (
    ctx,
    text,
    x,
    startY,
    maxWidth,
    lineHeight,
    maxLines = 2,
  ) => {
    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && line !== "") {
        lines.push(line.trim());
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }

    if (line) lines.push(line.trim());

    // limit lines
    lines = lines.slice(0, maxLines);

    // add ellipsis if cut
    if (lines.length === maxLines) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, "") + "...";
    }

    lines.forEach((l, i) => {
      ctx.fillText(l, x, startY + i * lineHeight);
    });

    return lines.length;
  };

  const handlePrintToZebra = async (uuid) => {
    try {
      const response = await axios_post(true, "item_location_master/details", {
        uuid,
      });

      const { item_name, itemprice, itemupc } = response.data;

      if (!itemupc) {
        alert("UPC not available to generate barcode!");
        return;
      }

      // ---- LABEL SIZE (2 x 1 inch @ 96 DPI) ----
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = LABEL_WIDTH; // 192px
      canvas.height = LABEL_HEIGHT; // 96px

      // ---- BACKGROUND ----
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      const TOP_SAFE_MARGIN = 6; // px (≈1.6mm) — safe for Zebra

      // ---- ITEM NAME (WRAPPED) ----
      ctx.font = "bold 10px Arial";

      // const nameLines = drawWrappedText(
      //   ctx,
      //   item_name || "",
      //   canvas.width / 2,
      //   10,
      //   canvas.width - 10,
      //   10,
      //   2,
      // );

      const nameStartY = TOP_SAFE_MARGIN + 10;

      const nameLines = drawWrappedText(
        ctx,
        item_name || "",
        canvas.width / 2,
        nameStartY,
        canvas.width - 10,
        10,
        2,
      );

      // ---- PRICE ----
      // const priceY = 10 + nameLines * 10 + 2;
      const priceY = nameStartY + nameLines * 10 + 2;

      ctx.font = "bold 12px Arial";
      ctx.fillText(itemprice || "", canvas.width / 2, priceY);

      // ---- BARCODE ----
      const barcodeCanvas = document.createElement("canvas");
      JsBarcode(barcodeCanvas, itemupc, {
        format: itemupc.length === 12 ? "UPC" : "CODE128",
        width: 1.6,
        height: 32, // ⬅ slightly smaller
        displayValue: false,
        marginTop: 4, // ⬅ critical (quiet zone)
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      });

      const barcodeY = priceY + 8;
      // const barcodeY = priceY + 16;

      const barcodeX = 10;
      const barcodeW = canvas.width - 20;
      const barcodeH = 36;

      ctx.drawImage(barcodeCanvas, barcodeX, barcodeY, barcodeW, barcodeH);

      // ---- UPC TEXT ----
      ctx.font = "bold 12px monospace";
      ctx.fillText(itemupc, canvas.width / 2, barcodeY + barcodeH + 7);

      // ---- DOWNLOAD / PRINT ----
      // downloadCanvas(canvas, item_name);
      downloadCanvasAsPDF(canvas, item_name);

      // printCanvas(canvas);
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  };

  const downloadCanvasAsPDF = (canvas, item_name) => {
    try {
      const imgData = canvas.toDataURL("image/png");

      // 2 x 1 inch label
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [2, 1], // width x height in inches
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        2,
        1, // exact same size
      );

      pdf.save(`barcode_${item_name || "item"}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    }
  };

  const downloadCanvas = (canvas, item_name) => {
    try {
      const finalImg = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = finalImg;
      link.download = `barcode_${item_name || "item"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Canvas export failed (CORS?)", err);
    }
  };

  const handlePrintToZebra1 = async (uuid) => {
    try {
      const response = await axios_post(true, "item_location_master/details", {
        uuid,
      });

      const { item_name, itemprice, itemupc } = response.data;

      if (!itemupc) {
        alert("UPC not available to generate barcode!");
        return;
      }

      // ---- LABEL SIZE (2 x 1 inch) ----
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = LABEL_WIDTH; // 192px
      canvas.height = LABEL_HEIGHT; // 96px

      // ---- BACKGROUND ----
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000";
      ctx.textAlign = "center";

      // ---- ITEM NAME ----
      // ctx.font = "bold 10px Arial";
      // ctx.fillText(item_name || "", canvas.width / 2, 12);

      // ---- ITEM NAME (WRAPPED TO 2 LINES) ----
      ctx.font = "bold 10px Arial";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";

      const nameLines = drawWrappedText(
        ctx,
        item_name || "",
        canvas.width / 2, // center X
        12, // start Y
        canvas.width - 10, // max width (padding)
        10, // line height
        2, // max 2 lines
      );

      // adjust Y for price based on how many lines name used
      const priceY = 12 + nameLines * 10 + 2;

      // ---- PRICE ----
      // ctx.font = "9px Arial";
      // ctx.fillText(itemprice || "", canvas.width / 2, 24);

      // ---- PRICE ----
      ctx.font = "9px Arial";
      ctx.fillText(itemprice || "", canvas.width / 2, priceY);

      // ---- BARCODE CANVAS (DECLARE BEFORE USE!) ----
      const barcodeCanvas = document.createElement("canvas");

      JsBarcode(barcodeCanvas, itemupc, {
        format: itemupc.length === 12 ? "UPC" : "CODE128",
        width: 2,
        height: 40,
        displayValue: false,
        margin: 0,
      });

      // ---- BARCODE POSITION ----
      const barcodeX = 10;
      const barcodeY = 30;
      const barcodeW = canvas.width - 20;
      const barcodeH = 40;

      ctx.drawImage(barcodeCanvas, barcodeX, barcodeY, barcodeW, barcodeH);

      // ---- UPC TEXT ----
      ctx.font = "10px monospace";
      ctx.fillText(itemupc, canvas.width / 2, barcodeY + barcodeH + 10);

      // ---- PRINT ----
      // printCanvas(canvas);
      downloadCanvas(canvas);
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  };

  const printCanvas = (canvas) => {
    const dataUrl = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank", "width=400,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
@media print {
  @page {
    size: 2in 1in;
    margin: 0;
  }

  body {
    margin: 0;
    padding: 0;
  }

  img {
    width: 2in;
    height: 1in;
    object-fit: contain;
  }
}
</style>

      </head>
      <body onload="window.print(); window.close();">
        <img src="${dataUrl}" />
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const handleEdit = (idOrUuid, type) => {
    if (type === "edit") {
      navigate(`/itemlocmaster/edit/${idOrUuid}`);
    } else if (type === "view") {
      navigate(`/itemlocmaster/view/${idOrUuid}`);
    } else if (type === "image") {
      navigate(`/itemlocmaster/image/${idOrUuid}`);
    } else if (type === "barcode") {
      handlePrintToZebra(idOrUuid); // ✅ will now get uuid correctly
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    const { id } = orderData;
    setIsDeleting(true);
    try {
      const response = await axios_post(true, "item/delete", {
        id: id,
      });
      if (response.status === true) {
        getdetails();
        ToastMassage(response.message, "success");
        handleCloseDeleteModal();
        setorderData({});
        setdialogbox(false);
        setIsDeleting(false);
      } else {
        ToastMassage(response.message, "error");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Full user data
  const user = getCurrentUser();
  // Just the id
  console.log("User id:", user?.id);
  const [openEditPrice, setOpenEditPrice] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [editPriceData, setEditPriceData] = useState({
    item_name: "",
    itemprice: "",
    itemnewprice: "",
    batch_no: "",
    company_id: "",
    location_id: "",
    changed_by: "",
  });

  const handleEditClick = (row) => {
    // Get the first batch with stock > 0 (FIFO)
    const availableBatch = row.batches?.find(
      (b) => parseFloat(b.current_in_stock) > 0,
    );

    setRowData(row);
    setEditPriceData({
      item_name: row.item_name,
      item_id: row.item_id, // store actual id for submit

      itemprice: row.itemprice,
      itemnewprice: row.itemprice,
      batch_no: availableBatch?.batch_number || "", // FIFO batch
      company_id: row.company_id,
      location_id: row.location_id,
      changed_by: user?.id, // user id
    });

    setOpenEditPrice(true);
  };

  const handleEditPopupClose = () => setOpenEditPrice(false);

  const handleChange = (e) => {
    setEditPriceData({ ...editPriceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const user = getCurrentUser();
      const dataToSend = {
        ...editPriceData,
        changed_by: user?.id, // ensure current user id
      };

      console.log("Changed data:", dataToSend);

      // Call API to save price history and update item price
      const response = await axios.post(
        `${constantApi.baseUrl}/item_price_history/save`,
        dataToSend,
      );

      if (response.data) {
        console.log("Saved successfully:", response.data);

        // Show toast for success
        ToastMassage("Item price updated successfully", "success");

        // Refresh table data to get latest prices
        await getdetails();
      }

      setOpenEditPrice(false);
    } catch (error) {
      console.error("Error saving item price history:", error);
      ToastMassage("Failed to update item price", "error");
    }
  };

  const getMRPWithTax = (row) => {
    const price = Number(row?.itemprice || 0);
    const taxPercent = Number(row?.tax_master_1?.taxcal || 0);

    return Math.round(price + (price * taxPercent) / 100);
  };

  const handlebarcodeapi1 = (row) => {
    alert("Hi Ashish yadav");
    console.log("rows is --------", row);

    const {
      item_name,
      itemupc,
      itemprice,
      remaining_stock,
      tax_master_1,
      size_master,
    } = row;

    const result = {
      item_name,
      itemupc,
      itemprice,
      remaining_stock,
      tax_master_1,
      size_master,
    };
    console.log("Required data:", result);
  };

  const handlebarcodeapi = async (row) => {
    const {
      item_name,
      itemupc,
      itemprice,
      remaining_stock,
      tax_master_1,
      size_master,
    } = row;
    if (loading) return;

    setLoading(true);

    alert("Hi Ashish yadav");
    console.log("rows is --------", row);
    const result = {
      item_name,
      itemupc,
      itemprice,
      remaining_stock,
      tax_master_1,
      size_master,
    };

    console.log("Required data:", result);
    try {
      const res = await fetch(
        `${constantApi.baseUrl}/item_location_master/print/barcode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        },
      );

      // 🔴 Handle non-200 HTTP status
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Printing failed");
      }

      const data = await res.json();

      if (data.success) {
        alert("✅ Barcode printed successfully");
      } else {
        alert(`❌ ${data.message || "Print failed"}`);
      }
    } catch (err) {
      if (err.message === "Failed to fetch") {
        alert("❌ Print server not reachable. Please check the printer PC.");
      } else {
        alert(`❌ ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "company_id",
      headerName: "Company",
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const company = compines.find(
          (c) => String(c.id) === String(params.row.company_id),
        );

        return company ? company.compdesc : "Unknown Company";
      },
    },

    {
      field: "location_id",
      headerName: "Location",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const location = locations.find(
          (l) => String(l.id) === String(params.row.location_id),
        );

        return location ? location.locname : "Unknown Location";
      },
    },

    {
      field: "itemupc",
      headerName: "UPC",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "item_name",
      headerName: "NAME",
      width: 300,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.item_name,
    },

    {
      field: "itemprice",
      headerName: "PRICE",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{params?.row?.itemprice}</span>
          <FaEdit
            style={{ cursor: "pointer", color: "#007bff" }}
            onClick={() => handleEditClick(params.row)}
          />
        </div>
      ),
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const mrpWithTax = getMRPWithTax(params.row);

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{mrpWithTax}</span>
            {/* <FaEdit
              style={{ cursor: "pointer", color: "#007bff" }}
              onClick={() => handleEditClick(params.row)}
            /> */}
          </div>
        );
      },
    },

    {
      field: "stock",
      headerName: "Total Stock",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.stock,
    },
    {
      field: "distributed_stock",
      headerName: "Trn Stock",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.distributed_stock,
    },
    {
      field: "remaining_stock",
      headerName: "Avl Stock",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => params?.row?.remaining_stock,
    },

    {
      field: "itemcatname",
      headerName: "Category",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const itemCategory = itemCategories.find(
          (c) => String(c.id) === String(params.row.itemcatname),
        );

        return itemCategory ? itemCategory.itemcatname : "Unknown category";
      },
      // renderCell: (params) => params?.row?.itemcategory?.itemcatname,
    },
    // {
    //   field: "company_id",
    //   headerName: "Company Id",
    //   width: 150,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => params?.row?.itemcategory?.itemcatname,
    // },

    {
      field: "updated_at",
      headerName: "Modified DATE",
      width: 150,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) =>
        moment(params?.value).format("DD MMM YYYY hh:mm A"),
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
              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "edit");
                  console.log("id is", params.row.id);
                }}
              >
                <Icon fontSize="small">edit</Icon> Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "image");
                  console.log("id is", params.row.id);
                }}
              >
                <Icon fontSize="small">edit</Icon> Image
              </MenuItem>

              {/* <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "barcode");
                  console.log("id is", params.row.id);
                }}
              >
                <Icon fontSize="small">edit</Icon> Generate barcode
              </MenuItem> */}

              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "barcode"); // ✅ pass uuid instead of id
                  console.log("uuid is", params.row.id);
                }}
              >
                <Icon fontSize="small">qr_code</Icon> Generate Barcode
              </MenuItem>

              {/* <MenuItem
                onClick={() => {
                  handlebarcodeapi(params.row); // ✅ pass uuid instead of id
                }}
              >
                <Icon fontSize="small">qr_code</Icon> Testing Barcode
              </MenuItem> */}

              <MenuItem
                onClick={() => {
                  handleEdit(params.row.id, "view");
                }}
              >
                <Icon fontSize="small">visibility</Icon> View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleClickOpened(params.row);
                }}
              >
                <Icon fontSize="small">delete</Icon> Delete
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  // const [searchTerm, setSearchTerm] = useState("");

  // const filteredRows = useMemo(() => {
  //   return data.filter((row) => {
  //     // const itemCodeMatch = row.item_code;
  //     const itemCodeMatch = row.itemupc;
  //     const itemNameMatch = row.item_name;
  //     return (
  //       itemCodeMatch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       itemNameMatch?.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   });
  // }, [searchTerm]);

  const [importPopup, setImportPopup] = useState(false);
  const [file, setFile] = useState(null);

  const openImportPopup = () => {
    setImportPopup(true);
  };

  const handleImportClose = () => {
    setImportPopup(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkSubmit = async () => {
    if (excelData.length === 0) {
      alert("Please upload a valid Excel file first.");
      return;
    }
    try {
      const response = await axios.post(
        `${constantApi.baseUrl}/item/store-bulk`,
        excelData,
        { headers: { "Content-Type": "application/json" } },
      );

      // ✅ FIX: use "status" instead of "success"
      if (response.data.status && response.data.inserted > 0) {
        ToastMassage("Bulk items uploaded successfully", "success");
      } else if (response.data.status && response.data.inserted === 0) {
        const skippedNames = response.data.skippedItems
          .map((item) => `${item.item_name}: ${item.reason}`)
          .join(", ");

        ToastMassage(
          `All items were skipped. Nothing was uploaded. Reason(s): ${skippedNames}`,
          "warning",
        );
      } else {
        ToastMassage("Some error occurred during upload", "error");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      ToastMassage("Upload failed", "error");
    }
  };

  const importSuppliers = async () => {
    if (!file) {
      toast.error("Please select an Excel file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${constantApi.baseUrl}/supplier/import`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        const inserted = data.data.inserted || 0;
        const duplicates = data.data.duplicates || [];

        toast.success(`Imported ${inserted} suppliers`);
        if (duplicates.length > 0) {
          toast.info(`Duplicate emails skipped: ${duplicates.join(", ")}`);
        }
        setAnchorEl(null);
      } else {
        toast.error(data.message || "Import failed");
      }
    } catch (err) {
      toast.error("Import failed");
      console.error(err);
    }
  };

  const handleExportData1 = () => {
    if (!data || data.length === 0) return;

    const exportData = data.map((item) => ({
      code: item.item_code || "",
      item_name: item.item_name || "",
      uom: item.item_main_prices?.[0]?.item_uom?.name || "",
      company_id: item.company_id || "",
      location_id: item.location_id || "",
      price: item.item_vat_percentage || "",
      stock: item.stock || "",
      tax: item.item_tax || "",
      rate: item.rate || "",
      itemcatname: item.itemcatname || "",
      brandname: item.brandname || "",
      hsncode: item.hsncode || "",
      itemcost: item.itemcost || "",
      itemprice: item.itemprice || "",
      status: item.status === 1 ? "Active" : "Inactive",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "BulkItemsTemplate.xlsx");
  };

  const handleExportData = async () => {
    try {
      setLoading(true);

      // 🔥 Fetch ALL records (not paginated)
      const response = await axios.get(
        `${constantApi.baseUrl}/item_location_master/pagination_list`,
        {
          params: {
            page: 1,
            limit: rowCount || 100000, // use total records
            search: searchTerm, // optional
          },
        },
      );

      if (!response?.data?.status) return;

      const allData = response.data.data;

      const exportData = allData.map((item) => ({
        code: item.item_code || "",
        item_name: item.item_name || "",
        company_id: item.company_id || "",
        location_id: item.location_id || "",
        // price: item.item_vat_percentage || "",
        departname: item.departname,
        stock: item.stock || "",
        distributed_stock: item.distributed_stock || "",
        remaining_stock: item.remaining_stock || "",
        tax: item.item_tax || "",
        rate: item.rate || "",
        // itemcatname: item.itemcatname || "",
        // brandname: item.brandname || "",
        // hsncode: item.hsncode || "",
        itemcost: item.itemcost || "",
        itemlanprice: item.itemlanprice || "",
        itemprice: item.itemprice || "",
        uom: item.item_main_prices?.[0]?.item_uom?.name || "",

        status: item.status === 1 ? "Active" : "Inactive",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(fileData, "BulkItemsTemplate.xlsx");
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Dialog
        open={dialogbox}
        onClose={handleClosing}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Do you really want to delete this {orderData.item_code} Item ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosing} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* You would spread priceColumn into your DataGrid column config */}
      <Dialog
        open={openEditPrice}
        onClose={handleEditPopupClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Item Price</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Item Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="item_name"
                value={editPriceData.item_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Batch No
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="batch_no"
                value={editPriceData.batch_no}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Old Price
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="itemprice"
                value={editPriceData.itemprice}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                New Price
              </Typography>
              <TextField
                fullWidth
                size="small"
                name="itemnewprice"
                value={editPriceData.itemnewprice}
                onChange={handleChange}
              />
            </Grid>

            {/* Show user firstname but store user id */}
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Changed By
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={user?.firstname || ""} // Show firstname
                InputProps={{ readOnly: true }}
              />
              <TextField
                type="hidden"
                name="changed_by"
                value={editPriceData.changed_by} // Store user id
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleEditPopupClose}>
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              color: "#fff", // 👈 text white
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <MDBox className="custome-card" pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* <AddButtonHeader title="All Items" buttonText="New" buttonAction="/master/item" /> */}
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
                  <Grid item xs={4} mr={40}>
                    <MDTypography variant="h6" color="white">
                      <Icon fontSize="small">person</Icon>
                      Item Location Master
                    </MDTypography>
                  </Grid>
                  <Grid item xs={1} ml={40}>
                    <MDTypography component={Link} to="/master/item">
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
                            className="Generate-Barcode"
                            aria-haspopup="true"
                            onClick={handleBarCode}
                            variant="gradient"
                            color="light"
                            disabled={loading} // disable button when loading
                          >
                            {loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "Generate Barcode"
                            )}
                          </MDButton>
                        </MDBox>
                      </Grid>

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
                  <MenuItem onClick={handleClickactionOpen}>
                    Mark as Active
                  </MenuItem>
                  <MenuItem onClick={handleClickinactiveOpen}>
                    Mark as Inactive
                  </MenuItem>
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
                    <Button
                      autoFocus
                      onClick={(e) => handleActiveModalSubmit("active")}
                    >
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
                    <Button
                      autoFocus
                      onClick={(e) => handleActiveModalSubmit("inactive")}
                    >
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
                  <MenuItem onClick={openImportPopup}>Import</MenuItem>

                  <BootstrapDialog
                    onClose={handleImportClose}
                    aria-labelledby="customized-dialog-title"
                    open={importPopup} // use importPopup instead of opened
                  >
                    <BootstrapDialogTitle
                      id="customized-dialog-title"
                      onClose={handleImportClose}
                    >
                      Import Items
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      <MDTypography style={{ fontSize: 17 }} gutterBottom>
                        Select an Excel (.xlsx) file to import Items data.
                      </MDTypography>

                      <MDBox mt={2}>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileChange}
                        />
                      </MDBox>
                    </DialogContent>

                    <DialogActions>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleBulkSubmit}
                      >
                        Import
                      </MDButton>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleImportClose}
                      >
                        Cancel
                      </MDButton>
                    </DialogActions>
                  </BootstrapDialog>

                  {/* this is directly export the data in excell */}
                  <MenuItem onClick={handleExportData}>Export</MenuItem>

                  {/* this below code is use for export the data in different format but its not working */}
                  {/* <MenuItem onClick={handleClickOpen}>Export</MenuItem> */}
                  <BootstrapDialog
                    onClose={handleClosed}
                    aria-labelledby="customized-dialog-title"
                    open={opened}
                  >
                    <BootstrapDialogTitle
                      id="customized-dialog-title"
                      onClose={handleClosed}
                    >
                      Export
                    </BootstrapDialogTitle>
                    <DialogContent dividers>
                      <MDTypography style={{ fontSize: 17 }} gutterBottom>
                        {/* Order Display can export data from Invoice in CSV or XLS format. */}
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
                        <FormControlLabel
                          value="auto"
                          control={<Radio />}
                          label=" Order"
                        />
                        <FormControlLabel
                          value="add"
                          control={<Radio />}
                          label="Specific Order"
                        />
                        {selectedValue === "add" && (
                          <>
                            <Grid
                              container
                              rowSpacing={2}
                              columnSpacing={{ xs: 1, sm: 2, md: 1 }}
                            >
                              <Grid item xs={4}>
                                <TextField
                                  type="date"
                                  label="From"
                                  sx={{ width: 150 }}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  type="date"
                                  label="To"
                                  sx={{ width: 150 }}
                                />
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
                        <FormLabel id="demo-radio-buttons-group-label">
                          Export As :
                        </FormLabel>
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
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleClosed}
                      >
                        Export
                      </MDButton>
                      <MDButton
                        variant="text"
                        color="info"
                        autoFocus
                        onClick={handleClosed}
                      >
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
                  // onChange={(e) => setSearchTerm(e.target.value)}
                  onChange={handleSearchChange} // ✅ FIX
                />
              </MDBox>
              <MDBox pt={3}>
                {/* <DataGrid
                  localeText={{ noRowsLabel: "No records" }}
                  autoHeight
                  loading={loading}
                  rows={searchTerm != "" ? filteredRows : data}
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
                        "& .MuiDataGrid-menuList": {
                          minWidth: "200px", // Set the minimum width for the menu list
                        },
                        "& .MuiMenuItem-root .MuiTypography-root": {
                          fontSize: "14px", // Apply the specific style to the MenuItem within DataGrid
                        },
                      },
                    },
                  }}
                /> */}

                <DataGrid
                  autoHeight
                  loading={loading}
                  rows={data}
                  // rows={searchTerm != "" ? filteredRows : data}
                  columns={columns}
                  paginationMode="server"
                  rowCount={rowCount}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

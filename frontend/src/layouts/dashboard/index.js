// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useEffect } from "react";
import axios, { axios_post } from "../../axios";
import { useState } from "react";

import car from "../../assets/Trip/sport-car.png";
import train from "../../assets/Trip/rail.png";
import flight from "../../assets/Trip/travelling.png";
import hotel from "../../assets/Trip/hotel.png";
import constantApi from "../../constantApi";
import InvoiceDashboard from "pages/invoice/InvoiceDashboard";
import InvoiceChartCard from "pages/invoice/InvoiceChartCard";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const navigate = useNavigate();

  const getdetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "dashboard/list");
    if (response) {
      if (response.status) {
        const records = response?.data;
        setData(records);
        setLoading(false);
      } else {
        // ToastMassage(response.message, 'error')
        setLoading(false);
      }
    }
  };

  const getInvoiceDetails = async () => {
    setLoading(true);
    const response = await axios_post(true, "invoice/list");
    // console.log(
    //   "response from the invoice in dashbaord is ---",
    //   response?.data
    // );

    if (response) {
      if (response.status) {
        const { records } = response?.data;
        setInvoiceData(records);
        setLoading(false);
      } else {
        ToastMassage(response.message, "error");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getdetails();
    getInvoiceDetails();
    let token = localStorage.getItem("token");
    if (token == null) {
      navigate("/auth/login");
    }
  }, []);

  const [queueData, setQueueData] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchQueueData = async () => {
    try {
      const response = await axios.get(`${constantApi.baseUrl}/queue/list`);
      if (response.data.success) {
        setQueueData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching queue list:", error);
      toast.error("Failed to fetch queue list");
    }
  };

  // Calculate the current page's items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = queueData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page navigation
  const handleNext = () => {
    if (indexOfLastItem < queueData.length) setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdate((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const updateStatus = async (id) => {
    const newStatus = statusUpdate[id];
    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await axios.post(`${constantApi.baseUrl}/queue/update`, {
        id,
        status: newStatus,
      });

      if (response.data.success) {
        const updated = queueData.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        setQueueData(updated);

        setStatusUpdate((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });

        toast.success("Status updated successfully!");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox className="custome-card" py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={() => navigate("/order")}
              sx={{ cursor: "pointer" }}
            >
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Orders"
                count={data?.order}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={() => navigate("/invoice")}
              sx={{ cursor: "pointer" }}
            >
              <ComplexStatisticsCard
                icon="leaderboard"
                title="invoice"
                count={data?.invoice}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={() => navigate("/customer")}
              sx={{ cursor: "pointer" }}
            >
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Customer"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={() => navigate("/itemlocationmaster")}
              sx={{ cursor: "pointer" }}
            >
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Item"
                count={data?.item}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* invoice details is here */}
        <Grid item xs={12} md={6} lg={4} mt={12}>
          <InvoiceChartCard />
        </Grid>

        {/* <InvoiceDashboard /> */}

        {/* //here */}

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Order"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="GRN"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Customer Revenue"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}

        <MDBox className="custome-card mt-6" py={3}>
          <Grid container spacing={3}>
            {/* Flight */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox
                onClick={() =>
                  window.open(`${constantApi.tripUrl}?status=Flight`, "_blank")
                }
                className="cursor-pointer transition-transform hover:scale-105"
                mb={1.5}
              >
                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center">
                  <img src={flight} alt="Flight" className="w-12 h-12 mb-2" />

                  <h2 className="font-semibold text-lg text-gray-800">
                    Flight
                  </h2>
                  <p className="text-sm text-gray-500">
                    Explore flight options
                  </p>
                </div>
              </MDBox>
            </Grid>

            {/* Car */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox
                onClick={() =>
                  window.open(`${constantApi.tripUrl}?status=Car`, "_blank")
                }
                className="cursor-pointer transition-transform hover:scale-105"
                mb={1.5}
              >
                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center">
                  <img src={car} alt="Car" className="w-12 h-12 mb-2" />
                  <h2 className="font-semibold text-lg text-gray-800">Car</h2>
                  <p className="text-sm text-gray-500">Available rental cars</p>
                </div>
              </MDBox>
            </Grid>

            {/* Hotel */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox
                onClick={() =>
                  window.open(`${constantApi.tripUrl}?status=Hotel`, "_blank")
                }
                className="cursor-pointer transition-transform hover:scale-105"
                mb={1.5}
              >
                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center">
                  <img src={hotel} alt="Hotel" className="w-12 h-12 mb-2" />
                  <h2 className="font-semibold text-lg text-gray-800">Hotel</h2>
                  <p className="text-sm text-gray-500">View hotel packages</p>
                </div>
              </MDBox>
            </Grid>

            {/* Train */}
            <Grid item xs={12} md={6} lg={3}>
              <MDBox
                onClick={() =>
                  window.open(`${constantApi.tripUrl}?status=Train`, "_blank")
                }
                className="cursor-pointer transition-transform hover:scale-105"
                mb={1.5}
              >
                <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center">
                  <img src={train} alt="Train" className="w-12 h-12 mb-2" />
                  <h2 className="font-semibold text-lg text-gray-800">Train</h2>
                  <p className="text-sm text-gray-500">Check train bookings</p>
                </div>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* order details set here */}
        <div className="max-w-5xl mx-auto">
          <ToastContainer position="top-right" />
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Queue Details
          </h2>

          {currentItems.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders in queue.</p>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item, index) => {
                const effectiveStatus = statusUpdate[item.id] || item.status;
                const cardBg =
                  effectiveStatus === "ready"
                    ? "bg-green-600 text-white"
                    : effectiveStatus === "completed"
                    ? "bg-green-100 text-gray-800"
                    : "bg-yellow-100 text-gray-800";

                return (
                  <div
                    key={item.id}
                    className={`w-full p-4 rounded-lg shadow-md border ${cardBg} flex flex-col sm:flex-row sm:justify-between sm:items-center`}
                  >
                    <div className="flex-1 mb-2 sm:mb-0">
                      <p className="text-xs font-semibold">
                        # {indexOfFirstItem + index + 1}
                      </p>
                      <p className="text-sm font-medium text-blue-800">
                        Order No: {item.order_no}
                      </p>
                      <p className="text-xs text-gray-600">
                        Created At: {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      {effectiveStatus !== "ready" ? (
                        <>
                          <select
                            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-black disabled:bg-gray-100"
                            value={effectiveStatus}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value)
                            }
                            disabled={effectiveStatus === "ready"}
                          >
                            <option value="preparing">Preparing</option>
                            <option value="completed">Completed</option>
                            <option value="ready">Ready</option>
                          </select>

                          <button
                            onClick={() => updateStatus(item.id)}
                            disabled={loadingIds[item.id]}
                            className={`px-3 py-1 rounded text-white text-xs transition ${
                              loadingIds[item.id]
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {loadingIds[item.id] ? "Updating..." : "Update"}
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-green-800">
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 rounded disabled:cursor-not-allowed text-xs"
                >
                  Prev
                </button>
                <button
                  onClick={handleNext}
                  disabled={indexOfLastItem >= queueData.length}
                  className="px-4 py-2 bg-gray-300 rounded disabled:cursor-not-allowed text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;

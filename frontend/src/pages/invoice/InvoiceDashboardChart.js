import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { axios_post } from "../../axios";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import MDBox from "components/MDBox";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);
dayjs.extend(isoWeek);

const InvoiceDashboardChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ label: "Invoices", color: "info", data: [] }],
  });

  const getInvoiceDetails = async () => {
    const response = await axios_post(true, "invoice/list");
    if (response?.status) {
      const { records } = response?.data;
      processChartData(records);
    }
  };

  const processChartData = (records) => {
    const now = dayjs();

    const counts = {
      Today: 0,
      "This Week": 0,
      "This Month": 0,
      "Last 3 Months": 0,
      "Last 6 Months": 0,
      "This Year": 0,
    };

    records.forEach((invoice) => {
      const created = dayjs(invoice.created_at);
      if (created.isSame(now, "day")) counts["Today"]++;
      if (created.isSame(now, "week")) counts["This Week"]++;
      if (created.isSame(now, "month")) counts["This Month"]++;
      if (created.isSameOrAfter(now.subtract(3, "month")))
        counts["Last 3 Months"]++;
      if (created.isSameOrAfter(now.subtract(6, "month")))
        counts["Last 6 Months"]++;
      if (created.isSame(now, "year")) counts["This Year"]++;
    });

    setChartData({
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Invoices",
          color: "info",
          data: Object.values(counts),
        },
      ],
    });
  };

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  return (
    <MDBox mt={4}>
      <ReportsBarChart
        color="info"
        title="Invoice Summary"
        description="Invoices grouped by time period"
        date="Updated now"
        chart={chartData}
      />
    </MDBox>
  );
};

export default InvoiceDashboardChart;

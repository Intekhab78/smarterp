import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import { axios_post } from "../../axios";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import MDBox from "components/MDBox";

// Extend dayjs with required plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);
dayjs.extend(isoWeek);

function InvoiceChartCard() {
  const [chartData, setChartData] = useState({
    labels: [
      "Today",
      "This Week",
      "This Month",
      "Last 3 Months",
      "Last 6 Months",
      "This Year",
    ],
    datasets: {
      label: "Invoices",
      data: [0, 0, 0, 0, 0, 0],
    },
  });

  const getInvoiceDetails = async () => {
    try {
      const response = await axios_post(true, "invoice/list");
      if (response?.status) {
        const { records } = response.data;
        // console.log("Invoice Records:", records);
        if (Array.isArray(records)) {
          processInvoiceData(records);
        }
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  const processInvoiceData = (records) => {
    const now = dayjs();

    const startOfWeek = now.startOf("isoWeek");
    const endOfWeek = now.endOf("isoWeek");

    const counters = {
      Today: 0,
      "This Week": 0,
      "This Month": 0,
      "Last 3 Months": 0,
      "Last 6 Months": 0,
      "This Year": 0,
    };

    records.forEach((invoice) => {
      if (!invoice.created_at) return;
      const created = dayjs(invoice.created_at);

      if (created.isSame(now, "day")) counters["Today"]++;
      if (
        created.isSameOrAfter(startOfWeek) &&
        created.isSameOrBefore(endOfWeek)
      )
        counters["This Week"]++;
      if (created.isSame(now, "month")) counters["This Month"]++;
      if (created.isSameOrAfter(now.subtract(3, "month")))
        counters["Last 3 Months"]++;
      if (created.isSameOrAfter(now.subtract(6, "month")))
        counters["Last 6 Months"]++;
      if (created.isSame(now, "year")) counters["This Year"]++;
    });

    // console.log("Invoice Count by Period:", counters);

    setChartData({
      labels: Object.keys(counters),
      datasets: {
        label: "Invoices",
        data: Object.values(counters),
        borderRadius: 4,
        barThickness: 120, // 👈 increase this value (e.g., 40 or 50)
      },
    });
  };

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  return (
    <MDBox mb={3}>
      <ReportsBarChart
        color="primary"
        title="Invoice"
        description="Invoices by time period"
        date="updated now"
        chart={chartData}
        options={{
          scales: {
            x: {
              barThickness: 40,
              maxBarThickness: 50,
            },
          },
        }}
      />
    </MDBox>
  );
}

export default InvoiceChartCard;

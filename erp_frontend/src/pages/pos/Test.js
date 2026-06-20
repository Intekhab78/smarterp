// src/pages/Dashboard.jsx
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import {
  FaUsers,
  FaDollarSign,
  FaShoppingCart,
  FaUserTie,
  FaBell,
  FaTasks,
  FaBars,
  FaHome,
  FaChartLine,
  FaBoxOpen,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dummy Data
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
  ];

  const performanceData = [
    { name: "Production", value: 80 },
    { name: "Sales", value: 65 },
    { name: "HR", value: 50 },
    { name: "Support", value: 70 },
  ];

  const notifications = [
    { message: "New order #1024 received", time: "2 min ago", type: "info" },
    {
      message: "Employee John Doe completed task",
      time: "30 min ago",
      type: "success",
    },
    { message: "Server backup completed", time: "1 hour ago", type: "success" },
    {
      message: "Pending invoice #120 overdue",
      time: "3 hours ago",
      type: "warning",
    },
  ];

  const teamSummary = [
    { title: "Total Employees", value: "128", color: "bg-purple-500" },
    { title: "Departments", value: "6", color: "bg-blue-500" },
    { title: "Active Users", value: "95", color: "bg-green-500" },
    { title: "Projects Running", value: "12", color: "bg-yellow-400" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="flex h-screen ">
        {/* Main Content */}
        <div className="flex-1 flex flex-col ">
          {/* Top Navbar */}
          <header className="flex items-center justify-between bg-white p-4 shadow-md ">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-700 lg:hidden"
              >
                <FaBars size={24} />
              </button>
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="flex items-center space-x-4">
              <FaBell size={20} className="text-gray-600" />
              <img
                src="https://i.pravatar.cc/40"
                alt="User"
                className="rounded-full w-10 h-10 border-2 border-blue-400"
              />
            </div>
          </header>

          <main className="p-6 space-y-8 bg-gray-100 min-h-screen">
            {/* About ERP */}
            {/* About ERP - Attractive Version */}
            <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-white text-blue-600 p-3 rounded-full shadow-lg">
                    <FaCog size={24} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    About Our ERP
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                  Our ERP platform integrates all core business processes,
                  including{" "}
                  <span className="font-semibold">
                    finance, HR, production, and sales
                  </span>
                  , into a single seamless system. Access{" "}
                  <span className="font-semibold">real-time insights</span>,
                  automate workflows, and empower smarter decisions across your
                  organization.
                </p>
                <div className="mt-4">
                  <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition">
                    Learn More
                  </button>
                </div>
              </div>
            </section>

            {/* Products, Pricing & Features */}
            <section className="space-y-8">
              {/* Products */}
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Our Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Inventory Manager",
                      desc: "Manage your stock and warehouse efficiently",
                      icon: <FaBoxOpen size={24} className="text-blue-500" />,
                    },
                    {
                      name: "Sales Tracker",
                      desc: "Monitor sales and revenue in real-time",
                      icon: (
                        <FaChartLine size={24} className="text-green-500" />
                      ),
                    },
                    {
                      name: "HR & Payroll",
                      desc: "Automate employee management and payroll",
                      icon: <FaUserTie size={24} className="text-purple-500" />,
                    },
                  ].map((product, i) => (
                    <div
                      key={i}
                      className="p-4 border rounded-2xl hover:shadow-lg transition-shadow duration-300 flex flex-col items-start"
                    >
                      <div className="mb-2">{product.icon}</div>
                      <h3 className="font-semibold text-gray-700">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Pricing Plans
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      plan: "Basic",
                      price: "$29/mo",
                      features: [
                        "Up to 10 users",
                        "Basic Analytics",
                        "Email Support",
                      ],
                      color: "border-blue-500",
                    },
                    {
                      plan: "Pro",
                      price: "$59/mo",
                      features: [
                        "Up to 50 users",
                        "Advanced Analytics",
                        "Priority Support",
                      ],
                      color: "border-green-500",
                    },
                    {
                      plan: "Enterprise",
                      price: "$99/mo",
                      features: [
                        "Unlimited users",
                        "Full Analytics",
                        "Dedicated Support",
                      ],
                      color: "border-purple-500",
                    },
                  ].map((plan, i) => (
                    <div
                      key={i}
                      className={`border-2 ${plan.color} p-5 rounded-2xl hover:shadow-lg transition-shadow duration-300`}
                    >
                      <h3 className="text-lg font-semibold text-gray-700">
                        {plan.plan}
                      </h3>
                      <p className="text-2xl font-bold mt-2">{plan.price}</p>
                      <ul className="mt-3 text-sm text-gray-500 space-y-1">
                        {plan.features.map((f, idx) => (
                          <li key={idx}>• {f}</li>
                        ))}
                      </ul>
                      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                        Choose Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Real-Time Analytics",
                      desc: "Monitor business metrics in real-time",
                      icon: <FaChartLine size={24} className="text-blue-500" />,
                    },
                    {
                      title: "Automated Workflows",
                      desc: "Reduce manual tasks with automation",
                      icon: <FaTasks size={24} className="text-green-500" />,
                    },
                    {
                      title: "Multi-Department Access",
                      desc: "Control permissions for each department",
                      icon: <FaUserTie size={24} className="text-purple-500" />,
                    },
                    {
                      title: "Secure Cloud Storage",
                      desc: "All your data is safe in the cloud",
                      icon: <FaFileAlt size={24} className="text-yellow-500" />,
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start p-4 border rounded-2xl hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="mb-2">{feature.icon}</div>
                      <h3 className="font-semibold text-gray-700">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Customers",
                  value: "1,240",
                  color: "from-blue-500 to-blue-400",
                  icon: <FaUsers size={24} />,
                },
                {
                  title: "Monthly Revenue",
                  value: "$84,300",
                  color: "from-green-500 to-green-400",
                  icon: <FaDollarSign size={24} />,
                },
                {
                  title: "Pending Orders",
                  value: "72",
                  color: "from-yellow-400 to-yellow-300",
                  icon: <FaShoppingCart size={24} />,
                },
                {
                  title: "Employees",
                  value: "128",
                  color: "from-purple-500 to-purple-400",
                  icon: <FaUserTie size={24} />,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-r ${card.color} text-white p-5 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center justify-between`}
                >
                  <div>
                    <h2 className="text-lg">{card.title}</h2>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                    <p className="text-xs mt-1 opacity-80">
                      Compared to last month
                    </p>
                  </div>
                  <div className="opacity-70">{card.icon}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                  Sales Overview
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Tracks monthly sales performance and highlights growth trends.
                </p>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" stroke="#8884d8" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#6366F1"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                  Department Performance
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Visualizes department productivity and goal achievements.
                </p>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#10B981"
                      barSize={40}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamSummary.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-start hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="text-xs text-gray-400">{item.title}</span>
                  <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
                </div>
              ))}
            </div>

            {/* Recent Transactions & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transactions Table */}
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Recent Transactions
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Latest transactions from customers and pending orders.
                </p>
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-600 border-b">
                      <th className="py-3">Date</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        date: "2025-10-24",
                        name: "John Doe",
                        amount: "$1200",
                        status: "Completed",
                      },
                      {
                        date: "2025-10-23",
                        name: "Ava Smith",
                        amount: "$980",
                        status: "Pending",
                      },
                      {
                        date: "2025-10-22",
                        name: "Mark Wilson",
                        amount: "$1500",
                        status: "Cancelled",
                      },
                      {
                        date: "2025-10-21",
                        name: "Emily Clark",
                        amount: "$780",
                        status: "Completed",
                      },
                      {
                        date: "2025-10-20",
                        name: "Michael Brown",
                        amount: "$450",
                        status: "Pending",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-3">{row.date}</td>
                        <td>{row.name}</td>
                        <td>{row.amount}</td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              row.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : row.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notifications Panel */}
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Notifications & Alerts
                </h2>
                <ul className="space-y-2 text-sm text-gray-600 max-h-96 overflow-y-auto">
                  {notifications.map((note, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p>{note.message}</p>
                        <span className="text-xs text-gray-400">
                          {note.time}
                        </span>
                      </div>
                      <FaBell
                        className={`ml-2 ${
                          note.type === "success"
                            ? "text-green-500"
                            : note.type === "warning"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                {[
                  "Add Order",
                  "New Invoice",
                  "Add Employee",
                  "Generate Report",
                ].map((action, i) => (
                  <button
                    key={i}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}

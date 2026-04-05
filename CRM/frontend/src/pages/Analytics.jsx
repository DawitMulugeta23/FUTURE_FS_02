// src/pages/Analytics.jsx
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiDownload,
  FiPieChart,
  FiRefreshCw,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import { fetchAnalytics } from "../store/slices/leadSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.leads);
  const [timeRange, setTimeRange] = useState("all");
  const [chartType, setChartType] = useState("bar");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [dispatch, timeRange]);

  const fetchAnalyticsData = () => {
    dispatch(fetchAnalytics({ range: timeRange })).then(() => {
      setLastUpdated(new Date());
    });
  };

  const handleRefresh = () => fetchAnalyticsData();
  const handleTimeRangeChange = (e) => setTimeRange(e.target.value);

  const handleExport = () => {
    const csvData = [
      ["Metric", "Value"],
      ["Total Leads", analytics?.total || 0],
      ["New Leads (30 days)", analytics?.recent || 0],
      ["Conversion Rate", `${analytics?.conversionRate || 0}%`],
      ["New", analytics?.byStatus?.new || 0],
      ["Contacted", analytics?.byStatus?.contacted || 0],
      ["Qualified", analytics?.byStatus?.qualified || 0],
      ["Converted", analytics?.byStatus?.converted || 0],
      ["Lost", analytics?.byStatus?.lost || 0],
    ];

    if (analytics?.bySource?.length > 0) {
      csvData.push(["", ""]);
      csvData.push(["Source", "Count"]);
      analytics.bySource.forEach((source) =>
        csvData.push([source._id, source.count]),
      );
    }

    const csvString = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading && !analytics?.total) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                  >
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Prepare data for charts - ensure we have valid numbers
  const statusData = {
    labels: ["New", "Contacted", "Qualified", "Converted", "Lost"],
    datasets: [
      {
        label: "Number of Leads",
        data: [
          analytics?.byStatus?.new || 0,
          analytics?.byStatus?.contacted || 0,
          analytics?.byStatus?.qualified || 0,
          analytics?.byStatus?.converted || 0,
          analytics?.byStatus?.lost || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(37, 99, 235)",
          "rgb(217, 119, 6)",
          "rgb(124, 58, 237)",
          "rgb(5, 150, 105)",
          "rgb(220, 38, 38)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const sourceData = {
    labels:
      analytics?.bySource?.map((s) => {
        const label = s._id?.replace(/_/g, " ") || "Unknown";
        return label.charAt(0).toUpperCase() + label.slice(1);
      }) || [],
    datasets: [
      {
        data: analytics?.bySource?.map((s) => s.count) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(14, 165, 233, 0.8)",
        ],
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#374151",
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} leads`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#374151",
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Number of Leads",
          color: document.documentElement.classList.contains("dark")
            ? "#9ca3af"
            : "#6b7280",
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#374151",
        },
        title: {
          display: true,
          text: "Lead Status",
          color: document.documentElement.classList.contains("dark")
            ? "#9ca3af"
            : "#6b7280",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#374151",
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} leads (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FiPieChart className="mr-3 h-8 w-8 text-primary-600" />
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Track your lead performance and conversion metrics
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                >
                  <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <FiDownload className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Leads"
                value={analytics?.total || 0}
                icon={FiUsers}
                color="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/20"
              />
              <StatCard
                title="New Leads (30d)"
                value={analytics?.recent || 0}
                icon={FiClock}
                color="text-yellow-600"
                bgColor="bg-yellow-100 dark:bg-yellow-900/20"
              />
              <StatCard
                title="Converted"
                value={analytics?.byStatus?.converted || 0}
                icon={FiUserCheck}
                color="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/20"
              />
              <StatCard
                title="Conversion Rate"
                value={`${analytics?.conversionRate || 0}%`}
                icon={FiTrendingUp}
                color="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/20"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiBarChart2 className="mr-2 h-5 w-5 text-primary-600" />
                    Leads by Status
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setChartType("bar")}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === "bar"
                          ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title="Bar Chart"
                    >
                      <FiBarChart2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setChartType("pie")}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === "pie"
                          ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title="Pie Chart"
                    >
                      <FiPieChart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  {analytics?.total > 0 ? (
                    chartType === "bar" ? (
                      <Bar data={statusData} options={barOptions} />
                    ) : (
                      <Pie data={statusData} options={pieOptions} />
                    )
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        No data available. Add some leads to see analytics.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FiActivity className="mr-2 h-5 w-5 text-primary-600" />
                  Leads by Source
                </h2>
                <div className="h-80">
                  {analytics?.bySource?.length > 0 ? (
                    <Pie data={sourceData} options={pieOptions} />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        No source data available. Add leads with different
                        sources.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Statistics Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiCalendar className="mr-2 h-5 w-5 text-primary-600" />
                Detailed Statistics
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Count
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Percentage
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Visualization
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: "new", label: "New", color: "bg-blue-500" },
                      {
                        key: "contacted",
                        label: "Contacted",
                        color: "bg-yellow-500",
                      },
                      {
                        key: "qualified",
                        label: "Qualified",
                        color: "bg-purple-500",
                      },
                      {
                        key: "converted",
                        label: "Converted",
                        color: "bg-green-500",
                      },
                      { key: "lost", label: "Lost", color: "bg-red-500" },
                    ].map((status) => {
                      const count = analytics?.byStatus?.[status.key] || 0;
                      const percentage = analytics?.total
                        ? ((count / analytics.total) * 100).toFixed(1)
                        : 0;
                      return (
                        <tr
                          key={status.key}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full ${status.color} mr-2`}
                              ></div>
                              <span className="text-gray-900 dark:text-white capitalize">
                                {status.label}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {count}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {percentage}%
                          </td>
                          <td className="py-3 px-4 w-48">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${status.color}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t dark:border-gray-700">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Total
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {analytics?.total || 0}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        100%
                      </td>
                      <td className="py-3 px-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Source Breakdown Cards */}
              {analytics?.bySource?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Source Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analytics.bySource.map((source) => {
                      const percentage = analytics.total
                        ? ((source.count / analytics.total) * 100).toFixed(1)
                        : 0;
                      return (
                        <div
                          key={source._id}
                          className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-1">
                            {source._id?.replace(/_/g, " ") || "Unknown"}
                          </p>
                          <div className="flex items-baseline justify-between">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {source.count}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {percentage}% of total
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                            <div
                              className="bg-primary-600 h-1.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
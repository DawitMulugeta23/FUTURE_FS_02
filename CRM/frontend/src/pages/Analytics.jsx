// src/pages/Analytics.jsx
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
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
    FiUsers
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import { fetchAnalytics } from '../store/slices/leadSlice';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Analytics = () => {
    const dispatch = useDispatch();
    const { analytics, loading } = useSelector(state => state.leads);
    const [timeRange, setTimeRange] = useState('30days');
    const [chartType, setChartType] = useState('bar');

    useEffect(() => {
        dispatch(fetchAnalytics());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchAnalytics());
    };

    const handleExport = () => {
        // Create CSV data
        const csvData = [
            ['Metric', 'Value'],
            ['Total Leads', analytics?.total || 0],
            ['New Leads (30 days)', analytics?.recent || 0],
            ['Conversion Rate', `${analytics?.conversionRate || 0}%`],
            ['New', analytics?.byStatus?.new || 0],
            ['Contacted', analytics?.byStatus?.contacted || 0],
            ['Qualified', analytics?.byStatus?.qualified || 0],
            ['Converted', analytics?.byStatus?.converted || 0],
            ['Lost', analytics?.byStatus?.lost || 0],
        ];

        // Add source data
        if (analytics?.bySource?.length > 0) {
            csvData.push(['', '']);
            csvData.push(['Source', 'Count']);
            analytics.bySource.forEach(source => {
                csvData.push([source._id, source.count]);
            });
        }

        // Convert to CSV string
        const csvString = csvData.map(row => row.join(',')).join('\n');
        
        // Create and download file
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const StatCard = ({ title, value, icon: Icon, color, bgColor, trend }) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`${bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {title}
            </p>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8 animate-pulse"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const statusData = {
        labels: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
        datasets: [
            {
                label: 'Leads by Status',
                data: [
                    analytics?.byStatus?.new || 0,
                    analytics?.byStatus?.contacted || 0,
                    analytics?.byStatus?.qualified || 0,
                    analytics?.byStatus?.converted || 0,
                    analytics?.byStatus?.lost || 0,
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',  // blue
                    'rgba(245, 158, 11, 0.8)',  // yellow
                    'rgba(139, 92, 246, 0.8)',  // purple
                    'rgba(16, 185, 129, 0.8)',  // green
                    'rgba(239, 68, 68, 0.8)',   // red
                ],
                borderColor: [
                    'rgb(37, 99, 235)',
                    'rgb(217, 119, 6)',
                    'rgb(124, 58, 237)',
                    'rgb(5, 150, 105)',
                    'rgb(220, 38, 38)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const sourceData = {
        labels: analytics?.bySource?.map(s => s._id.replace('_', ' ')) || [],
        datasets: [
            {
                data: analytics?.bySource?.map(s => s.count) || [],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
                },
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#374151',
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            
            <div className="flex">
                <Sidebar />
                
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <FiPieChart className="mr-3 h-8 w-8 text-primary-600" />
                                    Analytics Dashboard
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    Track your lead performance and conversion metrics
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             focus:outline-none focus:ring-2 focus:ring-primary-500
                                             dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                    <option value="90days">Last 90 Days</option>
                                    <option value="year">This Year</option>
                                    <option value="all">All Time</option>
                                </select>
                                <button
                                    onClick={handleRefresh}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                                             rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                                             transition-colors flex items-center space-x-2"
                                >
                                    <FiRefreshCw className="h-4 w-4" />
                                    <span>Refresh</span>
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg 
                                             hover:bg-primary-700 transition-colors flex items-center space-x-2"
                                >
                                    <FiDownload className="h-4 w-4" />
                                    <span>Export CSV</span>
                                </button>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Total Leads"
                                value={analytics?.total || 0}
                                icon={FiUsers}
                                color="text-blue-600"
                                bgColor="bg-blue-100 dark:bg-blue-900/20"
                                trend={12}
                            />
                            <StatCard
                                title="New Leads (30d)"
                                value={analytics?.recent || 0}
                                icon={FiClock}
                                color="text-yellow-600"
                                bgColor="bg-yellow-100 dark:bg-yellow-900/20"
                                trend={8}
                            />
                            <StatCard
                                title="Converted"
                                value={analytics?.byStatus?.converted || 0}
                                icon={FiUserCheck}
                                color="text-green-600"
                                bgColor="bg-green-100 dark:bg-green-900/20"
                                trend={15}
                            />
                            <StatCard
                                title="Conversion Rate"
                                value={`${analytics?.conversionRate || 0}%`}
                                icon={FiTrendingUp}
                                color="text-purple-600"
                                bgColor="bg-purple-100 dark:bg-purple-900/20"
                                trend={5}
                            />
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Status Distribution */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                        <FiBarChart2 className="mr-2 h-5 w-5 text-primary-600" />
                                        Leads by Status
                                    </h2>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setChartType('bar')}
                                            className={`p-2 rounded-lg transition-colors ${
                                                chartType === 'bar'
                                                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <FiBarChart2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setChartType('pie')}
                                            className={`p-2 rounded-lg transition-colors ${
                                                chartType === 'pie'
                                                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <FiPieChart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="h-80">
                                    {chartType === 'bar' ? (
                                        <Bar data={statusData} options={chartOptions} />
                                    ) : (
                                        <Pie data={statusData} options={pieOptions} />
                                    )}
                                </div>
                            </div>

                            {/* Source Distribution */}
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
                                            <p className="text-gray-500 dark:text-gray-400">
                                                No source data available
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Stats Table */}
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
                                                Metric
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Count
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Percentage
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Trend
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">Total Leads</td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{analytics?.total || 0}</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">100%</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-600">↑ 12%</span>
                                            </td>
                                        </tr>
                                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">New Leads</td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{analytics?.byStatus?.new || 0}</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                {analytics?.total ? ((analytics.byStatus.new / analytics.total) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-600">↑ 8%</span>
                                            </td>
                                        </tr>
                                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">Contacted</td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{analytics?.byStatus?.contacted || 0}</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                {analytics?.total ? ((analytics.byStatus.contacted / analytics.total) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-yellow-600">→ 0%</span>
                                            </td>
                                        </tr>
                                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">Qualified</td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{analytics?.byStatus?.qualified || 0}</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                {analytics?.total ? ((analytics.byStatus.qualified / analytics.total) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-600">↑ 5%</span>
                                            </td>
                                        </tr>
                                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">Converted</td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{analytics?.byStatus?.converted || 0}</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                {analytics?.total ? ((analytics.byStatus.converted / analytics.total) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-600">↑ 15%</span>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="py-3 px-4 text-gray-900 dark:text-white">Lost</td>
                                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{analytics?.byStatus?.lost || 0}</td>
                                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                {analytics?.total ? ((analytics.byStatus.lost / analytics.total) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-red-600">↓ 3%</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Analytics;
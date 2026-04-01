// src/components/Dashboard/Analytics.jsx
import { useEffect } from "react";
import { FiClock, FiTrendingUp, FiUserCheck, FiUsers } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "../../store/slices/leadSlice";

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      <div className={`${bgColor} p-4 rounded-lg`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (loading && !analytics?.total) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Ensure we have valid data with proper defaults
  const totalLeads = analytics?.total || 0;
  const recentLeads = analytics?.recent || 0;
  const convertedLeads = analytics?.byStatus?.converted || 0;
  const conversionRate = analytics?.conversionRate || "0";
  const byStatus = analytics?.byStatus || {
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  };
  const bySource = analytics?.bySource || [];

  const stats = [
    {
      icon: FiUsers,
      label: "Total Leads",
      value: totalLeads,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: FiClock,
      label: "New (30 days)",
      value: recentLeads,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      icon: FiUserCheck,
      label: "Converted",
      value: convertedLeads,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: FiTrendingUp,
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  // Status list with colors
  const statusList = [
    { key: "new", label: "New", color: "bg-blue-600" },
    { key: "contacted", label: "Contacted", color: "bg-yellow-600" },
    { key: "qualified", label: "Qualified", color: "bg-purple-600" },
    { key: "converted", label: "Converted", color: "bg-green-600" },
    { key: "lost", label: "Lost", color: "bg-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leads by Status
          </h3>
          <div className="space-y-4">
            {statusList.map((status) => {
              const count = byStatus[status.key] || 0;
              const percentage =
                totalLeads > 0 ? (count / totalLeads) * 100 : 0;

              return (
                <div key={status.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-600 dark:text-gray-400">
                      {status.label}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${status.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Leads by Source
          </h3>
          <div className="space-y-4">
            {bySource.length > 0 ? (
              bySource.map((source, index) => {
                const count = source.count || 0;
                const percentage =
                  totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                const sourceName = source._id?.replace(/_/g, " ") || "Unknown";

                return (
                  <div key={source._id || index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-600 dark:text-gray-400">
                        {sourceName}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary-600"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No source data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

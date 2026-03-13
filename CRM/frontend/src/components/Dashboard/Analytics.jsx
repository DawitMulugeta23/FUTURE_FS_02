// src/components/Dashboard/Analytics.jsx
import { useEffect } from 'react';
import { FiClock, FiTrendingUp, FiUserCheck, FiUsers } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../store/slices/leadSlice';

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <div className={`${bgColor} p-4 rounded-lg`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
        </div>
    </div>
);

const Analytics = () => {
    const dispatch = useDispatch();
    const { analytics, loading } = useSelector(state => state.leads);

    useEffect(() => {
        dispatch(fetchAnalytics());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    const stats = [
        {
            icon: FiUsers,
            label: 'Total Leads',
            value: analytics?.total || 0,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            icon: FiClock,
            label: 'New (30 days)',
            value: analytics?.recent || 0,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
        },
        {
            icon: FiUserCheck,
            label: 'Converted',
            value: analytics?.byStatus?.converted || 0,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/20'
        },
        {
            icon: FiTrendingUp,
            label: 'Conversion Rate',
            value: `${analytics?.conversionRate || 0}%`,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20'
        }
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
                        {Object.entries(analytics?.byStatus || {}).map(([status, count]) => (
                            <div key={status}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-gray-600 dark:text-gray-400">{status}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
                                            status === 'converted' ? 'bg-green-600' :
                                            status === 'new' ? 'bg-blue-600' :
                                            status === 'contacted' ? 'bg-yellow-600' :
                                            status === 'qualified' ? 'bg-purple-600' :
                                            'bg-red-600'
                                        }`}
                                        style={{ 
                                            width: `${analytics?.total ? (count / analytics.total) * 100 : 0}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Source breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Leads by Source
                    </h3>
                    <div className="space-y-4">
                        {(analytics?.bySource?.length > 0 ? analytics.bySource : []).map((source) => (
                            <div key={source._id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-gray-600 dark:text-gray-400">
                                        {source._id?.replace('_', ' ') || 'Unknown'}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {source.count || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-primary-600"
                                        style={{ 
                                            width: `${analytics?.total ? ((source.count || 0) / analytics.total) * 100 : 0}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {(!analytics?.bySource || analytics.bySource.length === 0) && (
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
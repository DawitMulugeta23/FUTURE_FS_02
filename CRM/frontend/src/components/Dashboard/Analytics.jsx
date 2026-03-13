// src/components/Dashboard/Analytics.jsx
import { useEffect, useState } from 'react';
import { FiClock, FiTrendingUp, FiUserCheck, FiUsers } from 'react-icons/fi';
import leadService from '../../services/leadService';

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`${bgColor} p-4 rounded-lg`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
        </div>
    </div>
);

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const fetchAnalytics = async () => {
            try {
                const response = await leadService.getAnalytics();
                if (isMounted) {
                    setAnalytics(response.data);
                }
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        fetchAnalytics();
        
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!analytics) return null;

    const stats = [
        {
            icon: FiUsers,
            label: 'Total Leads',
            value: analytics.total,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            icon: FiClock,
            label: 'New (30 days)',
            value: analytics.recent,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            icon: FiUserCheck,
            label: 'Converted',
            value: analytics.byStatus.converted,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            icon: FiTrendingUp,
            label: 'Conversion Rate',
            value: `${analytics.conversionRate}%`,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
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
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h3>
                    <div className="space-y-4">
                        {Object.entries(analytics.byStatus).map(([status, count]) => (
                            <div key={status}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-gray-600">{status}</span>
                                    <span className="font-medium text-gray-900">{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
                                            status === 'converted' ? 'bg-green-600' :
                                            status === 'new' ? 'bg-blue-600' :
                                            status === 'contacted' ? 'bg-yellow-600' :
                                            status === 'qualified' ? 'bg-purple-600' :
                                            'bg-red-600'
                                        }`}
                                        style={{ width: `${analytics.total ? (count / analytics.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Source breakdown */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Source</h3>
                    <div className="space-y-4">
                        {analytics.bySource.map((source) => (
                            <div key={source._id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="capitalize text-gray-600">
                                        {source._id.replace('_', ' ')}
                                    </span>
                                    <span className="font-medium text-gray-900">{source.count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-primary-600"
                                        style={{ width: `${analytics.total ? (source.count / analytics.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
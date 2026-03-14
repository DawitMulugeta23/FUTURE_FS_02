// src/components/Leads/ActivityTimeline.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
    FiMail, FiPhone, FiCalendar, FiFileText, 
    FiMessageSquare, FiCheckCircle, FiXCircle,
    FiClock, FiUser, FiPaperclip 
} from 'react-icons/fi';

const ActivityTimeline = ({ activities }) => {
    const getActivityIcon = (type) => {
        const icons = {
            email: FiMail,
            call: FiPhone,
            meeting: FiCalendar,
            note: FiFileText,
            task: FiCheckCircle,
            status_change: FiClock,
            file_upload: FiPaperclip,
            default: FiMessageSquare
        };
        return icons[type] || icons.default;
    };

    const getActivityColor = (type, outcome) => {
        if (outcome === 'positive') return 'text-green-500 bg-green-100 dark:bg-green-900/20';
        if (outcome === 'negative') return 'text-red-500 bg-red-100 dark:bg-red-900/20';
        
        const colors = {
            email: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
            call: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
            meeting: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
            note: 'text-gray-500 bg-gray-100 dark:bg-gray-900/20',
            task: 'text-green-500 bg-green-100 dark:bg-green-900/20'
        };
        return colors[type] || 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    };

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {activities?.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClass = getActivityColor(activity.type, activity.outcome);
                    
                    return (
                        <motion.li
                            key={activity._id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="relative pb-8">
                                {index < activities.length - 1 && (
                                    <span
                                        className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                                        aria-hidden="true"
                                    />
                                )}
                                <div className="relative flex items-start space-x-3">
                                    <div className={`relative px-1 ${colorClass} rounded-full p-2`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {activity.title}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <FiClock className="mr-1 h-3 w-3" />
                                                {formatDistanceToNow(new Date(activity.createdAt))} ago
                                            </div>
                                        </div>
                                        
                                        {activity.description && (
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                {activity.description}
                                            </p>
                                        )}
                                        
                                        {activity.metadata && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {Object.entries(activity.metadata).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs 
                                                                 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                    >
                                                        {key}: {value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {activity.attachments?.length > 0 && (
                                            <div className="mt-2 flex items-center space-x-2">
                                                <FiPaperclip className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {activity.attachments.length} attachment(s)
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                            <FiUser className="h-3 w-3" />
                                            <span>{activity.userId?.name || 'System'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.li>
                    );
                })}
                
                {(!activities || activities.length === 0) && (
                    <li className="text-center py-8">
                        <div className="text-gray-400 dark:text-gray-600 text-5xl mb-4">📭</div>
                        <p className="text-gray-500 dark:text-gray-400">
                            No activities yet. Start engaging with your lead!
                        </p>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ActivityTimeline;
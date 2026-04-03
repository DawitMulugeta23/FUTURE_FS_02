// src/components/Leads/EmailHistory.jsx
import { format } from 'date-fns';
import { useState } from 'react';
import { FiMail, FiMessageSquare, FiReply, FiUser, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const EmailHistory = ({ emails }) => {
    const [expandedEmail, setExpandedEmail] = useState(null);

    const toggleExpand = (index) => {
        setExpandedEmail(expandedEmail === index ? null : index);
    };

    const getStatusBadge = (email) => {
        if (email.replyReceived) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <FiReply className="mr-1 h-3 w-3" />
                    Replied
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                <FiMail className="mr-1 h-3 w-3" />
                Sent
            </span>
        );
    };

    if (!emails || emails.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📧</div>
                <p className="text-gray-500 dark:text-gray-400">
                    No emails have been sent to this lead yet.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Use the email button above to send your first message.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {emails.map((email, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden"
                >
                    <div 
                        className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => toggleExpand(index)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                                <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                                    <FiMail className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                        {email.subject}
                                    </p>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <FiUser className="mr-1 h-3 w-3" />
                                            {email.sentBy?.name || 'Unknown'}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <FiClock className="mr-1 h-3 w-3" />
                                            {format(new Date(email.sentAt), 'MMM dd, yyyy h:mm a')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {getStatusBadge(email)}
                                {expandedEmail === index ? (
                                    <FiChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FiChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {expandedEmail === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t dark:border-gray-600"
                            >
                                <div className="p-4 space-y-4">
                                    {/* Email Content */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Message:
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                            {email.message}
                                        </div>
                                    </div>

                                    {/* Reply Section */}
                                    {email.replyReceived && email.replyMessage && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <FiReply className="h-4 w-4 text-green-500" />
                                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Reply Received:
                                                </h4>
                                                <span className="text-xs text-gray-500">
                                                    {format(new Date(email.replyReceivedAt), 'MMM dd, yyyy h:mm a')}
                                                </span>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap border-l-4 border-green-500">
                                                {email.replyMessage}
                                            </div>
                                        </div>
                                    )}

                                    {/* Email Metadata */}
                                    <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                                        <span>Email ID: {email._id}</span>
                                        <span className="mx-2">•</span>
                                        <span>Status: {email.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
};

export default EmailHistory;
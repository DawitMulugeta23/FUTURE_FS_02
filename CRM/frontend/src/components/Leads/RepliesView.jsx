// src/components/Leads/RepliesView.jsx
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FiChevronDown,
    FiChevronUp,
    FiClock,
    FiCornerUpLeft,
    FiMail,
    FiMessageSquare,
    FiUser,
} from "react-icons/fi";
import leadService from "../../services/leadService";

const RepliesView = ({ leadId }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReply, setExpandedReply] = useState(null);

  useEffect(() => {
    fetchReplies();
  }, [leadId]);

  const fetchReplies = async () => {
    setLoading(true);
    try {
      const response = await leadService.getEmailReplies(leadId);
      setReplies(response.data || []);
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast.error("Failed to load replies");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedReply(expandedReply === index ? null : index);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg animate-pulse"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📭</div>
        <p className="text-gray-500 dark:text-gray-400">
          No replies received yet.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          When leads reply to your emails, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <FiCornerUpLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-300">
            {replies.length}{" "}
            {replies.length === 1 ? "reply has" : "replies have"} been received
            from this lead.
          </p>
        </div>
      </div>

      {replies.map((reply, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
        >
          <div
            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() => toggleExpand(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <FiCornerUpLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    Re: {reply.subject}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FiUser className="mr-1 h-3 w-3" />
                      Lead replied
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FiClock className="mr-1 h-3 w-3" />
                      {format(
                        new Date(reply.replyReceivedAt),
                        "MMM dd, yyyy h:mm a",
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <FiMail className="mr-1 h-3 w-3" />
                  Reply
                </span>
                {expandedReply === index ? (
                  <FiChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expandedReply === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t dark:border-gray-700"
              >
                <div className="p-4 space-y-4">
                  {/* Original Email Subject */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Original Email:
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">{reply.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Sent on{" "}
                        {format(new Date(reply.sentAt), "MMM dd, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>

                  {/* Reply Message */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <FiMessageSquare className="mr-2 h-4 w-4 text-green-500" />
                      Lead's Reply:
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap border-l-4 border-green-500">
                      {reply.replyMessage}
                    </div>
                  </div>

                  {/* Reply Metadata */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                    <span>
                      Reply received:{" "}
                      {format(
                        new Date(reply.replyReceivedAt),
                        "MMM dd, yyyy h:mm a",
                      )}
                    </span>
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

export default RepliesView;

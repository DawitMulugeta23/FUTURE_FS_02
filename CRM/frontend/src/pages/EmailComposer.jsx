import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiSend, FiUsers, FiX } from "react-icons/fi";
import emailService from "../services/emailService";

const EmailComposer = ({ leads = [], onClose, onSuccess }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((lead) => lead._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectLead = (leadId) => {
    if (selectedLeadIds.includes(leadId)) {
      setSelectedLeadIds(selectedLeadIds.filter((id) => id !== leadId));
    } else {
      setSelectedLeadIds([...selectedLeadIds, leadId]);
    }
  };

  const handleSend = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (selectedLeadIds.length === 0) {
      toast.error("Please select at least one lead");
      return;
    }

    setSending(true);

    try {
      if (selectedLeadIds.length === 1) {
        await emailService.sendToLead(selectedLeadIds[0], subject, message);
        toast.success("Email sent successfully");
      } else {
        const result = await emailService.sendBulk(
          selectedLeadIds,
          subject,
          message,
        );
        toast.success(
          result.message ||
            `Sent to ${result.data?.sentCount || selectedLeadIds.length} leads`,
        );
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Send email error:", error);
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiMail className="mr-2 h-6 w-6 text-primary-600" />
            Compose Email
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Lead Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipients
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedLeadIds.length} lead(s) selected
                </span>
                {leads.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {selectAll ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {leads.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <FiUsers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No leads available</p>
                  </div>
                ) : (
                  leads.map((lead) => (
                    <label
                      key={lead._id}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.includes(lead._id)}
                        onChange={() => handleSelectLead(lead._id)}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {lead.email} • {lead.company || "No Company"}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                     dark:bg-gray-700 dark:text-white"
              placeholder="Email subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="10"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                     dark:bg-gray-700 dark:text-white resize-y"
              placeholder="Write your message here..."
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || selectedLeadIds.length === 0}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {sending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FiSend className="h-4 w-4" />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;

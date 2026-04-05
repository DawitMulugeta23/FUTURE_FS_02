import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCornerUpLeft,
  FiEdit2,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiPlus,
  FiSave,
  FiSend,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import leadService from "../../services/leadService";
import EmailHistory from "./EmailHistory";
import EmailModal from "./EmailModal";
import LeadForm from "./LeadForm";

const statusColors = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  contacted:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  qualified:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  converted:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "?";
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  if (firstInitial && lastInitial) return `${firstInitial}${lastInitial}`;
  return firstInitial || lastInitial || "?";
};

const getBackgroundColor = (firstName, lastName) => {
  const name = `${firstName} ${lastName}`;
  const colors = [
    "from-red-500 to-red-600",
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-yellow-500 to-yellow-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
    "from-orange-500 to-orange-600",
    "from-cyan-500 to-cyan-600",
  ];
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

// Reply Modal Component
const ReplyModalComponent = ({ lead, onClose, onSuccess }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    setLoading(true);
    try {
      await leadService.addLeadReply(lead._id, replyMessage);
      toast.success("Reply recorded successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-xl">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiCornerUpLeft className="mr-2 h-6 w-6 text-green-600" />
            Record Lead Reply
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lead Information
            </label>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {lead.firstName} {lead.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {lead.email}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reply Message
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Enter the lead's reply message here..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSend className="h-4 w-4" />
                  <span>Save Reply</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Replies List Component
const RepliesListComponent = ({ replies, onAddReply }) => {
  const [expandedReply, setExpandedReply] = useState(null);

  if (!replies || replies.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📭</div>
        <p className="text-gray-500 dark:text-gray-400">
          No replies received yet.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          When leads reply to your emails, you can record them here.
        </p>
        <button
          onClick={onAddReply}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
        >
          <FiPlus className="h-4 w-4" />
          <span>Record First Reply</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiCornerUpLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {replies.length}{" "}
              {replies.length === 1 ? "reply has" : "replies have"} been
              received.
            </p>
          </div>
          <button
            onClick={onAddReply}
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium inline-flex items-center space-x-1"
          >
            <FiPlus className="h-3 w-3" />
            <span>Add Reply</span>
          </button>
        </div>
      </div>
      {replies.map((reply, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
        >
          <div
            className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            onClick={() =>
              setExpandedReply(expandedReply === index ? null : index)
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <FiCornerUpLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    Re: {reply.subject || "Email Reply"}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FiMail className="mr-1 h-3 w-3" />
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
          {expandedReply === index && (
            <div className="border-t dark:border-gray-700 p-4 space-y-4">
              {reply.subject && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Original Email:
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{reply.subject}</p>
                    {reply.sentAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Sent on{" "}
                        {format(new Date(reply.sentAt), "MMM dd, yyyy h:mm a")}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <FiMessageSquare className="mr-2 h-4 w-4 text-green-500" />
                  Lead's Reply:
                </h4>
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap border-l-4 border-green-500">
                  {reply.replyMessage}
                </div>
              </div>
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
          )}
        </div>
      ))}
    </div>
  );
};

// Main LeadDetails Component
const LeadDetails = ({ lead, onClose, onUpdate }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [emailHistory, setEmailHistory] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const [editableLead, setEditableLead] = useState({
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone || "",
    company: lead.company || "",
    source: lead.source || "website",
    status: lead.status,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isChanged =
      editableLead.firstName !== lead.firstName ||
      editableLead.lastName !== lead.lastName ||
      editableLead.email !== lead.email ||
      editableLead.phone !== (lead.phone || "") ||
      editableLead.company !== (lead.company || "") ||
      editableLead.source !== (lead.source || "website") ||
      editableLead.status !== lead.status;
    setHasChanges(isChanged);
  }, [editableLead, lead]);

  useEffect(() => {
    if (activeTab === "emails") fetchEmailHistory();
    else if (activeTab === "replies") fetchReplies();
  }, [activeTab]);

  const fetchEmailHistory = async () => {
    setLoadingEmails(true);
    try {
      const response = await leadService.getEmailHistory(lead._id);
      setEmailHistory(response.data || []);
    } catch (error) {
      toast.error("Failed to load email history");
    } finally {
      setLoadingEmails(false);
    }
  };

  const fetchReplies = async () => {
    setLoadingReplies(true);
    try {
      const response = await leadService.getReplies(lead._id);
      setReplies(response.data || []);
    } catch (error) {
      toast.error("Failed to load replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditableLead((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const response = await leadService.updateLead(lead._id, editableLead);
      onUpdate(response.data);
      toast.success("Lead updated successfully");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to update lead");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    try {
      const response = await leadService.addNote(lead._id, note);
      onUpdate(response.data);
      setNote("");
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await leadService.deleteLead(lead._id);
      toast.success("Lead deleted successfully");
      onClose();
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete lead");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSent = async () => {
    await fetchEmailHistory();
    onUpdate();
  };

  const handleReplyAdded = async () => {
    await fetchReplies();
    onUpdate();
  };

  const initials = getInitials(lead.firstName, lead.lastName);
  const bgGradient = getBackgroundColor(lead.firstName, lead.lastName);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-10">
            <div className="flex justify-between items-center p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lead Details
              </h2>
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br ${bgGradient} shadow-md flex items-center justify-center text-white font-bold text-2xl`}
                >
                  {initials}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editableLead.firstName}
                      onChange={(e) =>
                        handleFieldChange("firstName", e.target.value)
                      }
                      className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editableLead.lastName}
                      onChange={(e) =>
                        handleFieldChange("lastName", e.target.value)
                      }
                      className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none transition-colors"
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    type="text"
                    value={editableLead.company}
                    onChange={(e) =>
                      handleFieldChange("company", e.target.value)
                    }
                    className="text-gray-500 dark:text-gray-400 mt-1 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none transition-colors"
                    placeholder="Company Name"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Send Email"
                >
                  <FiSend className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <select
                  value={editableLead.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${statusColors[editableLead.status]}`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              {hasChanges && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  CONTACT INFORMATION
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="email"
                      value={editableLead.email}
                      onChange={(e) =>
                        handleFieldChange("email", e.target.value)
                      }
                      className="flex-1 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none transition-colors text-primary-600 dark:text-primary-400"
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="tel"
                      value={editableLead.phone}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value)
                      }
                      className="flex-1 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none transition-colors text-gray-700 dark:text-gray-300"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="flex items-center">
                    <FiBriefcase className="h-5 w-5 text-gray-400 mr-3" />
                    <select
                      value={editableLead.source}
                      onChange={(e) =>
                        handleFieldChange("source", e.target.value)
                      }
                      className="flex-1 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none transition-colors text-gray-700 dark:text-gray-300 capitalize"
                    >
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="social_media">Social Media</option>
                      <option value="email_campaign">Email Campaign</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  TIMELINE
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Created:{" "}
                      {format(new Date(lead.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Updated:{" "}
                      {format(new Date(lead.updatedAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  {lead.convertedAt && (
                    <div className="flex items-center">
                      <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Converted:{" "}
                        {format(new Date(lead.convertedAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b dark:border-gray-700 mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === "notes" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <FiMessageSquare className="inline mr-2 h-4 w-4" />
                  Notes ({lead.notes?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("emails")}
                  className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === "emails" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <FiMail className="inline mr-2 h-4 w-4" />
                  Email History ({lead.emailHistory?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("replies")}
                  className={`pb-3 px-2 text-sm font-medium transition-colors ${activeTab === "replies" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                >
                  <FiCornerUpLeft className="inline mr-2 h-4 w-4" />
                  Replies ({replies.length})
                </button>
              </div>
            </div>

            {activeTab === "notes" && (
              <div className="mb-8">
                <form onSubmit={handleAddNote} className="mb-6">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a follow-up note..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows="3"
                  />
                  <button
                    type="submit"
                    disabled={loading || !note.trim()}
                    className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Adding..." : "Add Note"}
                  </button>
                </form>
                <div className="space-y-4">
                  {lead.notes && lead.notes.length > 0 ? (
                    [...lead.notes].reverse().map((note, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {note.createdBy?.name || "Unknown"}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(
                              new Date(note.createdAt),
                              "MMM dd, yyyy h:mm a",
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No notes yet. Add your first follow-up note above.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "emails" && (
              <div className="mb-8">
                {loadingEmails ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmailHistory
                    emails={
                      emailHistory.length > 0
                        ? emailHistory
                        : lead.emailHistory || []
                    }
                  />
                )}
              </div>
            )}

            {activeTab === "replies" && (
              <div className="mb-8">
                {loadingReplies ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RepliesListComponent
                    replies={replies}
                    onAddReply={() => setShowReplyModal(true)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditForm && (
        <LeadForm
          lead={lead}
          onClose={() => setShowEditForm(false)}
          onSuccess={() => {
            onUpdate();
            setShowEditForm(false);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Lead
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {lead.firstName} {lead.lastName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEmailModal && (
        <EmailModal
          lead={lead}
          onClose={() => setShowEmailModal(false)}
          onSuccess={handleEmailSent}
        />
      )}

      {showReplyModal && (
        <ReplyModalComponent
          lead={lead}
          onClose={() => setShowReplyModal(false)}
          onSuccess={handleReplyAdded}
        />
      )}
    </>
  );
};

export default LeadDetails;

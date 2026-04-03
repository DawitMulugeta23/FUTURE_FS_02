// src/components/Leads/LeadDetails.jsx - Add this function and update the header section
import { format } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiBriefcase,
  FiCalendar,
  FiEdit2,
  FiMail,
  FiMessageSquare,
  FiPhone,
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

// Get initials from first and last name
const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "?";

  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";

  if (firstInitial && lastInitial) {
    return `${firstInitial}${lastInitial}`;
  }
  return firstInitial || lastInitial || "?";
};

// Generate consistent background color based on lead name
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
  const colorIndex = sum % colors.length;

  return colors[colorIndex];
};

const LeadDetails = ({ lead, onClose, onUpdate }) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [emailHistory, setEmailHistory] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  const initials = getInitials(lead.firstName, lead.lastName);
  const bgGradient = getBackgroundColor(lead.firstName, lead.lastName);

  useEffect(() => {
    if (activeTab === "emails") {
      fetchEmailHistory();
    }
  }, [activeTab]);

  const fetchEmailHistory = async () => {
    setLoadingEmails(true);
    try {
      const response = await leadService.getEmailHistory(lead._id);
      setEmailHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching email history:", error);
      toast.error("Failed to load email history");
    } finally {
      setLoadingEmails(false);
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
      toast.error(
        error.response?.data?.message || "An error occurred while adding note",
      );
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
      toast.error(error.response?.data?.message || "Failed to delete lead");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await leadService.updateLead(lead._id, {
        status: newStatus,
      });
      onUpdate(response.data);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleEmailSent = async () => {
    await fetchEmailHistory();
    onUpdate();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-10">
            <div className="flex justify-between items-center p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lead Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Header with avatar and actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                {/* Lead Avatar - Large version for details */}
                <div
                  className={`h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br ${bgGradient} shadow-md flex-shrink-0`}
                >
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                    {initials}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {lead.company || "No Company"}
                  </p>
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

            {/* Status badges and quick actions */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[lead.status]}`}
              >
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>

              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {/* Contact information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  CONTACT INFORMATION
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center">
                      <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-gray-700 dark:text-gray-300"
                      >
                        {lead.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FiBriefcase className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {lead.source?.replace("_", " ") || "website"}
                    </span>
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
                      Last Updated:{" "}
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

            {/* Tabs */}
            <div className="border-b dark:border-gray-700 mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`pb-3 px-2 text-sm font-medium transition-colors ${
                    activeTab === "notes"
                      ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiMessageSquare className="inline mr-2 h-4 w-4" />
                  Notes ({lead.notes?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("emails")}
                  className={`pb-3 px-2 text-sm font-medium transition-colors ${
                    activeTab === "emails"
                      ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <FiMail className="inline mr-2 h-4 w-4" />
                  Email History ({lead.emailHistory?.length || 0})
                </button>
              </div>
            </div>

            {/* Notes Section */}
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
                    [...lead.notes].reverse().map((note, index) => (
                      <div
                        key={index}
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

            {/* Email History Section */}
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
          </div>
        </div>
      </div>

      {/* Edit form modal */}
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

      {/* Delete confirmation modal */}
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

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          lead={lead}
          onClose={() => setShowEmailModal(false)}
          onSuccess={handleEmailSent}
        />
      )}
    </>
  );
};

export default LeadDetails;

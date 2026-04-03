// src/components/Leads/LeadCard.jsx
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { FiBriefcase, FiCalendar, FiMail, FiPhone } from "react-icons/fi";

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

  // Use the sum of character codes to determine color index
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = sum % colors.length;

  return colors[colorIndex];
};

const LeadCard = ({ lead, onClick }) => {
  const initials = getInitials(lead.firstName, lead.lastName);
  const bgGradient = getBackgroundColor(lead.firstName, lead.lastName);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onClick(lead)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          {/* Lead Avatar - Using Initials */}
          <div className="flex-shrink-0">
            <div
              className={`h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br ${bgGradient} shadow-md`}
            >
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {lead.firstName} {lead.lastName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {lead.company || "No Company"}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
          >
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiMail className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{lead.email}</span>
          </div>

          {lead.phone && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FiPhone className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
              <span>{lead.phone}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiBriefcase className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span className="capitalize">
              {lead.source?.replace("_", " ") || "website"}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <FiCalendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>
              Added {formatDistanceToNow(new Date(lead.createdAt))} ago
            </span>
          </div>
        </div>

        {lead.notes && lead.notes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Latest note:
              </span>{" "}
              {lead.notes[lead.notes.length - 1].content.substring(0, 50)}
              {lead.notes[lead.notes.length - 1].content.length > 50
                ? "..."
                : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;

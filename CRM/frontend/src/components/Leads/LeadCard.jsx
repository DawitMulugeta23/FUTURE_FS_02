// src/components/Leads/LeadCard.jsx (updated with hover descriptions)
import { formatDistanceToNow } from "date-fns";
import md5 from "md5";
import { useEffect, useState } from "react";
import { FiBriefcase, FiCalendar, FiMail, FiPhone } from "react-icons/fi";
import HoverSpeak from "../Voice/HoverSpeak";

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  lost: "bg-red-100 text-red-800",
};

const LeadCard = ({ lead, onClick }) => {
  const [gravatarUrl, setGravatarUrl] = useState("");

  useEffect(() => {
    if (lead?.email) {
      const emailHash = md5(lead.email.toLowerCase().trim());
      setGravatarUrl(
        `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=128`,
      );
    }
  }, [lead]);

  const getStatusDescription = (status) => {
    const descriptions = {
      new: "New lead, not yet contacted",
      contacted: "Lead has been contacted",
      qualified: "Lead has been qualified as potential customer",
      converted: "Lead has been converted to customer",
      lost: "Lead was lost or declined",
    };
    return descriptions[status] || `Status: ${status}`;
  };

  return (
    <HoverSpeak
      description={`Lead card for ${lead.firstName} ${lead.lastName} from ${lead.company || "unknown company"}. Status: ${lead.status}. ${getStatusDescription(lead.status)}. Email: ${lead.email}. Added ${formatDistanceToNow(new Date(lead.createdAt))} ago.`}
      delay={300}
    >
      <div
        onClick={() => onClick(lead)}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-4">
            {/* Lead Avatar from Gravatar */}
            <HoverSpeak
              description={`Avatar for ${lead.firstName} ${lead.lastName}`}
              delay={200}
            >
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600">
                  {gravatarUrl ? (
                    <img
                      src={gravatarUrl}
                      alt={`${lead.firstName} ${lead.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${lead.firstName}+${lead.lastName}&background=4f46e5&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {lead.firstName?.charAt(0)}
                      {lead.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </HoverSpeak>

            <div className="flex-1 min-w-0">
              <HoverSpeak
                description={`Name: ${lead.firstName} ${lead.lastName}`}
                delay={200}
              >
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {lead.firstName} {lead.lastName}
                </h3>
              </HoverSpeak>
              <HoverSpeak
                description={`Company: ${lead.company || "No Company"}`}
                delay={200}
              >
                <p className="text-sm text-gray-500 truncate">
                  {lead.company || "No Company"}
                </p>
              </HoverSpeak>
            </div>

            <HoverSpeak
              description={`Status: ${lead.status}. ${getStatusDescription(lead.status)}`}
              delay={200}
            >
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
              >
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
            </HoverSpeak>
          </div>

          <div className="space-y-2">
            <HoverSpeak description={`Email: ${lead.email}`} delay={200}>
              <div className="flex items-center text-sm text-gray-600">
                <FiMail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="truncate">{lead.email}</span>
              </div>
            </HoverSpeak>

            {lead.phone && (
              <HoverSpeak description={`Phone: ${lead.phone}`} delay={200}>
                <div className="flex items-center text-sm text-gray-600">
                  <FiPhone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              </HoverSpeak>
            )}

            <HoverSpeak
              description={`Source: ${lead.source.replace("_", " ")}`}
              delay={200}
            >
              <div className="flex items-center text-sm text-gray-600">
                <FiBriefcase className="h-4 w-4 mr-2 text-gray-400" />
                <span className="capitalize">
                  {lead.source.replace("_", " ")}
                </span>
              </div>
            </HoverSpeak>

            <HoverSpeak
              description={`Added ${formatDistanceToNow(new Date(lead.createdAt))} ago`}
              delay={200}
            >
              <div className="flex items-center text-sm text-gray-600">
                <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>
                  Added {formatDistanceToNow(new Date(lead.createdAt))} ago
                </span>
              </div>
            </HoverSpeak>
          </div>

          {lead.notes && lead.notes.length > 0 && (
            <HoverSpeak
              description={`Latest note: ${lead.notes[lead.notes.length - 1].content.substring(0, 100)}`}
              delay={200}
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Latest note:</span>{" "}
                  {lead.notes[lead.notes.length - 1].content.substring(0, 50)}
                  {lead.notes[lead.notes.length - 1].content.length > 50
                    ? "..."
                    : ""}
                </p>
              </div>
            </HoverSpeak>
          )}
        </div>
      </div>
    </HoverSpeak>
  );
};

export default LeadCard;

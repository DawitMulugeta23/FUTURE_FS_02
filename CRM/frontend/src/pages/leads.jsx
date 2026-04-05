// src/pages/Leads.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiFilter,
  FiMail,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import EmailComposer from "../components/EmailComposer";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import LeadCard from "../components/Leads/LeadCard";
import LeadDetails from "../components/Leads/LeadDetails";
import LeadForm from "../components/Leads/LeadForm";
import {
  fetchLeads,
  setFilters,
  setPage,
  setSelectedLead,
} from "../store/slices/leadSlice";

const Leads = () => {
  const dispatch = useDispatch();

  const { leads, loading, pagination, filters, selectedLead } = useSelector(
    (state) => state.leads,
  );

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [selectedLeadsForEmail, setSelectedLeadsForEmail] = useState([]);

  useEffect(() => {
    dispatch(
      fetchLeads({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }, [dispatch, filters, pagination.page, pagination.limit]);

  const handleSearch = (e) => {
    dispatch(setFilters({ search: e.target.value }));
    dispatch(setPage(1));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(setPage(1));
  };

  const handleSendEmailToAll = () => {
    if (leads.length === 0) {
      toast.error("No leads available to send emails");
      return;
    }
    setSelectedLeadsForEmail(leads);
    setShowEmailComposer(true);
  };

  const handleRefresh = () => {
    dispatch(
      fetchLeads({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  };

  const handleClearFilters = () => {
    dispatch(
      setFilters({
        status: "all",
        search: "",
        sort: "newest",
      }),
    );
    dispatch(setPage(1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Leads Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage and track all your leads in one place
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleSendEmailToAll}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <FiMail className="h-5 w-5" />
                  <span>Email All</span>
                </button>

                <button
                  onClick={() => setShowLeadForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Add Lead</span>
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-4 flex-wrap gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={filters.search}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 border rounded-lg flex items-center space-x-2 transition-colors ${
                      showFilters
                        ? "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiFilter className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {leads.length} of {pagination.total} leads
                </div>
              </div>

              {/* Conditional Filter Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sort}
                        onChange={(e) =>
                          handleFilterChange("sort", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Leads List / Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-white dark:bg-gray-800 rounded-xl animate-pulse shadow-sm"
                  />
                ))}
              </div>
            ) : leads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    onClick={() => dispatch(setSelectedLead(lead))}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <p className="text-gray-500">
                  No leads found matching your criteria.
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => dispatch(setPage(pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 dark:text-white"
                >
                  Previous
                </button>

                <span className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  {pagination.page} / {pagination.pages}
                </span>

                <button
                  onClick={() => dispatch(setPage(pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 dark:text-white"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showLeadForm && (
        <LeadForm
          onClose={() => setShowLeadForm(false)}
          onSuccess={() => {
            handleRefresh();
            setShowLeadForm(false);
          }}
        />
      )}

      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => dispatch(setSelectedLead(null))}
          onUpdate={handleRefresh}
        />
      )}

      {showEmailComposer && (
        <EmailComposer
          leads={selectedLeadsForEmail}
          onClose={() => setShowEmailComposer(false)}
          onSuccess={() => {
            setShowEmailComposer(false);
            toast.success("Email sent successfully!");
          }}
        />
      )}
    </div>
  );
};

export default Leads;

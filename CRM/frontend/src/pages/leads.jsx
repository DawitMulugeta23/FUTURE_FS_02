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

  // State declarations - IMPORTANT: showFilters is declared here
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

  const handleSendEmailToLead = (lead) => {
    setSelectedLeadsForEmail([lead]);
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
            {/* Header */}
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
                  <span>Email All Leads</span>
                </button>
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <FiPlus className="h-5 w-5" />
                  <span>Add New Lead</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center space-x-4 flex-wrap gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads by name, email, company..."
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

              {/* Expanded Filters */}
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="status">Status</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Leads Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-2/3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {leads.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leads.map((lead) => (
                      <LeadCard
                        key={lead._id}
                        lead={lead}
                        onClick={() => dispatch(setSelectedLead(lead))}
                        onSendEmail={handleSendEmailToLead}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <div className="text-gray-400 dark:text-gray-600 text-7xl mb-6">
                      📭
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      No leads found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      {filters.search || filters.status !== "all"
                        ? "No leads match your current filters. Try adjusting your search criteria."
                        : "You haven't added any leads yet. Start by adding your first lead!"}
                    </p>
                    {!filters.search && filters.status === "all" ? (
                      <button
                        onClick={() => setShowLeadForm(true)}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <FiPlus className="h-5 w-5" />
                        <span>Add Your First Lead</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleClearFilters}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-flex items-center space-x-2"
                      >
                        <span>Clear Filters</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => dispatch(setPage(pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => dispatch(setPage(pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors"
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
            toast.success("Email(s) sent successfully");
          }}
        />
      )}
    </div>
  );
};

export default Leads;

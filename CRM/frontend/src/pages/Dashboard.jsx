// src/pages/Dashboard.jsx - Update the layout structure
import React, { useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Analytics from "../components/Dashboard/Analytics";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import LeadCard from "../components/Leads/LeadCard";
import LeadDetails from "../components/Leads/LeadDetails";
import LeadForm from "../components/Leads/LeadForm";
import {
  fetchAnalytics,
  fetchLeads,
  setFilters,
  setPage,
  setSelectedLead,
} from "../store/slices/leadSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { leads, loading, pagination, filters, selectedLead } = useSelector(
    (state) => state.leads,
  );
  const [showLeadForm, setShowLeadForm] = React.useState(false);

  useEffect(() => {
    dispatch(
      fetchLeads({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
    dispatch(fetchAnalytics());
  }, [dispatch, filters, pagination.page, pagination.limit]);

  const handleSearch = (e) => {
    dispatch(setFilters({ search: e.target.value }));
    dispatch(setPage(1));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(setPage(1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <button
                onClick={() => setShowLeadForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus className="h-5 w-5" />
                <span>Add New Lead</span>
              </button>
            </div>

            {/* Analytics Section */}
            <div className="mb-8">
              <Analytics />
            </div>

            {/* Filters */}
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
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                     dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>

                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {leads.length} of {pagination.total} leads
                </div>
              </div>
            </div>

            {/* Leads Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
                        onClick={(lead) => dispatch(setSelectedLead(lead))}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">
                      📭
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      No leads found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {filters.search
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first lead"}
                    </p>
                    {!filters.search && (
                      <button
                        onClick={() => setShowLeadForm(true)}
                        className="btn-primary inline-flex items-center space-x-2"
                      >
                        <FiPlus className="h-5 w-5" />
                        <span>Add Your First Lead</span>
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
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 
                                             dark:hover:bg-gray-700 dark:text-white transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => dispatch(setPage(pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 
                                             dark:hover:bg-gray-700 dark:text-white transition-colors"
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
            dispatch(
              fetchLeads({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
              }),
            );
            setShowLeadForm(false);
          }}
        />
      )}

      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => dispatch(setSelectedLead(null))}
          onUpdate={() => {
            dispatch(
              fetchLeads({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
              }),
            );
            dispatch(setSelectedLead(null));
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

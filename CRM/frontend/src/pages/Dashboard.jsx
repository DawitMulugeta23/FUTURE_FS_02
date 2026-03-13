// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import Analytics from '../components/Dashboard/Analytics';
import LeadCard from '../components/Leads/LeadCard';
import LeadDetails from '../components/Leads/LeadDetails';
import LeadForm from '../components/Leads/LeadForm';
import leadService from '../services/leadService';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        sort: 'newest'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        fetchLeads();
    }, [filters, pagination.page]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.page,
                limit: pagination.limit
            };
            if (filters.status === 'all') delete params.status;
            
            const response = await leadService.getLeads(params);
            setLeads(response.data);
            setPagination(response.pagination);
        } catch (error) {
            toast.error(error.response.data?.message || 'Failed to fetch lead data');
            // Error is already handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="flex">
                <Sidebar />
                
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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
                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <div className="flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex items-center space-x-4 flex-wrap gap-2">
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search leads..."
                                            value={filters.search}
                                            onChange={handleSearch}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    
                                    <select
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="name">Name</option>
                                        <option value="status">Status</option>
                                    </select>
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    Showing {leads.length} of {pagination.total} leads
                                </div>
                            </div>
                        </div>
                        
                        {/* Leads Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {leads.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {leads.map(lead => (
                                            <LeadCard
                                                key={lead._id}
                                                lead={lead}
                                                onClick={setSelectedLead}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 text-6xl mb-4">📭</div>
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">No leads found</h3>
                                        <p className="text-gray-500 mb-6">
                                            {filters.search 
                                                ? 'Try adjusting your search or filters' 
                                                : 'Get started by adding your first lead'}
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
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                        fetchLeads();
                        setShowLeadForm(false);
                    }}
                />
            )}
            
            {selectedLead && (
                <LeadDetails
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onUpdate={() => {
                        fetchLeads();
                        setSelectedLead(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
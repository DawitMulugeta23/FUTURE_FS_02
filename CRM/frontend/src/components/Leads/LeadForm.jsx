// src/components/Leads/LeadForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createLead, updateLead } from '../../store/slices/leadSlice';

const LeadForm = ({ onClose, onSuccess, lead = null }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        firstName: lead?.firstName || '',
        lastName: lead?.lastName || '',
        email: lead?.email || '',
        phone: lead?.phone || '',
        company: lead?.company || '',
        source: lead?.source || 'website',
        status: lead?.status || 'new'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let result;
            if (lead) {
                result = await dispatch(updateLead({ 
                    id: lead._id, 
                    data: formData 
                })).unwrap();
            } else {
                result = await dispatch(createLead(formData)).unwrap();
            }
            
            if (result) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error saving lead:', error);
            // Error toast is already shown in the slice
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lead ? 'Edit Lead' : 'Add New Lead'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        type="button"
                    >
                        <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="John"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Doe"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="john@example.com"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company
                            </label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Acme Inc."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Source
                            </label>
                            <select
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                <option value="website">Website</option>
                                <option value="referral">Referral</option>
                                <option value="social_media">Social Media</option>
                                <option value="email_campaign">Email Campaign</option>
                                <option value="advertisement">Advertisement</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        {lead && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="converted">Converted</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
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
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {lead ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : (
                                lead ? 'Update Lead' : 'Create Lead'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadForm;
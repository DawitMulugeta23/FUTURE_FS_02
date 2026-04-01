// src/components/Leads/LeadDetails.jsx
import React, { useState } from 'react';
import { FiX, FiEdit2, FiTrash2, FiCalendar, FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import { format } from 'date-fns';
import leadService from '../../services/leadService';
import toast from 'react-hot-toast';
import LeadForm from './LeadForm';
import EmailModal from './EmailModal';

const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
};

const LeadDetails = ({ lead, onClose, onUpdate }) => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!note.trim()) return;
        
        setLoading(true);
        try {
            const response = await leadService.addNote(lead._id, note);
            onUpdate(response.data);
            setNote('');
            toast.success('Note added successfully');
        } catch (error) {
            toast.error(error.response.data?.message || 'An error occurred while adding note');
            // Error is already handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await leadService.deleteLead(lead._id);
            toast.success('Lead deleted successfully');
            onClose();
            onUpdate(); // Refresh the list
        } catch (error) {
            // Error is already handled by interceptor
            toast.error(error.response.data?.message || 'Faild to delete lead');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await leadService.updateLead(lead._id, { status: newStatus });
            onUpdate(response.data);
            toast.success('Status updated successfully');
        } catch (error) {
            // Error is already handled by interceptor
            toast.error(error.response.data?.message || 'Faild to update status');
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b z-10">
                        <div className="flex justify-between items-center p-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Lead Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {/* Header with actions */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    {lead.firstName} {lead.lastName}
                                </h3>
                                <p className="text-gray-500 mt-1">{lead.company || 'No Company'}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setShowEditForm(true)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <FiEdit2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setShowEmailModal(true)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Send Email"
                                >
                                    <FiMail className="h-5 w-5" />
                                </button>
                                {showEmailModal && (
                                    <EmailModal
                                        lead={lead}
                                        onClose={() => setShowEmailModal(false)}
                                        onSuccess={()=>{
                                            onUpdate();
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        
                        {/* Status badges and quick actions */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[lead.status]}`}>
                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </span>
                            
                            <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">CONTACT INFORMATION</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                                        <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">
                                            {lead.email}
                                        </a>
                                    </div>
                                    {lead.phone && (
                                        <div className="flex items-center">
                                            <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                                            <a href={`tel:${lead.phone}`} className="text-gray-700">
                                                {lead.phone}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <FiBriefcase className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="capitalize text-gray-700">
                                            {lead.source.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-500 mb-3">TIMELINE</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-700">
                                            Created: {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-700">
                                            Last Updated: {format(new Date(lead.updatedAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    {lead.convertedAt && (
                                        <div className="flex items-center">
                                            <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-gray-700">
                                                Converted: {format(new Date(lead.convertedAt), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Notes section */}
                        <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Notes</h4>
                            
                            <form onSubmit={handleAddNote} className="mb-6">
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a follow-up note..."
                                    className="input-field mb-3"
                                    rows="3"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !note.trim()}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {loading ? 'Adding...' : 'Add Note'}
                                </button>
                            </form>
                            
                            <div className="space-y-4">
                                {lead.notes && lead.notes.length > 0 ? (
                                    lead.notes.map((note, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center">
                                                    <FiUser className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {note.createdBy?.name || 'Unknown'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{note.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No notes yet. Add your first follow-up note above.
                                    </p>
                                )}
                            </div>
                        </div>
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
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Lead</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete {lead.firstName} {lead.lastName}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="btn-danger disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LeadDetails;
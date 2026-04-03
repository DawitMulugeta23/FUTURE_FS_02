// src/components/Leads/LeadDetails.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiTrash2, FiCalendar, FiUser, FiMail, FiPhone, FiBriefcase, FiMessageSquare, FiSend } from 'react-icons/fi';
import { format } from 'date-fns';
import leadService from '../../services/leadService';
import toast from 'react-hot-toast';
import LeadForm from './LeadForm';
import EmailModal from './EmailModal';
import EmailHistory from './EmailHistory';

const statusColors = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    qualified: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    converted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    lost: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

const LeadDetails = ({ lead, onClose, onUpdate }) => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [activeTab, setActiveTab] = useState('notes');
    const [emailHistory, setEmailHistory] = useState([]);
    const [loadingEmails, setLoadingEmails] = useState(false);

    useEffect(() => {
        if (activeTab === 'emails') {
            fetchEmailHistory();
        }
    }, [activeTab]);

    const fetchEmailHistory = async () => {
        setLoadingEmails(true);
        try {
            const response = await leadService.getEmailHistory(lead._id);
            setEmailHistory(response.data || []);
        } catch (error) {
            console.error('Error fetching email history:', error);
            toast.error('Failed to load email history');
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
            setNote('');
            toast.success('Note added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while adding note');
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
            onUpdate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete lead');
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
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleEmailSent = async () => {
        await fetchEmailHistory();
        onUpdate();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className
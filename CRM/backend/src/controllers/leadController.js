const Lead = require('../models/Lead');

// Get all leads
const getLeads = async (req, res) => {
    try {
        const { status, search, sort } = req.query;
        let query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Search by name or email
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Sorting
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'name') {
            sortOption = { firstName: 1 };
        }
        
        const leads = await Lead.find(query).sort(sortOption);
        res.json(leads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single lead
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new lead
const createLead = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, company, source } = req.body;
        
        // Check if lead already exists
        const existingLead = await Lead.findOne({ email });
        if (existingLead) {
            return res.status(400).json({ message: 'Lead with this email already exists' });
        }
        
        const lead = await Lead.create({
            firstName,
            lastName,
            email,
            phone,
            company,
            source
        });
        
        res.status(201).json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update lead
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        // Update fields
        const fieldsToUpdate = ['firstName', 'lastName', 'email', 'phone', 'company', 'source', 'status'];
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                lead[field] = req.body[field];
            }
        });
        
        // If status changed to converted, set convertedAt
        if (req.body.status === 'converted' && lead.status !== 'converted') {
            lead.convertedAt = Date.now();
        }
        
        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete lead
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        await lead.remove();
        res.json({ message: 'Lead removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add note to lead
const addNote = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        lead.notes.push({
            content: req.body.content,
            createdBy: req.user._id
        });
        
        await lead.save();
        res.json(lead);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get analytics
const getAnalytics = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const newLeads = await Lead.countDocuments({ status: 'new' });
        const contactedLeads = await Lead.countDocuments({ status: 'contacted' });
        const qualifiedLeads = await Lead.countDocuments({ status: 'qualified' });
        const convertedLeads = await Lead.countDocuments({ status: 'converted' });
        const lostLeads = await Lead.countDocuments({ status: 'lost' });
        
        // Leads by source
        const leadsBySource = await Lead.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);
        
        res.json({
            total: totalLeads,
            byStatus: {
                new: newLeads,
                contacted: contactedLeads,
                qualified: qualifiedLeads,
                converted: convertedLeads,
                lost: lostLeads
            },
            bySource: leadsBySource
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    addNote,
    getAnalytics
};
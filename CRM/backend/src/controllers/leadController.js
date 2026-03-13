// backend/controllers/leadController.js
const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
    try {
        const { status, search, sort, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }
        
        // Search functionality
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Sorting
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'name') {
            sortOption = { firstName: 1 };
        } else if (sort === 'status') {
            sortOption = { status: 1 };
        }
        
        const leads = await Lead.find(query)
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip)
            .populate('createdBy', 'name email')
            .populate('notes.createdBy', 'name');
        
        const total = await Lead.countDocuments(query);
        
        res.json({
            success: true,
            data: leads,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('notes.createdBy', 'name');
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }
        
        res.json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, company, source } = req.body;
        
        // Check if lead exists
        const existingLead = await Lead.findOne({ email });
        if (existingLead) {
            return res.status(400).json({
                success: false,
                message: 'Lead with this email already exists'
            });
        }
        
        const lead = await Lead.create({
            firstName,
            lastName,
            email,
            phone,
            company,
            source,
            createdBy: req.user.id
        });
        
        res.status(201).json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }
        
        // Update fields
        const fieldsToUpdate = ['firstName', 'lastName', 'email', 'phone', 'company', 'source', 'status'];
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                lead[field] = req.body[field];
            }
        });
        
        await lead.save();
        
        res.json({
            success: true,
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }
        
        await lead.deleteOne();
        
        res.json({
            success: true,
            message: 'Lead removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addNote = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }
        
        lead.notes.push({
            content: req.body.content,
            createdBy: req.user.id
        });
        
        await lead.save();
        
        const updatedLead = await Lead.findById(req.params.id)
            .populate('notes.createdBy', 'name');
        
        res.json({
            success: true,
            data: updatedLead
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get lead analytics
// @route   GET /api/leads/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        
        const leadsByStatus = await Lead.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        
        const leadsBySource = await Lead.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);
        
        // Leads created in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentLeads = await Lead.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        // Conversion rate
        const convertedLeads = await Lead.countDocuments({ status: 'converted' });
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
        
        const statusMap = {
            new: 0,
            contacted: 0,
            qualified: 0,
            converted: 0,
            lost: 0
        };
        
        leadsByStatus.forEach(item => {
            statusMap[item._id] = item.count;
        });
        
        res.json({
            success: true,
            data: {
                total: totalLeads,
                recent: recentLeads,
                conversionRate: conversionRate.toFixed(1),
                byStatus: statusMap,
                bySource: leadsBySource
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
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
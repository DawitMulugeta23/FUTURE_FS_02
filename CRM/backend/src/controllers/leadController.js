// backend/src/controllers/leadController.js
const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
    try {
        const { status, search, sort, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        // Only show leads created by the current user or all if admin
        query.createdBy = req.user.id;
        
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
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        
        // Sorting
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'name') {
            sortOption = { firstName: 1, lastName: 1 };
        } else if (sort === 'status') {
            sortOption = { status: 1, createdAt: -1 };
        }
        
        const leads = await Lead.find(query)
            .sort(sortOption)
            .limit(limitNum)
            .skip(skip)
            .populate('createdBy', 'name email')
            .populate('notes.createdBy', 'name');
        
        const total = await Lead.countDocuments(query);
        
        res.status(200).json({
            success: true,
            data: leads,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error in getLeads:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching leads'
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

        // Check if user owns the lead or is admin
        if (lead.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this lead'
            });
        }
        
        res.status(200).json({
            success: true,
            data: lead
        });
    } catch (error) {
        console.error('Error in getLeadById:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching lead'
        });
    }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
    try {
        console.log('Creating lead with data:', req.body);
        console.log('User ID:', req.user.id);
        
        const { firstName, lastName, email, phone, company, source } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide firstName, lastName, and email'
            });
        }
        
        // Check if lead exists
        const existingLead = await Lead.findOne({ email, createdBy: req.user.id });
        if (existingLead) {
            return res.status(400).json({
                success: false,
                message: 'Lead with this email already exists'
            });
        }
        
        const leadData = {
            firstName,
            lastName,
            email,
            phone: phone || '',
            company: company || '',
            source: source || 'website',
            status: 'new',
            createdBy: req.user.id,
            notes: [],
            convertedAt: null // Initialize as null
        };
        
        console.log('Creating lead with data:', leadData);
        
        const lead = await Lead.create(leadData);
        
        // Populate the createdBy field
        const populatedLead = await Lead.findById(lead._id)
            .populate('createdBy', 'name email');
        
        console.log('Lead created successfully:', populatedLead._id);
        
        res.status(201).json({
            success: true,
            data: populatedLead,
            message: 'Lead created successfully'
        });
    } catch (error) {
        console.error('Error in createLead:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Lead with this email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating lead'
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

        // Check if user owns the lead or is admin
        if (lead.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this lead'
            });
        }
        
        // Update fields
        const fieldsToUpdate = ['firstName', 'lastName', 'email', 'phone', 'company', 'source', 'status'];
        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                lead[field] = req.body[field];
            }
        });
        
        // Handle convertedAt logic in controller instead of middleware
        if (req.body.status === 'converted' && lead.status !== 'converted') {
            lead.convertedAt = Date.now();
        } else if (req.body.status && req.body.status !== 'converted' && lead.status === 'converted') {
            // If changing from converted to another status, you might want to clear convertedAt
            // Uncomment the next line if you want this behavior
            // lead.convertedAt = null;
        }
        
        await lead.save();
        
        // Populate the updated lead
        const updatedLead = await Lead.findById(lead._id)
            .populate('createdBy', 'name email')
            .populate('notes.createdBy', 'name');
        
        res.status(200).json({
            success: true,
            data: updatedLead,
            message: 'Lead updated successfully'
        });
    } catch (error) {
        console.error('Error in updateLead:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating lead'
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

        // Check if user owns the lead or is admin
        if (lead.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this lead'
            });
        }
        
        await lead.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Lead removed successfully'
        });
    } catch (error) {
        console.error('Error in deleteLead:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while deleting lead'
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

        // Check if user owns the lead or is admin
        if (lead.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to add notes to this lead'
            });
        }
        
        if (!req.body.content) {
            return res.status(400).json({
                success: false,
                message: 'Note content is required'
            });
        }
        
        lead.notes.push({
            content: req.body.content,
            createdBy: req.user.id,
            createdAt: Date.now()
        });
        
        await lead.save();
        
        const updatedLead = await Lead.findById(req.params.id)
            .populate('notes.createdBy', 'name');
        
        res.status(200).json({
            success: true,
            data: updatedLead,
            message: 'Note added successfully'
        });
    } catch (error) {
        console.error('Error in addNote:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while adding note'
        });
    }
};

// @desc    Get lead analytics
// @route   GET /api/leads/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        // Get analytics only for current user's leads
        const userId = req.user.id;
        
        console.log('Fetching analytics for user:', userId);
        
        const totalLeads = await Lead.countDocuments({ createdBy: userId });
        console.log('Total leads:', totalLeads);
        
        const leadsByStatus = await Lead.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        console.log('Leads by status:', leadsByStatus);
        
        const leadsBySource = await Lead.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);
        console.log('Leads by source:', leadsBySource);
        
        // Leads created in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentLeads = await Lead.countDocuments({
            createdBy: userId,
            createdAt: { $gte: thirtyDaysAgo }
        });
        console.log('Recent leads (30 days):', recentLeads);
        
        // Conversion rate
        const convertedLeads = await Lead.countDocuments({ 
            createdBy: userId,
            status: 'converted' 
        });
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
        
        // Create status map with all statuses
        const statusMap = {
            new: 0,
            contacted: 0,
            qualified: 0,
            converted: 0,
            lost: 0
        };
        
        // Update with actual counts
        leadsByStatus.forEach(item => {
            if (item._id && statusMap.hasOwnProperty(item._id)) {
                statusMap[item._id] = item.count;
            }
        });
        
        const responseData = {
            total: totalLeads,
            recent: recentLeads,
            conversionRate: conversionRate.toFixed(1),
            byStatus: statusMap,
            bySource: leadsBySource
        };
        
        console.log('Sending analytics response:', responseData);
        
        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Error in getAnalytics:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching analytics'
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
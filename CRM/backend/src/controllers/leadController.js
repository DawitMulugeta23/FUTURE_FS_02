const Lead = require('../models/Lead');
const nodemailer = require('nodemailer');

// Add this email configuration after imports
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// @desc    Send email to lead
// @route   POST /api/leads/:id/email
// @access  Private
const sendEmailToLead = async (req, res) => {
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
        message: 'Not authorized to email this lead'
      });
    }

    const { subject, message } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject and message'
      });
    }

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: lead.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">CRM System</h2>
          <p>Hello ${lead.firstName} ${lead.lastName},</p>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <p style="color: #6b7280; font-size: 12px;">This email was sent from the CRM System.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Add activity record
    await Activity.create({
      leadId: lead._id,
      userId: req.user.id,
      type: 'email',
      title: `Email sent: ${subject}`,
      description: message.substring(0, 200),
      outcome: 'positive',
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error in sendEmailToLead:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while sending email'
    });
  }
};

// @desc    Get email replies (webhook endpoint)
// @route   POST /api/leads/email/webhook
// @access  Public
const handleEmailWebhook = async (req, res) => {
  try {
    const { email, subject, message, from } = req.body;
    
    // Find lead by email
    const lead = await Lead.findOne({ email: from });
    
    if (lead) {
      // Add reply as a note
      lead.notes.push({
        content: `Email Reply: ${subject}\n\n${message}`,
        createdBy: lead.createdBy,
        createdAt: Date.now()
      });
      await lead.save();
      
      // Add activity
      await Activity.create({
        leadId: lead._id,
        userId: lead.createdBy,
        type: 'email',
        title: `Email reply received: ${subject}`,
        description: message.substring(0, 200),
        outcome: 'positive',
      });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in handleEmailWebhook:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update module.exports to include new functions
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

// @access  Private
const getAnalytics = async (req, res) => {
    try {
        // Get analytics only for current user's leads
        const userId = req.user.id;
        const { range } = req.query;
        
        console.log('Fetching analytics for user:', userId);
        console.log('Time range:', range);
        
        // Base query for user's leads
        let baseQuery = { createdBy: userId };
        
        // Add date filter based on range
        let recentDateFilter = {};
        let dateFilter = {};
        
        const now = new Date();
        let startDate = null;
        
        switch (range) {
            case '7days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                dateFilter = { createdAt: { $gte: startDate } };
                recentDateFilter = { createdAt: { $gte: startDate } };
                break;
            case '30days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                dateFilter = { createdAt: { $gte: startDate } };
                recentDateFilter = { createdAt: { $gte: startDate } };
                break;
            case '90days':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 90);
                dateFilter = { createdAt: { $gte: startDate } };
                recentDateFilter = { createdAt: { $gte: startDate } };
                break;
            case 'year':
                startDate = new Date();
                startDate.setFullYear(startDate.getFullYear() - 1);
                dateFilter = { createdAt: { $gte: startDate } };
                recentDateFilter = { createdAt: { $gte: startDate } };
                break;
            case 'all':
            default:
                // No date filter for 'all'
                dateFilter = {};
                // For recent (30 days), still use 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                recentDateFilter = { createdAt: { $gte: thirtyDaysAgo } };
                break;
        }
        
        // Apply date filter for total count
        const queryWithDate = { ...baseQuery, ...dateFilter };
        
        const totalLeads = await Lead.countDocuments(queryWithDate);
        console.log('Total leads in period:', totalLeads);
        
        const leadsByStatus = await Lead.aggregate([
            { $match: queryWithDate },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        console.log('Leads by status:', leadsByStatus);
        
        const leadsBySource = await Lead.aggregate([
            { $match: queryWithDate },
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);
        console.log('Leads by source:', leadsBySource);
        
        // Leads created in last 30 days (for the recent metric)
        const recentLeads = await Lead.countDocuments({
            createdBy: userId,
            ...recentDateFilter
        });
        console.log('Recent leads:', recentLeads);
        
        // Conversion rate (only for leads that are converted in the period)
        const convertedLeads = await Lead.countDocuments({ 
            ...queryWithDate,
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
    getAnalytics,
    sendEmailToLead,
    handleEmailWebhook
};

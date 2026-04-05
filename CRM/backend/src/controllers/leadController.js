// backend/src/controllers/leadController.js
const Lead = require("../models/Lead");
const Activity = require("../models/Activity");

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const { status, search, sort, page = 1, limit = 10 } = req.query;

    let query = {};

    query.createdBy = req.user.id;

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "name") {
      sortOption = { firstName: 1, lastName: 1 };
    } else if (sort === "status") {
      sortOption = { status: 1, createdAt: -1 };
    }

    const leads = await Lead.find(query)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip)
      .populate("createdBy", "name email")
      .populate("notes.createdBy", "name")
      .populate("emailHistory.sentBy", "name email");

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error in getLeads:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching leads",
    });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("notes.createdBy", "name")
      .populate("emailHistory.sentBy", "name email");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this lead",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Error in getLeadById:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching lead",
    });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, source } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide firstName, lastName, and email",
      });
    }

    const existingLead = await Lead.findOne({ email, createdBy: req.user.id });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "Lead with this email already exists",
      });
    }

    const leadData = {
      firstName,
      lastName,
      email,
      phone: phone || "",
      company: company || "",
      source: source || "website",
      status: "new",
      createdBy: req.user.id,
      notes: [],
      emailHistory: [],
      convertedAt: null,
    };

    const lead = await Lead.create(leadData);

    await Activity.create({
      leadId: lead._id,
      userId: req.user.id,
      type: "note",
      title: "Lead created",
      description: `Lead ${firstName} ${lastName} was created`,
      outcome: "positive",
    });

    const populatedLead = await Lead.findById(lead._id).populate(
      "createdBy",
      "name email",
    );

    res.status(201).json({
      success: true,
      data: populatedLead,
      message: "Lead created successfully",
    });
  } catch (error) {
    console.error("Error in createLead:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Lead with this email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating lead",
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
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this lead",
      });
    }

    const oldStatus = lead.status;
    const fieldsToUpdate = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "source",
      "status",
    ];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        lead[field] = req.body[field];
      }
    });

    if (req.body.status === "converted" && lead.status !== "converted") {
      lead.convertedAt = Date.now();
    }

    await lead.save();

    if (oldStatus !== lead.status) {
      await Activity.create({
        leadId: lead._id,
        userId: req.user.id,
        type: "status_change",
        title: "Status changed",
        description: `Lead status changed from ${oldStatus} to ${lead.status}`,
        outcome: lead.status === "converted" ? "positive" : "neutral",
      });
    }

    const updatedLead = await Lead.findById(lead._id)
      .populate("createdBy", "name email")
      .populate("notes.createdBy", "name")
      .populate("emailHistory.sentBy", "name email");

    res.status(200).json({
      success: true,
      data: updatedLead,
      message: "Lead updated successfully",
    });
  } catch (error) {
    console.error("Error in updateLead:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating lead",
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
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this lead",
      });
    }

    await Activity.deleteMany({ leadId: lead._id });
    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead removed successfully",
    });
  } catch (error) {
    console.error("Error in deleteLead:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while deleting lead",
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
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add notes to this lead",
      });
    }

    if (!req.body.content) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    lead.notes.push({
      content: req.body.content,
      createdBy: req.user.id,
      createdAt: Date.now(),
    });

    await lead.save();

    await Activity.create({
      leadId: lead._id,
      userId: req.user.id,
      type: "note",
      title: "Note added",
      description: req.body.content.substring(0, 200),
      outcome: "neutral",
    });

    const updatedLead = await Lead.findById(req.params.id)
      .populate("notes.createdBy", "name")
      .populate("emailHistory.sentBy", "name email");

    res.status(200).json({
      success: true,
      data: updatedLead,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Error in addNote:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while adding note",
    });
  }
};

// @desc    Get analytics
// @route   GET /api/leads/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { range } = req.query;

    let baseQuery = { createdBy: userId };
    let dateFilter = {};

    switch (range) {
      case "7days":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        dateFilter = { createdAt: { $gte: sevenDaysAgo } };
        break;
      case "30days":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
        break;
      case "90days":
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        dateFilter = { createdAt: { $gte: ninetyDaysAgo } };
        break;
      case "year":
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        dateFilter = { createdAt: { $gte: oneYearAgo } };
        break;
      default:
        dateFilter = {};
        break;
    }

    const queryWithDate = { ...baseQuery, ...dateFilter };
    const allLeads = await Lead.find(queryWithDate);
    const totalLeads = allLeads.length;

    const statusCounts = {
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };

    allLeads.forEach((lead) => {
      if (statusCounts.hasOwnProperty(lead.status)) {
        statusCounts[lead.status]++;
      }
    });

    const sourceMap = {};
    allLeads.forEach((lead) => {
      const source = lead.source || "other";
      sourceMap[source] = (sourceMap[source] || 0) + 1;
    });

    const leadsBySource = Object.entries(sourceMap).map(([id, count]) => ({
      _id: id,
      count,
    }));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLeads = await Lead.countDocuments({
      createdBy: userId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    const convertedLeads = statusCounts.converted;
    const conversionRate =
      totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const responseData = {
      total: totalLeads,
      recent: recentLeads,
      conversionRate: conversionRate.toFixed(1),
      byStatus: statusCounts,
      bySource: leadsBySource,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching analytics",
    });
  }
};

// @desc    Send email to lead
// @route   POST /api/leads/:id/email
// @access  Private
const sendEmailToLead = async (req, res) => {
  try {
    const nodemailer = require("nodemailer");

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to email this lead",
      });
    }

    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject and message",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: lead.email,
      subject: subject,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4f46e5;">CRM System</h2>
                    <p>Hello ${lead.firstName} ${lead.lastName},</p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        ${message.replace(/\n/g, "<br/>")}
                    </div>
                    <p style="color: #6b7280; font-size: 12px;">This email was sent from the CRM System.</p>
                    <hr style="margin: 20px 0;" />
                    <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
                        <p style="color: #166534; font-size: 13px; margin: 0;">
                            <strong>📬 Reply to this email</strong><br/>
                            Your response will be automatically tracked in our system.
                        </p>
                    </div>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);

    lead.emailHistory.push({
      subject: subject,
      message: message,
      sentBy: req.user.id,
      sentAt: Date.now(),
      status: "sent",
      replyReceived: false,
      replyMessage: null,
      replyReceivedAt: null,
    });

    await lead.save();

    await Activity.create({
      leadId: lead._id,
      userId: req.user.id,
      type: "email",
      title: `Email sent: ${subject}`,
      description: message.substring(0, 200),
      outcome: "positive",
    });

    const updatedLead = await Lead.findById(lead._id).populate(
      "emailHistory.sentBy",
      "name email",
    );

    res.status(200).json({
      success: true,
      data: updatedLead,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error in sendEmailToLead:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while sending email",
    });
  }
};

// @desc    Add reply from lead
// @route   POST /api/leads/:id/reply
// @access  Private
const addLeadReply = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add replies to this lead",
      });
    }

    // Find the most recent email sent to this lead
    const lastEmail = lead.emailHistory[lead.emailHistory.length - 1];

    if (lastEmail) {
      lastEmail.replyReceived = true;
      lastEmail.replyMessage = replyMessage;
      lastEmail.replyReceivedAt = Date.now();
    }

    // Add a note about the reply
    lead.notes.push({
      content: `📨 Lead replied:\n\n${replyMessage}`,
      createdBy: req.user.id,
      createdAt: Date.now(),
    });

    await lead.save();

    await Activity.create({
      leadId: lead._id,
      userId: req.user.id,
      type: "email",
      title: "📬 Lead replied to email",
      description: replyMessage.substring(0, 200),
      outcome: "positive",
    });

    const updatedLead = await Lead.findById(lead._id)
      .populate("createdBy", "name email")
      .populate("notes.createdBy", "name")
      .populate("emailHistory.sentBy", "name email");

    res.status(200).json({
      success: true,
      data: updatedLead,
      message: "Reply added successfully",
    });
  } catch (error) {
    console.error("Error in addLeadReply:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while adding reply",
    });
  }
};

// @desc    Get all replies for a lead
// @route   GET /api/leads/:id/replies
// @access  Private
const getReplies = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "emailHistory.sentBy",
      "name email",
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view replies for this lead",
      });
    }

    const replies = lead.emailHistory.filter(
      (email) => email.replyReceived === true,
    );

    res.status(200).json({
      success: true,
      data: replies,
    });
  } catch (error) {
    console.error("Error in getReplies:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching replies",
    });
  }
};

// @desc    Get email history for a lead
// @route   GET /api/leads/:id/emails
// @access  Private
const getEmailHistory = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "emailHistory.sentBy",
      "name email",
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view email history for this lead",
      });
    }

    res.status(200).json({
      success: true,
      data: lead.emailHistory,
    });
  } catch (error) {
    console.error("Error in getEmailHistory:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching email history",
    });
  }
};

// @desc    Handle email webhook
// @route   POST /api/leads/email/webhook
// @access  Public
const handleEmailWebhook = async (req, res) => {
  try {
    const { from, subject, message } = req.body;
    const senderEmail = from;

    const lead = await Lead.findOne({ email: senderEmail });

    if (lead) {
      const originalEmail = lead.emailHistory.find(
        (e) => e.subject === subject,
      );

      if (originalEmail) {
        originalEmail.replyReceived = true;
        originalEmail.replyMessage = message;
        originalEmail.replyReceivedAt = Date.now();
      }

      lead.notes.push({
        content: `Email Reply Received:\n\nOriginal Subject: ${subject}\n\nReply: ${message}`,
        createdBy: lead.createdBy,
        createdAt: Date.now(),
      });
      await lead.save();

      await Activity.create({
        leadId: lead._id,
        userId: lead.createdBy,
        type: "email",
        title: `Email reply received: ${subject}`,
        description: message.substring(0, 200),
        outcome: "positive",
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in handleEmailWebhook:", error);
    res.status(500).json({ success: false, message: error.message });
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
  addLeadReply,
  getReplies,
  getEmailHistory,
  handleEmailWebhook,
};

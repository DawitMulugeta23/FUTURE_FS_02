const sendEmail = require("../utils/sendEmail");
const Lead = require("../models/Lead");

// @desc    Send email to lead
// @route   POST /api/email/send-to-lead
// @access  Private
const sendEmailToLead = async (req, res) => {
  try {
    const { leadId, subject, message } = req.body;

    if (!leadId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide leadId, subject and message",
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if user owns the lead
    if (
      lead.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to send email to this lead",
      });
    }

    const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #6c757d;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${subject.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${lead.firstName} ${lead.lastName},</h2>
                        <div style="white-space: pre-line;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                        <hr style="margin: 20px 0;">
                        <p style="font-size: 12px; color: #666;">
                            This email was sent from CRM System. If you have any questions, please reply to this email.
                        </p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} CRM System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

    await sendEmail({
      email: lead.email,
      subject: subject,
      html: emailHtml,
    });

    // Add note to lead about email sent
    lead.notes.push({
      content: `Email sent: "${subject}"`,
      createdBy: req.user.id,
      createdAt: Date.now(),
    });
    await lead.save();

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while sending email",
    });
  }
};

// @desc    Send bulk email to leads
// @route   POST /api/email/send-bulk
// @access  Private
const sendBulkEmail = async (req, res) => {
  try {
    const { leadIds, subject, message } = req.body;

    if (!leadIds || !leadIds.length || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide leadIds, subject and message",
      });
    }

    const leads = await Lead.find({
      _id: { $in: leadIds },
      createdBy: req.user.id,
    });

    if (leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No leads found",
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const lead of leads) {
      try {
        const emailHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; }
                            .content { padding: 40px 30px; }
                            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>${subject.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h1>
                            </div>
                            <div class="content">
                                <h2>Hello ${lead.firstName} ${lead.lastName},</h2>
                                <div style="white-space: pre-line;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                                <hr style="margin: 20px 0;">
                                <p style="font-size: 12px; color: #666;">This email was sent from CRM System.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; ${new Date().getFullYear()} CRM System. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `;

        await sendEmail({
          email: lead.email,
          subject: subject,
          html: emailHtml,
        });

        // Add note to lead
        lead.notes.push({
          content: `Bulk email sent: "${subject}"`,
          createdBy: req.user.id,
          createdAt: Date.now(),
        });
        await lead.save();

        sentCount++;
      } catch (error) {
        console.error(`Failed to send email to ${lead.email}:`, error);
        failedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Emails sent: ${sentCount} successful, ${failedCount} failed`,
      data: { sentCount, failedCount },
    });
  } catch (error) {
    console.error("Bulk email error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while sending bulk emails",
    });
  }
};

module.exports = {
  sendEmailToLead,
  sendBulkEmail,
};

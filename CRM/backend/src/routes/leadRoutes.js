// backend/src/routes/leadRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
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
} = require("../controllers/leadController");
const { validate, leadSchema, noteSchema } = require("../utils/validation");

// Public webhook for email replies
router.post("/email/webhook", handleEmailWebhook);

// Protect all other routes
router.use(protect);

router.route("/").get(getLeads).post(validate(leadSchema), createLead);

router.get("/analytics", getAnalytics);

router
  .route("/:id")
  .get(getLeadById)
  .put(validate(leadSchema.partial()), updateLead)
  .delete(deleteLead);

router.post("/:id/notes", validate(noteSchema), addNote);
router.post("/:id/email", sendEmailToLead);
router.post("/:id/reply", addLeadReply);
router.get("/:id/replies", getReplies);
router.get("/:id/emails", getEmailHistory);

module.exports = router;

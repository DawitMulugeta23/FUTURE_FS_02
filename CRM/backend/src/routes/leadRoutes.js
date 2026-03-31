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
} = require("../controllers/leadController");

// Protect all routes
router.use(protect);

router.route("/").get(getLeads).post(createLead);

router.get("/analytics", getAnalytics);

router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);

router.post("/:id/notes", addNote);

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  sendEmailToLead,
  sendBulkEmail,
} = require("../controllers/emailController");

router.use(protect);

router.post("/send-to-lead", sendEmailToLead);
router.post("/send-bulk", sendBulkEmail);

module.exports = router;

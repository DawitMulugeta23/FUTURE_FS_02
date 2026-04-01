const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    addNote,
    getAnalytics,
    sendEmailToLead,
    handleEmailWebhook
} = require('../controllers/leadController');
const { validate, leadSchema, noteSchema } = require('../utils/validation');

router.post('/email/webhook', handleEmailWebhook);

router.use(protect);

router.route('/')
    .get(getLeads)
    .post(validate(leadSchema), createLead);

router.get('/analytics', getAnalytics);

router.route('/:id')
    .get(getLeadById)
    .put(validate(leadSchema.partial()), updateLead)
    .delete(deleteLead);

router.post('/:id/notes', validate(noteSchema), addNote);
router.post('/:id/email', sendEmailToLead);

module.exports = router;
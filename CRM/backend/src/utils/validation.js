// backend/src/utils/validation.js
const { z } = require('zod');

// User validation schemas
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

// Lead validation schemas
const leadSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().optional(),
    company: z.string().optional(),
    source: z.enum(['website', 'referral', 'social_media', 'email_campaign', 'advertisement', 'other']),
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional()
});

const noteSchema = z.object({
    content: z.string().min(1, 'Note content is required')
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: error.errors
        });
    }
};

module.exports = {
    registerSchema,
    loginSchema,
    leadSchema,
    noteSchema,
    validate
};
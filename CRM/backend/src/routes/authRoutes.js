// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation rules
const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
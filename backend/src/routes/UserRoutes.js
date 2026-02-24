const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validate, userValidationRules, resetPasswordValidationRules } = require('../middleware/validator');

const { protect } = require('../middleware/auth');

router.post('/register', userValidationRules(), validate, UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/me', protect, UserController.getMe);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidationRules(), validate, UserController.resetPassword);
router.get('/verify/:token', UserController.verify);

module.exports = router;

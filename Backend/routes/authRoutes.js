const express = require('express');
const { googleLogin, loginLimiter } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginLimiter, googleLogin);

module.exports = router;
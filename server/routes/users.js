const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/googleLogin', authController.registerWithGoogle);

router.post('/facebookLogin', authController.registerWithFacebook);

module.exports = router;

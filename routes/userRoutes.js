const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/rbac');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/logout', verifyToken, userController.logout);

module.exports = router;

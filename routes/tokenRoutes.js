const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');

router.post('/generate-admin-token', userController.generateAdminToken);
router.post('/generate-user-token', userController.generateUserToken);

module.exports = router;

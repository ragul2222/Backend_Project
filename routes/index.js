const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const tokenRoutes = require('./tokenRoutes');

router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/token', tokenRoutes);

module.exports = router;

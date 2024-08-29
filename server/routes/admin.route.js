const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth.middleware');
const { promoteToAdmin } = require('../controller/admin.controller');

router.post('/promote', authenticate, authorizeRole('admin'), promoteToAdmin);

module.exports = router;

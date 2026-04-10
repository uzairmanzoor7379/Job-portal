const express = require('express');
const { submitQuery, getAllQueries } = require('../controllers/query.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Submit query - public (no auth required)
router.post('/', submitQuery);

// Get all queries - admin only (optional - add auth later)
router.get('/', protect, getAllQueries);

module.exports = router;

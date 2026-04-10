const express = require('express');
const router = express.Router();
const {
    applyJob,
    getSeekerApplications,
    getJobApplications,
    updateApplicationStatus,
} = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');

// Seekers
router.post('/apply/:id', protect, applyJob);
router.get('/seeker', protect, getSeekerApplications);


// Employers
router.get('/job/:id', protect, getJobApplications);
router.put('/:id/status', protect, updateApplicationStatus);

module.exports = router;

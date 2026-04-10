const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
    checkApplicationStatus,
} = require('../controllers/job.controller');
const { protect, optionalProtect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getJobs);
router.get('/my-jobs', protect, getMyJobs); // must be before /:id
router.get('/:id', optionalProtect, getJobById);

// Protected routes (employer only)
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;

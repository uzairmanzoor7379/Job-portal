const mongoose = require('mongoose');
const Application = require('../models/Application.model');
const Job = require('../models/Job.model');

// Allowed status values — single source of truth
const VALID_STATUSES = ['pending', 'shortlisted', 'rejected', 'accepted'];

// @desc    Apply for a job
// @route   POST /api/applications/apply/:id
// @access  Private (Seeker only)
const applyJob = async (req, res) => {
    try {
        if (req.user.role !== 'seeker') {
            return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
        }

        if (!req.user.resume) {
            return res.status(400).json({ message: 'Please upload a resume in your profile before applying' });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const existingApp = await Application.findOne({ job: job._id, seeker: req.user._id });
        if (existingApp) {
            if (existingApp.status === 'rejected') {
                // If previously rejected, delete the old application so they can re-apply
                await existingApp.deleteOne();
            } else {
                return res.status(400).json({ message: 'You have already applied for this job' });
            }
        }

        const application = await Application.create({
            job: job._id,
            seeker: req.user._id,
            employer: job.employer,
            status: 'pending',
        });

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Get seeker's applications
// @route   GET /api/applications/seeker
// @access  Private (Seeker only)
const getSeekerApplications = async (req, res) => {
    try {
        if (req.user.role !== 'seeker') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ seeker: req.user._id })
            .populate('job', 'title location jobType companyName')
            .populate('employer', 'name companyName')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:id
// @access  Private (Employer only)
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view applications for this job' });
        }

        const applications = await Application.find({ job: job._id })
            .populate('seeker', 'name email phone resume skills bio location')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Issue #9 — validate status before any DB operation
        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    applyJob,
    getSeekerApplications,
    getJobApplications,
    updateApplicationStatus,
};

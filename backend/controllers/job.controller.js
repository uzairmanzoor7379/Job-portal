const Job = require('../models/Job.model');
const Application = require('../models/Application.model');
const mongoose = require('mongoose');

// ... (rest of the imports/logic)


// @desc    Create a job listing
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can create job listings' });
        }

        const { title, description, qualifications, responsibilities, location, jobType, salaryMin, salaryMax } = req.body;

        if (!title || !description || !qualifications || !responsibilities || !location) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const job = await Job.create({
            title,
            description,
            qualifications,
            responsibilities,
            location,
            jobType,
            salaryMin,
            salaryMax,
            employer: req.user._id,
        });

        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        // Issue #11 — generic error, no internal details exposed
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Get all job listings (public)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { keyword, location, jobType } = req.query;
        let query = { isActive: true };

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (jobType) {
            query.jobType = jobType;
        }

        const jobs = await Job.find(query)
            .populate('employer', 'name companyName location')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Get single job listing
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employer', 'name companyName location website');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Logic added: if seeker is logged in, check if they applied
        if (req.user && req.user.role === 'seeker') {
            const application = await Application.findOne({ job: job._id, seeker: req.user._id });
            if (application) {
                const jobObj = job.toObject();
                jobObj.applied = true;
                jobObj.applicationStatus = application.status;
                return res.json(jobObj);
            }
        }

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Update a job listing
// @route   PUT /api/jobs/:id
// @access  Private (Employer owner only)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        // Issue #6 — whitelist only allowed fields; never pass req.body directly
        const { title, description, qualifications, responsibilities, location, jobType, salaryMin, salaryMax, isActive } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { title, description, qualifications, responsibilities, location, jobType, salaryMin, salaryMax, isActive },
            { new: true, runValidators: true }
        ).populate('employer', 'name companyName');

        res.json(updatedJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Delete a job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Employer owner only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Get jobs posted by the logged-in employer
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer only)
const getMyJobs = async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can access this route' });
        }

        const jobsWithAppCount = await Job.aggregate([
            { $match: { employer: new mongoose.Types.ObjectId(req.user._id) } },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'applications'
                }
            },
            {
                $addFields: {
                    applicationCount: { $size: '$applications' }
                }
            },
            { $project: { applications: 0 } },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(jobsWithAppCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc    Check if current seeker applied to this job
// @route   GET /api/jobs/:id/applied-status
// @access  Private (Seeker only)
const checkApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== 'seeker') {
             return res.json({ applied: false });
        }

        const application = await Application.findOne({
            job: req.params.id,
            seeker: req.user._id
        });

        if (application) {
             res.json({ applied: true, status: application.status });
        } else {
             res.json({ applied: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs, checkApplicationStatus };

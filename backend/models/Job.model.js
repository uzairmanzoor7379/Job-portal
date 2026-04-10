const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a job description'],
    },
    qualifications: {
        type: String,
        required: [true, 'Please add qualifications'],
    },
    responsibilities: {
        type: String,
        required: [true, 'Please add responsibilities'],
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
        default: 'full-time',
    },
    salaryMin: {
        type: Number,
        default: 0,
    },
    salaryMax: {
        type: Number,
        default: 0,
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;

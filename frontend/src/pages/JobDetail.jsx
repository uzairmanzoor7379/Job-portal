import { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import { AuthContext } from '../context/AuthContext';
import { ApplicationContext } from '../context/ApplicationContext';
import '../styles/jobs.scss';
import '../styles/applications.scss';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getJobById, deleteJob, loading: jobLoading } = useContext(JobContext);
    const { user } = useContext(AuthContext);
    const {
        applyToJob,
        fetchJobApplications,
        jobApplications,
        updateStatus,
        loading: appLoading
    } = useContext(ApplicationContext);

    const [job, setJob] = useState(null);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get Job Details (now includes 'applied' status automatically)
                const data = await getJobById(id);
                setJob(data);

                // 2. Set applied state from the job data
                if (data.applied && data.applicationStatus !== 'rejected') {
                    setApplied(true);
                } else {
                    setApplied(false);
                }

                // 3. If Employer, fetch applications for this job
                if (user && user.role === 'employer' && data.employer?._id === user._id) {
                    await fetchJobApplications(id);
                }
            } catch (err) {
                setError('This job post has been deleted by the employer');
            }
        };

        if (id) fetchData();
        // eslint-disable-next-line
    }, [id, user]);

    const handleApply = async () => {
        if (!user) return navigate('/login');
        if (!user.resume) return alert('Please upload a resume in your profile before applying!');

        setApplying(true);
        try {
            await applyToJob(id);
            setApplied(true);
            alert('Application submitted successfully!');
        } catch (err) {
            alert(err);
        } finally {
            setApplying(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this job listing?')) {
            try {
                await deleteJob(id);
                navigate('/jobs');
            } catch (err) {
                alert(err);
            }
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await updateStatus(appId, newStatus);
            alert('Status updated successfully!');
        } catch (err) {
            alert(err);
        }
    };

    if (jobLoading || !job) {
        if (error) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', fontSize: '1.5rem'}}>{error}</div>;
        return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '2rem', fontWeight: '500'}}>Loading Job Details...</div>;
    }

    const isOwner = user && user.role === 'employer' && job.employer?._id === user._id;

    return (
        <div className="container job-detail-container centered-layout">
            <div className="job-detail-grid">
                {/* Left Column: Main Info */}
                <div className="job-main-info">
                    <div className="glass-panel main-info-card">
                        <div className="job-detail-header">
                            <span className="posted-date">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            <h1>{job.title}</h1>
                            <div className="company">{job.employer?.companyName || job.employer?.name}</div>
                        </div>

                        <div className="job-detail-content">
                            <div className="content-section">
                                <h3>About the role</h3>
                                <p>{job.description}</p>
                            </div>

                            <div className="content-section">
                                <h3>Responsibilities</h3>
                                {job.responsibilities?.split('\n').filter(line => line.trim()).map((line, index) => (
                                    <p key={index} className="list-format">{line}</p>
                                ))}
                            </div>

                            <div className="content-section">
                                <h3>Qualifications</h3>
                                {job.qualifications?.split('\n').filter(line => line.trim()).map((line, index) => (
                                    <p key={index} className="list-format">{line}</p>
                                ))}
                            </div>
                        </div>

                        {isOwner && (
                            <div className="owner-actions">
                                <button className="btn btn-primary" style={{ marginRight: '1rem' }} onClick={() => navigate(`/edit-job/${job._id}`)}>Edit Listing</button>
                                <button className="btn" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2' }} onClick={handleDelete}>Delete Listing</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sidebar Actions */}
                <div className="job-sidebar">
                    <div className="glass-panel sidebar-card">
                        <h3>Apply for this job</h3>
                        
                        <div className="sidebar-stats">
                            <div className="stat-row">
                                <span className="label">Salary</span>
                                <span className="value">${job.salaryMin}k - ${job.salaryMax}k</span>
                            </div>
                            <div className="stat-row">
                                <span className="label">Job Type</span>
                                <span className="value" style={{textTransform: 'capitalize'}}>{job.jobType}</span>
                            </div>
                            <div className="stat-row">
                                <span className="label">Location</span>
                                <span className="value">{job.location}</span>
                            </div>
                        </div>

                        <div className="sidebar-actions">
                            {user?.role === 'seeker' && (
                                <>
                                    <button
                                        className={`btn btn-primary btn-block ${applied ? 'btn-disabled' : ''}`}
                                        disabled={applying || applied}
                                        onClick={handleApply}
                                        style={{ marginBottom: '1rem' }}
                                    >
                                        {applying ? 'Applying...' : applied ? 'Applied' : 'Apply Now'}
                                    </button>
                                    <button className="btn btn-secondary btn-block" style={{ marginBottom: '1rem' }}>Save for Later</button>
                                </>
                            )}
                            {!user && (
                                <button className="btn btn-primary btn-block" style={{ marginBottom: '1rem' }} onClick={() => navigate('/login')}>Login to Apply</button>
                            )}
                            <button className="btn btn-outline btn-block" style={{ width: '100%', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0' }} onClick={() => navigate(-1)}>Back</button>
                        </div>
                    </div>

                    <div className="glass-panel sidebar-card company-card">
                        <div className="company-info-small">
                            <div className="company-logo-placeholder">🏢</div>
                            <div>
                                <h4 style={{ margin: 0 }}>{job.employer?.companyName || job.employer?.name}</h4>
                                <button className="link-btn" style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.9rem', cursor: 'pointer' }}> <a style={{color: '#2563eb'}} href={job.employer?.website} target="_blank">View company</a></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employer: Applicant Management Section */}
            {isOwner && (
                <div className="applicants-section">
                    <h2>Applicants ({jobApplications.length})</h2>
                    {jobApplications.length === 0 ? (
                        <div className="glass-panel no-applicants">No applications yet.</div>
                    ) : (
                        <div className="applicants-list">
                            {jobApplications.map(app => (
                                <div key={app._id} className="glass-panel applicant-card">
                                    <div className="applicant-header">
                                        <div className="name-email">
                                            <h3>{app.seeker.name}</h3>
                                            <p>{app.seeker.email} • {app.seeker.phone || 'No phone'}</p>
                                        </div>
                                        <div className={`status-badge ${app.status}`}>
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="applicant-details">
                                        <div>
                                            <h4>Location</h4>
                                            <p>{app.seeker.location || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <h4>Bio</h4>
                                            <p>{app.seeker.bio || 'No bio provided'}</p>
                                        </div>
                                        <div>
                                            <h4>Skills</h4>
                                            <p>{app.seeker.skills?.length > 0 ? app.seeker.skills.join(', ') : 'No skills listed'}</p>
                                        </div>
                                    </div>

                                    <div className="applicant-actions">
                                        {/* Issue #16 — use relative path for resume; proxied through Vite, carries auth cookie */}
                                        <a
                                            href={app.seeker.resume}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary"
                                            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}
                                        >
                                            View Resume
                                        </a>
                                        <div className="status-select-group">
                                            <label>Set Status:</label>
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDetail;

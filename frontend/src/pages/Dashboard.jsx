import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { JobContext } from '../context/JobContext';
import { ApplicationContext } from '../context/ApplicationContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/dashboard.scss';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { myJobs, fetchMyJobs } = useContext(JobContext);
    const { seekerApplications, fetchSeekerApplications } = useContext(ApplicationContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'employer') fetchMyJobs();
            if (user.role === 'seeker') fetchSeekerApplications();
        }
        // eslint-disable-next-line
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="container dashboard-loading">
                <h2>Please Login to View Dashboard</h2>
                <button onClick={() => navigate('/login')} className="btn btn-primary btn-login-mt">Go to Login</button>
            </div>
        );
    }

    const SeekerDashboard = () => (
        <div className="dashboard-content">
            <div className="stats-grid">
                <div className="glass-panel stat-card">
                    <h4>Total Applied</h4>
                    <div className="stat-number">{seekerApplications.length}</div>
                </div>
                <div className="glass-panel stat-card">
                    <h4>Shortlisted</h4>
                    <div className="stat-number">
                        {seekerApplications.filter(app => app.status === 'shortlisted').length}
                    </div>
                </div>
                <div className="glass-panel stat-card">
                    <h4>Interviews</h4>
                    <div className="stat-number">
                        {seekerApplications.filter(app => app.status === 'accepted').length}
                    </div>
                </div>
            </div>

            <div className="dashboard-section glass-panel" >
                <div className='dashboard-section-top'>
                    <h3>Recent Applications</h3>
                <button onClick={() => navigate('/my-applications')}>View All Applications</button>
                </div>
                {seekerApplications.length > 0 ? (
                    <table className="summary-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seekerApplications.slice(0, 5).map(app => (
                                <tr key={app._id}>
                                    <td><Link to={`/jobs/${app.job?._id}`} style={{ color: '#2563eb' }}>{app.job?.title}</Link></td>
                                    <td>{app.employer?.companyName || app.employer?.name}</td>
                                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                    <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-muted">No applications yet. <Link to="/jobs" style={{ color: '#2563eb' }}>Browse jobs</Link></p>
                )}
            </div>
        </div>
    );

    const EmployerDashboard = () => {
        const totalCandidates = myJobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0);
        
        return (
            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="glass-panel stat-card">
                        <h4>Active Listings</h4>
                        <div className="stat-number">{myJobs.length}</div>
                    </div>
                    <div className="glass-panel stat-card">
                        <h4>Total Candidates</h4>
                        <div className="stat-number">{totalCandidates}</div>
                    </div>
                    <div className="glass-panel stat-card">
                        <h4>Avg. Candidates</h4>
                        <div className="stat-number">
                            {myJobs.length > 0 ? (totalCandidates / myJobs.length).toFixed(1) : 0}
                        </div>
                    </div>
                </div>

                <div className="dashboard-section glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>My Active Listings</h3>
                        <button onClick={() => navigate('/create-job')} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>+ Post Job</button>
                    </div>
                    {myJobs.length > 0 ? (
                        <table className="summary-table">
                            <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Candidates</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myJobs.map(job => (
                                    <tr key={job._id}>
                                        <td>{job.title}</td>
                                        <td><span style={{ fontWeight: 600, color: '#2563eb' }}>{job.applicationCount || 0}</span> Applicants</td>
                                        <td><span className="status-badge accepted">Active</span></td>
                                        <td>
                                            <Link to={`/jobs/${job._id}`} className="info-link">Manage</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted">You haven't posted any jobs yet.</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container dashboard-container centered-layout">
            <div className="glass-panel dashboard-panel">
                <div className="dashboard-header">
                    <div>
                        <h2 className="dashboard-title" style={{ marginBottom: '0.25rem' }}>Dashboard</h2>
                        <p className="text-muted">Welcome back, <span style={{ color: '#0f172a', fontWeight: 600 }}>{user.name}</span></p>
                    </div>
                    <div className="dashboard-actions">
                        <button onClick={() => navigate('/Jobs')} className="btn btn-primary btn-action">Find Jobs</button>
                        <button onClick={() => navigate('/profile')} className="btn btn-secondary btn-action">Edit Profile</button>
                        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                    </div>
                </div>

                <hr className="dashboard-divider" />

                {user.role === 'seeker' ? <SeekerDashboard /> : <EmployerDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;

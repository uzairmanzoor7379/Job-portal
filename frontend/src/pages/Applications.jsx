import { useContext, useEffect } from 'react';
import { ApplicationContext } from '../context/ApplicationContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/applications.scss';

const Applications = () => {
    const { seekerApplications, fetchSeekerApplications, loading } = useContext(ApplicationContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'seeker') {
            navigate('/dashboard');
        } else {
            fetchSeekerApplications();
        }
        // eslint-disable-next-line
    }, []);

    if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '2rem', fontWeight: '500'}}>Loading Applications...</div>;

    return (
        <div className="applications-page">
            <div className="jobs-header">
                <h1>My Applications</h1>
            </div>

            {seekerApplications.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p className="text-muted" style={{ marginBottom: '1.5rem' }}>You haven't applied for any jobs yet.</p>
                    <button onClick={() => navigate('/jobs')} className="btn btn-primary">Browse Jobs</button>
                </div>
            ) : (
                <div className="applications-list">
                    {seekerApplications.map(app => (
                        <div key={app._id} className="glass-panel application-card">
                            <div className="app-info">
                                <h3 
                                    onClick={() => navigate(`/jobs/${app.jobId || app.job?._id}`)} 
                                    style={{ cursor: 'pointer' }}
                                >
                                    {app.jobTitle || app.job?.title || '[Job Deleted]'}
                                </h3>
                                <p className="company-name">{app.employer?.companyName || app.employer?.name}</p>
                                <p className="applied-on">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>
                            <div className={`status-badge ${app.status}`}>
                                {app.status}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;

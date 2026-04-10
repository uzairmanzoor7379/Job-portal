import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.scss';

const CreateJob = () => {
    const { createJob } = useContext(JobContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', description: '', qualifications: '', responsibilities: '',
        location: '', jobType: 'full-time', salaryMin: '', salaryMax: ''
    });
    const [error, setError] = useState(null);

    // Redirect seekers
    if (user && user.role !== 'employer') {
        navigate('/dashboard');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newJob = await createJob(formData);
            navigate(`/jobs/${newJob._id}`);
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="auth-container profile-container" style={{ padding: '4rem 2rem' }}>
            <div className="glass-panel auth-panel profile-panel" style={{ maxWidth: '800px' }}>
                <div className="auth-header">
                    <h2>Post a New Job</h2>
                    <p>Create a listing to find the perfect candidate</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Job Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ flex: '1 1 45%' }}>
                            <label>Location *</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Remote, New York" />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 45%' }}>
                            <label>Job Type *</label>
                            <select name="jobType" value={formData.jobType} onChange={handleChange} required className="profile-textarea" style={{height: '42px', padding: '0 1rem'}}>
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="remote">Remote</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ flex: '1 1 45%' }}>
                            <label>Minimum Salary (USD)</label>
                            <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} min="0" placeholder="e.g. 60000" />
                        </div>
                        <div className="form-group" style={{ flex: '1 1 45%' }}>
                            <label>Maximum Salary (USD)</label>
                            <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} min="0" placeholder="e.g. 90000" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Job Description *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required className="profile-textarea"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Qualifications *</label>
                        <textarea name="qualifications" value={formData.qualifications} onChange={handleChange} rows="4" required className="profile-textarea"></textarea>
                    </div>

                    <div className="form-group">
                        <label>Responsibilities *</label>
                        <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows="4" required className="profile-textarea"></textarea>
                    </div>

                    <div className="profile-actions">
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-cancel">Cancel</button>
                        <button type="submit" className="btn btn-primary btn-save">Post Job</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;

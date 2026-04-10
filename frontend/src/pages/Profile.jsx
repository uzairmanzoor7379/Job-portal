import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.scss';
import '../styles/profile.scss';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const { user, updateProfile } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '', phone: '', location: '', bio: '', skills: '',
        companyName: '', companyDescription: '', website: ''
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const Navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                skills: user.skills ? user.skills.join(', ') : '',
                companyName: user.companyName || '',
                companyDescription: user.companyDescription || '',
                website: user.website || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            let submitData;
            if (user.role === 'seeker') {
                submitData = new FormData();
                Object.keys(formData).forEach(key => {
                    if (formData[key]) submitData.append(key, formData[key]);
                });
                if (resumeFile) {
                    submitData.append('resume', resumeFile);
                }
            } else {
                submitData = formData;
            }

            await updateProfile(submitData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            Navigate('/dashboard');
        } catch (error) {
            setMessage({ type: 'error', text: error });
            console.error(error);
        }
    };

    if (!user) return <div className="container profile-loading">Loading...</div>;

    return (
        <div className="auth-container profile-container">
            <div className="glass-panel auth-panel profile-panel">
                <div className="auth-header">
                    <h2>Edit Profile</h2>
                    <p>Update your personal information and details</p>
                </div>

                {message.text && (
                    <div className={`error-message ${message.type === 'success' ? 'message-success' : ''}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form" encType={user.role === 'seeker' ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +1 555-1234" />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" />
                    </div>

                    {user.role === 'seeker' && (
                        <>
                            <div className="form-group">
                                <label>Professional Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell us about yourself..." className="profile-textarea"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Skills (comma separated)</label>
                                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" />
                            </div>
                            <div className="form-group">
                                {/* Issue #16 — use relative URL (proxied) instead of hardcoded localhost:5000 */}
                                <label>Resume (PDF/Doc) {user.resume && <span className="resume-label"><a href={user.resume} target="_blank" rel="noreferrer" className="resume-link">View Current</a></span>}</label>
                                <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="file-input" />
                            </div>
                        </>
                    )}

                    {user.role === 'employer' && (
                        <>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Company Website</label>
                                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                            </div>
                            <div className="form-group">
                                <label>Company Description</label>
                                <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="3" className="profile-textarea"></textarea>
                            </div>
                        </>
                    )}

                    <div className="profile-actions">
                        <button type="button" onClick={() => window.history.back()} className="btn btn-cancel">Cancel</button>
                        <button type="submit" className="btn btn-primary btn-save">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;

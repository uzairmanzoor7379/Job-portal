import { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import { QueryContext } from '../context/QueryContext';
import '../styles/contact.scss';

const Contact = () => {
    const { user } = useContext(AuthContext);
    const { loading, error, success, submitQuery, clearMessages } = useContext(QueryContext);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        clearMessages();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
            return;
        }

        try {
            await submitQuery(formData);
            setFormData({
                fullName: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (err) {
            // Error is already handled in context
        }
    };

    return (
        <div className="contact-wrapper">
            <Navbar />

            <main className="main-content container">
                <header className="contact-header">
                    <h1>Get in touch</h1>
                    <p>
                        Have questions about our platform or need help with your account? Our team is 
                        here to help. Reach out to us through any of the channels below.
                    </p>
                </header>

                <div className="contact-grid">
                    {/* Left Column: Info */}
                    <div className="contact-info-col">
                        <h2>Contact Information</h2>
                        
                        <div className="info-item">
                            <div className="icon-wrapper">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div className="info-text">
                                <h3>Email us</h3>
                                <p>We'll respond within 24 hours.</p>
                                <strong>support@jobportal.com</strong>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-wrapper">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div className="info-text">
                                <h3>Visit us</h3>
                                <p>Our global headquarters.</p>
                                <strong>123 Tech Avenue, Suite 400<br/>San Francisco, CA 94107</strong>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-wrapper">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>
                            </div>
                            <div className="info-text">
                                <h3>Call us</h3>
                                <p>Mon-Fri from 8am to 5pm PST.</p>
                                <strong>+1 (800) 555-0199</strong>
                            </div>
                        </div>

                        <div className="quick-answers-box">
                            <div className="qa-header">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                <h3>Quick Answers</h3>
                            </div>
                            <p>Check our knowledge base to find fast answers to commonly asked questions.</p>
                            <a href="#" className="help-link">Visit Help Center &rarr;</a>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="contact-form-col">
                        <div className="form-card">
                            <h2>Send us a message</h2>

                            {success && <div className="success-message">{success}</div>}
                            {error && <div className="error-message">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group-row">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label htmlFor="fullName">Full Name</label>
                                        <input 
                                            type="text" 
                                            id="fullName"
                                            name="fullName"
                                            placeholder="Jane Doe"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label htmlFor="email">Email Address</label>
                                        <input 
                                            type="email" 
                                            id="email"
                                            name="email"
                                            placeholder="jane@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input 
                                        type="text" 
                                        id="subject"
                                        name="subject"
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea 
                                        id="message"
                                        name="message"
                                        placeholder="Tell us a little more about your inquiry..."
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={loading}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;

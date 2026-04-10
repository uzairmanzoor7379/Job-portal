import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/about.scss';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <Navbar />

            {/* Hero Section */}
            <section className="about-hero">
                <div className="container hero-content">
                    <span className="pill-badge">
                        <span className="dot"></span>
                        About JobPortal
                    </span>
                    <h1>We are building the future of hiring infrastructure.</h1>
                    <p className="hero-subtitle">
                        JobPortal is the modern platform for the modern workforce. We connect 
                        forward-thinking companies with exceptional talent across the globe.
                    </p>

                    <div className="trusted-by">
                        TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
                        <div className="logos">
                            <span className="acme">Acme Corp</span>
                            <span className="global">GlobalTech</span>
                            <span className="nebula">Nebula</span>
                            <span className="pinnacle">PINNACLE</span>
                            <span className="lumina">Lumina</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="our-story-section">
                <div className="container story-grid">
                    <div className="story-image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                            alt="Team discussing in modern office" 
                        />
                    </div>
                    
                    <div className="story-content">
                        <h2>Our Story</h2>
                        <p>
                            JobPortal was founded on a simple principle: finding a job or hiring 
                            talent shouldn't be a fragmented, painful process. In a world where 
                            technology accelerates every other industry, hiring felt stuck in the past.
                        </p>
                        <p>
                            We realized that talent is universally distributed, but opportunity is 
                            not. Systemic barriers, geographical constraints, and outdated software 
                            were keeping brilliant people from finding their life's work.
                        </p>
                        <p>
                            Today, we're building the infrastructure to fix this. Whether you're a 
                            recent graduate looking for your first role, or a seasoned executive 
                            seeking a new challenge, our technology is designed to highlight your 
                            unique skills.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="stats-banner">
                <div className="container stats-grid">
                    <div className="stat-item">
                        <h3>1M+</h3>
                        <p>Active Professionals</p>
                    </div>
                    <div className="stat-item">
                        <h3>150+</h3>
                        <p>Countries Represented</p>
                    </div>
                    <div className="stat-item">
                        <h3>98%</h3>
                        <p>Successful Match Rate</p>
                    </div>
                    <div className="stat-item">
                        <h3>10k+</h3>
                        <p>Companies Hiring</p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="core-values-section">
                <div className="container">
                    <div className="values-header">
                        <h2>Our Core Values</h2>
                        <p>The principles that guide our product, our team, and how we operate every single day.</p>
                    </div>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="icon-wrapper">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <h3>Trust & Transparency</h3>
                            <p>We believe in clear salary ranges, honest role expectations, and transparent feedback loops.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg>
                            </div>
                            <h3>Inclusivity First</h3>
                            <p>Opportunity should not be bound by geography. We build products that level the playing field globally.</p>
                        </div>
                        <div className="value-card">
                            <div className="icon-wrapper">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            </div>
                            <h3>Speed to Value</h3>
                            <p>Your time is valuable. We minimize friction so you can focus on building your career or your team.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta-section">
                <div className="container">
                    <div className="cta-box">
                        <div className="cta-text">
                            <h2>Ready to shape your future?</h2>
                            <p>Join thousands of professionals and top-tier companies already using JobPortal to hire and get hired.</p>
                        </div>
                        <div className="cta-actions">
                            <button className="btn btn-white-pill" onClick={() => navigate('/jobs')}>Find a Job</button>
                            <button className="btn btn-outline-white" onClick={() => navigate('/register')}>Start Hiring</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;

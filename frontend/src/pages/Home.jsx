import { useNavigate, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/home.scss';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handlePostJobClick = () => {
        if (user && user.role === 'employer') {
            navigate('/create-job');
        } else   {
            navigate('/dashboard');
        } 
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        navigate(`/jobs?${params.toString()}`);
    };

    return (
        <div className="home-wrapper">
            <Navbar />

            {/* Hero Section */}
            <header className="hero-section">
                <div className="container hero-content">
                    <div className="hero-text">
                        <div className="badge-wrapper">
                            <span className="pill-badge">
                                <span className="dot"></span>
                                Over 10,000+ active job listings
                            </span>
                        </div>
                        <h1>Find the job that <span>fits your life.</span></h1>
                        <p className="hero-subtitle">
                            Discover remote, hybrid, and onsite opportunities from top 
                            companies. Your next career move is just a search away.
                        </p>

                        <div className="search-box-container">
                            <form className="search-bar" onSubmit={handleSearch}>
                                <div className="input-with-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input 
                                        type="text" 
                                        placeholder="Job title, keywords..." 
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                </div>
                                <div className="divider"></div>
                                <div className="input-with-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    <input 
                                        type="text" 
                                        placeholder="City, state, or remote" 
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-search">Search Jobs</button>
                            </form>
                        </div>

                        <div className="popular-tags">
                            <span>Popular:</span> 
                            <span className="tag" onClick={() => navigate('/jobs?keyword=Frontend')}>Frontend</span>
                            <span className="tag" onClick={() => navigate('/jobs?keyword=Product+Design')}>Product Design</span>
                            <span className="tag" onClick={() => navigate('/jobs?location=Remote')}>Remote</span>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-img-container">
                            <img src="https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc1Njc1MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2>Explore by Category</h2>
                            <p>Browse opportunities in your industry.</p>
                        </div>
                        <Link to="/jobs" className="view-all">View all categories &rarr;</Link>
                    </div>

                    <div className="categories-grid">
                        <CategoryCard 
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path></svg>}
                            title="Software Engineering"
                            count="1,240 open roles"
                            onClick={() => navigate('/jobs')}
                        />
                        <CategoryCard 
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>}
                            title="Product Design"
                            count="480 open roles"
                            onClick={() => navigate('/jobs')}
                        />
                        <CategoryCard 
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>}
                            title="Sales & Marketing"
                            count="890 open roles"
                            onClick={() => navigate('/jobs')}
                        />
                        <CategoryCard 
                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"></path><path d="M3 7v1a3 3 0 006 0V7m0 1a3 3 0 006 0V7m0 1a3 3 0 006 0V7H3"></path><path d="M19 21V7a2 2 0 00-2-2H7a2 2 0 00-2 2v14"></path></svg>}
                            title="Customer Success"
                            count="320 open roles"
                            onClick={() => navigate('/jobs')}
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="why-choose-section">
                <div className="container">
                    <div className="centered-header">
                        <h2>Why choose JobPortal?</h2>
                        <p>We've built a platform that puts the needs of both job seekers and employers first.</p>
                    </div>

                    <div className="features-grid">
                        <FeatureItem 
                            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>}
                            title="Fast Application"
                            desc="Apply to multiple jobs with a single click using your saved profile and resume. Save time and get noticed faster."
                        />
                        <FeatureItem 
                            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
                            title="Verified Employers"
                            desc="Every company on our platform is vetted. We ensure you're applying to legitimate opportunities at reputable organizations."
                        />
                        <FeatureItem 
                            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>}
                            title="Direct Communication"
                            desc="Chat directly with hiring managers once your application is reviewed. No more black holes or endless waiting."
                        />
                    </div>
                </div>
            </section>

            {/* Hire Next Star CTA */}
            <section className="cta-banner">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to hire your next star?</h2>
                        <p>Join thousands of companies using JobPortal to find top talent. Post your first job today and reach millions of qualified candidates.</p>
                        <div className="cta-actions">
                            <button className="btn btn-white-pill" onClick={handlePostJobClick}>Post a Job Now</button>
                            <button className="btn btn-outline-white" onClick={() => navigate('/jobs')}>Learn More</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

/* Subcomponents */
const CategoryCard = ({ icon, title, count, onClick }) => (
    <div className="category-card" onClick={onClick}>
        <div className="category-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{count}</p>
    </div>
);

const FeatureItem = ({ icon, title, desc }) => (
    <div className="feature-item">
        <div className="feature-icon-wrapper">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
    </div>
);

export default Home;

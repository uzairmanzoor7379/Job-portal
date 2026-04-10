import { useNavigate, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.scss';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        setIsMenuOpen(false);
        await logout();
        navigate('/');
    };

    return (
        <nav className="home-nav">
            <div className="container nav-content">
                <div className="logo" onClick={() => navigate('/')}>JobPortal</div>
                
                {/* Mobile Hamburger Icon */}
                <div className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isMenuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </>
                        )}
                    </svg>
                </div>

                <div className={`nav-links-wrapper ${isMenuOpen ? 'open' : ''}`}>
                    {/* Center links inside Navbar */}
                    <div className="nav-center-links">
                        <div className="dropdown">
                            <span className="nav-link dropdown-trigger">Jobs</span>
                            <div className="dropdown-menu">
                                <span onClick={() => { setIsMenuOpen(false); navigate('/jobs?jobType=remote'); }}>Remote Jobs</span>
                                <span onClick={() => { setIsMenuOpen(false); navigate('/jobs?jobType=full-time'); }}>Full-time</span>
                                <span onClick={() => { setIsMenuOpen(false); navigate('/jobs?jobType=internship'); }}>Internships</span>
                            </div>
                        </div>
                        <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                        <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </div>

                    <div className="nav-actions">
                        {user ? (
                            <>
                                <button 
                                    onClick={handleLogout} 
                                    className="nav-link" 
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
                                >
                                    Logout
                                </button>
                                <button onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }} className="btn btn-dark-pill">Dashboard</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                                <button onClick={() => { setIsMenuOpen(false); navigate('/register'); }} className="btn btn-dark-pill">Sign up</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

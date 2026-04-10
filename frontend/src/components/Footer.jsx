import { Link } from 'react-router-dom';
import '../styles/footer.scss';

const Footer = () => {
    return (
        <footer className="home-footer">
            <div className="container footer-content">
                <div className="footer-copyright">
                    <span className="logo-small">JobPortal</span> &copy; 2026
                </div>
                <div className="footer-links">
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="#">Privacy Policy</Link>
                    <Link to="#">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

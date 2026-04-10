import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { QueryProvider } from './context/QueryContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import Applications from './pages/Applications';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';

// PrivateRoute — unauthenticated users are sent to /login
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="container profile-loading">Loading...</div>;
    return user ? children : <Navigate to="/login" replace />;
};

// PublicRoute — authenticated users are sent to /
// Prevents a logged-in user from seeing the login or register page
const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="container profile-loading">Loading...</div>;
    return user ? <Navigate to="/" replace /> : children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <JobProvider>
                    <ApplicationProvider>
                        <QueryProvider>
                            <div className="app-container">
                                <Routes>
                                    {/* Root route — Home Page */}
                                    <Route path="/" element={<Home />} />

                                    {/* Auth routes — redirect to dashboard if already logged in */}
                                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                                    {/* Fully public routes — accessible to everyone */}
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/about" element={<About />} />
                                    
                                    {/* Protected routes — require authentication */}
                                    <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
                                    <Route path="/jobs/:id" element={<PrivateRoute><JobDetail /></PrivateRoute>} />
                                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                                    <Route path="/create-job" element={<PrivateRoute><CreateJob /></PrivateRoute>} />
                                    <Route path="/edit-job/:id" element={<PrivateRoute><EditJob /></PrivateRoute>} />
                                    <Route path="/my-applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
                                </Routes>
                            </div>
                        </QueryProvider>
                    </ApplicationProvider>
                </JobProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

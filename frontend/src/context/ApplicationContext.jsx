import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
    
    const [seekerApplications, setSeekerApplications] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
   
    // Seeker: Apply for a job
    const applyToJob = useCallback(async (jobId) => {
        try {
            const { data } = await axios.post(`/api/applications/apply/${jobId}`, {});
            setSeekerApplications(prev => [data, ...prev]);
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Error applying to job';
        }
    }, []);

    // Seeker: Check if applied for a specific job
    const checkApplicationStatus = useCallback(async (jobId) => {
        try {
            const { data } = await axios.get(`/api/jobs/${jobId}/applied-status`);
            return data;
        } catch (error) {
            console.error('Error checking application status:', error.response?.data?.message || error.message);
            return { applied: false };
        }
    }, []);

    // Seeker: Get my applications
    const fetchSeekerApplications = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/applications/seeker');
            setSeekerApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Employer: Get applications for a specific job
    const fetchJobApplications = useCallback(async (jobId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/applications/job/${jobId}`);
            setJobApplications(data);
            return data;
        } catch (error) {
            console.error('Error fetching job applications:', error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Employer: Update application status
    const updateStatus = useCallback(async (applicationId, status) => {
        try {
            const { data } = await axios.put(`/api/applications/${applicationId}/status`, { status });
            setJobApplications(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: data.status } : app
            ));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Error updating status';
        }
    }, []);

    return (
        <ApplicationContext.Provider value={{
            seekerApplications, jobApplications, loading,
            applyToJob, fetchSeekerApplications, fetchJobApplications, updateStatus, checkApplicationStatus
        }}>
            {children}
        </ApplicationContext.Provider>
    );
};

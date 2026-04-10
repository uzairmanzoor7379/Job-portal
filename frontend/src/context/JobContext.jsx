import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [currentJob, setCurrentJob] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);

    // Get all jobs — public, no auth needed
    const fetchJobs = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/jobs', { params });
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Get employer's jobs
    const fetchMyJobs = useCallback(async () => {
        if (!user || user.role !== 'employer') return;
        setLoading(true);
        try {
            const { data } = await axios.get('/api/jobs/my-jobs');
            setMyJobs(data);
        } catch (error) {
            console.error('Error fetching my jobs:', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Get single job — public
    const getJobById = useCallback(async (id) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/jobs/${id}`);
            setCurrentJob(data);
            return data;
        } catch (error) {
            console.error('Error fetching job:', error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create job
    const createJob = useCallback(async (jobData) => {
        try {
            const { data } = await axios.post('/api/jobs', jobData, {
                headers: { 'Content-Type': 'application/json' },
            });
            setMyJobs(prev => [data, ...prev]);
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Error creating job';
        }
    }, []);

    // Update job
    const updateJob = useCallback(async (id, jobData) => {
        try {
            const { data } = await axios.put(`/api/jobs/${id}`, jobData, {
                headers: { 'Content-Type': 'application/json' },
            });
            setMyJobs(prev => prev.map(job => (job._id === id ? data : job)));
            setCurrentJob(prev => (prev && prev._id === id ? data : prev));
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'Error updating job';
        }
    }, []);

    // Delete job
    const deleteJob = useCallback(async (id) => {
        try {
            await axios.delete(`/api/jobs/${id}`);
            setMyJobs(prev => prev.filter(job => job._id !== id));
        } catch (error) {
            throw error.response?.data?.message || 'Error deleting job';
        }
    }, []);

    return (
        <JobContext.Provider value={{
            jobs, myJobs, currentJob, loading,
            fetchJobs, fetchMyJobs, getJobById, createJob, updateJob, deleteJob
        }}>
            {children}
        </JobContext.Provider>
    );
};

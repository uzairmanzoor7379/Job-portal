import { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { JobContext } from '../context/JobContext';
import '../styles/jobs.scss';

const Jobs = () => {
    const { jobs, fetchJobs, loading } = useContext(JobContext);
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        location: searchParams.get('location') || '',
        jobType: searchParams.get('jobType') || ''
    });

    useEffect(() => {
        // Fetch jobs with any initial URL parameters
        fetchJobs({
            keyword: searchParams.get('keyword') || '',
            location: searchParams.get('location') || '',
            jobType: searchParams.get('jobType') || ''
        });
        // eslint-disable-next-line
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(filters);
    };

    const handleClear = () => {
        const clearedFilters = { keyword: '', location: '', jobType: '' };
        setFilters(clearedFilters);
        fetchJobs(clearedFilters);
    };

    return (
        <div className="jobs-container">
            <div className="jobs-header" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '2rem 1.5rem 0' }}>
                    <h1>Find Your Dream Job</h1>
                </div>
                
                <form className="search-filters-section" onSubmit={handleSearch}>
                    <div className="filter-group">
                        <label>Keyword</label>
                        <input 
                            type="text" 
                            name="keyword" 
                            placeholder="Job title, keywords..." 
                            value={filters.keyword}
                            onChange={handleFilterChange}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Location</label>
                        <input 
                            type="text" 
                            name="location" 
                            placeholder="City, state, or remote" 
                            value={filters.location}
                            onChange={handleFilterChange}
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label>Job Type</label>
                        <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
                            <option value="">All Types</option>
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="remote">Remote</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>

                    <div className="filter-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <button type="button" className="btn btn-clear" onClick={handleClear} disabled={loading}>
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 className="text-muted" style={{ fontSize: '1.2rem' }}>
                    {jobs.length} Job{jobs.length !== 1 ? 's' : ''} Found
                </h2>
            </div>

            {jobs.length === 0 ? (
                <div className="glass-panel" style={{padding: '3rem', textAlign: 'center'}}>No jobs found.</div>
            ) : (
                <div className="jobs-grid">
                    {jobs.map(job => (
                        <div key={job._id} className="glass-panel job-card">
                            <h2 className="job-title">{job.title}</h2>
                            <div className="job-company">{job.employer?.companyName || job.employer?.name}</div>
                            
                            <div className="job-meta">
                                <span>{job.location}</span>
                                <span style={{ textTransform: 'capitalize' }}>{job.jobType}</span>
                                {job.salaryMax > 0 && <span>${job.salaryMin} - ${job.salaryMax} /yr</span>}
                            </div>
                            
                            <p className="job-desc-snippet">{job.description}</p>
                            
                            <Link to={`/jobs/${job._id}`} className="btn btn-primary" style={{textAlign: 'center', marginTop: 'auto', padding: '0.6rem'}}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Jobs;

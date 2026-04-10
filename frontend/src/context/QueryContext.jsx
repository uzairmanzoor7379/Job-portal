import { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const QueryContext = createContext();

export const QueryProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Submit a contact query
    const submitQuery = useCallback(async (queryData) => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const { data } = await axios.post('/api/queries', queryData, {
                headers: { 'Content-Type': 'application/json' },
            });
            setSuccess('Query submitted successfully! We will get back to you soon.');
            
            // Auto-clear success message after 5 seconds
            setTimeout(() => {
                setSuccess('');
            }, 5000);
            
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error submitting query. Please try again.';
            setError(errorMessage);
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear messages
    const clearMessages = useCallback(() => {
        setError('');
        setSuccess('');
    }, []);

    return (
        <QueryContext.Provider value={{
            loading,
            error,
            success,
            submitQuery,
            clearMessages,
        }}>
            {children}
        </QueryContext.Provider>
    );
};

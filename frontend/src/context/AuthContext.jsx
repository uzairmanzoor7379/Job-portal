import { createContext, useState, useEffect } from 'react';
import axios from 'axios';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // loading starts TRUE — we must verify the session before rendering any routes
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * On every app load, ask the backend to verify the httpOnly cookie.
         * This is the single source of truth for authentication state:
         *
         *  ✅ Cookie valid   → set user, allow access to protected pages
         *  ❌ Cookie expired  → clear localStorage, user = null → redirect to /login
         *  ❌ Cookie missing  → same as above
         *
         * localStorage is only used as a cache for non-sensitive profile fields
         * (name, role, email…) so the UI can paint instantly without an extra request.
         */
        const verifySession = async () => {
            try {
                const { data } = await axios.get('/api/auth/me');
                // Cookie is valid — sync localStorage with fresh server data
                const { token: _omit, password: _pw, ...safeProfile } = data;
                localStorage.setItem('user', JSON.stringify(safeProfile));
                setUser(safeProfile);
            } catch {
                // Cookie is absent, expired, or invalid — treat as logged out
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                // Only AFTER this check do PrivateRoute / PublicRoute make decisions
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    /** Store user profile WITHOUT any token field */
    const persistUser = (data) => {
        const { token: _omit, password: _pw, ...safeProfile } = data;
        localStorage.setItem('user', JSON.stringify(safeProfile));
        setUser(safeProfile);
        return safeProfile;
    };

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = async (userData) => {
        try {
            const { data } = await axios.post('/api/auth/login', userData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return persistUser(data);
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    // ── Register ──────────────────────────────────────────────────────────────
    const register = async (userData) => {
        try {
            const { data } = await axios.post('/api/auth/register', userData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return persistUser(data);
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    // ── Update Profile ────────────────────────────────────────────────────────
    const updateProfile = async (profileData) => {
        try {
            const isFormData = profileData instanceof FormData;
            const { data } = await axios.put('/api/auth/profile', profileData, {
                headers: {
                    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                },
            });
            return persistUser(data);
        } catch (error) {
            throw error.response?.data?.message || 'Profile update failed';
        }
    };

    // ── Logout ────────────────────────────────────────────────────────────────
    // Tells the backend to clear the httpOnly cookie, then wipes local state
    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch {
            // Proceed even if the network call fails
        } finally {
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

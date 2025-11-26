import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user session
        const savedUser = localStorage.getItem('coach_app_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // userData: { name, role, team }
        const userWithId = { ...userData, id: Date.now().toString() };
        setUser(userWithId);
        localStorage.setItem('coach_app_user', JSON.stringify(userWithId));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('coach_app_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

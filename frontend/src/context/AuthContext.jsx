import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (name, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (err) {
            return { success: false, error: "Erreur de connexion au serveur" };
        }
    };

    const register = async (userData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (err) {
            return { success: false, error: "Erreur lors de l'inscription" };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout');
        } catch (err) {
            console.error("Logout failed", err);
        }
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUserFavorites = async (newFavorites) => {
        if (!user) return;

        // Optimistic update
        const updatedUser = { ...user, favorites: newFavorites };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        try {
            await fetch('/api/auth/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user.id, favorites: newFavorites })
            });
        } catch (err) {
            console.error("Failed to sync favorites", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserFavorites }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

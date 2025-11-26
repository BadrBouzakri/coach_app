import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('coach_app_active_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (name, password) => {
        const users = JSON.parse(localStorage.getItem('coach_app_users_db') || '[]');
        const foundUser = users.find(u => u.name === name && u.password === password);

        if (foundUser) {
            const { password, ...safeUser } = foundUser; // Exclude password from session
            setUser(safeUser);
            localStorage.setItem('coach_app_active_user', JSON.stringify(safeUser));
            return { success: true };
        }
        return { success: false, error: "Identifiants incorrects" };
    };

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('coach_app_users_db') || '[]');

        if (users.find(u => u.name === userData.name)) {
            return { success: false, error: "Ce nom d'utilisateur existe déjà" };
        }

        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem('coach_app_users_db', JSON.stringify(users));

        // Auto login after register
        const { password, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem('coach_app_active_user', JSON.stringify(safeUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('coach_app_active_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

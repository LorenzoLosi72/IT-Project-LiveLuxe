import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Controlla se l'utente è autenticato al caricamento
        const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(isUserLoggedIn);
    }, []);

    const login = (username) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

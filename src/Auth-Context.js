import React, { createContext, useState, useEffect } from 'react';

// Create a context that allows to share authentication state between components.
export const AuthContext = createContext();

// Wrapper component that provides the AuthContext context to child components.
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); 

    // Data recovery on assembly.
    useEffect(() => {
        const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('userRole'); 
        setIsLoggedIn(isUserLoggedIn);
        setUserRole(role);
    }, []);

    // Login function
    const login = (username, isHost) => {
        const role = isHost ? 'host' : 'client'; 
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', role); 
        setIsLoggedIn(true);
        setUserRole(role);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole'); 
        setIsLoggedIn(false);
        setUserRole(null);
    };

    // Makes context available to child components.
    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

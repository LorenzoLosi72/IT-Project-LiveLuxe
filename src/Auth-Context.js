import React, { createContext, useState, useEffect } from 'react';

// Create a context that allows to share authentication state between components.
export const AuthContext = createContext();

// Wrapper component that provides the AuthContext context to child components.
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userId, setUserID] = useState(null);

    // Data recovery on assembly.
    useEffect(() => {
        const isUserLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const role = sessionStorage.getItem('userRole'); 
        const storedFirstName = sessionStorage.getItem('firstName');
        const storedLastName = sessionStorage.getItem('lastName');
        const storedUserId = sessionStorage.getItem('userId');
        
        setIsLoggedIn(isUserLoggedIn);
        setUserRole(role);
        setFirstName(storedFirstName || '');
        setLastName(storedLastName || '');
        setUserID(storedUserId || null);
    }, []);

    // Login function
    const login = (username, isHost, firstName, lastName, userId) => {
        const role = isHost ? 'host' : 'client';
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('lastName', lastName);
        sessionStorage.setItem('userId', userId);

        setIsLoggedIn(true);
        setUserRole(role);
        setFirstName(firstName);
        setLastName(lastName);
        setUserID(userId);
    };

    // Logout function
    const logout = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('firstName');
        sessionStorage.removeItem('lastName');
        sessionStorage.removeItem('userId');
        
        setIsLoggedIn(false);
        setUserRole(null);
        setFirstName('');
        setLastName('');
        setUserID(null);
    };

    // Makes context available to child components.
    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, firstName, lastName, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
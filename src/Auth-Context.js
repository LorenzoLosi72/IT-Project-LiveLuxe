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
        const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('userRole'); 
        const storedFirstName = localStorage.getItem('firstName');
        const storedLastName = localStorage.getItem('lastName');
        const storedUserId = localStorage.getItem('userId'); 
        
        setIsLoggedIn(isUserLoggedIn);
        setUserRole(role);
        setFirstName(storedFirstName || '');
        setLastName(storedLastName || '');
        setUserID(storedUserId || null);
    }, []);

    // Login function
    const login = (username, isHost, firstName, lastName, userId) => {
        const role = isHost ? 'host' : 'client';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', role);
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        localStorage.setItem('userId', userId);

        setIsLoggedIn(true);
        setUserRole(role);
        setFirstName(firstName);
        setLastName(lastName);
        setUserID(userId);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('userId');
        
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
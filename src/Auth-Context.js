import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); 

    useEffect(() => {
        const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('userRole'); 
        setIsLoggedIn(isUserLoggedIn);
        setUserRole(role);
    }, []);

    const login = (username, isHost) => {
        const role = isHost ? 'host' : 'client'; 
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', role); 
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole'); 
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

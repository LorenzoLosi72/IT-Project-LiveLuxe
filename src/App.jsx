// Import packages, libraries and stylesheets
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import PublicHeader from './components/Public-Header.jsx';
import PublicSearchbar from './components/Public-Searchbar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';
import Login from './components/Login.jsx';
import GuestRegistration from './components/Guest-Registration.jsx';
import RentHome from './components/Rent-Home.jsx';
import UserAccount from './components/User-Account.jsx';

// Layout wrapper to conditionally render components
function Layout({ children }) {
    const location = useLocation();
    const isRentHomePage = location.pathname === '/rent-home';

    return (
        <>
            {!isRentHomePage && <PublicHeader />}
            {!isRentHomePage && <PublicSearchbar />}
            <main className="flex-fill">{children}</main>
        </>
    );
}

// Protected route wrapper
function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [navigate]);

    return children;
}

// Base of the react application
function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Layout>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/guest-registration" element={<GuestRegistration />} />
                        <Route path="/user-account" element={<UserAccount />} />
                        <Route path="/rent-home" element={<RentHome />} />
                        
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;

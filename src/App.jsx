import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicHeader from './components/Public-Header.jsx';
import PublicSearchbar from './components/Public-Searchbar.jsx';
import Login from './components/Login.jsx';
import GuestRegistration from './components/Guest-Registration.jsx';
import RentHome from './components/Rent-Home.jsx';
import UserAccount from './components/User-Account.jsx';
import { AuthContext } from './Auth-Context';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';

// Component for protecting routes
function ProtectedRoute({ children }) {
    const { isLoggedIn } = useContext(AuthContext);
    const location = useLocation();

    return isLoggedIn ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
}

// Layout component to manage headers and search bar visibility
function Layout({ children }) {
    const location = useLocation();
    const showSearchBar = location.pathname === '/'; // Show search bar only on homepage
    const showHeader = location.pathname !== '/rent-home'; // Hide header on /rent-home

    return (
        <>
            {showHeader && <PublicHeader />}
            {showSearchBar && <PublicSearchbar />}
            <main className="flex-fill">{children}</main>
        </>
    );
}

// App component
function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Layout>
                    <Routes>
                        <Route path="/" element={<div></div>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/guest-registration" element={<GuestRegistration />} />
                        <Route
                            path="/rent-home"
                            element={
                                <ProtectedRoute>
                                    <RentHome />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user-account"
                            element={
                                <ProtectedRoute>
                                    <UserAccount />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Layout>
            </div>
        </Router>
    );
}

export default App;

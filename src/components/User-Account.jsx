import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Row, Col, Button, Container, Form } from 'react-bootstrap';
import '../css/user-account.css';

// React component that represent the user account data.
function UserAccount() {

    // States for user data
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB'); 
      };

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const userId = sessionStorage.getItem('userId');

        if (!isLoggedIn || !userId) {
            navigate('/login');
        } else {
            fetchUserData(userId);
        }
    }, [navigate]);

    // Function that fetch user data
    const fetchUserData = async (userId) => {
        try {
            const response = await axios.post('http://localhost:3001/api/user-data', { userId });
            setUserData(response.data);

        } catch (err) {
            console.error("Error fetching user data:", err.response?.data || err.message);
            setError('Failed to fetch user data.');
        }
    };

    // Account user data graphic component
    return (
        <Container className="user-account-container">
            <h1 className="user-account-title">Your Account</h1>
            <hr className="line-divider" />
            {error && <p className="text-danger">{error}</p>}
            {userData ? (
                <div className="user-account-data">
                    <strong className="user-account-label">Username:</strong> {userData.Username} <br/>
                    <strong className="user-account-label">Email:</strong> {userData.Mail} <br/>
                    <strong className="user-account-label">First Name:</strong> {userData.FirstName} <br/>
                    <strong className="user-account-label">Last Name:</strong> {userData.LastName} <br/>
                    <strong className="user-account-label">Date of Birth:</strong> {formatDate(userData.DoB)} <br/>
                    <strong className="user-account-label">Address:</strong> {userData.Address} <br/>
                    <strong className="user-account-label">Telephone Number:</strong> {userData.TelephoneNumber} <br/>
                    <strong className="user-account-label">Host:</strong> {userData.IsHost ? 'Yes' : 'No'}

                </div>
            ) : (
                <p>Loading your account data...</p>
            )}
            <hr className="line-divider" />
            <div className="d-flex justify-content-center">
                <Button onClick={() => {
                    sessionStorage.removeItem('isLoggedIn');
                    sessionStorage.removeItem('username');
                    navigate('/login');
                }} className="btn btn-danger mt-3">
                    LOGOUT
                </Button>
            </div>
        </Container>
    );
}

export default UserAccount;

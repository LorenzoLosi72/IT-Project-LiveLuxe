import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/user-account.css';

function UserAccount() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB'); 
      };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const username = localStorage.getItem('username');

        if (!isLoggedIn || !username) {
            navigate('/login');
        } else {
            fetchUserData(username);
        }
    }, [navigate]);

    const fetchUserData = async (username) => {
        try {
            const response = await axios.post('http://localhost:3001/api/user-data', { username });
            setUserData(response.data);
        } catch (err) {
            console.error("Error fetching user data:", err.response?.data || err.message);
            setError('Failed to fetch user data.');
        }
    };

    return (
        <div className="user-account-container">
            <h1>Your Account</h1>
            {error && <p className="text-danger">{error}</p>}
            {userData ? (
                <div className="user-data">
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.mail}</p>
                    <p><strong>First Name:</strong> {userData.firstName}</p>
                    <p><strong>Last Name:</strong> {userData.lastName}</p>
                    <p><strong>Date of Birth:</strong> {formatDate(userData.dob)}</p>
                    <p><strong>Address:</strong> {userData.address}</p>
                    <p><strong>Telephone Number:</strong> {userData.telephoneNumber}</p>
                    <p><strong>Host:</strong> {userData.isHost ? 'Yes' : 'No'}</p>
                </div>
            ) : (
                <p>Loading your account data...</p>
            )}
            <button onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                navigate('/login');
            }} className="btn btn-danger mt-3">
                Logout
            </button>
        </div>
    );
}

export default UserAccount;

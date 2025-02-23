import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/host-booking.css';

function HostBooking() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [currentAndFutureBookings, setCurrentAndFutureBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const username = localStorage.getItem('username');

        if (!isLoggedIn || !username) {
            navigate('/login');
        } else {
            fetchUserData(username);
        }
    }, []);

    const fetchUserData = async (username) => {
        try {
            console.log("Username from localStorage:", username);

            const response = await axios.post('http://localhost:3001/api/get-userid', { username });
            console.log("Data received:", response.data);
            setUserData(response.data);
            const userID = response.data.UserID;
            if (userID) {
                fetchHostBookings(userID);
            }
        } catch (err) {
            console.error("Error fetching user data:", err.response?.data || err.message);
            setError('Error loading user data.');
        }
    };

    const fetchHostBookings = async (userID) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/host-bookings/${userID}`);
            console.log("Bookings received:", response.data);
            
            const now = new Date().toISOString().split('T')[0];
            const upcomingBookings = response.data.filter(booking => booking.EndDate.split('T')[0] >= now);
            const pastBookings = response.data.filter(booking => booking.EndDate.split('T')[0] < now);
            
            setCurrentAndFutureBookings(upcomingBookings);
            setPastBookings(pastBookings);
        } catch (err) {
            console.error("Error fetching bookings:", err.response?.data || err.message);
            setError('Error loading your property bookings.');
        }
    };

    const formatDate = (dateString) => {
        return dateString.split('T')[0];
    };

    return (
        <div className="container">
            <h2 className="booking-title">Current and Upcoming Bookings</h2>
            {currentAndFutureBookings.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Property Name</th>
                            <th>Guest</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAndFutureBookings.map((booking) => (
                            <tr key={booking.BookingID}>
                                <td>{booking.BookingID}</td>
                                <td>{booking.PropertyName}</td>
                                <td>{booking.GuestName}</td>
                                <td>{formatDate(booking.StartDate)}</td>
                                <td>{formatDate(booking.EndDate)}</td>
                                <td>{booking.TotalPrice}€</td>
                                <td>{booking.BookingStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No current or upcoming bookings found.</p>
            )}

            <h2 className="booking-title">Past Bookings</h2>
            {pastBookings.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Property Name</th>
                            <th>Guest</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastBookings.map((booking) => (
                            <tr key={booking.BookingID}>
                                <td>{booking.BookingID}</td>
                                <td>{booking.PropertyName}</td>
                                <td>{booking.GuestName}</td>
                                <td>{formatDate(booking.StartDate)}</td>
                                <td>{formatDate(booking.EndDate)}</td>
                                <td>{booking.TotalPrice}€</td>
                                <td>{booking.BookingStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No past bookings found.</p>
            )}
        </div>
    );
}

export default HostBooking;

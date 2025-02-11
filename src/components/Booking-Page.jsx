import React from "react";
import { useLocation } from "react-router-dom";
import "../css/booking-page.css";

const BookingPage = () => {
    const location = useLocation();
    const { houseId, houseName, checkIn, checkOut, totalPrice } = location.state || {};

    if (!houseId) {
        return <div>Error: Missing booking details.</div>;
    }

    return (
        <div className="booking-container">
            <h1 className="booking-title">Confirm Your Booking</h1>
            <div className="booking-details">
                <p><strong>House:</strong> {houseName}</p>
                <p><strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ${totalPrice}</p>
            </div>
            <button className="booking-button">Confirm Booking</button>
        </div>
    );
};


export default BookingPage;

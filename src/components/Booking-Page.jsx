import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import moment from 'moment';
import axios from 'axios'; // Assicurati di aver installato axios
import "../css/booking-page.css";

const BookingPage = () => {
    const location = useLocation();
    const { houseId, houseName, checkIn, checkOut, totalPrice, } = location.state || {};

    const [loading, setLoading] = useState(false); // Stato per il loading

    // Recupera lo username dal localStorage
    const username = localStorage.getItem("username");


    if (!houseId) {
        return <div>Error: Missing booking details.</div>;
    }

    // Converting data format
    const formatDateToUS = (date) => {
        return moment(date).format('YYYY-MM-DD');
    };

    // Function that calls api to book the house
    const handleConfirmBooking = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/booking', {
                startDate: checkIn,
                endDate: checkOut,
                houseId: houseId,
                totalPrice: totalPrice,
                username: username,
            });
    
            if (response.data.success) {
                alert("Booking confirmed successfully!");
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.response ? error.response.data.message : 'Unknown error'}`);
        }
    };
    

    return (
        <div className="booking-container">
            <h1 className="booking-title">Confirm Your Booking</h1>
            <div className="booking-details">
                <p><strong>House:</strong> {houseName}</p>
                <p><strong>Check-in:</strong> {formatDateToUS(checkIn)}</p>
                <p><strong>Check-out:</strong> {formatDateToUS(checkOut)}</p>
                <p><strong>Total Price:</strong> ${totalPrice}</p>
            </div>
            
            {}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <button className="booking-button" onClick={handleConfirmBooking}>Confirm Booking</button>
            )}
        </div>
    );
};

export default BookingPage;

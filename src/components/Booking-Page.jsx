import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from 'moment';
import axios from 'axios'; 

import { Row, Col, Button, Image, Container, Form } from 'react-bootstrap';
import "../css/booking-page.css";
import visaLogo from "../images/logos/visa-logo.png";
import mastercardLogo from "../images/logos/mastercard-logo.png";
import amexLogo from "../images/logos/american-express-logo.png";

// React component that represent the confirm booking and payments form.
const BookingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { houseId, houseName, houseAddress, houseCity, houseState, houseImage, checkIn, checkOut, totalPrice } = location.state || {};

    // Recover user data session
    const sessionFirstName = sessionStorage.getItem("firstName");
    const sessionLastName = sessionStorage.getItem("lastName");
    const sessionUserId = sessionStorage.getItem("userId");

    console.log(sessionFirstName);
    console.log(sessionLastName);
    console.log(sessionUserId);

    // States for booking details and info payments
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [error, setError] = useState("");
    const [finalError, setFinalError] = useState("");

    if (!houseId) { return <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '25px', color: '#f7f7f7ef',fontWeight: '600' }}> Missing booking details. </div> }

    const formatDateToIT = (date) => { return moment(date).format('DD-MM-YYYY'); };
    const formatDateToUS = (date) => { return moment(date).format('YYYY-MM-DD'); };

    // Pass to step2 (payment)
    const handleConfirmBooking = async () => { setStep(2); };

    // Function that set booking status 'Deleted' if error in payment
    const handlePaymentFailure = async (bookingId) => {
        try {
            const response = await axios.post('http://localhost:3001/api/update-booking-status', { bookingId: bookingId });
    
            if (response.status === 200) { console.log('Booking status updated to Deleted.'); }
        } 
        catch (error) { console.error('Error updating booking status:', error); }
    };

    // Function that manage the payment of booking
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        const cardNumberPattern = /^\d{16}$/;
        const cvvPattern = /^\d{3}$/;
    
        // User must be owner of card
        if ((name && sessionFirstName && name.toLowerCase() !== sessionFirstName.toLowerCase()) || (surname && sessionLastName && surname.toLowerCase() !== sessionLastName.toLowerCase())
        ) { setError("User must be card holder."); return; }
    
        // Number of card must be 16 digit
        else if (!cardNumberPattern.test(cardNumber)) { setError("Invalid card number. Must be 16 digits."); return; }
    
        // CVV must be 3 digit
        else if (!cvvPattern.test(cvv)) { setError("Invalid CVV. Must be 3 digits."); return; }

        // Insert booking data in database
        try {
            const bookingData = {
                startDate: formatDateToUS(checkIn),
                endDate: formatDateToUS(checkOut),
                totalPrice: totalPrice,
                bookingStatus: "Confirmed",
                propertyId: houseId,
                userId: sessionUserId
            };

            console.log(bookingData);

            const bookingResponse = await axios.post('http://localhost:3001/api/bookings', bookingData);

            // Insert payment data in database
            if (bookingResponse.status === 201) {
                
                const paymentData = {
                    paymentDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                    amount: totalPrice,
                    bookingId: bookingResponse.data.bookingId,
                };

                const paymentResponse = await axios.post('http://localhost:3001/api/payments', paymentData);

                 // Log per il debug
                console.log("Payment Response Status: ", paymentResponse.status);
                console.log("Payment Response Data: ", paymentResponse.data);

                if (paymentResponse.status === 201) { setStep(3);
                } 
                else { setFinalError("Failed to process payment. Please try again later."); setStep(3);  await handlePaymentFailure(bookingResponse.data.bookingId); console.log(bookingResponse.data.bookingId) } 
            } 
            else { setFinalError("Failed to process booking. Please try again later."); setStep(3); } 
        } 
        catch (err) { setFinalError("An error occurred while processing your payment. Please try again later."); setStep(3);}
    
        setStep(3);
    };

    const handleClose = () => { navigate("/"); };

    // Booking 3 steps graphic form component
    return (
        <div className="booking-container">

            {/*Booking form - step 1*/}
            {step === 1 && (
                <Container className="booking-details-container">
                    <h1 className="form-title">Booking Details</h1>
                    <hr className="line-divider" />
                    <Row>
                        <Col md={6}>
                            <strong className="booking-details-label">House: </strong> {houseName}.<br/>
                            <strong className="booking-details-label">Address: </strong> {houseAddress}. <br/>
                            <strong className="booking-details-label">Location: </strong> {houseCity}, {houseState}. <br/>
                            <strong className="booking-details-label">Check-in: </strong> {formatDateToIT(checkIn)} <br/>
                            <strong className="booking-details-label">Check-out: </strong> {formatDateToIT(checkOut)} <br/>
                            <strong className="booking-details-label">Total Price: </strong> ${totalPrice}
                        </Col>
                        <Col md={4} >
                            <Image src={houseImage} className="booking-details-image"/>
                        </Col>
                    </Row>
                    <hr className="line-divider" />
                    <div className="d-flex justify-content-end"><Button variant="primary"  onClick={handleConfirmBooking}>Go to the payment</Button></div>
                </Container>
            )}

            {/*Payement form - step 2*/}
            {step === 2 && (
                <Container className="payment-container position-relative d-flex flex-column align-items-center">
                <h1 className="form-title">Payment</h1>
                <Form onSubmit={handlePaymentSubmit}>
                    <Form.Group controlId="formFirstName" className="form-name mb-2">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your first name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
            
                    <Form.Group controlId="formLastName" className="mb-2">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your last name"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                    </Form.Group>
            
                    <Form.Group controlId="formCardNumber" className="mb-2">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your card number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            maxLength="16"
                            required
                        />
                    </Form.Group>
            
                    <Form.Group controlId="formCvv" className="mb-2">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            maxLength="3"
                            required
                        />
                    </Form.Group>
            
                    <div className="payment-logos d-flex justify-content-start">
                        <Row>
                            <img src={visaLogo} alt="Visa" className="payment-logo" />
                            <img src={mastercardLogo} alt="MasterCard" className="payment-logo" />
                            <img src={amexLogo} alt="American Express" className="payment-logo" />
                        </Row> 
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <hr className="line-divider" />
                    <div className="d-flex justify-content-end"><Button variant="primary" type="submit">Submit Payment</Button></div>
                </Form>
            </Container>
            )}

            {/*Booking and Payment confirm form - step 3*/}
            {step === 3 && (
                <Container className="booking-confirm-form position-relative d-flex flex-column align-items-center">
                    <h1 className="form-title">Booking Confirm</h1>
                    <hr className="line-divider" />
                    {finalError ? (
                        <p className="text-danger">{finalError}</p>
                    ) : (
                        <>
                            <strong className="message-payment-success">Your payment has been successfully processed!</strong> <br/>
                            <strong className="message-contact-host">The host will contact you with more details about your stay and check-in instructions.</strong>
                        </>
                    )}
                    <hr className="line-divider" />
                    <div className="d-flex justify-content-end"><Button variant="primary" onClick={handleClose}>Close</Button></div>
                </Container>
            )}
        </div>
    );
};

export default BookingPage;


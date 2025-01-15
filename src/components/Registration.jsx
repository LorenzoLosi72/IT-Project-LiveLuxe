import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import { Form, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../css/registration.css';

// React component that represent the registration form of the application.
function Registration() {
    const navigate = useNavigate();

    // States for error fields
    const [passwordError, setPasswordError] = useState(false);;
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [maxDate, setMaxDate] = useState(''); // Max date
    const [minDate, setMinDate] = useState(''); // Min date

    // Disable dates which provides age < 18 and age > 100.
    useEffect(() => {
        const today = new Date();

        const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));
        const maxFormattedDate = eighteenYearsAgo.toISOString().split('T')[0];  // Format as YYYY-MM-DD
        
        const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        const minFormattedDate = hundredYearsAgo.toISOString().split('T')[0];

        setMinDate(minFormattedDate);
        setMaxDate(maxFormattedDate);

    }, []);

    // Creating SHA-256 hash password to send to server.
    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    };

    // Registration management.
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const firstName = form.formFirstName.value;
        const lastName = form.formLastName.value;
        const username = form.formUsername.value;
        const mail = form.formEmail.value;
        const dob = form.formBirthdate.value;
        const phoneNumber = form.formPhoneNumber.value;
        const address = form.formAddress.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const isHost = form.isHost.checked ? 1 : 0; 
    
        if (password !== confirmPassword) {
            setPasswordError(true);
            return;
        }
        setPasswordError(false);
    
        try {
            const hashedPassword = await hashPassword(password);
            const response = await axios.post('http://localhost:3001/api/register', { firstName, lastName, username, mail, dob, phoneNumber, address, password: hashedPassword, isHost });
    
            if (response.status === 200) {
                setSuccess(true);
                navigate('/login');
            }

        } catch (err) {
            console.error(err);
            setError('Registration failed. Please try again.');
        }
    };
    
    // Registration form component
    return (
        <Container className="signup-container position-relative d-flex flex-column align-items-center">
            <h2>Sign Up</h2>
            <Form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <Form.Group controlId="formFirstName" className="mb-2">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your first name" required />
                        </Form.Group>

                        <Form.Group controlId="formBirthdate" className="mb-2">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" required min={minDate} max={maxDate} />
                        </Form.Group>

                        <Form.Group controlId="formPhoneNumber" className="mb-2">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="tel" placeholder="Enter your phone number" required />
                        </Form.Group>
                    </div>

                    <div className="col-md-6 mx-auto">
                        <Form.Group controlId="formLastName" className="mb-2">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your last name" required />
                        </Form.Group>

                        <Form.Group controlId="formUsername" className="mb-2">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Choose a username" required />
                        </Form.Group>

                        <Form.Group controlId="formAddress" className="mb-2">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter your address" required />
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <Form.Group controlId="formEmail" className="mb-2 position-relative">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter your email" required />
                        </Form.Group>
                    </div>
                    <div className="col-md-6 mx-auto">
                        <Form.Group controlId="formPassword" className="mb-2 position-relative">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" required />
                            <FontAwesomeIcon className="password-icon" icon={showPassword ? faEyeSlash : faEye} onClick={() => setShowPassword(!showPassword)}/>
                        </Form.Group>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <Form.Group controlId="formConfirmPassword" className="mb-2">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name="confirmPassword" placeholder="Re-enter your password" required />
                        </Form.Group>
                    </div>
                    <div className="col-md-6 mx-auto">
                        <Form.Group controlId="formIsHost" className="mb-3">
                            <Form.Label>Register as Host?</Form.Label>
                            <Form.Check type="checkbox" name="isHost" label={<span style={{ color: '#ffffff' }}>Yes, I want to be a host.</span>} className="host-checkbox"/>
                        </Form.Group>
                    </div>
                </div>
                
                {passwordError && ( <p className="text-danger">Passwords do not match</p> )}
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">Registration successful! Redirecting to login...</p>}
                
                <div className="button-container">
                    <Button variant="primary" type="submit" className="w-100 mt-2"> Sign Up </Button>
                </div>

                <p className="mt-4 text-center"> You already have an account?{' '} <Link to="/login" className="login-link"> Sign in </Link></p>
                
            </Form>
        </Container>
    );
}

export default Registration;

import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/guest-registration.css';

function GuestRegistration() {
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState(false);
    const [dobError, setDobError] = useState(false); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleClose = () => {
        navigate('/');
    };

    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    };

    const isAtLeast18YearsOld = (date) => {
        const today = new Date();
        const birthDate = new Date(date);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();

        if (age > 18 || (age === 18 && (monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)))) {
            return true;
        }
        return false;
    };

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

        
        if (password !== confirmPassword) {
            setPasswordError(true);
            return;
        }
        setPasswordError(false);

        
        if (!isAtLeast18YearsOld(dob)) {
            setDobError(true);
            return;
        }
        setDobError(false);

        try {
            const hashedPassword = await hashPassword(password);
            const response = await axios.post('http://localhost:3001/api/register', {
                firstName,
                lastName,
                username,
                mail,
                dob,
                phoneNumber,
                address,
                password: hashedPassword,
                isHost: 0,
            });

            if (response.status === 200) {
                setSuccess(true);
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Container className="signup-container position-relative">
            <Button
                variant="light"
                className="close-button"
                onClick={handleClose}
                aria-label="Close"
            >
                ✕
            </Button>

            <h2>Sign Up</h2>
            {success && <p className="text-success">Registration successful! Redirecting to login...</p>}
            {error && <p className="text-danger">{error}</p>}

            <Form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group controlId="formFirstName" className="mb-2">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your first name" required />
                        </Form.Group>

                        <Form.Group controlId="formBirthdate" className="mb-2">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" required />
                            {dobError && <p className="text-danger">You must be at least 18 years old.</p>}
                        </Form.Group>

                        <Form.Group controlId="formPhoneNumber" className="mb-2">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="tel" placeholder="Enter your phone number" required />
                        </Form.Group>
                    </div>

                    <div className="col-md-6">
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
                    <div className="col-md-6">
                        <Form.Group controlId="formPassword" className="mb-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-6">
                        <Form.Group controlId="formConfirmPassword" className="mb-2">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter your password"
                                required
                            />
                        </Form.Group>
                    </div>
                </div>

                <Form.Group controlId="formEmail" className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                {passwordError && (
                    <p className="text-danger">Passwords do not match</p>
                )}

                <Button variant="primary" type="submit" className="w-100 mt-2">
                    Sign Up
                </Button>
            </Form>
        </Container>
    );
}

export default GuestRegistration;

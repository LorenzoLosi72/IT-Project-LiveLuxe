// // Import packages, libraries and stylesheets
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/host-registration.css';

// Host Registration function
function HostRegistration() {
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState(false);

    const handleClose = () => { navigate('/'); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (password !== confirmPassword) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
            console.log("Form submitted successfully!");
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
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName" className="mb-2">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-2">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your last name"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formUsername" className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Choose a username"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formBirthdate" className="mb-2">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                        type="date"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formAddress" className="mb-2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your address"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPhoneNumber" className="mb-2">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        required
                    />
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

export default HostRegistration;

import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

function Login() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/'); 
    };

    return (
        <Container className="login-container position-relative d-flex flex-column align-items-center">
            {}
            <Button
                variant="light"
                className="close-button"
                onClick={handleClose}
                aria-label="Chiudi"
            >
                ✕
            </Button>

            <h2>Sign Up</h2>
            <Form>
                <Form.Group controlId="formUsername" className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your Username"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-2">
                    Login
                </Button>
            </Form>
        </Container>
    );
}

export default Login;

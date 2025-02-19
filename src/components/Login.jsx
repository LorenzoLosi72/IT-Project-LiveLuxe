import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Auth-Context';

import { Form, Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../css/login.css';

// React component that represent the login form of the application.
function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    // States for input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Creating SHA-256 hash password to send to server.
    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    };

    // Login management
const handleSubmit = async (e) => {
    e.preventDefault(); // Page refresh prevention

    try {
        const hashedPassword = await hashPassword(password); // Creating hash password.
        const response = await axios.post('http://localhost:3001/api/login', { username, password: hashedPassword, }); // Send a POST request to the server with the login data.

        const { isHost, firstName, lastName, userId } = response.data; // Extract user role, first name, and last name.

        // Pass FirstName and LastName to the login function in the AuthContext
        login(username, isHost, firstName, lastName, userId);

        // Redirect
        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath);
    } catch (err) {
        console.error('Authentication failed:', err.response?.data || err.message);
        setError('Invalid username or password');
    }
};

    // Login graphic form component
    return (
        <Container className="login-container position-relative d-flex flex-column align-items-center">
            <h2>Sign In</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter your Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-2 position-relative">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required  />
                    <FontAwesomeIcon className="password-icon" icon={showPassword ? faEyeSlash : faEye} onClick={() => setShowPassword(!showPassword)}/>
                </Form.Group>

                {error && <p className="text-danger">{error}</p>}

                <Button variant="primary" type="submit" className="w-100 mt-2"> Login </Button>

                <p className="mt-4 text-center"> Don't have an account?{' '} <Link to="/registration" className="registration-link"> Sign up </Link></p>

            </Form>
        </Container>
    );
}

export default Login;

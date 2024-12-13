import React, { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Auth-Context';
import '../css/login.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const hashedPassword = await hashPassword(password);
            const response = await axios.post('http://localhost:3001/api/login', {
                username,
                password: hashedPassword,
            });

            const { isHost } = response.data; // Estrarre il ruolo dell'utente
            login(username, isHost); // Passare il ruolo al contesto

            // Redirect alla pagina precedente o all'account utente
            const redirectPath = location.state?.from?.pathname || '/user-account';
            navigate(redirectPath);
        } catch (err) {
            console.error('Authentication failed:', err.response?.data || err.message);
            setError('Invalid username or password');
        }
    };

    return (
        <Container className="login-container position-relative d-flex flex-column align-items-center">
            <h2>Sign In</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {error && <p className="text-danger">{error}</p>}

                <Button variant="primary" type="submit" className="w-100 mt-2">
                    Login
                </Button>
            </Form>
        </Container>
    );
}

export default Login;

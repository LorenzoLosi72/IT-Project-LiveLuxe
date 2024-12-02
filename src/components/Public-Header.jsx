import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Logo from '../images/logos/logo.png';
import '../css/public-header.css';

function PublicHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    return (
        <Navbar className="public-header">
            <Container fluid>
                <Navbar.Brand href="/" className="d-flex align-items-center">
                    <img
                        alt="LiveLuxe-Logo"
                        src={Logo}
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                    />
                    <span className="ms-2">LiveLuxe</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="ms-auto">
                        <Nav.Link href="/rent-home" target="_blank" rel="noopener noreferrer">
                            Rent Your Home
                        </Nav.Link>
                    </Nav>

                    <Dropdown align="end">
                        <Dropdown.Toggle id="user-dropdown" className="user-dropdown">
                            <FaUser size={20} className="me-2" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="custom-dropdown-menu">
                            {isLoggedIn ? (
                                <Dropdown.Item
                                    href="/user-account"
                                    className="custom-dropdown-item"
                                >
                                    My Account
                                </Dropdown.Item>
                            ) : (
                                <>
                                    <Dropdown.Item
                                        href="/login"
                                        className="custom-dropdown-item"
                                    >
                                        Sign In
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="/guest-registration"
                                        className="custom-dropdown-item"
                                    >
                                        Sign Up
                                    </Dropdown.Item>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default PublicHeader;

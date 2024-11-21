import React, { useState } from 'react';
import { Container, Navbar, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import Logo from '../images/logos/logo.png';
import '../css/header-public.css';

function LiveLuxeHeader() {
    const [selectedItem, setSelectedItem] = useState('');

    const handleSelect = (item) => {
        setSelectedItem(item);
    };

    return (
        <Navbar className="LiveLuxe-navbar" expand="lg">
            <Container fluid>
                <Navbar.Brand href="" className="d-flex align-items-center">
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
                    <Dropdown align="end">
                        <Dropdown.Toggle id="user-dropdown" className="user-dropdown">
                            <FaUser size={20} className="me-2" />
                            Account
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item
                                href="/login"
                                className={`custom-dropdown-item ${
                                    selectedItem === 'Sign In' ? 'selected' : ''
                                }`}
                                onClick={() => handleSelect('Sign In')}
                            >
                                Sign In
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="/signup"
                                className={`custom-dropdown-item ${
                                    selectedItem === 'Sign Up' ? 'selected' : ''
                                }`}
                                onClick={() => handleSelect('Sign Up')}
                            >
                                Sign Up
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="/contacts"
                                className={`custom-dropdown-item ${
                                    selectedItem === 'Contacts' ? 'selected' : ''
                                }`}
                                onClick={() => handleSelect('Contacts')}
                            >
                                Contacts
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default LiveLuxeHeader;

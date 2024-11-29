// Import packages, libraries and stylesheets
import React, { useState } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import Logo from '../images/logos/logo.png';
import '../css/public-header.css';

// Public Header component
function PublicHeader() {
    const [selectedItem, setSelectedItem] = useState('');

    const handleSelect = (item) => { setSelectedItem(item); };

    return (
        <Navbar className="public-header">
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

                    <Nav className='ms-auto'>
                        <Nav.Link href="">rent your home</Nav.Link>
                    </Nav>

                    <Dropdown align="end">
                        <Dropdown.Toggle id="user-dropdown" className="user-dropdown">
                            <FaUser size={20} className="me-2" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="custom-dropdown-menu">
                            <Dropdown.Item
                                href="/login"
                                className={`custom-dropdown-item ${ selectedItem === 'Sign In' ? 'selected' : '' }`}
                                onClick={() => handleSelect('Sign In')}
                            >
                                sign in
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="/guest-registration"
                                className={`custom-dropdown-item ${ selectedItem === 'Sign Up' ? 'selected' : '' }`}
                                onClick={() => handleSelect('Sign Up')}
                            >
                                sign up
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default PublicHeader;

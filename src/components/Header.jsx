import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth-Context';

import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import Logo from '../images/logos/logo.png';
import '../css/header.css';

// React component that represent the header of the application.
function Header() {
    const { isLoggedIn, userRole, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Logout management
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Navigate management
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Header graphic navigation-bar component
    return (
        <Navbar className="public-header">
            <Container fluid>
                <Navbar.Brand  className="d-flex align-items-center" onClick={() => { 
                        if ((isLoggedIn) && (userRole === 'host')) { handleNavigate('/user-account')}
                        else if ((isLoggedIn) && (userRole === 'client')) { handleNavigate('/user-account')}
                        else { handleNavigate('/')}
                        }}>
                    <img className="d-inline-block align-top" alt="LiveLuxe-Logo" src={Logo} width="50" height="50"/>
                    <span className="ms-2">LiveLuxe</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="ms-auto">
                        {isLoggedIn && userRole === 'host' && (
                            <>
                                <Nav.Link onClick={() => handleNavigate('/rent-home')} > Rent your home </Nav.Link>
                                <Nav.Link onClick={() => handleNavigate('/host-bookings')} > Bookings </Nav.Link>
                            </>
                        )}
                        {isLoggedIn && userRole === 'client' && (
                            <Nav.Link onClick={() => handleNavigate('/bookings')} > Your Bookings </Nav.Link>
                        )}
                    </Nav>

                    <Dropdown align="end">
                        <Dropdown.Toggle id="user-dropdown" className="user-dropdown">
                            <FaUser size={20} className="me-2" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="custom-dropdown-menu">
                            {isLoggedIn ? (
                                <>
                                    <Dropdown.Item className="custom-dropdown-item" onClick={() => handleNavigate('/user-account')}> Account </Dropdown.Item>
                                    <Dropdown.Item className="custom-dropdown-item" onClick={handleLogout}> Logout </Dropdown.Item>
                                </>
                            ) : (
                                <>
                                    <Dropdown.Item className="custom-dropdown-item" onClick={() => handleNavigate('/login')}> Sign in </Dropdown.Item>
                                    <Dropdown.Item className="custom-dropdown-item" onClick={() => handleNavigate('/registration')}> Sign up </Dropdown.Item>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>

                </Navbar.Collapse>
                
            </Container>
        </Navbar>
    );
}

export default Header;

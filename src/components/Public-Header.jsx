import React, { useContext } from 'react';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth-Context';
import Logo from '../images/logos/logo.png';
import '../css/public-header.css';

function PublicHeader() {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Navbar className="public-header">
            <Container fluid>
                <Navbar.Brand onClick={() => handleNavigate('/')} className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
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
                        {isLoggedIn && (
                            <Nav.Link
                                onClick={() => handleNavigate('/rent-home')}
                                style={{ cursor: 'pointer' }}
                            >
                                Rent Your Home
                            </Nav.Link>
                        )}
                    </Nav>

                    <Dropdown align="end">
                        <Dropdown.Toggle id="user-dropdown" className="user-dropdown">
                            <FaUser size={20} className="me-2" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="custom-dropdown-menu">
                            {isLoggedIn ? (
                                <>
                                    <Dropdown.Item
                                        onClick={() => handleNavigate('/user-account')}
                                        className="custom-dropdown-item"
                                    >
                                        My Account
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={handleLogout}
                                        className="custom-dropdown-item"
                                    >
                                        Logout
                                    </Dropdown.Item>
                                </>
                            ) : (
                                <>
                                    <Dropdown.Item
                                        onClick={() => handleNavigate('/login')}
                                        className="custom-dropdown-item"
                                    >
                                        Sign In
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => handleNavigate('/guest-registration')}
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

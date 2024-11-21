import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Logo from '../images/logos/logo.png';
import '../css/header-public.css';

function LiveLuxeHeader() {
    return(
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
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/login">Sign In</Nav.Link>
                        <Nav.Link href="/signup">Sign Up</Nav.Link>
                        <Nav.Link href="">Contacts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
  );
};

export default LiveLuxeHeader;
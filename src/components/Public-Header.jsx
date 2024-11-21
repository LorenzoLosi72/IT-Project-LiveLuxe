import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Logo from '../images/logos/logo.png';
import '../css/public-header.css';

function PublicHeader() {
    return(
        <Navbar className="public-header" expand="lg">
            <Container fluid>
                <Navbar.Brand href="" className="d-flex align-items-center">
                    <img
                    alt="LiveLuxe-logo"
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
                        <Nav.Link href="">rent your home</Nav.Link>
                        <Nav.Link href="">Sign In</Nav.Link>
                        <Nav.Link href="">Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
  );
};

export default PublicHeader;
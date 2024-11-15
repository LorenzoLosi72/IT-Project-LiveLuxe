import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../images/logos/logo.png';
import '../css/navbar.css';

function LiveLuxeNavbar() {
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
                        <Nav.Link href="">Sign In</Nav.Link>
                        <Nav.Link href="">Sign Up</Nav.Link>
                        <Nav.Link href="">Contacts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
  );
};

export default LiveLuxeNavbar;
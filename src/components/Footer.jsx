import React from "react";

import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/footer.css';

// Global Footer component
function Footer() {
    return (
        <footer className="footer" expand="lg">
            <Container fluid>
                <Row>
                    <Col md={4} className="text-center text-md-start">
                        <h5>Contacts</h5>
                        <p><i className="bi bi-envelope me-2"></i> LiveLuxe@gmail.com </p>
                        <p><i className="bi bi-telephone me-2"></i> +39 123 456 789 </p>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5>Follow us</h5>
                        <div id="container-social" className="d-flex justify-content-center">
                            <a href="#"><i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i></a>
                            <a href="#"><i className="bi bi-twitter" style={{ fontSize: '1.5rem' }}></i></a>
                            <a href="#"><i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i></a>
                            <a href="#"><i className="bi bi-telegram" style={{ fontSize: '1.5rem' }}></i></a>
                        </div>
                    </Col>
                    <Col md={4} className="text-center text-md-end">
                        <h5>Copyright</h5>
                        <p style={{ textAlign: 'end' }}>© 2025 LiveLuxe. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
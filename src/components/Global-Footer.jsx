// Import packages, libraries and stylesheets
import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/global-footer.css';

// Global Footer component
function GlobalFooter() {
    return (
        <footer className="global-footer" expand="lg">
            <Container fluid>
                <Row>
                    <Col md={4} className="text-center text-md-start">
                        <h5>contacts</h5>
                        <p>
                            <i className="bi bi-envelope me-2"></i>
                            liveluxe@gmail.com
                        </p>
                        <p>
                            <i className="bi bi-telephone me-2"></i>
                            +39 123 456 789
                         </p>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5>follow us</h5>
                        <div className="d-flex justify-content-center">
                            <a href="#">
                                <i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i>
                            </a>
                            <a href="#">
                                <i className="bi bi-twitter" style={{ fontSize: '1.5rem' }}></i>
                            </a>
                            <a href="#">
                                <i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i>
                            </a>
                            <a href="#">
                                <i className="bi bi-linkedin" style={{ fontSize: '1.5rem' }}></i>
                            </a>
                        </div>
                    </Col>
                    <Col md={4} className="text-center text-md-end">
                        <h5>copyright</h5>
                        <p>© 2024 LiveLuxe. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default GlobalFooter;
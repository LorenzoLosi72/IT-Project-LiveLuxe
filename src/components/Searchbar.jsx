import React, { useState } from 'react';

import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import '../css/searchbar.css';

// React component that represent the homepage search-bar component.
const Searchbar = () => {

    // States for input fields
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guestsNumber, setGuestsNumber] = useState("");
    const [hasKitchen, setHasKitchen] = useState(false); 
    const [hasParking, setHasParking] = useState(false);  
    const [hasAC, setHasAC] = useState(false);  
    const [hasWiFi, setHasWiFi] = useState(false);  
    const [hasPool, setHasPool] = useState(false);  
    const [bedrooms, setBedrooms] = useState(1);  
    const [budget, setBudget] = useState([0, 500]);  

    const [showFilters, setShowFilters] = useState(false);

    // Toggle the filter pop-up visibility
    const handleToggleModalFilters = () => { setShowFilters(!showFilters); };

    // Function for managing form submission
    const handleSubmit = (e) => { e.preventDefault(); }

    // Search-bar graphic component.
    return(
        <div>
            <div className="searchbar-wrapper">
                <form onSubmit={handleSubmit} className="container">
                    <div className="row align-items-center g-3">
                        <div className="col-md-4">
                            <input className="form-control" type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                        </div>
                        <div className="col-md-2">
                            <input className="form-control" type="date" placeholder="Check-in" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                        </div>
                        <div className="col-md-2">
                            <input className="form-control" type="date" placeholder="Check-out" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                        </div>

                        <div className="col-md-1">
                            <input className="form-control" type="number" placeholder="Who" value={guestsNumber} onChange={(e) => setGuestsNumber(e.target.value)} required min="1" max="20" />
                        </div>

                        <div className="col-md-1">
                            <button type="button" className="btn btn-primary w-100" onClick={handleToggleModalFilters}>filter</button>
                        </div>

                        <div className="col-md-2">
                            <button type="submit" className="btn btn-primary w-100">search</button>
                        </div>
                    </div>
                </form>
            </div>

            <Modal show={showFilters} onHide={handleToggleModalFilters} centered>
                <Modal.Header className="justify-content-center position-relative">
                    <Modal.Title className="w-100 text-center">Advanced Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="kitchen">
                                <Form.Check type="checkbox" label="Kitchen" checked={hasKitchen} onChange={(e) => setHasKitchen(e.target.checked)} />
                            </Form.Group>

                            <Form.Group controlId="parking">
                                <Form.Check type="checkbox" label="Parking" checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} />
                            </Form.Group>

                            <Form.Group controlId="wifi">
                                <Form.Check type="checkbox" label="Wi-Fi" checked={hasWiFi} onChange={(e) => setHasWiFi(e.target.checked)} />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="ac">
                                <Form.Check type="checkbox" label="Air Conditioning" checked={hasAC} onChange={(e) => setHasAC(e.target.checked)} />
                            </Form.Group>

                            <Form.Group controlId="pool">
                                <Form.Check type="checkbox" label="Pool" checked={hasPool} onChange={(e) => setHasPool(e.target.checked)} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="row-bedrooms">
                        <Col md={6}>
                            <Form.Label className="label">Bedrooms</Form.Label>
                            <Form.Control type="number" min="1" max="10" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="bedrooms-input" />
                        </Col>
                    </Row>
                    <Row className="row-range-budget">
                        <Col md={12}>
                            <Form.Group controlId="budget">
                                <Form.Label className="label">Budget</Form.Label>
                                <Form.Control type="range" min="50" max="500" value={budget[0]} onChange={(e) => setBudget([e.target.value, budget[0]])}/>
                                <p className="text-center mt-2">{budget[0]} USD</p>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleToggleModalFilters} className="btn-footer"> Close </Button>
                    <Button variant="primary" onClick={handleToggleModalFilters} className="btn-footer"> Apply Filters </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default Searchbar;

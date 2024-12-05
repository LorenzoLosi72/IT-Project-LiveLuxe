import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../css/rent-home.css';
import PublicHeader from './Public-Header.jsx';
import GlobalFooter from './Global-Footer.jsx';

function RentHome() {
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [minEndDate, setMinEndDate] = useState('');

    // Recupera Locations dal server
    useEffect(() => {
        axios.get('http://localhost:3001/api/locations')
            .then((response) => setLocations(response.data))
            .catch((error) => console.error('Error fetching locations:', error));
    }, []);

    // Recupera Categories dal server
    useEffect(() => {
        axios.get('http://localhost:3001/api/categories')
            .then((response) => setCategories(response.data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    const handleStartDateChange = (e) => {
        const startDate = e.target.value;
        setMinEndDate(startDate);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <PublicHeader />
            <Container className="rent-home-container mt-4 flex-grow-1">
                <h1 className="rent-home-title text-center mb-2">Rent Your Home</h1>
                <p className="rent-home-warning text-center mb-4">
                    Please insert truthful information. If you provide false data, your account will be deleted.
                </p>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formName" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter property name" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formLocationID" className="mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Select required>
                                    <option value="">Select a City</option>
                                    {locations.map((location) => (
                                        <option key={location.LocationID} value={location.LocationID}>
                                            {location.City}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formAddress" className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" placeholder="Enter property address" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formCategoryID" className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select required>
                                    <option value="">Select a Category</option>
                                    {categories.map((category) => (
                                        <option key={category.CategoryID} value={category.CategoryID}>
                                            {category.Name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formGuestsNumber" className="mb-3">
                                <Form.Label>Number of Guests</Form.Label>
                                <Form.Control type="number" placeholder="Enter maximum number of guests" required min="0" />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formBedrooms" className="mb-3">
                                <Form.Label>Bedrooms</Form.Label>
                                <Form.Control type="number" placeholder="Enter number of bedrooms" required min="0" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formKitchen" className="mb-3">
                                <Form.Label>Kitchen</Form.Label>
                                <Form.Select required>
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formWifi" className="mb-3">
                                <Form.Label>WIFI</Form.Label>
                                <Form.Select required>
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formParking" className="mb-3">
                                <Form.Label>Parking</Form.Label>
                                <Form.Select required>
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formPool" className="mb-3">
                                <Form.Label>Pool</Form.Label>
                                <Form.Select required>
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formAirConditioning" className="mb-3">
                                <Form.Label>Air Conditioning</Form.Label>
                                <Form.Select required>
                                    <option value="">Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formPhotos" className="mb-3">
                                <Form.Label>Upload Photos</Form.Label>
                                <Form.Control type="file" multiple accept="image/*" required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group controlId="formAvailabilityStart" className="mb-3">
                                <Form.Label>Available From</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Start date"
                                    required
                                    onChange={handleStartDateChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formAvailabilityEnd" className="mb-3">
                                <Form.Label>Available To</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="End date"
                                    required
                                    min={minEndDate}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formNotes" className="mb-3">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control as="textarea" placeholder="Describe your house" rows={5} style={{ resize: 'none' }} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit" className="w-100">
                        Submit
                    </Button>
                </Form>
            </Container>
            <GlobalFooter />
        </div>
    );
}

export default RentHome;

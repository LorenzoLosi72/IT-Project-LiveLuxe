import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../css/rent-home.css';
import Header from './Header.jsx';
import GlobalFooter from './Footer.jsx';

function RentHome() {
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userID, setUserID] = useState(sessionStorage.getItem('userId') || null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [minEndDate, setMinEndDate] = useState('');

    // Fetch locations
    useEffect(() => {
        axios.get('http://localhost:3001/api/locations')
            .then((response) => setLocations(response.data))
            .catch((error) => console.error('Error fetching locations:', error));
    }, []);

    // Fetch categories
    useEffect(() => {
        axios.get('http://localhost:3001/api/categories')
            .then((response) => setCategories(response.data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    // Gestisce la selezione della data di inizio
    const handleStartDateChange = (e) => {
        const startDate = e.target.value;
        setMinEndDate(startDate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        if (!userID) {
            setError('Failed to retrieve user information. Please log in again.');
            return;
        }

        const data = {
            name: form.formName.value,
            bedrooms: parseInt(form.formBedrooms.value, 10),
            kitchen: parseInt(form.formKitchen.value, 10),
            parking: parseInt(form.formParking.value, 10),
            pool: parseInt(form.formPool.value, 10),
            wifi: parseInt(form.formWifi.value, 10),
            airConditioning: parseInt(form.formAirConditioning.value, 10),
            notes: form.formNotes.value || null,
            address: form.formAddress.value,
            locationID: parseInt(form.formLocationID.value, 10),
            categoryID: parseInt(form.formCategoryID.value, 10),
            guestsNumber: parseInt(form.formGuestsNumber.value, 10),
            userID: userID, 
        };

        try {
            const response = await axios.post('http://localhost:3001/api/register-property', data);
            if (response.status === 200) {
                setSuccess(true);
                setError('');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to register the property. Please try again.');
            setSuccess(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <Container className="rent-home-container mt-4 flex-grow-1">
                <h1 className="rent-home-title text-center mb-2">Rent Your Home</h1>
                <p className="rent-home-warning text-center mb-4">
                    Please insert truthful information. If you provide false data, your account will be deleted.
                </p>
                {success && <p className="text-success">Property registered successfully!</p>}
                {error && <p className="text-danger">{error}</p>}
                <Form onSubmit={handleSubmit}>
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Carousel, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaCoins } from 'react-icons/fa';
import "../css/card-house.css";

const HostProperties = () => {
    const [houses, setHouses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserHouses = async () => {
            try {
                const username = sessionStorage.getItem('username'); 
                if (!username) {
                    setError('User not logged in.');
                    return;
                }
                const response = await axios.post('http://localhost:3001/api/host-properties', { username });
                console.log("Fetched houses response:", response);
                console.log("Fetched houses data:", response.data);

                if (response.data.success && Array.isArray(response.data.properties)) {
                    console.log("Final house list:", response.data.properties);
                    setHouses(response.data.properties);
                } else {
                    console.log("Unexpected response format:", response.data);
                    setError('Failed to load your properties.');
                }
            } catch (error) {
                console.error("Error retrieving house data:", error);
                setError('Failed to load your properties.');
            }
        };

        fetchUserHouses();
    }, []);

    return (
        <div className="container-house-cards" style={{ marginTop: '80px' }}>
            <h1 className="container-house-cards-host">Your rental properties</h1>
            <Row className="justify-content-center gx-4 mx-2">
                {error && <p className="error-message">{error}</p>}
                {houses.length === 0 ? (
                    <Col className="d-flex justify-content-center">
                        <div className="no-results-message">
                            <h3>No properties found.</h3>
                        </div>
                    </Col>
                ) : (
                    houses.map((house, index) => (
                        <Col md={4} className="mb-4" key={index}>
                            <Card className="house-card">
                                <Carousel interval={null} className="house-carousel">
                                    {house.images && house.images.length > 0 ? (
                                        house.images.map((image, idx) => (
                                            <Carousel.Item key={idx}>
                                                <img 
                                                    src={image} 
                                                    alt={`House ${house.PropertyID} - Image ${idx + 1}`} 
                                                    className="d-block w-100 carousel-image" 
                                                />
                                            </Carousel.Item>
                                        ))
                                    ) : (
                                        <Carousel.Item>
                                            <img 
                                                src="https://via.placeholder.com/300" 
                                                alt={`House ${house.PropertyID}`} 
                                                className="d-block w-100 carousel-image" 
                                            />
                                        </Carousel.Item>
                                    )}
                                </Carousel>


                                
                                <Card.Body>
                                    <Card.Title>{house.Name}</Card.Title>
                                    <Card.Text> 
                                        <FaMapMarkerAlt className="icon-location"/> {house.Address} <br/> 
                                        <strong className="label-house-cards">Rooms:</strong> {house.Bedrooms} <br/>
                                        <strong className="label-house-cards">Guests:</strong> {house.GuestsNumber} <br/>
                                    </Card.Text>
                                    <hr className="card-divider" />
                                    <div className="d-flex justify-content-end">
                                        <div className="d-flex justify-content-end"><Button variant="primary" onClick={() => window.location.href = `/manage-property/${house.PropertyID}`}> Manage</Button></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default HostProperties;

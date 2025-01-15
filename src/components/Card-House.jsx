import React, {useEffect, useState} from "react";
import axios from "axios";

import { Card, Button, Carousel, Row, Col} from "react-bootstrap";
import { FaMapMarkerAlt, FaCoins } from 'react-icons/fa';
import "../css/card-house.css";

// React component that represent the card-house-description of the application.
const CardHouse = () => {

    // States for houses data 
    const [houses, setHouses] = useState([]);

    // Fetch houses data
    useEffect(() => {
        const fetchHouses = async () => {
            try { 
                const response = await axios.get('http://localhost:3001/api/houses'); 
                setHouses(response.data);

            } catch (error) { console.error("Error retrieving house data:", error); } };

        fetchHouses();

    }, []);

    // Function that convert house availability dates to day-month-year format.
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('it-IT', options); 
    };

    // Card house graphic component
    return (
        <div className="container-house-cards">
            <Row className="justify-content-center gx-4 mx-2">
            {houses.map((house, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card className="house-card">
                            <Carousel interval={null} className="house-carousel"> 
                            {house.images.map((image, idx) => (
                                <Carousel.Item key={idx}><img src={image} alt={`House ${index + 1} - Image ${idx + 1}`} className="d-block w-100 carousel-image" /></Carousel.Item>))}
                            </Carousel>
                            <Card.Body>
                                <Card.Title>{house.name} </Card.Title>
                                <Card.Text> 
                                    <FaMapMarkerAlt className="icon-location"/>{house.city}, {house.state}  <br/> 
                                    <strong className="label-house-cards">Host:</strong> {house.hostName} <br/>
                                    <strong className="label-house-cards">Avaible:</strong> {formatDate(house.startDate)} to {formatDate(house.endDate)} <br/>
                                    <FaCoins className="icon-price" /> {house.pricePerNight} $ / night 
                                </Card.Text>
                                <hr className="card-divider" />
                                <div className="d-flex justify-content-end"><Button variant="primary" onClick={() => window.location.href = `/house/${house.id}`}> View Details</Button></div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CardHouse;


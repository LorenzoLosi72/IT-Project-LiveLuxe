import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Carousel, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaUserFriends, FaBed, FaUtensils, FaWifi, FaSwimmer, FaCar, FaSnowflake } from "react-icons/fa";
import "../css/house-description.css";

const HouseDescription = () => {
    const { id } = useParams();
    const [house, setHouse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recupera i dettagli della casa
    useEffect(() => {
        const fetchHouseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/house/${id}`);
                console.log("House data:", response.data);
                setHouse(response.data);
            } catch (error) {
                console.error("Error fetching house details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHouseDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!house) return <div>House not found.</div>;

    const advancedServices = [
        { name: "Kitchen", icon: <FaUtensils className="icon-services" />, available: house.kitchen },
        { name: "Wi-Fi", icon: <FaWifi className="icon-services" />, available: house.wifi },
        { name: "Pool", icon: <FaSwimmer className="icon-services" />, available: house.pool },
        { name: "Parking", icon: <FaCar className="icon-services" />, available: house.parking },
        { name: "Air Conditioning", icon: <FaSnowflake className="icon-services" />, available: house.airConditioning },
    ];

    return (
        <div className="container-house-description">
            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10}>
                    <h1 className="house-title">{house.name}</h1>
                </Col>
            </Row>

            <Row className="justify-content-center gx-4 mx-2">
                <Col md={6}>
                    <Carousel interval={null} className="house-carousel">
                        {house.images && house.images.map((image, idx) => (
                            <Carousel.Item key={idx}>
                                <img src={image} alt={`House Image ${idx + 1}`} className="d-block w-100 house-carousel-image" />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
            </Row>

            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10} className="house-location">
                    <FaMapMarkerAlt className="house-icon-location" /> {house.address}
                    <span className="detail-separator mx-2">•</span>{house.city}, {house.state}.
                </Col>
            </Row>

            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10} className="house-guests-details">
                    <FaUserFriends className="house-icon-guests" /> Guests: {house.guestsNumber}
                    <span className="detail-separator mx-2"> • </span>
                    <FaBed className="house-icon-guests" /> Bedrooms: {house.bedrooms}
                </Col>
            </Row>

            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10} className="house-services-details">
                    {advancedServices.filter(service => service.available).map((service, idx, filteredServices) => (
                        <React.Fragment key={idx}>
                            {service.icon} {service.name}
                            {idx < filteredServices.length - 1 && (
                                <span className="detail-separator mx-2"> • </span>
                            )}
                        </React.Fragment>
                    ))}
                </Col>
            </Row>
        </div>
    );
};

export default HouseDescription;

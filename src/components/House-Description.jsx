import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Carousel, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaUserFriends, FaBed, FaUtensils, FaWifi, FaSwimmer, FaCar, FaSnowflake } from "react-icons/fa";
import "../css/house-description.css";

const HouseDescription = () => {
    const { id } = useParams();
    const [house, setHouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(new Date());

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

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/house/${id}/availability`);
                console.log("Availability dates:", response.data);

                const availableDates = response.data.map(date => new Date(date));
                setAvailability(availableDates);
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
        };
        fetchAvailability();
    }, [id]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleActiveDateChange = ({ activeStartDate }) => {
        setActiveDate(activeStartDate);  // Aggiorniamo la data attiva (mese corrente)
    };

    if (loading) return <div>Loading...</div>;
    if (!house) return <div>House not found.</div>;

    // Verifica se la data è disabilitata
    const tileDisabled = ({ date }) => {
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        return !availability.some(availableDate => 
            availableDate.getTime() === normalizedDate.getTime()
        );
    };

    // Funzione per disabilitare i giorni che non appartengono al mese corrente
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const currentMonth = activeDate.getMonth();
            const currentYear = activeDate.getFullYear();
            if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
                return 'react-calendar__tile--disabled';
            }
        }
        return null;
    };

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
                <Col md={4} className="calendar-container">
                    <div className="calendar-title">Availability</div>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileDisabled={tileDisabled}
                        tileClassName={tileClassName}  // Aggiungi la classe per i giorni non appartenenti al mese
                        view="month"
                        onActiveDateChange={handleActiveDateChange}  // Cambia mese
                        showNeighboringMonth={false} 
                    />
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

import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { AuthContext } from "../Auth-Context";
import { useParams, useNavigate } from "react-router-dom";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Carousel, Row, Col } from "react-bootstrap";
import { FaMapMarkerAlt, FaUserFriends, FaBed, FaUtensils, FaWifi, FaSwimmer, FaCar, FaSnowflake } from "react-icons/fa";
import "../css/house-description.css";

const ManageProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [house, setHouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [arrivalDate, setArrivalDate] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const today = new Date();

    useEffect(() => {
        const fetchHouseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/house/${id}`);
                console.log("🏠 House Data Received:", response.data); // Debug
                setHouse(response.data);
            } catch (error) {
                console.error("Error fetching house details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHouseDetails();
    }, [id]);

    // Funzione per verificare se una data è disponibile o prenotata (NON deve essere selezionabile)
    const isBlocked = (date) => {
        if (!house || !house.availabilities) return false;

        const dateToCheck = new Date(date).toISOString().split('T')[0]; // Converti in formato YYYY-MM-DD

        // Controllo se la data è tra le disponibilità
        for (const availability of house.availabilities) {
            const startDate = new Date(availability.startDate).toISOString().split('T')[0];
            const endDate = new Date(availability.endDate).toISOString().split('T')[0];

            if (dateToCheck >= startDate && dateToCheck <= endDate) {
                console.log(`🔵 AVAILABLE (Blocked on calendar) -> ${dateToCheck}`); // Debug
                return true; // La data è disponibile, quindi NON deve essere selezionabile
            }
        }

        // Controllo se la data è prenotata
        if (house.bookings) {
            for (const booking of house.bookings) {
                const bookedStart = new Date(booking.startDate).toISOString().split('T')[0];
                const bookedEnd = new Date(booking.endDate).toISOString().split('T')[0];

                if (dateToCheck >= bookedStart && dateToCheck <= bookedEnd) {
                    console.log(`🔴 BOOKED (Blocked on calendar) -> ${dateToCheck}`); // Debug
                    return true; // La data è prenotata, quindi NON deve essere selezionabile
                }
            }
        }

        console.log(`✅ NOT AVAILABLE (Selectable) -> ${dateToCheck}`); // Debug
        return false; // La data NON è disponibile né prenotata, quindi deve essere selezionabile
    };

    const handleDateChange = (date) => {
        setErrorMessage("");

        if (!arrivalDate || (arrivalDate && departureDate)) {
            setArrivalDate(date);
            setDepartureDate(null);
        } else {
            if (date > arrivalDate) {
                if (!isRangeAvailable(arrivalDate, date)) {
                    setErrorMessage("There are unavailable dates in this range.");
                    return;
                }
                setDepartureDate(date);
            } else {
                setArrivalDate(date);
                setDepartureDate(null);
            }
        }
    };

    const isRangeAvailable = (start, end) => {
        let currentDate = new Date(start);

        while (currentDate < end) {
            if (isBlocked(currentDate)) {
                window.location.reload();
                return false;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return true;
    };

    const tileClassName = ({ date }) => {
        if (date < today) return "react-calendar__tile--disabled"; // Blocca le date passate

        if (isBlocked(date)) {
            console.log(`🚫 Blocking date on calendar: ${date.toISOString().split('T')[0]}`); // Debug
            return "react-calendar__tile--disabled"; // Blocca le date disponibili/prenotate
        }

        return null;
    };

    if (loading) return <div>Loading...</div>;
    if (!house) return <div>House not found.</div>;

    // Servizi avanzati della casa
    const advancedServices = [
        { name: "Kitchen", icon: <FaUtensils className="icon-services" />, available: house.kitchen },
        { name: "Wi-Fi", icon: <FaWifi className="icon-services" />, available: house.wifi },
        { name: "Pool", icon: <FaSwimmer className="icon-services" />, available: house.pool },
        { name: "Parking", icon: <FaCar className="icon-services" />, available: house.parking },
        { name: "AC", icon: <FaSnowflake className="icon-services" />, available: house.airConditioning },
    ];

    return (
        <div className="container-house-description">
            <Row className="justify-content-center gx-4 mx-2">
                <Col md={10}><h1 className="house-title">{house.name}</h1></Col>
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
                    <Row className="justify-content-left gx-4 mx-2">
                        <Col md={10} className="house-location">
                            <FaMapMarkerAlt className="house-icon-location" /> {house.address}
                            <span className="detail-separator mx-2">•</span> {house.city}, {house.state}.
                        </Col>
                    </Row>
                    <Row className="justify-content-left gx-4 mx-2">
                        <Col md={10} className="house-guests-details">
                            <FaUserFriends className="house-icon-guests" /> Guests: {house.guestsNumber}
                            <span className="detail-separator mx-2"> • </span>
                            <FaBed className="house-icon-guests" /> Bedrooms: {house.bedrooms}
                        </Col>
                    </Row>
                    <Row className="justify-content-left gx-4 mx-2">
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
                </Col>
                <Col md={4} className="calendar-container">
                    <div className="calendar-title">Manage Availabilities</div>
                    <Calendar
                        locale="en-US"
                        onClickDay={handleDateChange}
                        tileClassName={tileClassName}
                        showNeighboringMonth={false}
                        minDate={today}
                    />
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <button className="book-button">Add Availability</button>
                </Col>
            </Row>
        </div>
    );
};

export default ManageProperty;

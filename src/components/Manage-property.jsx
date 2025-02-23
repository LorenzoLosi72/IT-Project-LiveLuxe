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
    const [blockedDates, setBlockedDates] = useState([]); // Date da bloccare nel calendario
    const [arrivalDate, setArrivalDate] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const today = new Date();

    useEffect(() => {
        const fetchHouseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/house/${id}`);
                console.log("🏡 House Data:", response.data);
                setHouse(response.data);
            } catch (error) {
                console.error("Error fetching house details:", error);
            }
        };

        const fetchBlockedDates = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/house-availability/${id}`);
                
                // Stampa nella console il risultato della seconda API
                console.log("📅 Blocked Dates API Response:", response.data);

                // Unisce disponibilità e prenotazioni in un unico array
                const allBlockedDates = [...(response.data.availabilities || []), ...(response.data.bookedDates || [])];
                setBlockedDates(allBlockedDates);
            } catch (error) {
                console.error("Error fetching blocked dates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHouseDetails();
        fetchBlockedDates();
    }, [id]);

    // Funzione per verificare se una data è bloccata (sia disponibile che prenotata)
    const isBlocked = (date) => {
        const dateToCheck = new Date(date).toISOString().split('T')[0];
    
        for (const range of blockedDates) {
            const startDate = new Date(range.startDate).toISOString().split('T')[0];
            const adjustedEndDate = new Date(range.endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() - 1); // ✅ Decrementa endDate di un giorno
            const endDate = adjustedEndDate.toISOString().split('T')[0];
    
            // ✅ Ora il blocco è solo tra startDate e endDate (compreso), senza toccare il giorno successivo
            if (dateToCheck >= startDate && dateToCheck <= endDate) {
                return true;
            }
        }
    
        return false;
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
                return false;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return true;
    };

    const tileClassName = ({ date }) => {
        if (date < today) return "react-calendar__tile--disabled"; // Blocca le date passate
        if (isBlocked(date)) return "react-calendar__tile--disabled"; // Blocca date disponibili e prenotate
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
